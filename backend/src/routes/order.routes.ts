import express from 'express'
import bodyParser from 'body-parser'
import { OrderController } from '../controllers/order.controller'
import { handleToken } from '../helpers/auth'

// https://www.freecodecamp.org/news/how-to-use-rabbitmq-with-nodejs/

const router = express.Router()
const orderController: OrderController = new OrderController()

router.use(bodyParser.json())

/**
 * Place a stock order
 *
 * @param {*} req
 * @param {*} res
 */
const placeStockOrder = async (req, res) => {
  try {
    const auth = await handleToken(req, res)
    const stockOrder = req.body

    if (
      (!stockOrder.stock_id || !stockOrder.is_buy || !stockOrder.order_type || !stockOrder.quantity) ||
      (stockOrder.order_type=="LIMIT" && !stockOrder.price) ||
      (stockOrder.order_type=="MARKET" && stockOrder.price)
    ) {
      res.status(400).send({
        message:
          `stock_id, is_buy, order_type, and quantity are required fields.
          When the order_type is LIMIT, the price field is required.
          When the order_type is MARKET, the price field must be null.`
      })
      return
    }

    await orderController.placeStockOrder(auth.user_name, stockOrder)

    res.status(200).send()
  } catch (err) {
    console.log('err', err)
    res.status(401).send({ message: err })
  }
}
router.post('/placeStockOrder', placeStockOrder)

/**
 * Get all Stock Orders
 *
 * @param {*} req
 * @param {*} res
 */
const getStockTransactions = async (req, res) => {
  try {
    await handleToken(req, res)

    const response = await orderController.getStockTransactions()

    res.status(200).send(response)
  } catch (err) {
    res.status(401).send({ message: err })
  }
}
router.get('/getStockTransactions', getStockTransactions)

module.exports = router
