import express from 'express'
import bodyParser from 'body-parser'
import { WalletController } from '../controllers/wallet.controller'
import { handleToken } from '../helpers/auth'
import {
  checkValidation,
  sendErrorResponse,
  sendSuccessResponse,
  tokenValidator,
} from '../helpers/axios'
import { body } from 'express-validator'

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
    //validate request
    if (!checkValidation(req, res)) {
      return
    }

    const auth = await handleToken(req, res)

    const wallet = await walletController.getWallet(auth.user_name)

    sendSuccessResponse(res, { balance: wallet.balance })
  } catch (err) {
    sendErrorResponse(res, 401, err)
  }
}
router.get('/getWalletBalance', tokenValidator, getWalletBalance)

const addMoneyValidator = [
  ...tokenValidator,
  body('amount', 'Invalid amount').isNumeric(),
  body('amount', 'Invalid does not Empty').not().isEmpty(),
]

/**
 * Update Wallet Balance
 *
 * @param {*} req
 * @param {*} res
 */
const addMoneyToWallet = async (req, res) => {
  try {
    //validate request
    if (!checkValidation(req, res)) {
      return
    }

    const auth = await handleToken(req, res)

    const amount = req.body.amount

    await walletController.addMoneyToWallet(auth.user_name, amount)

    sendSuccessResponse(res, null)
  } catch (err) {
    sendErrorResponse(res, 401, err)
  }
}
router.post('/addMoneyToWallet', addMoneyValidator, addMoneyToWallet)

/**
 * Get Wallet Transactions
 *
 * @param {*} req
 * @param {*} res
 */
const getWalletTransactions = async (req, res) => {
  try {
    //validate request
    if (!checkValidation(req, res)) {
      return
    }

    const auth = await handleToken(req, res)

    const transactions = await walletController.getWalletTransactionsByUserName(
      auth.user_name
    )

    sendSuccessResponse(res, transactions)
  } catch (err) {
    sendErrorResponse(res, 401, err)
  }
}
router.get('/getWalletTransactions', tokenValidator, getWalletTransactions)

module.exports = router
