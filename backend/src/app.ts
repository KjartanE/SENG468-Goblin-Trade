import express from 'express';
import bodyParser from 'body-parser';

const auth = require('./routes/auth.routes');

const app = express();

app.use(bodyParser.json()); // Middleware to parse JSON bodies
app.use('/auth', auth);


app.get('/', (req, res) => {
  res.send('Back End:  "Meow Meow Brother."');
});

app.post('/', (req, res) => {
  res.send('Back End:  "Woof Woof Brother."');
});

// // set port, listen for requests
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});