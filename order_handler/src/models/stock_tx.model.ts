/* eslint-disable no-unused-vars */
import { Schema, model } from 'mongoose'
import { ORDER_STATUS, ORDER_TYPE } from '../controller/order.controller'


export interface IStockTX {
  user_name: string
  stock_tx_id: string
  wallet_tx_id: string
  parent_stock_tx_id?: string
  stock_id: number
  order_status: ORDER_STATUS
  is_buy: boolean
  order_type: ORDER_TYPE
  stock_price: number
  quantity: number
  time_stamp: Date
}

export interface StockOrder {
  stock_tx_id: string
  stock_id: number
  is_buy: boolean
  order_type: ORDER_TYPE
  quantity: number
  price: number
  cancel_order?: boolean
}

export const stockTXSchema = new Schema<IStockTX>(
  {
    user_name: { type: String, required: true },
    stock_tx_id: { type: String, required: true, unique: true },
    wallet_tx_id: { type: String, required: true },
    parent_stock_tx_id: { type: String, required: false },
    stock_id: { type: Number, required: true },
    order_status: { type: String, required: true },
    is_buy: { type: Boolean, required: true },
    order_type: { type: String, required: true },
    stock_price: { type: Number, required: false },
    quantity: { type: Number, required: true },
    time_stamp: { type: Date, required: true },
  },
  { collection: 'Stock_Transaction' }
)

module.exports = model('Stock_Transaction', stockTXSchema)
