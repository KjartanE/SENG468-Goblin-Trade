import { IPortfolio } from '../models/portfolio.model'
import { IStock } from '../models/stock.model'
import { StockOrder } from '../models/stock_tx.model'

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
   *  Get Stock Price
   *
   * @param {number} stock_id
   * @return {*}  {Promise<IStock>}
   * @memberof StockController
   */
  async getStockPrice(stock_id: number): Promise<IStock> {
    const stock = await Stock.findOne({ stock_id: stock_id })
    if (!stock) {
      throw new Error('Stock not found.')
    }

    return stock
  }

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
   * Get Users stock portfolio
   *
   * @param {string} user_name
   * @return {*}  {Promise<IPortfolio[]>}
   * @memberof StockController
   */
  async getStockPortfolio(user_name: string): Promise<IPortfolio[]> {
    const userPortfolio = await Portfolio.find({ user_name: user_name }).select(
      'stock_id quantity_owned'
    )

    const stocks = await Stock.find().select('stock_id stock_name')

    if (!userPortfolio) {
      throw new Error('There were no stocks found.')
    }

    const portfolio = userPortfolio.map(stock => {
      const stock_name = stocks.find(
        stockItem => stockItem.stock_id === stock.stock_id
      )
      return {
        stock_id: stock.stock_id,
        stock_name: stock_name.stock_name,
        quantity_owned: stock.quantity_owned,
      }
    })

    return portfolio
  }

  /**
   * Get User Stock Portfolio
   *
   * @param {string} user_name
   * @param {number} stock_id
   * @return {*}  {Promise<IPortfolio>}
   * @memberof StockController
   */
  async getUserStockPortfolio(
    user_name: string,
    stock_id: number
  ): Promise<IPortfolio> {
    const portfolio = await Portfolio.findOne({
      user_name: user_name,
      stock_id: stock_id,
    })

    return portfolio
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
}
