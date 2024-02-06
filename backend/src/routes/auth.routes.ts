import express from 'express'
import bodyParser from 'body-parser'
import { AuthController } from '../controllers/auth.controller'

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
    if (!req.headers.authorization) {
      res
        .status(400)
        .send({ message: 'Self endpoint requires authorization header.' })
      return
    }

    const token = req.headers.authorization

    const response = await authController.self(token)

    res.status(200).send(response)
  } catch (err) {
    res.status(401).send({ message: err })
  }
}
router.post('/self', self)

module.exports = router
