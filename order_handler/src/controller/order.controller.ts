import amqp from 'amqplib'
import { StockOrder } from '../models/stock_tx.model'
import { WalletController } from './wallet.controller'
import { StockController } from './stock.controller'

const StockTx = require('../models/stock_tx.model')

export enum ORDER_STATUS {
  PENDING = 'PENDING',
  FILLED = 'FILLED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED',
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

    stockTx.order_status = ORDER_STATUS.CANCELLED
    await stockTx.save()

    if (stockOrder.is_buy) {
      // return money to wallet
      await this.walletController.returnMoneyToWallet(stockTx)
    } else {
      const wallet = await this.walletController.getUserWalletByStockTx(stockTx)
      // return stock to portfolio
      await this.stockController.returnStockToPortfolio(
        wallet.user_name,
        stockTx
      )
    }

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
    // Check if Stock Order is to be cancelled
    if (stockOrder.cancel_order) {
      await this.cancelStockOrder(stockOrder)
      return
    }

    const stockTx = await StockTx.findOne({
      stock_tx_id: stockOrder.stock_tx_id,
    })
    if (!stockTx) {
      throw new Error('Invalid Stock Transaction ID')
    }
    stockTx.order_status = ORDER_STATUS.FILLED
    await stockTx.save()

    // Update Stock Transaction
    if (stockOrder.is_buy) {
      const wallet = await this.walletController.getUserWalletByStockTx(stockTx)

      // update stock portfolio
      await this.stockController.addStockToUserPortfolio(
        wallet.user_name,
        stockTx.stock_id,
        stockTx.quantity
      )
    } else {
      const wallet = await this.walletController.getUserWalletByStockTx(stockTx)

      // update wallet balance
      await this.walletController.addMoneyToWallet(
        wallet.user_name,
        stockTx.stock_price * stockTx.quantity
      )
    }

    await this.stockController.updateStockPrice(stockOrder)
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
