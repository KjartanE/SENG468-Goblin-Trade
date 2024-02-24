import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react'
import { useAuth } from './AuthContext'
import { useApi } from './ApiContext'
import { IStockOrderForm, IStockTransaction } from '../types/stocks'

type StockTransactionsType = {
  stock_transactions: IStockTransaction[]
  placeStockOrder: (order: IStockOrderForm) => void
}

const stockTransactionsContextDefaultValues: StockTransactionsType = {
  stock_transactions: [],
  placeStockOrder: () => {
    null
  },
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

  const placeStockOrder = async (order: IStockOrderForm) => {
    try {
      if (!authContext.user?.token) return

      // JSON stringify order
      const orderString = JSON.stringify(order)

      console.log(orderString)
      const data = await api.stocks.placeStockOrder(orderString)
      console.log(data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const value = {
    stock_transactions,
    placeStockOrder,
  }

  return (
    <StockTransactionsContext.Provider value={value}>
      {children}
    </StockTransactionsContext.Provider>
  )
}
