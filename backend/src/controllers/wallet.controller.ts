import { IStockTX } from '../models/stock_tx.model'
import { IWallet } from '../models/wallet.model'
import { v4 as uuid } from 'uuid'

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
    const walletBalance = await Wallet.findOne({ user_name: user_name }).select(
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

    //create wallet transaction
    const walletTxId = await uuid()
    await this.createWalletTx(true, amount, null, walletTxId)

    // Update Wallet Transactions in Wallet
    await this.updateWalletTransactions(user_name, walletTxId)
    await wallet.save()

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
   * @param {boolean} isDebit
   * @param {number} amount
   * @param {(string | null)} stockTxId
   * @param {string} walletTxId
   * @return {*}  {Promise<void>}
   * @memberof WalletController
   */
  async createWalletTx(
    isDebit: boolean,
    amount: number,
    stockTxId: string | null,
    walletTxId: string
  ): Promise<void> {
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

  /**
   * Return Money to Wallet
   *
   * @param {IStockTX} stockTx
   * @return {*}  {Promise<void>}
   * @memberof WalletController
   */
  async returnMoneyToWallet(stockTx: IStockTX): Promise<void> {
    // Get Wallet Transaction
    const walletTx = await WalletTx.findOne({
      stock_tx_id: stockTx.stock_tx_id,
    })

    // Update Wallet Balance
    if (walletTx.is_debit) {
      await this.addMoneyToWallet(walletTx.user_name, walletTx.amount)
    }

    // new Wallet Transactions in Wallet for the returned amount
    const walletTxId = await uuid()
    await this.createWalletTx(
      false,
      walletTx.amount,
      stockTx.stock_tx_id,
      walletTxId
    )

    // Update Wallet Transactions in Wallet
    await this.updateWalletTransactions(walletTx.user_name, walletTxId)
  }
}
