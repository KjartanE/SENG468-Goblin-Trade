import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react'
import { useAuth } from './AuthContext'
import { StockTransactions } from '../types/stocks'

type StockTransactionsType = {
  stock_transactions: StockTransactions[]
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
    StockTransactions[]
  >([])
  const authContext = useAuth()

  useEffect(() => {
    const fetchStockTransactions = async () => {
      try {
        const response = await fetch(
          'http://localhost:8080/getstocktransactions',
          {
            method: 'GET',
            headers: new Headers({
              'Content-Type': 'application/json',
              token: authContext.user?.token || '',
            }),
          }
        )
        const data = await response.json()
        setStockTransactions(data)
      } catch (error) {
        console.error('Error:', error)
      }
    }

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
