//create and add mock data to the database

import { userData } from '../config/data/userData'
import { IUser } from '../models/user.model'
import { hashPassword } from './auth'

const User = require('../models/user.model')

export async function create_users() {
  // Create a new User if one doesn't already exist
  userData.forEach(async (data, index) => {
    User.findOne({ user_name: data.user_name }).then(async (user: IUser) => {
      if (!user) {
        data.password = await hashPassword(data.password)
        User.create(data)
          .then(() => {
            console.log('User ' + index + ' created!')
          })
          .catch(err => {
            console.log('Error creating users!', err)
          })
      }
    })
  })
}
