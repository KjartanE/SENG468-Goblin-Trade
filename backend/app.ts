import express from 'express';

const app = express();
const port = 8080; // You can choose any port

app.get('/', (req, res) => {
  res.send('Back End:  "Meow Meow Brother."');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});