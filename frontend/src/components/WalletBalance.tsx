import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'

function WalletBalance() {
  const authContext = useAuth()
  const [walletBalance, setWalletBalance] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const response = await fetch('http://localhost:8080/getwalletbalance', {
          method: 'GET',
          headers: new Headers({
            'Content-Type': 'application/json',
            token: authContext.user?.token || '',
          }),
        })
        const data = await response.json()
        setWalletBalance(data[0].balance)
      } catch (error) {
        console.error('Error:', error)
      }
    }

    if (authContext.user?.token) {
      fetchWalletBalance()
    }
  }, [authContext.user?.token])

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderRadius: '10px',
        p: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <Button
        variant="contained"
        size="small"
        onClick={() => navigate('/addFunds')}
        sx={{
          minWidth: '32px',
          height: '32px',
          lineHeight: '32px',
          padding: 0,
        }}
      >
        +
      </Button>
      <span>{walletBalance !== null ? `$${walletBalance}` : 'Loading...'}</span>
    </Box>
  )
}

export default WalletBalance
