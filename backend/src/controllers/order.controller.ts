/* eslint-disable no-unused-vars */
import amqp from 'amqplib'

const queue = 'stock_orders'

export enum OrderType {
  MARKET = 'MARKET',
  LIMIT = 'LIMIT',
  STOP = 'STOP',
  STOP_LIMIT = 'STOP_LIMIT',
}

export interface StockOrder {
  stock_id: number
  is_buy: boolean
  order_type: OrderType
  quantity: number
  price: number
}

export class OrderController {
  async placeStockOrder(stockOrder: StockOrder): Promise<void> {
    let connection
    try {
      const rabbitmqHost = `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`
      connection = await amqp.connect(rabbitmqHost)
      const channel = await connection.createChannel()

      await channel.assertQueue(queue, { durable: false })
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(stockOrder)))
      console.log(" [x] Sent '%s'", stockOrder)
      await channel.close()
    } catch (err) {
      console.warn(err)
    } finally {
      if (connection) await connection.close()
    }
  }
}
