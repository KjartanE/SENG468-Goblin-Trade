import express from "express"
import amqp from "amqplib"

const input_queue = "stock_orders"
const output_queue = "finished_orders"
const market_order_buy = "market_order_buy"
const market_order_sell = "market_order_sell"
const market_order_buy_cancel = "market_order_buy_cancel"
const market_order_sell_cancel = "market_order_sell_cancel"
const limit_order_buy = "limit_order_buy"
const limit_order_sell = "limit_order_sell"
const limit_order_buy_cancel = "limit_order_buy_cancel"
const limit_order_sell_cancel = "limit_order_sell_cancel"

const app = express()
const PORT = 7000

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

export interface IQueue {
  content: string
}

app.use(express.json())

app.listen(PORT, () => console.log("Server running at port " + PORT))

var input_channel, process_channel, compare_channel, connection
connectQueue() // call the connect function

async function connectQueue() {
  try {
    const rabbitmqHost = `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`

    connection = await amqp.connect(rabbitmqHost)
    input_channel = await connection.createChannel()
    process_channel = await connection.createChannel()
    compare_channel = await connection.createChannel()

    await input_channel.assertQueue(input_queue, { durable: false })
    await process_channel.assertQueue(input_queue, { durable: false })
    await compare_channel.assertQueue(input_queue, { durable: false })

    // Check input queue for new orders and place into matching queues
    input_channel.consume(input_queue, (data) => {
      // add order to appropriate matching queue
      input_channel.ack(data)
      addOrder(data)
    })

    // Check market buy queue
    matchMarketBuytoSell()
    // Check other queues..
    // matchLimitBuytoSell()

    // publish the processed data to the output queue
    // publishToQueue(output_queue, processedData)
  } catch (error) {
    console.log(error)
  }
}

// function to add order to apprpriate matching queue
function addOrder(data) {
  const order = JSON.parse(`${Buffer.from(data.content)}`)

  if ("cancel_order" in order) {
    // Cancel order
    switch (order._doc.order_type) {
      case "LIMIT":
        if (order._doc.is_buy == true) {
          // add buy order to buy cancel queue
          addCancelOrderToQueue(limit_order_buy_cancel)
        } else {
          // add sell order to sell cancel queue
          addCancelOrderToQueue(limit_order_sell_cancel)
        }
        break
      case "MARKET":
        if (order._doc.is_buy == true) {
          // add buy order to buy cancel queue
          addCancelOrderToQueue(market_order_buy_cancel)
        } else {
          // add sell order to sell cancel queue
          addCancelOrderToQueue(market_order_sell_cancel)
        }
        break
      default:
        throw new Error("Invalid order type")
    }
  } else {
    // Add order
    switch (order.order_type) {
      case "LIMIT":
        if (order.is_buy == true) {
          // add buy order to buy queue
          addOrderToQueue(limit_order_buy)
        } else {
          // add sell order to sell queue
          addOrderToQueue(limit_order_sell)
        }
        break
      case "MARKET":
        if (order.is_buy == true) {
          // add buy order to buy queue
          addOrderToQueue(market_order_buy)
        } else {
          // add sell order to sell queue
          addOrderToQueue(market_order_sell)
        }
        break
      default:
        throw new Error("Invalid order type")
    }
  }

  function addOrderToQueue(queueName) {
    const payload = JSON.stringify(order)
    publishToQueue(queueName, payload)
    console.log(queueName, payload)
  }
  function addCancelOrderToQueue(queueName) {
    const payload = JSON.stringify(order._doc)
    publishToQueue(queueName, payload)
    console.log(queueName, payload)
  }
}

function matchMarketBuytoSell() {
  process_channel.consume(input_queue, (data) => {
    process_channel.ack(data)
    const buy_order = JSON.parse(`${Buffer.from(data.content)}`)
    var count,
      lowest_price,
      first_sell_id,
      lowest_price_id,
      looped = 0
    console.log("Matching market buy:", buy_order)

    // iterate through all sell orders
    // finds the lowest price sell order and matches with buy order
    compare_channel.consume(limit_order_sell, (orderQueue: IQueue) => {
      const sellOrder: StockOrder = JSON.parse(
        `${Buffer.from(orderQueue.content)}`
      )
      if (count == 0) {
        lowest_price = sellOrder.price
        lowest_price_id = sellOrder.stock_tx_id
        first_sell_id = sellOrder.stock_tx_id
      } else if (sellOrder.price < lowest_price) {
        lowest_price = sellOrder.price
        lowest_price_id = sellOrder.stock_tx_id
      } else if (first_sell_id == sellOrder.stock_tx_id) {
        looped = 1
        return
      } else if (looped == 1 && lowest_price_id == sellOrder.stock_tx_id) {
        // at best price sell
        compare_channel.ack(orderQueue)
      }
      count += 1
    })

    // sell not found, send buy order back to queue
    publishToQueue(market_order_buy, JSON.stringify(buy_order))
    return
  })
}

// function to get queue length
async function getQueueLength(queueName) {
  const queue = await input_channel.checkQueue(queueName)
  return queue.messageCount
}

// function to publish to queue
async function publishToQueue(queueName, data) {
  try {
    input_channel.sendToQueue(queueName, Buffer.from(data))
  } catch (error) {
    console.log(error)
  }
}
