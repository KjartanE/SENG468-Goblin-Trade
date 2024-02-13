import express from 'express'
import bodyParser from 'body-parser'
import { StockController } from '../controllers/stock.controller'
import { AuthController } from '../controllers/auth.controller'

const router = express.Router()
const stockController: StockController = new StockController()
const authController: AuthController = new AuthController()

router.use(bodyParser.json())

const getStockPrices = async (req, res) => {
  try {
    if (!req.headers.token) {
      res.status(400).send({
        message: 'getstockprices endpoint requires token header.',
      })
      return
    }
    const token = req.headers.token

    authController.validateToken(token)

    const response = await stockController.getStockPrices()

    res.status(200).send(response)
  } catch (err) {
    console.log('err', err)
    res.status(401).send({ message: err })
  }
}
router.get('/getstockprices', getStockPrices)

const getStockPortfolio = async (req, res) => {
  try {
    if (!req.headers.token) {
      res.status(400).send({
        message: 'getstockportfolio endpoint requires token header.',
      })
      return
    }
    const token = req.headers.token

    authController.validateToken(token)

    const response = await stockController.getStockPortfolio(token)

    res.status(200).send(response)
  } catch (err) {
    console.log('err', err)
    res.status(401).send({ message: err })
  }
}
router.get('/getstockportfolio', getStockPortfolio)

module.exports = router
