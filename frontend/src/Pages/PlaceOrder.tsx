import './App.css'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '@mui/material'
import StockPlaceOrderComponent from '../components/StockPlaceOrderComponent'

function PlaceOrder() {
  const authContext = useAuth()

  return (
    <div className="StockOrder">
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
                Place Stock Order
              </Typography>
              <StockPlaceOrderComponent />
              <Button variant="contained" color="primary" href="/user">
                Back
              </Button>
            </Box>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </header>
    </div>
  )
}

export default PlaceOrder
