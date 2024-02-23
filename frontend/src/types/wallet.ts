/**
 * The currently signed in user's wallet balance
 */

export interface IWallet {
  _id?: string
  user_name?: string
  balance?: number
}

/**
 * An entry in the user's recent wallet transactions
 */
export interface IWalletTransaction {
  _id?: string
  wallet_tx_id?: string
  stock_tx_id?: string
  is_debit?: boolean
  amount?: number
  time_stamp?: string
  __v?: number
}
