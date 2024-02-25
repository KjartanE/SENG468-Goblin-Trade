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
  orderErrors: string
  placeStockOrder: (order: IStockOrderForm) => void
}

const stockTransactionsContextDefaultValues: StockTransactionsType = {
  stock_transactions: [],
  orderErrors: '',
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
  const [orderErrors, setOrderErrors] = useState<''>('')

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

      const data = await api.stocks.placeStockOrder(order)

      // If response is not empty, then an error occured.
      if (data) {
        setOrderErrors(orderErrors)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const value = {
    stock_transactions,
    orderErrors,
    placeStockOrder,
  }

  return (
    <StockTransactionsContext.Provider value={value}>
      {children}
    </StockTransactionsContext.Provider>
  )
}
