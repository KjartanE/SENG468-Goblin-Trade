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
