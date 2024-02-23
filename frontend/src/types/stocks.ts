/**
 * A stock with its details and current price
 */
export interface IStock {
  stock_id?: number
  stock_name: string
  current_price: number
  update_date: Date
}

/**
 * A stock within a user's portfolio
 */
export interface IStockPortfolio {
  stock_id?: number
  quantity_owned?: number
}

/**
 * A stock transaction
 */
export interface IStockTransaction {
  stock_tx_id?: string
  wallet_tx_id?: string
  stock_id?: number
  order_status?: string
  is_buy?: boolean
  order_type?: string
  stock_price?: number
  quantity?: number
  time_stamp?: string
  __v?: number
}