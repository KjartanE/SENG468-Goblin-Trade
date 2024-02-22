import { BrowserRouter } from 'react-router-dom'
import Router from './Pages/Router'
import { ApiContextProvider } from './contexts/ApiContext'
import { AuthContextProvider } from './contexts/AuthContext'
import { StockPricesProvider } from './contexts/StockPricesContext'
import { WalletProvider } from './contexts/WalletContext'
import { WalletTransactionsProvider } from './contexts/WalletTransactionsContext'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Layout from './layout/appLayout'
import { StockPortfolioProvider } from './contexts/StockPortfolioContext'
import { StockTransactionsProvider } from './contexts/StockTransactionsContext'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <BrowserRouter>
        <ApiContextProvider>
          <AuthContextProvider>
            <StockTransactionsProvider>
              <StockPricesProvider>
                <StockPortfolioProvider>
                  <WalletProvider>
                    <WalletTransactionsProvider>
                      <Layout>
                        <Router />
                      </Layout>
                    </WalletTransactionsProvider>
                  </WalletProvider>
                </StockPortfolioProvider>
              </StockPricesProvider>
            </StockTransactionsProvider>
          </AuthContextProvider>
        </ApiContextProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
