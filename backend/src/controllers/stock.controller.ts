import { IStock } from '../models/stock.model'

const Stock = require('../models/stock.model')
const User = require('../models/user.model')
const Portfolio = require('../models/portfolio.model')

/**
 * Stock Controller
 *
 * @export
 * @class StockController
 */
export class StockController {
  /**
   * get all Stock Prices
   *
   * @return {*}  {Promise<IStock[]>}
   * @memberof StockController
   */
  async getStockPrices(): Promise<IStock[]> {
    const stockList = await Stock.find().select(
      'stock_id stock_name current_price'
    )

    if (!stockList) {
      throw new Error('There were no stocks found.')
    }

    return stockList
  }

  /**
   * Get Users stock portfolio
   *
   * @param {string} token
   * @return {*}  {Promise<IStock[]>}
   * @memberof StockController
   */
  async getStockPortfolio(token: string): Promise<IStock[]> {
    const user = await User.findOne({ token: token })
    const user_name = user.user_name

    const userPortfolio = await Portfolio.find({ user_name: user_name }).select(
      'stock_id quantity_owned'
    )

    if (!userPortfolio) {
      throw new Error('There were no stocks found.')
    }

    return userPortfolio
  }
}
