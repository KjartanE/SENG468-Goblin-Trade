import { useWallet } from '../contexts/WalletContext'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'

function WalletBalance() {
  const { wallet } = useWallet()
  const navigate = useNavigate()
  console.log('wallet in walletBalance Component', wallet)
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
      <span>{wallet !== null ? `$${wallet}` : 'Loading...'}</span>
    </Box>
  )
}

export default WalletBalance
