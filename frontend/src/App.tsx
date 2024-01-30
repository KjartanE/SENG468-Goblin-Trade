import { BrowserRouter } from 'react-router-dom'
import Router from './Pages/Router'
import { ApiContextProvider } from './contexts/ApiContext'
import { AuthContextProvider } from './contexts/AuthContext'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Layout from './layout/appLayout'

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
            <Layout>
              <Router />
            </Layout>
          </AuthContextProvider>
        </ApiContextProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
