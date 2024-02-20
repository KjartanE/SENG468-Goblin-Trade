import { Schema, model } from 'mongoose'

export interface IWallet {
  user_name: string
  balance: number
  transactions?: string[]
}

export const walletSchema = new Schema<IWallet>(
  {
    user_name: { type: String, required: true },
    balance: { type: Number, required: true },
    transactions: { type: [String], required: false },
  },
  { collection: 'Wallet' }
)

module.exports = model('Wallet', walletSchema)
