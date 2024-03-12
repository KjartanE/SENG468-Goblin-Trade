import amqp from 'amqplib'
import { IStockTX, StockOrder } from '../models/stock_tx.model'
import { v4 as uuid } from 'uuid'
import { WalletController } from './wallet.controller'
import { StockController } from './stock.controller'
import { IWallet } from '../models/wallet.model'

const queue = 'stock_orders'
const StockTx = require('../models/stock_tx.model')

export enum OrderStatus {
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
    const amount = stockOrder.price * stockOrder.quantity

    if (stockOrder.is_buy) {
      await this.handleBuyStockOrder(user_name, stockOrder)
    } else {
      await this.handleSellStockOrder(user_name, stockOrder)
    }

    const stockTxId = await uuid()
    const walletTxId = await uuid()

    // Create Wallet Transaction
    await this.walletController.createWalletTx(
      stockOrder.is_buy,
      amount,
      stockTxId,
      walletTxId
    )
    // Update Wallet Transactions in Wallet
    await this.walletController.updateWalletTransactions(user_name, walletTxId)

    // Create Stock Transaction
    await this.createStockTx(stockOrder, stockTxId, walletTxId)

    // Queue Stock Order
    await this.queueStockOrder({ ...stockOrder, stock_tx_id: stockTxId })
  }

  /**
   * Handle Buy Stock Order
   *
   * @param {string} user_name
   * @param {StockOrder} stockOrder
   * @return {*}  {Promise<IWallet>}
   * @memberof OrderController
   */
  async handleBuyStockOrder(
    user_name: string,
    stockOrder: StockOrder
  ): Promise<IWallet> {
    const wallet = await this.walletController.getWallet(user_name)
    const amount = stockOrder.price * stockOrder.quantity

    if (wallet.balance < amount) {
      throw new Error('Insufficient balance')
    }

    return this.walletController.addMoneyToWallet(user_name, -amount)
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

    if (!portfolio) {
      throw new Error('Insufficient stocks')
    }

    if (portfolio.quantity_owned < stockOrder.quantity) {
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
    parent_stock_tx_id?: string
  ): Promise<void> {
    const stockTx = {
      stock_tx_id: stockTxId,
      wallet_tx_id: walletTxId,
      parent_stock_tx_id: parent_stock_tx_id || null,
      stock_id: stockOrder.stock_id,
      order_status: OrderStatus.IN_PROGRESS,
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
    if (stockTx.order_status === OrderStatus.IN_PROGRESS) {
      stockTx.order_status = OrderStatus.CANCELLED
      await stockTx.save()

      // return money to wallet
      await this.walletController.returnMoneyToWallet(stockTx)
    }
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
   * Get Stock Transactions By UserName
   *
   * @param {string} user_name
   * @return {*}  {Promise<IStockTX[]>}
   * @memberof OrderController
   */
  async getStockTransactionsByUserName(user_name: string): Promise<IStockTX[]> {
    const walletTxOrders =
      await this.walletController.getWalletTransactionsByUserName(user_name)

    const walletTxIds = walletTxOrders.map(tx => tx.wallet_tx_id)
    const stockTransactions = await StockTx.find({
      wallet_tx_id: { $in: walletTxIds },
    })

    return stockTransactions
  }

  /**
   * Get Stock Transactions By TXIds
   *
   * @param {string[]} stockTxIds
   * @return {*}  {Promise<StockOrder[]>}
   * @memberof OrderController
   */
  async getStockTransactionsByTXIds(stockTxIds: string[]): Promise<IStockTX[]> {
    const stockTransactions = await StockTx.find({
      stock_tx_id: { $in: stockTxIds },
    })
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

  /**
   *  Handle Stock Order
   *
   * @param {StockOrder} stockOrder
   * @return {*}  {Promise<void>}
   * @memberof OrderController
   */
  async HandleStockOrder(stockOrder: StockOrder): Promise<void> {
    const stockTx = await StockTx.findOne({
      stock_tx_id: stockOrder.stock_tx_id,
    })
    if (!stockTx) {
      throw new Error('Invalid Stock Transaction ID')
    }

    if (stockOrder.cancel_order) {
      stockTx.order_status = OrderStatus.CANCELLED
      await stockTx.save()
      await this.walletController.returnMoneyToWallet(stockTx)
      return
    }

    stockTx.order_status = OrderStatus.COMPLETED
    await stockTx.save()

    const wallet = await this.walletController.getUserWalletByStockTx(stockTx)

    // update stock portfolio
    await this.stockController.addStockToUserPortfolio(
      wallet.user_name,
      stockTx.stock_id,
      stockTx.quantity
    )
  }
}
