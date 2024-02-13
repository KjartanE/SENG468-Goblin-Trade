//create and add mock data to the database

import { stockData } from '../config/data/StockData'
import {
  portfolioData,
  userData,
  userWalletData,
} from '../config/data/userData'
import { IUser } from '../models/user.model'
import { hashPassword } from './auth'

const User = require('../models/user.model')
const Stock = require('../models/stock.model')
const Wallet = require('../models/wallet.model')
const Portfolio = require('../models/portfolio.model')

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

export async function create_stock() {
  // Create a new Stock if one doesn't already exist

  stockData.forEach(async (data, index) => {
    Stock.findOne({ stock_name: data.stock_name }).then(stock => {
      if (!stock) {
        Stock.create({ ...data, stock_id: index + 1 })
          .then(() => {
            console.log('Stock ' + index + ' created!')
          })
          .catch(err => {
            console.log('Error creating stocks!', err)
          })
      }
    })
  })
}

export async function create_wallet() {
  // Create a new Wallet if one doesn't already exist
  userWalletData.forEach(async (data, index) => {
    Wallet.findOne({ user_name: data.user_name }).then(wallet => {
      if (!wallet) {
        Wallet.create(data)
          .then(() => {
            console.log('Wallet ' + index + ' created!')
          })
          .catch(err => {
            console.log('Error creating wallets!', err)
          })
      }
    })
  })
}

export async function create_portfolio() {
  portfolioData.forEach(async (data, index) => {
    Portfolio.findOne({
      user_name: data.user_name,
      stock_id: data.stock_id,
    }).then(portfolio => {
      if (!portfolio) {
        Portfolio.create(data)
          .then(() => {
            console.log('Portfolio ' + index + ' created!')
          })
          .catch(err => {
            console.log('Error creating portfolios!', err)
          })
      }
    })
  })
}

export async function add_mock_data() {
  create_users()
  create_stock()
  create_wallet()
  create_portfolio()
}
