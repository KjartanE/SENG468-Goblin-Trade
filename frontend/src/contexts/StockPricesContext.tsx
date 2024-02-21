import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react'
import { useAuth } from './AuthContext'

type StockPricesType = {
  stock_prices: unknown[]
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
  const [stock_prices, setStockPrices] = useState<unknown[]>([])
  const authContext = useAuth()

  useEffect(() => {
    const fetchStockPrices = async () => {
      try {
        const response = await fetch('http://localhost:8080/getstockprices', {
          method: 'GET',
          headers: new Headers({
            'Content-Type': 'application/json',
            token: authContext.user?.token || '',
          }),
        })
        const data = await response.json()
        setStockPrices(data)
      } catch (error) {
        console.error('Error:', error)
      }
    }

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
