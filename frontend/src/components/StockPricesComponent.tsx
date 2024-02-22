import { useStockPrices } from '../contexts/StockPricesContext'
import Box from '@mui/material/Box'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

const columns: GridColDef[] = [
  {
    field: 'stock_id',
    headerName: 'Stock ID',
    width: 150,
  },
  {
    field: 'stock_name',
    headerName: 'Name',
    width: 300,
  },
  {
    field: 'current_price',
    headerName: 'Current Price',
    width: 300,
  },
]

function StockPricesComponent() {
  // Fetch stock prices from backend
  const { stock_prices } = useStockPrices()
  if (stock_prices == null) {
    return <Box>Loading...</Box>
  }

  // Map retrieved list of objects to stocks
  const mapped_stock_prices = stock_prices.map((Stock: any, index: number) => ({
    id: index + 1,
    stock_id: Stock.stock_id,
    stock_name: Stock.stock_name,
    current_price: Stock.current_price,
  }))

  return (
    <Box sx={{ width: '100%', mb: 5 }}>
      <DataGrid
        rows={mapped_stock_prices}
        columns={columns}
        initialState={{
          sorting: {
            sortModel: [{ field: 'stock_id', sort: 'asc' }],
          },
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[5, 10, 20]}
        disableRowSelectionOnClick
      />
    </Box>
  )
}

export default StockPricesComponent
