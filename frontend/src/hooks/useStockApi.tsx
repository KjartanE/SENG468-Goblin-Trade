import { AxiosInstance } from 'axios'
import { IStock } from '../types/stocks'
import {
  IStockPortfolio,
  IStockTransaction,
  IStockOrderForm,
} from '../types/stocks'

/**
 * Stock API
 *
 * Requires the user to be logged in
 *
 * @param {AxiosInstance} axios
 * @return {*}
 */
const useStockAPI = (axios: AxiosInstance) => {
  /**
   * Get the current stock prices
   *
   * @return {*}  {Promise<string>}
   */
  const getStockPrices = async (): Promise<IStock[]> => {
    const { data } = await axios.get('/getStockPrices')

    return data
  }

  /**
   * Get user's stock portfolio
   *
   * @param {number} amount
   * @return {*}  {Promise<string>}
   */
  const getStockPortfolio = async (): Promise<IStockPortfolio[]> => {
    const { data } = await axios.get('/getStockPortfolio')

    return data
  }

  /**
   * Get user's stock transaction history
   *
   * @return {*}  {Promise<string>}
   */
  const getStockTransactions = async (): Promise<IStockTransaction[]> => {
    const { data } = await axios.get('/getStockTransactions')

    return data
  }

  /**
   * Place a stock order
   *
   * @param {IStockOrderForm} order
   * @returns {*} Promise
   */
  const placeStockOrder = async (order: string): Promise<IStockOrderForm> => {
    const { data } = await axios.post('/addMoney', {
      order,
    })

    return data
  }

  return {
    getStockPrices,
    getStockPortfolio,
    getStockTransactions,
    placeStockOrder,
  }
}

export default useStockAPI
