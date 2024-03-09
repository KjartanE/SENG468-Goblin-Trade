import express from 'express'
import bodyParser from 'body-parser'
import { OrderController } from '../controllers/order.controller'
import { handleToken } from '../helpers/auth'
import {
  checkValidation,
  sendErrorResponse,
  sendSuccessResponse,
  tokenValidator,
} from '../helpers/axios'
import { body } from 'express-validator'

// https://www.freecodecamp.org/news/how-to-use-rabbitmq-with-nodejs/

const router = express.Router()
const orderController: OrderController = new OrderController()

router.use(bodyParser.json())

const placeStockOrderValidator = [
  ...tokenValidator,
  body('stock_id', 'Invalid stock_id').not().isEmpty(),
  body('is_buy', 'Invalid is_buy').not().isEmpty(),
  body('order_type', 'Invalid order_type').not().isEmpty(),
  body('quantity', 'Invalid quantity').not().isEmpty(),
  body('price', 'Invalid price').optional().isNumeric(),
]

/**
 * Place a stock order
 *
 * @param {*} req
 * @param {*} res
 */
const placeStockOrder = async (req, res) => {
  try {
    //validate request
    if (!checkValidation(req, res)) {
      return
    }

    const auth = await handleToken(req, res)
    const stockOrder = req.body

    if (
      (stockOrder.order_type == 'LIMIT' && !stockOrder.price) ||
      (stockOrder.order_type == 'MARKET' && stockOrder.price)
    ) {
      sendErrorResponse(
        res,
        400,
        `When the order_type is LIMIT, the price field is required.
      When the order_type is MARKET, the price field must be null.`
      )
      return
    }

    await orderController.placeStockOrder(auth.user_name, stockOrder)

    sendSuccessResponse(res, null)
  } catch (err) {
    sendErrorResponse(res, 401, err)
  }
}
router.post('/placeStockOrder', placeStockOrderValidator, placeStockOrder)

/**
 * Get all Stock Orders
 *
 * @param {*} req
 * @param {*} res
 */
const getStockTransactions = async (req, res) => {
  try {
    // validate request
    if (!checkValidation(req, res)) {
      return
    }

    const auth = await handleToken(req, res)

    const response = await orderController.getStockTransactionsByUserName(
      auth.user_name
    )

    sendSuccessResponse(res, response)
  } catch (err) {
    sendErrorResponse(res, 401, err)
  }
}
router.get('/getStockTransactions', tokenValidator, getStockTransactions)

const cancelStockOrderValidator = [
  ...tokenValidator,
  body('stock_tx_id', 'Invalid stock_tx_id').not().isEmpty(),
]

/**
 * Cancel a stock order
 *
 * @param {*} req
 * @param {*} res
 */
const cancelStockTransaction = async (req, res) => {
  try {
    // validate request
    if (!checkValidation(req, res)) {
      return
    }

    await handleToken(req, res)

    const stock_tx_id = req.body.stock_tx_id

    await orderController.cancelStockOrder(stock_tx_id)

    sendSuccessResponse(res, null)
  } catch (err) {
    sendErrorResponse(res, 401, err)
  }
}
router.post(
  '/cancelStockTransaction',
  cancelStockOrderValidator,
  cancelStockTransaction
)

module.exports = router
