import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 8080; // You can choose any port

// Placeholder for storing user data (replace with a database later)
const users: { [key: string]: { password: string } } = {};

// Middleware to parse JSON bodies
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Back End:  "Meow Meow Brother."');
});

// Signup route
app.post('/signup', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  if (users[username]) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  users[username] = { password };
  res.json({ message: 'Signup successful' });
});

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password || !users[username] || users[username].password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.json({ message: 'Login successful' });
});

app.post('/logout', (req, res) => {

  //clear any stored token on the client side
  res.json({ message: 'Logout successful' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});