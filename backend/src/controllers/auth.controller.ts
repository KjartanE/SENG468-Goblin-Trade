import { comparePassword } from '../helpers/auth'
import type { IUser } from '../models/user.model'
import jwt from 'jsonwebtoken'

const User = require('../models/user.model')

/**
 * Auth Controller
 *
 * @export
 * @class AuthController
 */
export class AuthController {
  readonly #JWT_SECRET: string = 'sadlfkjsfk'

  // returns a jwt token
  public makeJWT = (user_name): string => {
    const jwtToken = jwt.sign(
      user_name,
      process.env.JWT_SECRET || this.#JWT_SECRET,
      {
        expiresIn: '1 days',
      }
    )
    return jwtToken
  }

  /**
   * Login user
   *
   * @param {string} user_name
   * @param {string} password
   * @return {*}  {Promise<string>}
   * @memberof AuthController
   */
  async login(user_name: string, password: string): Promise<string> {
    let verifiedJWT = ''

    const user = await User.findOne({ user_name: user_name })

    if (!user) {
      throw new Error('User not found.')
    }

    const match = await comparePassword(password, user.password)

    if (!match) {
      throw new Error('Invalid password.')
    }

    var jwtToken = this.makeJWT({ user_name: user.user_name })

    const updatedUser = await User.findOneAndUpdate(
      { user_name: user_name },
      { $set: { token: jwtToken } },
      { new: true }
    )

    if (updatedUser) {
      verifiedJWT = updatedUser.token
    }

    return verifiedJWT
  }

  /**
   * Get self
   *
   * @param {string} authToken
   * @return {*}  {Promise<IUser>}
   * @memberof AuthController
   */
  async self(authToken: string): Promise<IUser> {
    let selfUser: IUser = {
      _id: '',
      user_name: '',
      password: '',
      name: '',
      token: '',
    }

    const verify = jwt.verify(
      authToken,
      process.env.JWT_SECRET || this.#JWT_SECRET
    )

    if (!verify || verify['user_name'] === undefined) {
      throw new Error('This token was invalid!')
    }

    selfUser = await User.findOne({ user_name: verify['user_name'] })

    if (!selfUser) {
      throw new Error('There was no user with that user_name.')
    }

    return selfUser
  }
}
