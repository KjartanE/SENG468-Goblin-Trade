import './App.css'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useAuth } from '../contexts/AuthContext'
import WalletBalance from '../components/WalletBalance'
import Button from '@mui/material/Button'
import StockPortfolioComponent from '../components/StockPortfolioComponent'

function User() {
  const authContext = useAuth()

  return (
    <div className="User">
      <header className="App-header">
        {authContext.user ? (
          <div>
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
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                marginBottom: 4,
              }}
            >
              <Typography variant="h5" marginRight={3}>
                Wallet balance:
              </Typography>
              <WalletBalance />
            </Box>
            <Box>
              <Button
                variant="contained"
                color="primary"
                href="/stock-details"
                sx={{ marginLeft: 1 }}
              >
                Stock Details
              </Button>
              <Button
                variant="contained"
                color="primary"
                href="/stock-transactions"
                sx={{ marginLeft: 1 }}
              >
                Trade Stocks
              </Button>
              <Button
                variant="contained"
                color="primary"
                href="/my-wallet"
                sx={{ marginLeft: 1 }}
              >
                My Wallet
              </Button>
            </Box>
            <Typography
              variant="h5"
              align="left"
              marginBottom={2}
              marginTop={5}
            >
              Your portfolio:
            </Typography>
            <Box>
              <StockPortfolioComponent />
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
