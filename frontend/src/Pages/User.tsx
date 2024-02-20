import './App.css'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useAuth } from '../contexts/AuthContext'
import WalletBalance from '../components/WalletBalance'

function User() {
  const authContext = useAuth()

  return (
    <div className="User">
      <header className="App-header">
        {authContext.user ? (
          <div>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                marginBottom: 4,
              }}
            >
              <WalletBalance />
            </Box>
            <Box
              sx={{
                width: '100%',
                maxWidth: 1000,
                position: 'relative',
                mb: 5,
              }}
            >
              <Typography variant="h2" gutterBottom>
                Welcome back, {authContext.user.name}.
              </Typography>
            </Box>
            <Box sx={{ width: '100%', maxWidth: 1000, minHeight: 500 }}>
              <Typography variant="h5">
                Username: {authContext.user.user_name}
              </Typography>
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
