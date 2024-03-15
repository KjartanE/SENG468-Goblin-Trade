import amqp from 'amqplib'
import { IStockTX, StockOrder } from '../models/stock_tx.model'
import { WalletController } from './wallet.controller'
import { StockController } from './stock.controller'
import { v4 as uuid } from 'uuid'

const StockTx = require('../models/stock_tx.model')

export enum ORDER_STATUS {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  PARTIAL_FULFILLED = 'PARTIAL_FULFILLED',
  EXPIRED = 'EXPIRED',
}

export enum ORDER_TYPE {
  MARKET = 'MARKET',
  LIMIT = 'LIMIT',
  STOP = 'STOP',
  STOP_LIMIT = 'STOP_LIMIT',
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
   * Cancel Stock Order
   *
   * @param {string} stockTxId
   * @return {*}  {Promise<void>}
   * @memberof OrderController
   */
  async cancelStockOrder(stockOrder: StockOrder): Promise<void> {
    console.log('Cancelling Stock Order: ', stockOrder)

    // Check if Stock Transaction exists
    const stockTx = await StockTx.findOne({
      stock_tx_id: stockOrder.stock_tx_id,
    })
    if (!stockTx) {
      throw new Error('Invalid Stock Transaction ID')
    }

    // Set status to cancelled or expired
    if (stockOrder.expired) {
      stockTx.order_status = ORDER_STATUS.EXPIRED
    } else {
      stockTx.order_status = ORDER_STATUS.CANCELLED
    }
    await stockTx.save()

    if (stockOrder.is_buy) {
      // return money to wallet
      await this.walletController.returnMoneyToWallet(stockTx)
    } else {
      // return stock to portfolio
      await this.stockController.returnStockToPortfolio(
        stockTx.user_name,
        stockTx
      )
    }
    await this.stockController.deleteStockTx( stockTx.stock_tx_id )
    await this.walletController.deleteWalletTx( stockTx.stock_tx_id )

    return
  }

  /**
   *  Handle Stock Order
   *
   * @param {StockOrder} stockOrder
   * @return {*}  {Promise<void>}
   * @memberof OrderController
   */
  async handleStockOrder(stockOrder: StockOrder): Promise<void> {
    console.log('Handling Stock Order: ', stockOrder)

    var stockTxId: string = ''

    // Check if Stock Order is to be cancelled or expired
    if (stockOrder.cancel_order || stockOrder.expired) {
      await this.cancelStockOrder(stockOrder)
      return
    }

    const stockTx = await StockTx.findOne({
      stock_tx_id: stockOrder.stock_tx_id,
    })

    if (!stockTx) {
      throw new Error('Invalid Stock Transaction ID')
    }

    if (stockOrder.quantity < stockTx.quantity) {
      stockTx.order_status = ORDER_STATUS.PARTIAL_FULFILLED
      await stockTx.save()

      stockTxId = uuid()

      //create new stockTx for remaining quantity
      const childStockOrder: StockOrder = {
        stock_id: stockTx.stock_id,
        is_buy: stockTx.is_buy,
        order_type: stockTx.order_type,
        price: stockTx.stock_price,
        quantity: stockOrder.quantity,
        stock_tx_id: stockTxId,
      }

      await this.stockController.handleCreateChildStockTx(
        childStockOrder,
        stockTxId,
        stockTx.wallet_tx_id,
        stockTx.user_name,
        stockTx.stock_tx_id
      )
    } else {
      stockTxId = stockTx.stock_tx_id
      stockTx.order_status = ORDER_STATUS.COMPLETED
      await stockTx.save()
    }

    if (stockOrder.is_buy) {
      // update stock portfolio
      await this.stockController.addStockToUserPortfolio(
        stockTx.user_name,
        stockTx.stock_id,
        stockOrder.quantity
      )
      await this.stockController.updateStockPrice(stockOrder)
    }
     else {
      // update wallet balance
      await this.walletController.handleUpdateWalletBalance(
        stockTx.user_name,
        stockOrder,
        stockTx.wallet_tx_id,
        stockTxId
      )
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
   * Handle Stock Order Queue
   *
   * @param {amqp.ConsumeMessage} data
   * @memberof OrderController
   */
  async handleStockOrderQueue(data: amqp.ConsumeMessage) {
    const stockOrders: StockOrder[] = JSON.parse(data.content.toString())
    console.log(' [x] Received %s', stockOrders)

    for (const stockOrder of stockOrders) {
      try {
        await this.handleStockOrder(stockOrder)
      } catch (err) {
        console.warn(err)
      }
    }
  }
}
