import amqp from "amqplib"
import { OrderType, StockOrder } from "./misc"

export enum QUEUES {
  INPUT = "stock_orders",
  OUTPUT = "finished_orders",
  MARKET_ORDER_BUY = "market_order_buy",
  MARKET_ORDER_SELL = "market_order_sell",
  LIMIT_ORDER_BUY = "limit_order_buy",
  LIMIT_ORDER_SELL = "limit_order_sell",
}

export class QueueHandler {
  private connection: amqp.Connection

  constructor(connection: amqp.Connection) {
    this.connection = connection
  }

  /**
   * Connect to RabbitMQ
   *
   * @memberof QueueHandler
   */
  async connectQueue() {
    try {
      const channel = await this.connection.createChannel()

      await channel.assertQueue(QUEUES.INPUT, { durable: false })

      // Check input queue for new orders and place into matching queues
      channel.consume(QUEUES.INPUT, (data: any) => {
        console.log("data", data)
        // add order to appropriate matching queue
        channel.ack(data)
        this.handleOrder(data)
      })
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * Get Queue Length
   *
   * @param {*} queueName
   * @return {*}
   * @memberof QueueHandler
   */
  async getQueueLength(queueName) {
    const channel = await this.connection.createChannel()

    await channel.assertQueue(queueName, { durable: false })

    const queue = await channel.checkQueue(queueName)

    await channel.close()

    return queue.messageCount
  }

  /**
   * Publish to Queue
   *
   * @param {*} queueName
   * @param {*} data
   * @memberof QueueHandler
   */
  async publishToQueue(queueName, data) {
    try {
      const channel = await this.connection.createChannel()

      await channel.assertQueue(queueName, { durable: false })

      channel.sendToQueue(queueName, Buffer.from(data))

      await channel.close()

      return
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * Handle Order
   *
   * @param {*} data
   * @memberof QueueHandler
   */
  async handleOrder(data) {
    const order: StockOrder = JSON.parse(`${Buffer.from(data.content)}`)

    if ("cancel_order" in order) {
      this.cancelOrder(order)
    } else {
      if (order.order_type == OrderType.LIMIT) {
        this.handleLimitOrder(order)
      }

      if (order.order_type == OrderType.MARKET) {
        this.handleMarketOrder(order)
      }
    }
  }

  /**
   * Cancel Order
   *
   * @param {StockOrder} order
   * @memberof QueueHandler
   */
  async cancelOrder(order: StockOrder) {
    console.log("cancelOrder", order)
    // cancel order
    // remove order from queue
  }

  /**
   * Handle Limit Order
   *
   * @param {StockOrder} order
   * @memberof QueueHandler
   */
  async handleLimitOrder(order: StockOrder) {
    console.log("handleLimitOrder", order)
  }

  /**
   * Handle Market Order
   *
   * @param {StockOrder} order
   * @memberof QueueHandler
   */
  async handleMarketOrder(order: StockOrder) {
    console.log("handleMarketOrder", order)
  }

  /**
   * Handle Order to Queue
   *
   * @param {string} queueName
   * @param {StockOrder} order
   * @memberof QueueHandler
   */
  async handleOrderToQueue(queueName: string, order: StockOrder) {
    const payload = JSON.stringify(order)
    this.publishToQueue(queueName, payload)
    console.log(queueName, payload)
  }
}

export default QueueHandler
