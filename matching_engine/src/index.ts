import express from "express"
import amqp from "amqplib"
import QueueHandler from "./helper/queue"

const app = express()
const PORT = 7000

export interface IQueue {
  content: string
}

app.use(express.json())

app.listen(PORT, () => console.log("Server running at port " + PORT))

connectQueue() // call the connect function

async function connectQueue() {
  try {
    const rabbitmqHost = `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`

    const connection = await amqp.connect(rabbitmqHost)

    const queueHandler = new QueueHandler(connection) // Initialize QueueHandler
    queueHandler.connectQueue() // Connect to RabbitMQ
    
  } catch (error) {
    console.log(error)
  }
}

// function matchMarketBuytoSell() {
//   process_channel.consume(input_queue, (data) => {
//     process_channel.ack(data)
//     const buy_order = JSON.parse(`${Buffer.from(data.content)}`)
//     var count,
//       lowest_price,
//       first_sell_id,
//       lowest_price_id,
//       looped = 0
//     console.log("Matching market buy:", buy_order)

//     // iterate through all sell orders
//     // finds the lowest price sell order and matches with buy order
//     compare_channel.consume(limit_order_sell, (orderQueue: IQueue) => {
//       const sellOrder: StockOrder = JSON.parse(
//         `${Buffer.from(orderQueue.content)}`
//       )
//       if (count == 0) {
//         lowest_price = sellOrder.price
//         lowest_price_id = sellOrder.stock_tx_id
//         first_sell_id = sellOrder.stock_tx_id
//       } else if (sellOrder.price < lowest_price) {
//         lowest_price = sellOrder.price
//         lowest_price_id = sellOrder.stock_tx_id
//       } else if (first_sell_id == sellOrder.stock_tx_id) {
//         looped = 1
//         return
//       } else if (looped == 1 && lowest_price_id == sellOrder.stock_tx_id) {
//         // at best price sell
//         compare_channel.ack(orderQueue)
//       }
//       count += 1
//     })

//     // sell not found, send buy order back to queue
//     publishToQueue(market_order_buy, JSON.stringify(buy_order))
//     return
//   })
// }

// function to get queue length
