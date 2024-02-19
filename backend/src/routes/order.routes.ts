import express from 'express'
import bodyParser from 'body-parser'
import { AuthController } from '../controllers/auth.controller'
import { OrderController } from '../controllers/order.controller'

// https://www.freecodecamp.org/news/how-to-use-rabbitmq-with-nodejs/

const router = express.Router()
const authController: AuthController = new AuthController()
const orderController: OrderController = new OrderController()

router.use(bodyParser.json())

const placeStockOrder = async (req, res) => {
  try {
    if (!req.headers.token) {
      res.status(400).send({
        message: 'placeStockOrder endpoint requires token header.',
      })
      return
    }
    const token = req.headers.token

    authController.validateToken(token)

    const stockOrder = req.body

    if (
      !stockOrder.stock_id ||
      !stockOrder.is_buy ||
      !stockOrder.order_type ||
      !stockOrder.quantity ||
      !stockOrder.price
    ) {
      res.status(400).send({
        message:
          'stock_id, is_buy, order_type, quantity, and price are required fields.',
      })
      return
    }

    await orderController.placeStockOrder(stockOrder)

    res.status(200).send()
  } catch (err) {
    console.log('err', err)
    res.status(401).send({ message: err })
  }
}
router.post('/placeStockOrder', placeStockOrder)

module.exports = router
