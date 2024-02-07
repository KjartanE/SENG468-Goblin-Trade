import { IWallet } from '../models/wallet.model'

const User = require('../models/user.model')
const Wallet = require('../models/wallet.model')
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
  async getWalletBalance(token: string): Promise<IWallet> {
    const user = await User.findOne({ token: token })
    const user_name = user.user_name

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
   * @param {string} token
   * @param {number} amount
   * @return {*}  {Promise<IWallet>}
   * @memberof WalletController
   */
  async addMoneyToWallet(token: string, amount: number): Promise<IWallet> {
    const user = await User.findOne({ token: token })
    const user_name = user.user_name

    const wallet = await Wallet.findOne({ user_name: user_name })
    wallet.balance = wallet.balance + amount
    wallet.save()

    return wallet
  }
}
