import express from 'express'
import cors from 'cors'
import amqp from 'amqplib'
import { OrderController } from './controller/order.controller'
// import { add_mock_data } from './helpers/db'

const app = express()

app.use(cors())
// parse requests of content-type - application/json
app.use(express.json())

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))

// Connect to the database
const db = require('./models')
const mongoose = db.mongoose

mongoose
  .connect(db.url)
  .then(() => {
    console.log('Connected to the database!')
  })
  .catch(err => {
    console.log('Cannot connect to the database!', err)
    process.exit()
  })

app.get('/', (req, res) => {
  res.send('Order Handler:  "Meow Meow Brother."')
})

app.post('/', (req, res) => {
  res.send('Order Handler:  "Woof Woof Brother."')
})

// // set port, listen for requests
const PORT = 5000
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`)
})

const queue = 'finished_orders'
var channel, connection
connectQueue() // call the connect function

async function connectQueue() {
  try {
    const rabbitmqHost = `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`
    connection = await amqp.connect(rabbitmqHost)
    channel = await connection.createChannel()

    const orderController: OrderController = new OrderController()

    await channel.assertQueue(queue, { durable: false })

    channel.consume(queue, async (data: amqp.ConsumeMessage | null) => {
      if (data === null) {
        return
      }

      console.log(`${Buffer.from(data.content)}`)

      channel.ack(data)
      await orderController.handleStockOrderQueue(data)
    })
  } catch (error) {
    console.log(error)
  }
}
