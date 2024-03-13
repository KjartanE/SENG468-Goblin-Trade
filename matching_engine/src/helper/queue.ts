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
      channel.consume(QUEUES.INPUT, (data: amqp.ConsumeMessage | null) => {
        if (data === null) {
          return
        }

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
  async getQueueLength(queueName: string) {
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
  async publishToQueue(queueName: string, data: string) {
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
   * @param {amqp.ConsumeMessage} data
   * @memberof QueueHandler
   */
  async handleOrder(data: amqp.ConsumeMessage) {
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
    } else {
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
        const lowestOrder = await this.findLowestPrice(
          QUEUES.MARKET_ORDER_SELL,
          order
        )
        console.log("lowestOrder", lowestOrder)
      } catch (error) {
        console.log(error)
      }
    } else {
      try {
        const highestOrder = await this.findHighestPrice(
          QUEUES.MARKET_ORDER_SELL,
          order
        )
        console.log("highestOrder", highestOrder)
      } catch (error) {
        console.log(error)
      }
    }
  }

  /**
   * Handle Matched Orders
   *
   * @param {StockOrder[]} orders
   * @memberof QueueHandler
   */
  async handleMatchedOrders(orders: StockOrder[]) {
    console.log("Handling matched orders", orders)
    // Handle matched orders
  }

  /**
   * Check Order is Filled
   *
   * @param {StockOrder} newOrder
   * @param {StockOrder} matchedOrder
   * @return {*}
   * @memberof QueueHandler
   */
  async checkNewOrderIsFilled(newOrder: StockOrder, matchedOrder: StockOrder) {
    if (newOrder.quantity > matchedOrder.quantity) {
      // Partially filled
      console.log("Partially filled")
      return false
    } else if (newOrder.quantity < matchedOrder.quantity) {
      // Partially filled
      console.log("new Order filled")
      return true
    } else {
      // Fully filled
      console.log("Fully filled")
      return true
    }
  }

  /**
   * Find Lowest Price
   *
   * @param {string} queueName
   * @memberof QueueHandler
   */
  async findLowestPrice(
    queueName: string,
    stockOrder: StockOrder
  ): Promise<StockOrder | undefined> {
    const channel = await this.connection.createChannel()
    await channel.assertQueue(queueName, { durable: false })

    const queue = await channel.checkQueue(queueName)
    const queue_length = queue.messageCount

    var lowestOrder: StockOrder | undefined = undefined
    var count = 0

    await channel.consume(queueName, (orderData: any) => {
      const order: StockOrder = JSON.parse(`${Buffer.from(orderData.content)}`)
      count++

      // Check if stock_id matches
      if (order.stock_id != stockOrder.stock_id) {
        // Requeue order
        channel.reject(orderData, true)
        return
      }

      // check if price is lower
      if (lowestOrder == undefined || order.price < lowestOrder.price) {
        lowestOrder = order
      }

      if (count == queue_length) {
        // No orders found
        if (lowestOrder == undefined) {
          console.log("No orders found")
          // Release the channel
          channel.close()
          return
        }

        console.log("Lowest price", lowestOrder.price, lowestOrder.stock_tx_id)

        console.log("Handling matched orders", order)
        // Dequeue the matched order
        channel.ack(orderData)
        // Release the channel
        channel.close()
        return lowestOrder
      }

      // Requeue order
      channel.reject(orderData, true)
    })
    return lowestOrder
  }

  /**
   * Find Highest Price
   *
   * @param {string} queueName
   * @memberof QueueHandler
   */
  async findHighestPrice(
    queueName: string,
    stockOrder: StockOrder
  ): Promise<StockOrder | undefined> {
    const channel = await this.connection.createChannel()
    await channel.assertQueue(queueName, { durable: false })

    const queue = await channel.checkQueue(queueName)
    const queue_length = queue.messageCount

    var highestOrder: StockOrder | undefined = undefined
    var count = 0

    await channel.consume(queueName, (orderData: any) => {
      const order: StockOrder = JSON.parse(`${Buffer.from(orderData.content)}`)
      count++

      // Check if stock_id matches
      if (order.stock_id != stockOrder.stock_id) {
        // requeue order
        channel.reject(orderData, true)
        return
      }

      // check if price is higher
      if (highestOrder == undefined || order.price > highestOrder.price) {
        highestOrder = order
      }

      if (count == queue_length) {
        console.log(
          "Highest price",
          highestOrder.price,
          highestOrder.stock_tx_id
        )

        console.log("Handling matched orders", order)
        channel.ack(orderData)
        channel.close()
        return highestOrder
      }

      channel.reject(orderData, true)
    })

    return highestOrder
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
