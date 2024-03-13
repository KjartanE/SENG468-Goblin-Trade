export enum OrderType {
  MARKET = "MARKET",
  LIMIT = "LIMIT",
  STOP = "STOP",
  STOP_LIMIT = "STOP_LIMIT",
}

export enum QUEUES {
  INPUT = "stock_orders",
  OUTPUT = "finished_orders",
  MARKET_ORDER_BUY = "market_order_buy",
  MARKET_ORDER_SELL = "market_order_sell",
  LIMIT_ORDER_BUY = "limit_order_buy",
  LIMIT_ORDER_SELL = "limit_order_sell",
}

export enum ORDER_STATUS {
  PARTIALLY_FILLED = "PARTIALLY_FILLED",
  FILLED = "FILLED",
  FILLED_EXACT = "FILLED_EXACT",
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
