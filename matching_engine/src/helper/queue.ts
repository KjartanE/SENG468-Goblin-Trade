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
    if (order.is_buy) {
      console.log("Handling limit buy")
    }
    else {
      this.handleOrderToQueue(QUEUES.LIMIT_ORDER_SELL, order)
    }
  }

  /**
   * Handle Market Order
   *
   * @param {StockOrder} order
   * @memberof QueueHandler
   */
  async handleMarketOrder(order: StockOrder) {
    console.log("handleMarketOrder", order)
    if (order.is_buy) {
      console.log("Handling market buy")
      try {
        const queue_length = await this.getQueueLength(QUEUES.LIMIT_ORDER_SELL)

        // match market buy order against limit sell queue
        const channel = await this.connection.createChannel()
        await channel.assertQueue(QUEUES.LIMIT_ORDER_SELL, { durable: false })
        var lowest_price, lowest_price_id, loop_count = 0, found_sell = false
  
    
        await channel.consume(QUEUES.LIMIT_ORDER_SELL, async (sell_data: any) => {
          const sell_order: StockOrder = JSON.parse(`${Buffer.from(sell_data.content)}`)

            loop_count++

            if (lowest_price == undefined || sell_order.price < lowest_price) {
              lowest_price = sell_order.price
              lowest_price_id = sell_order.stock_tx_id
            }

            if (loop_count == queue_length) {
              console.log("Lowest price", lowest_price, lowest_price_id)
              found_sell = true
            }
            else if (found_sell && sell_order.stock_tx_id == lowest_price_id) {


              // TODO: Handle matched orders
              console.log("Handling matched orders", order, sell_order)


              // Dequeue the matched sell order
              channel.ack(sell_data)
              // Release the channel
              channel.close()
              return
            }
            // Requeue order
            channel.reject(sell_data, true)
        })
      } catch (error) {
        console.log(error)
      }
    }
    else {
      this.handleOrderToQueue(QUEUES.MARKET_ORDER_SELL, order)
    }
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
