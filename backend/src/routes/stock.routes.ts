import express from 'express'
import bodyParser from 'body-parser'
import { StockController } from '../controllers/stock.controller'
import { handleToken } from '../helpers/auth'

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
    await handleToken(req, res)

    const response = await stockController.getStockPrices()

    res.status(200).send(response)
  } catch (err) {
    console.log('err', err)
    res.status(401).send({ message: err })
  }
}
router.get('/getstockprices', getStockPrices)

/**
 * Get Users stock portfolio
 *
 * @param {*} req
 * @param {*} res
 */
const getStockPortfolio = async (req, res) => {
  try {
    const auth = await handleToken(req, res)
    console.log('auth', auth)

    const response = await stockController.getStockPortfolio(auth.user_name)

    res.status(200).send(response)
  } catch (err) {
    console.log('err', err)
    res.status(401).send({ message: err })
  }
}
router.get('/getstockportfolio', getStockPortfolio)

module.exports = router
