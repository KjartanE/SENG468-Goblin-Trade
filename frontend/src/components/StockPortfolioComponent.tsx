import { useStockPortfolio } from '../contexts/StockPortfolioContext'
import Box from '@mui/material/Box'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

interface StockPortfolio {
  stock_id?: number
  quantity_owned?: number
}

const columns: GridColDef[] = [
  {
    field: 'stock_id',
    headerName: 'Stock ID',
    width: 150,
  },
  {
    field: 'stock_name',
    headerName: 'Stock Name',
    width: 300,
  },
  {
    field: 'current_price',
    headerName: 'Current Price',
    width: 150,
  },
  {
    field: 'quantity_owned',
    headerName: 'Quantity Owned',
    width: 150,
  },
]

function StockPortfolioComponent() {
  // Fetch stock portfolio from backend
  const { stock_portfolio } = useStockPortfolio()
  if (stock_portfolio == null) {
    return <Box>Loading...</Box>
  }

  // Map retrieved list of objects to stock portfolio
  const mapped_stock_prices = stock_portfolio.map(
    (StockPortfolio: any, index: number) => ({
      id: index + 1,
      stock_id: StockPortfolio.stock_id,
      quantity_owned: StockPortfolio.quantity_owned,
    })
  )

  return (
    <Box sx={{ height: 625, width: '100%', mb: 5 }}>
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
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
      />
    </Box>
  )
}

export default StockPortfolioComponent
