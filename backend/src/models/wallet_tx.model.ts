import { Schema, model } from 'mongoose'

export interface IWalletTX {
  user_name: string
  wallet_tx_id: string
  stock_tx_id: string | null
  is_debit: boolean
  amount: number
  time_stamp: Date
}

export const walletTXSchema = new Schema<IWalletTX>(
  {
    user_name: { type: String, required: true },
    wallet_tx_id: { type: String, required: true },
    stock_tx_id: { type: String, nullable: true },
    is_debit: { type: Boolean, required: true },
    amount: { type: Number, required: true },
    time_stamp: { type: Date, required: true },
  },
  { collection: 'Wallet_Transaction' }
)

module.exports = model('Wallet_Transaction', walletTXSchema)
