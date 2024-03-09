import express from 'express'
import bodyParser from 'body-parser'
import { AuthController } from '../controllers/auth.controller'
import { hashPassword } from '../helpers/auth'
import { body } from 'express-validator'
import {
  checkValidation,
  sendErrorResponse,
  sendSuccessResponse,
  tokenValidator,
} from '../helpers/axios'

const router = express.Router()
const authController: AuthController = new AuthController()

router.use(bodyParser.json())

const loginValidator = [
  body('user_name', 'Invalid "user_name" does not Empty').not().isEmpty(),
  body('password', 'The minimum password length is 6 characters').isLength({
    min: 6,
  }),
]

/**
 * Login user
 * (./auth/login)
 *
 * @param {*} req
 * @param {*} res
 */
const login = async (req, res) => {
  try {
    //validate request
    if (!checkValidation(req, res)) {
      return
    }

    const response = await authController.login(
      req.body.user_name,
      req.body.password
    )

    sendSuccessResponse(res, { token: response.token })
  } catch (err) {
    sendErrorResponse(res, 401, err)
  }
}
router.post('/login', loginValidator, login)

/**
 * Get the current User
 * (./auth/self)
 * @param {*} req
 * @param {*} res
 */
const self = async (req, res) => {
  try {
    //validate request
    if (!checkValidation(req, res)) {
      return
    }

    const token = req.headers.token

    const response = await authController.self(token)

    sendSuccessResponse(res, response)
  } catch (err) {
    sendErrorResponse(res, 401, err)
  }
}
router.post('/self', tokenValidator, self)

const registerValidator = [
  body('user_name', 'Invalid "user_name" does not Empty').not().isEmpty(),
  body('password', 'The minimum "password" length is 6 characters').isLength({
    min: 6,
  }),
  body('name', 'Invalid "name" does not Empty').not().isEmpty(),
]

/**
 * Register user
 *
 * @param {*} req
 * @param {*} res
 */
const register = async (req, res) => {
  try {
    //validate request
    if (!checkValidation(req, res)) {
      return
    }

    const hashedPassword = await hashPassword(req.body.password)

    await authController.register(
      req.body.user_name,
      hashedPassword,
      req.body.name
    )

    sendSuccessResponse(res, null)
  } catch (err) {
    sendErrorResponse(res, 401, err)
  }
}
router.post('/register', registerValidator, register)

module.exports = router
