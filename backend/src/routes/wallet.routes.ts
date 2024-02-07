import express from 'express'
import bodyParser from 'body-parser'
import { AuthController } from '../controllers/auth.controller'
import { WalletController } from '../controllers/wallet.controller'

const router = express.Router()
const authController: AuthController = new AuthController()
const walletController: WalletController = new WalletController()

router.use(bodyParser.json())

/**
 * Update Wallet Balance
 *
 * @param {*} req
 * @param {*} res
 */
const getWalletBalance = async (req, res) => {
  try {
    if (!req.headers.token) {
      res.status(400).send({
        message: 'getwalletbalance endpoint requires token header.',
      })
      return
    }
    const token = req.headers.token

    authController.validateToken(token)

    const response = await walletController.getWalletBalance(token)

    res.status(200).send(response)
  } catch (err) {
    console.log('err', err)
    res.status(401).send({ message: err })
  }
}
router.get('/getwalletbalance', getWalletBalance)

const addMoneyToWallet = async (req, res) => {
  try {
    if (!req.headers.token) {
      res.status(400).send({
        message: 'updatewalletbalance endpoint requires token header.',
      })
      return
    }
    const token = req.headers.token

    authController.validateToken(token)

    const amount = req.body.amount

    const response = await walletController.addMoneyToWallet(token, amount)

    res.status(200).send(response)
  } catch (err) {
    console.log('err', err)
    res.status(401).send({ message: err })
  }
}
router.post('/addmoney', addMoneyToWallet)

module.exports = router
