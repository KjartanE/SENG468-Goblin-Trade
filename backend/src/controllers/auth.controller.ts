import type { IUser } from "../models/user.model"

const User = require("../models/user.model")
const jwt = require("jsonwebtoken")
const jwtDecode = require("jwt-decode")
const bcrypt = require("bcrypt")

/**
 * Auth Controller
 *
 * @export
 * @class AuthController
 */
export class AuthController {
  readonly #JWT_SECRET: string = "sadlfkjsfk"

  // returns a jwt token
  public makeJWT = (user: IUser): string => {
    const jwtToken = jwt.sign(user, process.env.JWT_SECRET ?? this.#JWT_SECRET)
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
    let verifiedJWT = ""

    const user = await User.findOne({ user_name: user_name })

    if (!user) {
      throw new Error("User not found.")
    }

    const match = await comparePassword(password, user.password)

    if (!match) {
      throw new Error("Invalid password.")
    }

    var jwtToken = await this.makeJWT(user)

    await User.findOneAndUpdate(
      { user_name: user_name },
      { $set: { token: jwtToken } }
    ).then(async () => {
      verifiedJWT = jwtToken
    })

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
    let decodedUser_name = ""
    let selfUser: IUser = {
      _id: "",
      user_name: "",
      password: "",
      name: "",
      token: "",
    }

    decodedUser_name = jwtDecode(authToken).user_name

    if (!decodedUser_name) {
      throw new Error("This token was invalid!")
    }

    selfUser = await User.findOne({ user_name: decodedUser_name })

    if (!selfUser) {
      throw new Error("There was no user with that user_name.")
    }

    return selfUser
  }
}

/**
 * Compares a password to a hash
 *
 * @export
 * @param {string} password
 * @param {string} hash
 * @return {*}
 */
export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean | unknown> {
  const match = await new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, function (err: any, result: unknown) {
      if (err) reject(err)
      resolve(result)
    })
  })

  return match
}
