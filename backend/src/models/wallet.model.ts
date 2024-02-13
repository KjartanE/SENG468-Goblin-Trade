import { Schema, model } from 'mongoose'

export interface IWallet {
  user_name: string
  balance: number
}

export const walletSchema = new Schema<IWallet>(
  {
    user_name: { type: String, required: true },
    balance: { type: Number, required: true },
  },
  { collection: 'Wallet' }
)

module.exports = model('Wallet', walletSchema)
