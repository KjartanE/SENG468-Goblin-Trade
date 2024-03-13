import { IStock } from '../models/stock.model'
import { IStockTX, StockOrder } from '../models/stock_tx.model'

const Portfolio = require('../models/portfolio.model')
const Stock = require('../models/stock.model')

/**
 * Stock Controller
 *
 * @export
 * @class StockController
 */
export class StockController {
  /**
   * Update Stock Price
   *
   * @param {IStockTX} stockTx
   * @return {*}  {Promise<IStock>}
   * @memberof StockController
   */
  async updateStockPrice(stockOrder: StockOrder): Promise<IStock> {
    const stockToUpdate = await Stock.findOne({ stock_id: stockOrder.stock_id })
    if (!stockToUpdate) {
      throw new Error('Stock not found.')
    }
    stockToUpdate.current_price = stockOrder.price
    await stockToUpdate.save()
    return stockToUpdate
  }

  /**
   * Add Stock to User Portfolio
   *
   * @param {string} user_name
   * @param {number} stock_id
   * @param {number} quantity
   * @return {*}  {Promise<IStock>}
   * @memberof StockController
   */
  async addStockToUserPortfolio(
    user_name: string,
    stock_id: number,
    quantity: number
  ): Promise<IStock> {
    const portfolio = await Portfolio.findOne({
      user_name: user_name,
      stock_id: stock_id,
    })

    if (portfolio) {
      portfolio.quantity_owned = portfolio.quantity_owned + quantity

      if (portfolio.quantity_owned === 0) {
        const response = await Portfolio.deleteOne({
          user_name: user_name,
          stock_id: stock_id,
        })
        return response
      }

      await portfolio.save()
      return portfolio
    }

    const newPortfolio = new Portfolio({
      user_name: user_name,
      stock_id: stock_id,
      quantity_owned: quantity,
    })

    await newPortfolio.save()

    return newPortfolio
  }

  /**
   * Return Stock to Portfolio
   *
   * @param {*} stockTx
   * @return {*}  {Promise<void>}
   * @memberof StockController
   */
  async returnStockToPortfolio(
    user_name: string,
    stockTx: IStockTX
  ): Promise<void> {
    console.log('Returning Stock to Portfolio: ', stockTx)
    const portfolio = await Portfolio.findOne({
      user_name: user_name,
      stock_id: stockTx.stock_id,
    })
    if (!portfolio) {
      throw new Error('Portfolio not found.')
    }

    portfolio.quantity_owned = portfolio.quantity_owned + stockTx.quantity
    await portfolio.save()
  }
}
