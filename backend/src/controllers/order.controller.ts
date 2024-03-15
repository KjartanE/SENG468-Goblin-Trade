import amqp from 'amqplib'
import { IStockTX, StockOrder } from '../models/stock_tx.model'
import { v4 as uuid } from 'uuid'
import { WalletController } from './wallet.controller'
import { StockController } from './stock.controller'

const queue = 'incoming_orders'
const StockTx = require('../models/stock_tx.model')

export enum ORDER_STATUS {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

/**
 * Order Controller
 *
 * @export
 * @class OrderController
 */
export class OrderController {
  private walletController: WalletController = new WalletController()
  private stockController: StockController = new StockController()

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
    console.log('Place Stock Order:', stockOrder)

    const stockTxId = await uuid()
    const walletTxId = await uuid()

    // if it is a buy order, check if the user has enough balance
    if (stockOrder.is_buy) {
      // update stock price if it is a market order
      if (stockOrder.order_type === 'MARKET') {
        const stock = await this.stockController.getStockPrice(
          stockOrder.stock_id
        )
        stockOrder.price = stock.current_price
      }

      // handle buy stock order
      await this.walletController.handleUpdateWalletBalance(
        user_name,
        stockOrder,
        walletTxId,
        stockTxId
      )
    } else {
      await this.handleSellStockOrder(user_name, stockOrder)
      await this.stockController.updateStockPrice(stockOrder)
    }

    // Create Stock Transaction
    await this.createStockTx(stockOrder, stockTxId, walletTxId, user_name)

    // Queue Stock Order
    await this.queueStockOrder({ ...stockOrder, stock_tx_id: stockTxId })
  }

  /**
   * Handle Sell Stock Order
   *
   * @param {string} user_name
   * @param {StockOrder} stockOrder
   * @return {*}  {Promise<void>}
   * @memberof OrderController
   */
  async handleSellStockOrder(
    user_name: string,
    stockOrder: StockOrder
  ): Promise<void> {
    const portfolio = await this.stockController.getUserStockPortfolio(
      user_name,
      stockOrder.stock_id
    )

    if (!portfolio || portfolio.quantity_owned < stockOrder.quantity) {
      throw new Error('Insufficient stocks')
    }

    await this.stockController.addStockToUserPortfolio(
      user_name,
      stockOrder.stock_id,
      -stockOrder.quantity
    )
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
    walletTxId: string,
    user_name: string,
    parent_stock_tx_id?: string
  ): Promise<void> {
    const stockTx = {
      user_name: user_name,
      stock_tx_id: stockTxId,
      wallet_tx_id: walletTxId,
      parent_stock_tx_id: parent_stock_tx_id || null,
      stock_id: stockOrder.stock_id,
      order_status: ORDER_STATUS.IN_PROGRESS,
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
   * Cancel Stock Order
   *
   * @param {string} stockTxId
   * @return {*}  {Promise<void>}
   * @memberof OrderController
   */
  async cancelStockOrder(stockTxId: string): Promise<void> {
    // Check if Stock Transaction exists
    const stockTx = await StockTx.findOne({ stock_tx_id: stockTxId })
    if (!stockTx) {
      throw new Error('Invalid Stock Transaction ID')
    }

    // Queue Stock Order to cancel
    const StockCancelOrder = {
      ...stockTx,
      cancel_order: true,
    }
    await this.queueStockOrder(StockCancelOrder)

    // Update Stock Transaction
    if (stockTx.order_status === ORDER_STATUS.IN_PROGRESS) {
      stockTx.order_status = ORDER_STATUS.CANCELLED
      await stockTx.save()
    }
  }

  /**
   * Get Stock Transactions By UserName
   *
   * @param {string} user_name
   * @return {*}  {Promise<IStockTX[]>}
   * @memberof OrderController
   */
  async getStockTransactionsByUserName(user_name: string): Promise<IStockTX[]> {
    const stockTransactions = await StockTx.find({ user_name: user_name })

    return stockTransactions
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
