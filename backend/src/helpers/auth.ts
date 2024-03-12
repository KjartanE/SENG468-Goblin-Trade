import { AuthController } from '../controllers/auth.controller'
import { IUser } from '../models/user.model'
import { jwtDecode } from 'jwt-decode'

const User = require('../models/user.model')
const bcrypt = require('bcrypt')
/**
 * Hashes a password
 *
 * @export
 * @param {string} password
 * @return {*}
 */
export async function hashPassword(password: string) {
  const saltRounds: number = 10

  const hashedPassword = await new Promise<string>((resolve, reject) => {
    bcrypt.genSalt(saltRounds, async function (err, salt) {
      bcrypt.hash(password, salt, async function (err, hash) {
        if (err) reject(err)
        resolve(hash)
      })
    })
  })

  return hashedPassword
}

/**
 * Compares a password to a hash
 *
 * @export
 * @param {string} password
 * @param {string} hash
 * @return {*}
 */
export async function comparePassword(password: string, hash: string) {
  const match = await new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, function (err, result) {
      if (err) reject(err)
      resolve(result)
    })
  })

  return match
}

/**
 * Gets user_name of the user associated with this authtoken, throws error if cannot
 * @param {string} authToken
 * @returns {Promise<String>}
 */
export async function getUsername(authToken: string) {
  let user_name = ''
  user_name = jwtDecode<{ user_name: string }>(authToken).user_name
  if (!user_name) throw new Error('Invalid authentication token.')
  return user_name
}

// /**
//  * Returns true if the user associated with the authToken is admin, false otherwise
//  * @param {string} authToken
//  * @returns {boolean}
//  */
// export async function isAdmin(authToken: string) {
//   let user_name = '';
//   user_name = jwt_decode(authToken).email;
//   if (!user_name) throw new Error('Invalid authentication token.');

//   let user: IUser = {} as IUser;
//   user = await User.findOne({ email: user_name }).catch((err) => err);

//   if (!user) return false;

//   return user.userrole == 'ADMIN';
// }

/**
 * Returns the name of the user associated with this authToken. Throws exception if authtoken is invalid or user not found.
 * @param {string} authToken
 * @returns {string}
 */
export async function getName(authToken: string) {
  const user_name = await getUsername(authToken)
  let user: IUser = {} as IUser
  user = await User.findOne({ user_name: user_name }).catch(err => err)

  if (!user) throw new Error('User not found.')

  return user.name
}

//get user id from authtoken. throws exception if not found
export async function getUid(authToken: string) {
  const user_name = await getUsername(authToken)
  let user: IUser = {} as IUser
  user = await User.findOne({ user_name: user_name }).catch(err => err)

  if (!user) throw new Error('User not found.')

  return user._id
}

/**
 * Returns the username of the user associated with this authToken. Throws exception if authtoken is invalid or user not found.
 *
 * @export
 * @param {*} req
 * @param {*} res
 * @return {*}  {(Promise<{ user_name: string }>)}
 */
export async function handleToken(
  req: any,
  res: any
): Promise<{ user_name: string }> {
  if (!req.headers.token) {
    res.status(400).send({
      message: 'getwalletbalance endpoint requires token header.',
    })
  }

  const token = req.headers.token

  const authController: AuthController = new AuthController()

  if (!authController.validateToken(token)) {
    res.status(400).send({
      message: 'Invalid token',
    })
  }

  const user_name = await getUsername(token)

  return { user_name }
}
