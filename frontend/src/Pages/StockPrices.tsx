import './App.css'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useAuth } from '../contexts/AuthContext'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'name',
    headerName: 'Name',
    width: 300,
  },
  {
    field: 'current_price',
    headerName: 'Current Price',
    width: 300,
  },
]

const rows = [
  { id: 1, name: 'AAAAAAA', current_price: 9999 },
  { id: 2, name: 'BBBBBBB', current_price: 8888 },
  { id: 3, name: 'CCCCCCC', current_price: 7777 },
]

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
                {authContext.user.name}
              </Typography>
            </Box>
            <Box sx={{ height: 400, width: '100%', mb: 5 }}>
              <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 5,
                    },
                  },
                }}
                pageSizeOptions={[5]}
                disableRowSelectionOnClick
              />
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
