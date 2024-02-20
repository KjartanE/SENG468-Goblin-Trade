import './App.css'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useAuth } from '../contexts/AuthContext'
import Button from '@mui/material/Button'

function StockTransactions() {
  const authContext = useAuth()

  return (
    <div className="StockTransactions">
      <header className="App-header">
        {authContext.user ? (
          <div>
            <Box
              sx={{
                width: '100%',
                maxWidth: 1000,
                position: 'relative',
                mt: 5,
                mb: 5,
              }}
            >
              <Typography variant="h2" gutterBottom>
                Recent Stock Transactions
              </Typography>
              <Typography>{'Coming soon!'}</Typography>
              <Button
                variant="contained"
                color="primary"
                href="/user"
                sx={{ marginLeft: 1 }}
              >
                Back
              </Button>
            </Box>
          </div>
        ) : (
          <p>Loading stock transactions...</p>
        )}
      </header>
    </div>
  )
}

export default StockTransactions
