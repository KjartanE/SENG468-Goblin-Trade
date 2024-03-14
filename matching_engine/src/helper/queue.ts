import amqp from "amqplib"
import { ORDER_STATUS, OrderType, QUEUES, StockOrder, StockCancelOrder } from "./misc"

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
      console.log('publishToQueue', queueName, data);
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
   * @param {StockCancelOrder} order
   * @memberof QueueHandler
   */
  async cancelOrder(order: StockCancelOrder) {
    // cancel order
    // remove order from queue

    var cancel_order = order._doc
    var queueName = cancel_order.is_buy ? QUEUES.BUY_ORDERS : QUEUES.SELL_ORDERS

    const channel = await this.connection.createChannel()
    await channel.assertQueue(queueName, { durable: false })

    const queue = await channel.checkQueue(queueName)
    const queue_length = queue.messageCount

    if (queue_length != 0) {
      return new Promise((resolve, reject) => {
        var count = 0

        // search through queue for order to cancel
        channel.consume(queueName, (orderData: any) => {
          const order: StockOrder = JSON.parse(`${Buffer.from(orderData.content)}`)
          count++
  
          if (order.stock_tx_id == cancel_order.stock_tx_id) {

            console.log("Found stock to cancel: ", order.stock_tx_id)

            // Order to cancel found. Dequeue it.
            // Release the channel
            channel.ack(orderData)
            channel.close()

            order.cancel_order = true
            this.publishToQueue(QUEUES.OUTPUT, JSON.stringify([order]))

            resolve(true)
            return
          } else if (count >= queue_length) {
            console.log("Unable to find order to cancel: ", order.stock_tx_id)

            // Order not found
            // Release the channel
            channel.close()
            resolve(false)
            return
          }
          // Requeue order
          channel.reject(orderData, true)
        })
      })
    }
    else {
      return false
    }
  }

  /**
   * Handle Limit Order
   *
   * @param {StockOrder} order
   * @memberof QueueHandler
   */
  async handleLimitOrder(order: StockOrder) {
    if (order.is_buy) {
      try {
        console.log("Handling limit buy")
        const lowestOrder = await this.findLowestPrice(
          QUEUES.SELL_ORDERS,
          order
        )
        console.log("lowestOrder", lowestOrder)

        if (lowestOrder != undefined) {
          this.handleMatchedOrders(order, lowestOrder)
        } else {
          console.log("No matching orders found")
          this.publishToQueue(QUEUES.BUY_ORDERS, JSON.stringify(order))
        }
      } catch (error) {
        console.log(error)
      }
    } else {
      try {
        console.log("Handling limit sell")
        const highestOrder = await this.findHighestPrice(
          QUEUES.BUY_ORDERS,
          order
        )
        console.log("highestOrder", highestOrder)

        if (highestOrder != undefined) {
          this.handleMatchedOrders(order, highestOrder)
        } else {
          console.log("No matching orders found")
          this.publishToQueue(QUEUES.SELL_ORDERS, JSON.stringify(order))
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  /**
   * Handle Market Order
   *
   * @param {StockOrder} order
   * @memberof QueueHandler
   */
  async handleMarketOrder(order: StockOrder) {
    if (order.is_buy) {
      console.log("Handling market buy")
      try {
        const lowestOrder = await this.findLowestPrice(
          QUEUES.SELL_ORDERS,
          order
        )
        console.log("lowestOrder", lowestOrder)

        if (lowestOrder != undefined) {
          this.handleMatchedOrders(order, lowestOrder)
        } else {
          console.log("No matching orders found")
          this.publishToQueue(QUEUES.BUY_ORDERS, JSON.stringify(order))
        }
      } catch (error) {
        console.log(error)
      }
    } else {
      try {
        console.log("Handling market sell")
        const highestOrder = await this.findHighestPrice(
          QUEUES.BUY_ORDERS,
          order
        )
        console.log("highestOrder", highestOrder)

        if (highestOrder != undefined) {
          this.handleMatchedOrders(order, highestOrder)
        } else {
          console.log("No matching orders found")
          this.publishToQueue(QUEUES.SELL_ORDERS, JSON.stringify(order))
        }
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
  async handleMatchedOrders(newOrder: StockOrder, matchedOrder: StockOrder) {
    console.log("Handling matched orders", newOrder, matchedOrder)
    // Handle matched orders

    // Check if new order is filled exactly, partially filled or filled
    const newOrderStatus = this.checkNewOrderIsFilled(newOrder, matchedOrder)

    // Handle new order status
    if (newOrderStatus == ORDER_STATUS.FILLED_EXACT) {
      // Handle new order filled exactly
      console.log("New order filled exactly")

      const outputQueueData = JSON.stringify([newOrder, matchedOrder])
      // Publish to output queue
      await this.publishToQueue(QUEUES.OUTPUT, outputQueueData)
    } else if (newOrderStatus == ORDER_STATUS.FILLED) {
      // Handle new order filled
      console.log("New order filled")

      const outputMatchedOrder: StockOrder = {
        ...matchedOrder,
        quantity: newOrder.quantity,
      }
      const outputQueueData = JSON.stringify([newOrder, outputMatchedOrder])

      // Publish to output queue
      await this.publishToQueue(QUEUES.OUTPUT, outputQueueData)

      const newMatchedOrderData = JSON.stringify({
        ...matchedOrder,
        quantity: matchedOrder.quantity - newOrder.quantity,
      })

      // Requeue the remaining matched order
      await this.publishToQueue(QUEUES.INPUT, newMatchedOrderData)
    } else if (newOrderStatus == ORDER_STATUS.PARTIALLY_FILLED) {
      // Handle new order partially filled
      console.log("New order partially filled")

      const outputNewOrder: StockOrder = {
        ...newOrder,
        quantity: matchedOrder.quantity,
      }

      const outputQueueData = JSON.stringify([outputNewOrder, matchedOrder])
      // Publish to output queue
      await this.publishToQueue(QUEUES.OUTPUT, outputQueueData)

      // Requeue the remaining new order
      const newOrderRemainingData = JSON.stringify({
        ...newOrder,
        quantity: newOrder.quantity - matchedOrder.quantity,
      })

      await this.publishToQueue(QUEUES.INPUT, newOrderRemainingData)
    }
  }

  /**
   * Check Order is Filled
   *
   * @param {StockOrder} newOrder
   * @param {StockOrder} matchedOrder
   * @return {*}  {ORDER_STATUS}
   * @memberof QueueHandler
   */
  checkNewOrderIsFilled(
    newOrder: StockOrder,
    matchedOrder: StockOrder
  ): ORDER_STATUS {
    if (newOrder.quantity > matchedOrder.quantity) {
      // Partially filled
      console.log("Partially filled")
      return ORDER_STATUS.PARTIALLY_FILLED
    } else if (newOrder.quantity < matchedOrder.quantity) {
      // Partially filled
      console.log("new Order filled")
      return ORDER_STATUS.FILLED
    } else {
      // Fully filled
      console.log("Fully filled")
      return ORDER_STATUS.FILLED_EXACT
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

    if (queue_length != 0) {
      return new Promise((resolve, reject) => {
        var lowestOrder: StockOrder | undefined = undefined
        var count = 0
        var ignoreMarketOrders = false

        // if order to match is a market order, only look at limit orders
        // otherwise if order to match is a limit order, allow matching with
        // market orders
        if (stockOrder.order_type == OrderType.MARKET) {
          ignoreMarketOrders = true
        }

        channel.consume(queueName, (orderData: any) => {
          const order: StockOrder = JSON.parse(`${Buffer.from(orderData.content)}`)
          count++

          if (order.order_type == OrderType.MARKET && ignoreMarketOrders) {
            // ignore market order
            channel.reject(orderData, true)
          }
          else if (order.order_type == OrderType.MARKET && !ignoreMarketOrders) {
            // accept market order
            lowestOrder = order
            channel.ack(orderData)
            channel.close()
            resolve(lowestOrder)
            return
          }

          if (stockOrder.order_type == OrderType.LIMIT && order.order_type == OrderType.LIMIT) {
            // if buy order less than or equal to limit price is found, accept order and match
            if (+order.price <= +stockOrder.price) {
              lowestOrder = order
              channel.ack(orderData)
              channel.close()
              resolve(lowestOrder)
              return
            }
          }

          // check if price is lower if serving a market order
          if (stockOrder.order_type == OrderType.MARKET && (lowestOrder == undefined || +order.price < +lowestOrder.price)) {
            lowestOrder = order
          }
  
          if (count == queue_length) {
            if (lowestOrder == undefined) {
              // No orders found
              // Release the channel
              channel.close()
              resolve(undefined)
              return
            }
          }

          if (lowestOrder != undefined && (order.stock_tx_id == lowestOrder.stock_tx_id) && (count > queue_length)) {
            // At lowest price order. Dequeue it.
            // Release the channel
            channel.ack(orderData)
            channel.close()
            resolve(lowestOrder)
            return
          }
  
          // Requeue order
          channel.reject(orderData, true)
        })
      })
    }
    else {
      return undefined
    }
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

    if (queue_length != 0) {
      return new Promise((resolve, reject) => {
        var highestOrder: StockOrder | undefined = undefined
        var count = 0
        var ignoreMarketOrders = false

        // if order to match is a market order, only look at limit orders
        // otherwise if order to match is a limit order, allow matching with
        // market orders
        if (stockOrder.order_type == OrderType.MARKET) {
          ignoreMarketOrders = true
        }

        channel.consume(queueName, (orderData: any) => {
          const order: StockOrder = JSON.parse(`${Buffer.from(orderData.content)}`)
          count++

          if (order.order_type == OrderType.MARKET && ignoreMarketOrders) {
            // ignore market order
            channel.reject(orderData, true)
          }
          else if (order.order_type == OrderType.MARKET && !ignoreMarketOrders) {
            // accept market order
            highestOrder = order
            channel.ack(orderData)
            channel.close()
            resolve(highestOrder)
            return
          }

          if (stockOrder.order_type == OrderType.LIMIT && order.order_type == OrderType.LIMIT) {
            // if sell order of at least limit price found, accept order and match
            if (+order.price >= +stockOrder.price) {
              highestOrder = order
              channel.ack(orderData)
              channel.close()
              resolve(highestOrder)
              return
            }
          }

          // check if price is higher if serving a market order
          if (stockOrder.order_type == OrderType.MARKET && (highestOrder == undefined || +order.price > +highestOrder.price)) {
            highestOrder = order
          }
  
          if (count == queue_length) {
            if (highestOrder == undefined) {
              // No orders found
              // Release the channel
              channel.close()
              resolve(undefined)
              return
            }
          }

          if (highestOrder != undefined && (order.stock_tx_id == highestOrder.stock_tx_id) && (count > queue_length)) {
            // At highest price order. Dequeue it.
            // Release the channel
            channel.ack(orderData)
            channel.close()
            resolve(highestOrder)
            return
          }
  
          // Requeue order
          channel.reject(orderData, true)
        })
      })
    }
    else {
      return undefined
    }
  }
}

export default QueueHandler
