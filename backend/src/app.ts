import express from 'express'
import cors from 'cors'
import { create_users } from './helpers/db'

const auth = require('./routes/auth.routes')

const app = express()

app.use(cors())
// parse requests of content-type - application/json
app.use(express.json())

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))

// Connect to the database
const db = require('./models')
db.mongoose
  .connect(db.url)
  .then(() => {
    console.log('Connected to the database!')
  })
  .catch(err => {
    console.log('Cannot connect to the database!', err)
    process.exit()
  })

// Import data
create_users()

// Routes
app.use('/auth', auth)

app.get('/', (req, res) => {
  res.send('Back End:  "Meow Meow Brother."')
})

app.post('/', (req, res) => {
  res.send('Back End:  "Woof Woof Brother."')
})

// // set port, listen for requests
const PORT = 8080
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`)
})
