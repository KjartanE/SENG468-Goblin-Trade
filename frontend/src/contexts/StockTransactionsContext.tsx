import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react'
import { useAuth } from './AuthContext'
import { useApi } from './ApiContext'
import { IStockTransaction } from '../types/stocks'

type StockTransactionsType = {
  stock_transactions: IStockTransaction[]
}

const stockTransactionsContextDefaultValues: StockTransactionsType = {
  stock_transactions: [],
}

const StockTransactionsContext = createContext<StockTransactionsType>(
  stockTransactionsContextDefaultValues
)

export function useStockTransactions() {
  return useContext(StockTransactionsContext)
}

export function StockTransactionsProvider({
  children,
}: {
  children: ReactNode
}) {
  const [stock_transactions, setStockTransactions] = useState<
    IStockTransaction[]
  >([])
  const authContext = useAuth()
  const api = useApi()

  useEffect(() => {
    const fetchStockTransactions = async () => {
      try {
        if (!authContext.user?.token) return

        const data = await api.stocks.getStockTransactions()
        setStockTransactions(data)
      } catch (error) {
        console.error('Error:', error)
      }
    }

    // Fetch stock transactions
    if (authContext.user?.token) {
      fetchStockTransactions()
    }
  }, [authContext.user?.token])

  const value = {
    stock_transactions,
  }

  return (
    <StockTransactionsContext.Provider value={value}>
      {children}
    </StockTransactionsContext.Provider>
  )
}
