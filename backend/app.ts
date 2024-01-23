import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 8080; // You can choose any port

// Placeholder for storing user data (replace with a database later)
const users: { [key: string]: { name: string, password: string } } = {};

// Middleware to parse JSON bodies
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Back End:  "Meow Meow Brother."');
});

// Signup route
app.post('/register', (req, res) => {
  const { user_name, password, name } = req.body;

  if (!user_name || !password) {
    return res.status(400).json({ success: 'false', data: null, error: 'Username and password are required' });
  }

  if (users[user_name]) {
    return res.status(400).json({ success: 'false', data: null, error: 'Username already exists' });
  }

  users[user_name] = { name, password };
  res.json({ success: 'true', data: null});
});

// Login route
app.post('/login', (req, res) => {
  const { user_name, password } = req.body;

  if (!user_name || !password || !users[user_name] || users[user_name].password !== password) {
    return res.status(401).json({ success: 'true', data: null, error: 'Invalid credentials' });
  }

  res.json({ success: 'true', data: {token: "your-token"}});
});

//logout route
app.post('/logout', (req, res) => {

  //clear any stored token on the client side
  res.json({ success: 'true', data: null, message: 'Logout successful' });
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});