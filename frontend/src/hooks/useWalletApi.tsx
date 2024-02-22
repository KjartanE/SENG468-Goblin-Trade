import { AxiosInstance } from 'axios'
import { IWalletTransactions } from '../types/wallet'

export interface IWallet {
  user_name: string
  balance: number
}

/**
 * Wallet API
 *
 * @param {AxiosInstance} axios
 * @return {*}
 */
const useWalletApi = (axios: AxiosInstance) => {
  /**
   * Get the wallet balance
   *
   * @return {*}  {Promise<string>}
   */
  const getWalletBalance = async (): Promise<IWallet> => {
    const { data } = await axios.get('/getWalletBalance')

    return data
  }

  /**
   * Update the wallet balance
   *
   * @param {number} amount
   * @return {*}  {Promise<string>}
   */
  const updateWalletBalance = async (amount: number): Promise<IWallet> => {
    const { data } = await axios.post('/addMoney', {
      amount,
    })

    return data
  }

  /**
   * Get wallet transaction history
   *
   * @return {*}  {Promise<string>}
   */
  const getWalletTransactions = async (): Promise<IWalletTransactions[]> => {
    const { data } = await axios.get('/getWalletTransactions')

    return data
  }

  return {
    getWalletBalance,
    updateWalletBalance,
    getWalletTransactions,
  }
}

export default useWalletApi
