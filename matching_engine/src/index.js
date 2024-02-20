const express = require("express")
const amqp = require("amqplib")

const queue = "stock_orders"

const app = express()
const PORT = process.env.MATCHING_ENGINE_PORT || 7000

app.use(express.json())

app.listen(PORT, () => console.log("Server running at port " + PORT))

var channel, connection
connectQueue() // call the connect function

async function connectQueue() {
  try {
    const rabbitmqHost = `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`

    connection = await amqp.connect(rabbitmqHost)
    channel = await connection.createChannel()

    await channel.assertQueue(queue, { durable: false })

    channel.consume(queue, (data) => {
      console.log(`${Buffer.from(data.content)}`)
      channel.ack(data)
    })
  } catch (error) {
    console.log(error)
  }
}
