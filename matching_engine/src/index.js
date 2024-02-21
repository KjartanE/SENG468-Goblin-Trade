const express = require("express")
const amqp = require("amqplib")

const input_queue = "stock_orders"
const output_queue = "finished_orders"

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

    await channel.assertQueue(input_queue, { durable: false })

    channel.consume(input_queue, (data) => {
      console.log(`${Buffer.from(data.content)}`)
      channel.ack(data)

      // process the data
      const processedData = processData(data.content)

      // publish the processed data to the output queue
      publishToQueue(output_queue, processedData)
    })
  } catch (error) {
    console.log(error)
  }
}

// function to process the data
function processData(data) {
  // process the data here
  return data
}

// function to publish to queue
async function publishToQueue(queueName, data) {
  try {
    channel.sendToQueue(queueName, Buffer.from(data))
  } catch (error) {
    console.log(error)
  }
}
