import express from 'express'
import bodyParser from 'body-parser'
import { AuthController } from '../controllers/auth.controller'
import { hashPassword } from '../helpers/auth'
const router = express.Router()
const authController: AuthController = new AuthController()

router.use(bodyParser.json())

/**
 * Login user
 * (./auth/login)
 *
 * @param {*} req
 * @param {*} res
 */
const login = async (req, res) => {
  try {
    //Validate request
    if (!req.body.user_name || !req.body.password) {
      res
        .status(400)
        .send({ success: 'false', data: null, error: 'Fields cannot be empty' })
      return
    }

    const response = await authController.login(
      req.body.user_name,
      req.body.password
    )

    res.status(200).send(response.token)
  } catch (err) {
    console.log('err', err)
    res.status(401).send({ message: err })
  }
}
router.post('/login', login)

/**
 * Get the current User
 * (./auth/self)
 * @param {*} req
 * @param {*} res
 */
const self = async (req, res) => {
  try {
    if (!req.headers.token) {
      res
        .status(400)
        .send({ message: 'Self endpoint requires token header.' })
      return
    }

    const token = req.headers.token

    const response = await authController.self(token)

    res.status(200).send(response)
  } catch (err) {
    res.status(401).send({ message: err })
  }
}
router.post('/self', self)

/**
 * Register user
 *
 * @param {*} req
 * @param {*} res
 */
const register = async (req, res) => {
  try {
    //Validate request
    if (!req.body.user_name || !req.body.password || !req.body.name) {
      res
        .status(400)
        .send({ success: 'false', data: null, error: 'Fields cannot be empty' })
      return
    }

    const hashedPassword = await hashPassword(req.body.password)

    const response = await authController.register(
      req.body.user_name,
      hashedPassword,
      req.body.name
    )

    res.status(200).send(response.token)
  } catch (err) {
    console.log('err', err)
    res.status(401).send({ message: err })
  }
}
router.post('/register', register)

module.exports = router
