import React, { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

function User() {
  const [userData, setUserData] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token')

      if (token) {
        try {
          const payloadData = {
            user_name: 'test', // Non-null payload (can be deleted later)
          }
          const customHeaders = {
            'Content-Type': 'application/json',
            Authorization: String(token), // Ensure token is a string
          }

          // Make a POST request to the backend localhost:8080/auth/self
          const response = await axios.post(
            'http://localhost:8080/auth/self',
            payloadData,
            { headers: customHeaders }
          )

          console.log('Authentication successful', response)
          setUserData(response.data) // Store specific data in state
        } catch (error) {
          // Handle authentication error, display a message, etc.
          console.error('Authentication failed', error)
        }
      }
    }

    fetchData()
  }, []) // empty dependency array means it will run only once when the component mounts

  function handleLogout() {
    // Remove locally stored key and return to home page
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="User">
        <header className="App-header">
          {userData ? (
            <div>
              <Box sx={{ width: '100%', maxWidth: 1000 }}>
                <Typography variant="h2" gutterBottom>
                  Welcome back, {userData['name']}.
                </Typography>
                {/* Add more attributes as needed */}
              </Box>
              <Box sx={{ width: '100%', maxWidth: 1000, minHeight: 500 }}>
                <Typography variant="h5">
                  Username: {userData['user_name']}
                </Typography>
                <Typography variant="body1" marginTop={50}>
                  More coming soon...
                </Typography>
                <Button variant="contained" onClick={handleLogout}>
                  Logout
                </Button>
              </Box>
            </div>
          ) : (
            <p>Loading user data...</p>
          )}
        </header>
      </div>
    </ThemeProvider>
  )
}

export default User
