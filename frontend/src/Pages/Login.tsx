import React from 'react'
import './App.css'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

function Login() {
  return (
    <div className="Login">
      <header className="App-header">
        <p>Login Page</p>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
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
        />
        <Button variant="contained">Contained</Button>
      </header>
    </div>
  )
}

export default Login
