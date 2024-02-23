import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react'
import { useAuth } from './AuthContext'
import { useApi } from './ApiContext'
import { Stock } from '../types/stocks'

type StockPricesType = {
  stock_prices: Stock[]
}

const stockPricesContextDefaultValues: StockPricesType = {
  stock_prices: [],
}

const StockPricesContext = createContext<StockPricesType>(
  stockPricesContextDefaultValues
)

export function useStockPrices() {
  return useContext(StockPricesContext)
}

export function StockPricesProvider({ children }: { children: ReactNode }) {
  const [stock_prices, setStockPrices] = useState<Stock[]>([])
  const authContext = useAuth()
  const api = useApi()

  useEffect(() => {
    const fetchStockPrices = async () => {
      try {
        if (!authContext.user?.token) return

        const data = await api.stocks.getStockPrices()
        setStockPrices(data)
      } catch (error) {
        console.error('Error:', error)
      }
    }

    // Fetch stock prices
    if (authContext.user?.token) {
      fetchStockPrices()
    }
  }, [authContext.user?.token])

  const value = {
    stock_prices,
  }

  return (
    <StockPricesContext.Provider value={value}>
      {children}
    </StockPricesContext.Provider>
  )
}
