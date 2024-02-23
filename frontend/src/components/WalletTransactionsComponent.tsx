import { useWalletTransactions } from '../contexts/WalletTransactionsContext'
import Box from '@mui/material/Box'
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid'

const columns: GridColDef[] = [
  {
    field: 'wallet_tx_id',
    headerName: 'Wallet Transaction ID',
    width: 200,
  },
  {
    field: 'stock_tx_id',
    headerName: 'Stock Transaction ID',
    width: 200,
  },
  {
    field: 'is_debit',
    headerName: 'Is Debit',
    width: 100,
  },
  {
    field: 'amount',
    headerName: 'Amount',
    width: 150,
  },
  {
    field: 'time_stamp',
    headerName: 'Time Stamp',
    width: 300,
  },
]

function WalletTransactionsComponent() {
  // Fetch stock portfolio from backend
  const { wallet_transactions } = useWalletTransactions()

  if (wallet_transactions == null) {
    return <Box>Loading...</Box>
  }

  if (wallet_transactions.length == 0) {
    return <Box>No recent transactions.</Box>
  }

  // Index retrieved list of transactions for DataGrid
  const mapped_wallet_transactions = wallet_transactions.map(
    (wallet_transaction: any, index: number) => ({
      id: index + 1,
      wallet_tx_id: wallet_transaction.wallet_tx_id,
      stock_tx_id: wallet_transaction.stock_tx_id,
      is_debit: wallet_transaction.is_debit,
      amount: wallet_transaction.amount,
      time_stamp: wallet_transaction.time_stamp,
      __v: wallet_transaction.__v,
    })
  )

  return (
    <Box sx={{ width: '100%', mb: 5 }}>
      <DataGrid
        rows={mapped_wallet_transactions}
        columns={columns}
        slots={{
          toolbar: GridToolbar,
        }}
        initialState={{
          sorting: {
            sortModel: [{ field: 'time_stamp', sort: 'asc' }],
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

export default WalletTransactionsComponent
