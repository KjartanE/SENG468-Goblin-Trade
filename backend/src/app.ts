import express from 'express'
import cors from 'cors'
import { add_mock_data } from './helpers/db'

const auth = require('./routes/auth.routes')
const stock = require('./routes/stock.routes')
const wallet = require('./routes/wallet.routes')
const order = require('./routes/order.routes')

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

// Import data
add_mock_data()

// Routes
app.use('/', auth)
app.use('/', stock)
app.use('/', wallet)
app.use('/', order)

app.get('/', (req, res) => {
  res.send('Back End:  "Meow Meow Brother."')
})

app.post('/', (req, res) => {
  res.send('Back End:  "Woof Woof Brother."')
})

// // set port, listen for requests
const PORT = 8080
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`)
})

const amqp = require('amqplib')
const queue = 'finished_orders'
var channel, connection
connectQueue() // call the connect function

async function connectQueue() {
  try {
    const rabbitmqHost = `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`
    connection = await amqp.connect(rabbitmqHost)
    channel = await connection.createChannel()

    await channel.assertQueue(queue, { durable: false })

    channel.consume(queue, data => {
      console.log(`${Buffer.from(data.content)}`)
      channel.ack(data)
    })
  } catch (error) {
    console.log(error)
  }
}
