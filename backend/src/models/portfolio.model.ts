import { Schema, model } from 'mongoose'

export interface IPortfolio {
  user_name: string
  stock_id: number
  quantity_owned: number
}

export const portfolioSchema = new Schema<IPortfolio>(
  {
    user_name: { type: String, required: true },
    stock_id: { type: Number, required: true },
    quantity_owned: { type: Number, required: true },
  },
  { collection: 'Portfolio' }
)

module.exports = model('Portfolio', portfolioSchema)
