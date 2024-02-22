import { useWallet } from '../contexts/WalletContext'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

function WalletBalance() {
  const { wallet, refreshWallet, updateWallet } = useWallet() // Destructure refreshWallet from the context

  const handleAddFunds = async (amount: number) => {
    await updateWallet(amount) // Call the updateWallet function to add funds to the wallet
    await refreshWallet() // Call the refreshWallet function to update the wallet balance
  }

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 2,
        py: 1,
        mx: 0,
      }}
    >
      <Button
        variant="contained"
        size="small"
        onClick={() => handleAddFunds(100)}
        sx={{
          minWidth: '32px',
          height: '32px',
          lineHeight: '32px',
          padding: 1,
          mr: 2,
        }}
      >
        Quick Add: 100
      </Button>

      {/* Display the wallet balance */}
      {wallet && wallet.balance}
      {!wallet && <span>Loading...</span>}
    </Box>
  )
}

export default WalletBalance
