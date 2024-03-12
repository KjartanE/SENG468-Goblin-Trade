import { Schema, model } from 'mongoose'

export interface IStock {
  stock_id?: number
  stock_name: string
  current_price: number
  update_date: Date
}

export const stockSchema = new Schema<IStock>(
  {
    stock_id: { type: Number, required: true, unique: true },
    stock_name: { type: String, required: true, unique: true },
    current_price: { type: Number, required: true },
    update_date: { type: Date, required: true },
  },
  { collection: 'Stock' }
)

module.exports = model('Stock', stockSchema)
