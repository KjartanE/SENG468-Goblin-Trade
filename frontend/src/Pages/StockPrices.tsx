import './App.css'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useAuth } from '../contexts/AuthContext'
import StockPricesComponent from '../components/StockPricesComponent'
import Button from '@mui/material/Button'

function StockPrices() {
  const authContext = useAuth()

  return (
    <div className="StockPrices">
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
                Current Stock Prices
              </Typography>
              {<StockPricesComponent />}
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
          <p>Loading stock prices...</p>
        )}
      </header>
    </div>
  )
}

export default StockPrices
