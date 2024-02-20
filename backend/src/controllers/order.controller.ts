import amqp from 'amqplib'
import { IStockTX, StockOrder } from '../models/stock_tx.model'
import { v4 as uuid } from 'uuid'
import { WalletController } from './wallet.controller'

const queue = 'stock_orders'
const StockTx = require('../models/stock_tx.model')

/**
 * Order Controller
 *
 * @export
 * @class OrderController
 */
export class OrderController {
  private walletController: WalletController = new WalletController()
  /**
   * Place Stock Order
   *
   * @param {string} user_name
   * @param {StockOrder} stockOrder
   * @return {*}  {Promise<void>}
   * @memberof OrderController
   */
  async placeStockOrder(
    user_name: string,
    stockOrder: StockOrder
  ): Promise<void> {
    const walletBalance =
      await this.walletController.getWalletBalance(user_name)

    const isDebit = stockOrder.is_buy
    const amount = stockOrder.price * stockOrder.quantity
    if (isDebit && walletBalance.balance < amount) {
      throw new Error('Insufficient balance')
    }

    if (isDebit) {
      await this.walletController.addMoneyToWallet(user_name, -amount)
    }

    const stockTxId = await uuid()
    const walletTxId = await uuid()

    // Create Wallet Transaction
    await this.walletController.createWalletTx(
      stockOrder,
      stockTxId,
      walletTxId
    )
    // Update Wallet Transactions in Wallet
    await this.walletController.updateWalletTransactions(user_name, walletTxId)

    // Create Stock Transaction
    await this.createStockTx(stockOrder, stockTxId, walletTxId)

    // Queue Stock Order
    await this.queueStockOrder(stockOrder)
  }

  /**
   * Create Stock Transaction
   *
   * @param {StockOrder} stockOrder
   * @param {string} stockTxId
   * @return {*}  {Promise<void>}
   * @memberof OrderController
   */
  async createStockTx(
    stockOrder: StockOrder,
    stockTxId: string,
    walletTxId: string
  ): Promise<void> {
    const stockTx = {
      stock_tx_id: stockTxId,
      stock_id: stockOrder.stock_id,
      wallet_tx_id: walletTxId,
      order_status: 'PENDING',
      is_buy: stockOrder.is_buy,
      order_type: stockOrder.order_type,
      stock_price: stockOrder.price,
      quantity: stockOrder.quantity,
      time_stamp: new Date(),
    }

    const stockTxModel = new StockTx(stockTx)
    await stockTxModel.save()
  }

  /**
   * Get All Stock Orders
   *
   * @return {*}  {Promise<IStockTX[]>}
   * @memberof OrderController
   */
  async getStockTransactions(): Promise<IStockTX[]> {
    const stockTX = await StockTx.find({})
    return stockTX
  }

  /**
   * Get Stock Orders By TXIds
   *
   * @param {string[]} stockTxIds
   * @return {*}  {Promise<StockOrder[]>}
   * @memberof OrderController
   */
  async getStockOrdersByTXIds(stockTxIds: string[]): Promise<IStockTX[]> {
    const stockOrders = await StockTx.find({
      stock_tx_id: { $in: stockTxIds },
    })
    return stockOrders
  }

  /**
   * Queue Stock Order to RabbitMQ
   *
   * @param {StockOrder} stockOrder
   * @return {*}  {Promise<void>}
   * @memberof OrderController
   */
  async queueStockOrder(stockOrder: StockOrder): Promise<void> {
    let connection
    try {
      const rabbitmqHost = `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`
      connection = await amqp.connect(rabbitmqHost)
      const channel = await connection.createChannel()

      await channel.assertQueue(queue, { durable: false })
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(stockOrder)))
      console.log(" [x] Sent '%s'", stockOrder)
      await channel.close()
    } catch (err) {
      console.warn(err)
    } finally {
      if (connection) await connection.close()
    }
  }
}
