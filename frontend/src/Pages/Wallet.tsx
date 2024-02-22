import './App.css'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useAuth } from '../contexts/AuthContext'
import Button from '@mui/material/Button'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { useState } from 'react'
import WalletTransactionsComponent from '../components/WalletTransactionsComponent'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component={'span'}>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

function Wallet() {
  const authContext = useAuth()

  // 0 for add funds to wallet, 1 for wallet transaction history table
  const [which_table, setValue] = useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <div className="Wallet">
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
                My Wallet
              </Typography>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                  value={which_table}
                  onChange={handleChange}
                  aria-label="wallet tab"
                >
                  <Tab label="Add Funds" {...a11yProps(0)} />
                  <Tab label="Transaction History" {...a11yProps(1)} />
                </Tabs>
              </Box>
              <CustomTabPanel value={which_table} index={0}>
                {'Coming soon...'}
              </CustomTabPanel>
              <CustomTabPanel value={which_table} index={1}>
                <WalletTransactionsComponent />
              </CustomTabPanel>
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
          <p>Loading wallet details...</p>
        )}
      </header>
    </div>
  )
}

export default Wallet
