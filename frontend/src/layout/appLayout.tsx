import Footer from '../components/footer'
import Navbar from '../components/navbar'
import { Box, Container, CssBaseline } from '@mui/material'

export default function Layout({ children }: any) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      minHeight="100vh"
      textAlign="center"
    >
      <CssBaseline />

      <Box sx={{ height: '7vh' }}>
        <Navbar />
      </Box>

      <Box sx={{ display: 'flex', flex: 1, marginBottom: 5 }}>
        <Container maxWidth="xl">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              flex: 1,
              alignContent: 'center',
              justifyContent: 'center',
            }}
          >
            {children}
          </Box>
        </Container>
      </Box>
      <Footer />
    </Box>
  )
}
