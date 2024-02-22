import { useStockTransactions } from '../contexts/StockTransactionsContext'
import Box from '@mui/material/Box'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

const columns: GridColDef[] = [
  {
    field: 'stock_tx_id',
    headerName: 'Stock Transaction ID',
    width: 200,
  },
  {
    field: 'wallet_tx_id',
    headerName: 'Wallet Transaction ID',
    width: 200,
  },
  {
    field: 'stock_id',
    headerName: 'Stock ID',
    width: 100,
  },
  {
    field: 'order_status',
    headerName: 'Order Status',
    width: 150,
  },
  {
    field: 'stock_price',
    headerName: 'Stock Price',
    width: 150,
  },
  {
    field: 'quantity',
    headerName: 'Quantity',
    width: 150,
  },
  {
    field: 'time_stamp',
    headerName: 'Time Stamp',
    width: 300,
  },
]

function StockTransactionsComponent() {
  // Fetch stock portfolio from backend
  const { stock_transactions } = useStockTransactions()

  if (stock_transactions == null) {
    return <Box>Loading...</Box>
  }

  if (stock_transactions.length == 0) {
    return <Box>No recent transactions.</Box>
  }

  // Map retrieved list of objects to stock portfolio
  // Map retrieved list of objects to stocks
  const mapped_stock_transactions = stock_transactions.map(
    (stock_transaction: any, index: number) => ({
      id: index + 1,
      stock_tx_id: stock_transaction.stock_tx_id,
      wallet_tx_id: stock_transaction.wallet_tx_id,
      stock_id: stock_transaction.stock_id,
      order_status: stock_transaction.order_status,
      is_buy: stock_transaction.is_buy,
      order_type: stock_transaction.order_type,
      stock_price: stock_transaction.stock_price,
      quantity: stock_transaction.quantity,
      time_stamp: stock_transaction.time_stamp,
      __v: stock_transaction.__v,
    })
  )

  return (
    <Box sx={{ width: '100%', mb: 5 }}>
      <DataGrid
        rows={mapped_stock_transactions}
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

export default StockTransactionsComponent
