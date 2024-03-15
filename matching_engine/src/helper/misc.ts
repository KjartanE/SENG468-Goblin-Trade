export enum OrderType {
  MARKET = "MARKET",
  LIMIT = "LIMIT",
  STOP = "STOP",
  STOP_LIMIT = "STOP_LIMIT",
}

export enum QUEUES {
  INPUT = "incoming_orders",
  OUTPUT = "finished_orders",
  BUY_ORDERS = "stock_buy_orders",
  SELL_ORDERS = "stock_sell_orders",
  EXPIRED_ORDERS = "expired_orders",
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
  expired?: boolean
}

export interface StockCancelOrder {
  '$__'?: any
  '$isNew'?: any
  _doc?: any
  cancel_order?: boolean
}