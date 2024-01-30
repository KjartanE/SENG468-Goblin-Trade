import React, { useState } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

function Login() {
  const [user_name, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

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
        navigate('/user')
      }
    } catch (error) {
      // Handle login error, display a message, etc.
      console.error('Login failed', error)
    }
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="Login">
        <header className="App-header">
          <Box sx={{ width: '100%', maxWidth: 1000 }}>
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
          </Box>
        </header>
      </div>
    </ThemeProvider>
  )
}

export default Login
