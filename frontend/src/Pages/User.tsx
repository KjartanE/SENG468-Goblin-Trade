import React from 'react'
import './App.css'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useAuth } from '../contexts/AuthContext'

function User() {
  const authContext = useAuth()

  return (
    <div className="User">
      <header className="App-header">
        {authContext.user ? (
          <div>
            <Box sx={{ width: '100%', maxWidth: 1000 }}>
              <Typography variant="h2" gutterBottom>
                Welcome back, {authContext.user.name}.
              </Typography>
              {/* Add more attributes as needed */}
            </Box>
            <Box sx={{ width: '100%', maxWidth: 1000, minHeight: 500 }}>
              <Typography variant="h5">
                Username: {authContext.user.user_name}
              </Typography>
              <Typography variant="body1" marginTop={50}>
                More coming soon...
              </Typography>
              <Button variant="contained" onClick={authContext.logout}>
                Logout
              </Button>
            </Box>
          </div>
        ) : (
          <p>Loading user data...</p>
        )}
      </header>
    </div>
  )
}

export default User
