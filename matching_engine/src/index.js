const express = require("express")
const amqp = require("amqplib")

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
const PORT = process.env.MATCHING_ENGINE_PORT || 7000

app.use(express.json())

app.listen(PORT, () => console.log("Server running at port " + PORT))

var channel, compare_channel, connection
connectQueue() // call the connect function

async function connectQueue() {
  try {
    const rabbitmqHost = `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`

    connection = await amqp.connect(rabbitmqHost)
    channel = await connection.createChannel()
    compare_channel = await connection.createChannel()

    await channel.assertQueue(input_queue, { durable: false })
    await compare_channel.assertQueue(input_queue, { durable: false })

    // Check input queue for new orders and place into matching queues
    processInputQueue()
    matchMarketBuytoSell()

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
  }
  else {
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

// function to check input queue
function processInputQueue() {
  channel.consume(input_queue, (data) => {
    // add order to appropriate matching queue
    channel.ack(data)
    addOrder(data)
  })

}

function matchMarketBuytoSell(data) {
  channel.consume(input_queue, (data) => {
    const buy_order = JSON.parse(`${Buffer.from(data.content)}`)
    var count = 0
    const sell_count = compare_channel.checkQueue(limit_order_sell);
    var lowest_price
    console.log("Matching market buy:", buy_order)
    console.log("Sell count:", sell_count)
    console.log("Count:", count)
    // iterate through all sell orders
    // finds the lowest price sell order and matches with buy order
    compare_channel.consume(limit_order_sell, (sell) => {
      const sell_order = JSON.parse(`${Buffer.from(sell.content)}`)
      if (count == 0) {
        lowest_price = sell_order.price
      }
      else if (sell_order.price < lowest_price) {
        lowest_price = sell_order.price
      }
      

      console.log("To sell:", sell_order)
      console.log("Lowest price:", lowest_price)


      count += 1
    })

    channel.ack(data)
  })
  // sell not found, send buy order back to queue
  publishToQueue(market_order_buy, JSON.stringify(buy_order))
}

// function to publish to queue
async function publishToQueue(queueName, data) {
  try {
    channel.sendToQueue(queueName, Buffer.from(data))
  } catch (error) {
    console.log(error)
  }
}
