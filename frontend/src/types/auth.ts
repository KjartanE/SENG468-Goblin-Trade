/**
 * Details pertaining to the currently signed in user
 */
export interface IUser {
  _id?: string
  user_name: string
  password?: string
  name: string
  token: string
}
