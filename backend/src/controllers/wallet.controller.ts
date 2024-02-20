import { StockOrder } from '../models/stock_tx.model'
import { IWallet } from '../models/wallet.model'

const Wallet = require('../models/wallet.model')
const WalletTx = require('../models/wallet_tx.model')

/**
 * Wallet Controller
 *
 * @export
 * @class WalletController
 */
export class WalletController {
  /**
   * get user Wallet Balance
   *
   * @return {*}  {Promise<IWallet[]>}
   * @memberof WalletController
   */
  async getWalletBalance(user_name: string): Promise<IWallet> {
    const walletBalance = await Wallet.find({ user_name: user_name }).select(
      'user_name balance'
    )

    if (!walletBalance) {
      throw new Error('There was no wallet found.')
    }

    return walletBalance
  }

  /**
   * Update Wallet Balance
   *
   * @param {string} user_name
   * @param {number} amount
   * @return {*}  {Promise<IWallet>}
   * @memberof WalletController
   */
  async addMoneyToWallet(user_name: string, amount: number): Promise<IWallet> {
    const wallet = await Wallet.findOne({ user_name: user_name })
    wallet.balance = wallet.balance + amount
    wallet.save()

    return wallet
  }

  /**
   * Update Wallet Transactions
   *
   * @param {string} user_name
   * @param {string} wallet_tx_id
   * @memberof WalletController
   */
  async updateWalletTransactions(
    user_name: string,
    wallet_tx_id: string
  ): Promise<void> {
    const wallet = await Wallet.findOne({ user_name: user_name })
    wallet.transactions.push(wallet_tx_id)
    wallet.save()
  }

  /**
   * Get Wallet Transactions
   *
   * @param {string} user_name
   * @return {*}
   * @memberof WalletController
   */
  async getWalletTransactions(user_name: string): Promise<string[]> {
    const wallet = await Wallet.findOne({ user_name: user_name })
    return wallet.transactions
  }

  /**
   * Create Wallet Transaction
   *
   * @param {StockOrder} stockOrder
   * @param {string} stockTxId
   * @return {*}  {Promise<void>}
   * @memberof OrderController
   */
  async createWalletTx(
    stockOrder: StockOrder,
    stockTxId: string,
    walletTxId: string
  ): Promise<void> {
    const isDebit = stockOrder.is_buy
    const amount = stockOrder.price * stockOrder.quantity
    const walletTx = {
      wallet_tx_id: walletTxId,
      stock_tx_id: stockTxId,
      is_debit: isDebit,
      amount: amount,
      time_stamp: new Date(),
    }

    const walletTxModel = new WalletTx(walletTx)
    await walletTxModel.save()
  }

  /**
   * Get Wallet Transactions by TXIds
   *
   * @param {string[]} txIds
   * @return {*}  {Promise<string[]>}
   * @memberof WalletController
   */
  async getWalletTransactionsByTXIds(txIds: string[]): Promise<string[]> {
    const walletTx = await WalletTx.find({ wallet_tx_id: { $in: txIds } })
    return walletTx
  }
}
