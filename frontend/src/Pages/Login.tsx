import React, { useState } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import axios from 'axios'

function Login() {
  const [user_name, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    try {
      // Make a POST request to the backend localhost:8080/auth/login
      const response = await axios.post('http://localhost:8080/auth/login', {
        user_name: user_name,
        password,
      })

      // Handle login success, displays received token
      if (response.data) {
        console.log('Login successful, token: ', response.data)
        // Store token in local storage
        localStorage.setItem('token', String(response.data))
      }
    } catch (error) {
      // Handle login error, display a message, etc.
      console.error('Login failed', error)
    }
  }

  return (
    <div className="Login">
      <header className="App-header">
        <p>Login Page</p>
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          autoFocus
          value={user_name}
          onChange={e => setUsername(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <Button variant="contained" onClick={handleLogin}>
          Submit
        </Button>
      </header>
    </div>
  )
}

export default Login
