import { IStock } from '../models/stock.model'

const Stock = require('../models/stock.model')
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
   * @param {string} user_name
   * @return {*}  {Promise<IStock[]>}
   * @memberof StockController
   */
  async getStockPortfolio(user_name: string): Promise<IStock[]> {
    const userPortfolio = await Portfolio.find({ user_name: user_name }).select(
      'stock_id quantity_owned'
    )

    if (!userPortfolio) {
      throw new Error('There were no stocks found.')
    }

    return userPortfolio
  }

  /**
   * Create Stock
   *
   * @param {string} stock_name
   * @return {*}  {Promise<IStock>}
   * @memberof StockController
   */
  async createStock(stock_name: string): Promise<IStock> {
    const count = await Stock.countDocuments()

    const stock = new Stock({
      stock_id: count + 1,
      stock_name: stock_name,
      current_price: 100,
      update_date: new Date(),
    })

    await stock.save()

    return stock
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
}
