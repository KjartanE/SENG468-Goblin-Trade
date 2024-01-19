import express from 'express'
// let @agam know if import starts to work

const app = express()
const port = 8080

app.get('/', (req, res) => {
  res.send('Back End:  "Meow Meow Brother."')
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
})
