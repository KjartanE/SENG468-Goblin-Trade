import express from 'express'
import bodyParser from 'body-parser'
import { WalletController } from '../controllers/wallet.controller'
import { handleToken } from '../helpers/auth'

const router = express.Router()

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
    const auth = await handleToken(req, res)

    const response = await walletController.getWalletBalance(auth.user_name)

    res.status(200).send(response)
  } catch (err) {
    console.log('err', err)
    res.status(401).send({ message: err })
  }
}
router.get('/getwalletbalance', getWalletBalance)

/**
 * Update Wallet Balance
 *
 * @param {*} req
 * @param {*} res
 */
const addMoneyToWallet = async (req, res) => {
  try {
    const auth = await handleToken(req, res)

    const amount = req.body.amount

    const response = await walletController.addMoneyToWallet(
      auth.user_name,
      amount
    )

    res.status(200).send(response)
  } catch (err) {
    console.log('err', err)
    res.status(401).send({ message: err })
  }
}
router.post('/addmoney', addMoneyToWallet)

/**
 * Get Wallet Transactions
 *
 * @param {*} req
 * @param {*} res
 */
const getWalletTransactions = async (req, res) => {
  try {
    const auth = await handleToken(req, res)

    const response = await walletController.getWalletTransactions(
      auth.user_name
    )

    const transactions =
      await walletController.getWalletTransactionsByTXIds(response)

    res.status(200).send(transactions)
  } catch (err) {
    console.log('err', err)
    res.status(401).send({ message: err })
  }
}
router.get('/getwallettransactions', getWalletTransactions)

module.exports = router
