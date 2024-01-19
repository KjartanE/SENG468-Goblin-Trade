import express from 'express';

const app = express();
const port = 8080; // You can choose any port

app.get('/', (req, res) => {
  res.send('Back End:  "Meow Meow Brother. as you can see, I am a cat. :3"');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});