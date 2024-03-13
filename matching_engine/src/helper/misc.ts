export enum OrderType {
  MARKET = "MARKET",
  LIMIT = "LIMIT",
  STOP = "STOP",
  STOP_LIMIT = "STOP_LIMIT",
}

export interface StockOrder {
  stock_tx_id?: string
  stock_id: number
  is_buy: boolean
  order_type: OrderType
  quantity: number
  price: number
  cancel_order?: boolean
}

