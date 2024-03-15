import { IStockTX, StockOrder } from '../models/stock_tx.model'
import { IWallet } from '../models/wallet.model'
import { v4 as uuid } from 'uuid'
import { IWalletTX } from '../models/wallet_tx.model'

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
   * Get Wallet Balance
   *
   * @param {string} user_name
   * @return {*}  {Promise<IWallet>}
   * @memberof WalletController
   */
  async getWallet(user_name: string): Promise<IWallet> {
    const wallet = await Wallet.findOne({ user_name: user_name })

    if (!wallet) {
      throw new Error('Wallet not found.')
    }

    return wallet
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

    if (!wallet) {
      throw new Error('Wallet not found.')
    }

    wallet.balance = wallet.balance + amount
    await wallet.save()

    return wallet
  }

  /**
   * Update Wallet Balance
   *
   * @param {string} user_name
   * @param {StockOrder} stockOrder
   * @param {string} walletTxId
   * @param {string} stockTxId
   * @return {*}  {Promise<IWallet>}
   * @memberof WalletController
   */
  async handleUpdateWalletBalance(
    user_name: string,
    stockOrder: StockOrder,
    walletTxId: string,
    stockTxId: string
  ): Promise<IWallet> {
    const wallet = await Wallet.findOne({ user_name: user_name })
    const amount = stockOrder.price * stockOrder.quantity

    wallet.balance = wallet.balance + amount
    await wallet.save()

    // Create Wallet Transaction
    await this.createWalletTx(false, amount, stockTxId, walletTxId, user_name)

    return wallet
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
    walletTxId: string,
    userName: string
  ): Promise<void> {
    const walletTx = {
      user_name: userName,
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
   * Delete Wallet Transaction
   *
   * @param {string} stockTxId
   * @return {*}  {Promise<void>}
   * @memberof WalletController
   */
    async deleteWalletTx(stockTxId: string): Promise<void> {
      await WalletTx.deleteMany({ stock_tx_id: stockTxId })
    }

  /**
   * Get Wallet Transactions by TXIds
   *
   * @param {string[]} txIds
   * @return {*}  {Promise<IWalletTX[]>}
   * @memberof WalletController
   */
  async getWalletTransactionsByUserName(
    user_name: string
  ): Promise<IWalletTX[]> {
    const walletTx = await WalletTx.find({ user_name: user_name })

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
      await this.addMoneyToWallet(stockTx.user_name, walletTx.amount)
    }
  }
}
