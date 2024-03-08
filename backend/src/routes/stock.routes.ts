import express from 'express'
import bodyParser from 'body-parser'
import { StockController } from '../controllers/stock.controller'
import { handleToken } from '../helpers/auth'
import {
  checkValidation,
  sendErrorResponse,
  sendSuccessResponse,
  tokenValidator,
} from '../helpers/axios'
import { body } from 'express-validator'

const router = express.Router()
const stockController: StockController = new StockController()

router.use(bodyParser.json())

/**
 * Get all Stock Prices
 *
 * @param {*} req
 * @param {*} res
 */
const getStockPrices = async (req, res) => {
  try {
    //validate request
    if (!checkValidation(req, res)) {
      return
    }

    await handleToken(req, res)

    const response = await stockController.getStockPrices()

    sendSuccessResponse(res, response)
  } catch (err) {
    sendErrorResponse(res, 401, err)
  }
}
router.get('/getStockPrices', tokenValidator, getStockPrices)

/**
 * Get Users stock portfolio
 *
 * @param {*} req
 * @param {*} res
 */
const getStockPortfolio = async (req, res) => {
  try {
    //validate request
    if (!checkValidation(req, res)) {
      return
    }

    const auth = await handleToken(req, res)

    const response = await stockController.getStockPortfolio(auth.user_name)

    sendSuccessResponse(res, response)
  } catch (err) {
    sendErrorResponse(res, 401, err)
  }
}
router.get('/getStockPortfolio', tokenValidator, getStockPortfolio)

const createStockValidator = [
  ...tokenValidator,
  body('stock_name', 'Invalid stock_name').not().isEmpty(),
]

/**
 * Create Stock
 *
 * @param {*} req
 * @param {*} res
 */
const createStock = async (req, res) => {
  try {
    //validate request
    if (!checkValidation(req, res)) {
      return
    }

    await handleToken(req, res)

    const stock_name = req.body.stock_name

    const stock = await stockController.createStock(stock_name)

    sendSuccessResponse(res, { stock_id: stock.stock_id })
  } catch (err) {
    sendErrorResponse(res, 401, err)
  }
}
router.post('/createStock', createStockValidator, createStock)

const addStockToUserValidator = [
  ...tokenValidator,
  body('stock_id', 'Invalid stock_id').not().isEmpty(),
  body('quantity', 'Invalid quantity').isNumeric(),
  body('quantity', 'Invalid quantity').not().isEmpty(),
]
/**
 * Add Stock to User
 *
 * @param {*} req
 * @param {*} res
 */
const addStockToUser = async (req, res) => {
  try {
    //validate request
    if (!checkValidation(req, res)) {
      return
    }

    const auth = await handleToken(req, res)

    const stock_id = req.body.stock_id
    const quantity = req.body.quantity

    await stockController.addStockToUserPortfolio(
      auth.user_name,
      stock_id,
      quantity
    )

    sendSuccessResponse(res, null)
  } catch (err) {
    sendErrorResponse(res, 401, err)
  }
}
router.post('/addStockToUser', addStockToUserValidator, addStockToUser)

module.exports = router
