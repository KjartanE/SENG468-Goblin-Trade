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
    if (!req.headers.authorization) {
      res.status(400).send({
        message: 'getstockprices endpoint requires authorization header.',
      })
      return
    }

    authController.validateToken(req.headers.authorization)

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
    const token = req.headers.authorization

    if (!token) {
      res.status(400).send({
        message: 'getstockportfolio endpoint requires authorization header.',
      })
      return
    }

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
