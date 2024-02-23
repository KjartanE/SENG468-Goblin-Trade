import { AxiosInstance } from 'axios'
import { Stock } from '../types/stocks'
import { StockPortfolio } from '../types/stocks'
import { StockTransaction } from '../types/stocks'

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
  const getStockPrices = async (): Promise<Stock[]> => {
    const { data } = await axios.get('/getStockPrices')

    return data
  }

  /**
   * Get user's stock portfolio
   *
   * @param {number} amount
   * @return {*}  {Promise<string>}
   */
  const getStockPortfolio = async (): Promise<StockPortfolio[]> => {
    const { data } = await axios.get('/getStockPortfolio')

    return data
  }

  /**
   * Get user's stock transaction history
   *
   * @return {*}  {Promise<string>}
   */
  const getStockTransactions = async (): Promise<StockTransaction[]> => {
    const { data } = await axios.get('/getStockTransactions')

    return data
  }

  return {
    getStockPrices,
    getStockPortfolio,
    getStockTransactions,
  }
}

export default useStockAPI
