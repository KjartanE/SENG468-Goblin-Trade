import { useWallet } from '../contexts/WalletContext'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton' // Import IconButton
import RefreshIcon from '@mui/icons-material/Refresh' // Import RefreshIcon
import { useNavigate } from 'react-router-dom'

function WalletBalance() {
  const { wallet, refreshWallet } = useWallet() // Destructure refreshWallet from the context
  const navigate = useNavigate()

  // Handle the refresh action
  const handleRefresh = () => {
    refreshWallet() // Call the refreshWallet function to update the wallet balance
  }

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
      <span>{wallet !== null ? `$${wallet.balance}` : 'Loading...'}</span>{' '}
      <IconButton
        size="small"
        onClick={handleRefresh}
        sx={{
          marginLeft: 'auto',
        }}
      >
        <RefreshIcon />
      </IconButton>
    </Box>
  )
}

export default WalletBalance
