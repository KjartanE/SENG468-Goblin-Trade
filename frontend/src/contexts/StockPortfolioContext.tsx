import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react'
import { useAuth } from './AuthContext'
export interface StockPortfolio {
  stock_id?: number
  quantity_owned?: number
}

type StockPortfolioType = {
  stock_portfolio: StockPortfolio[]
}

const stockPortfolioContextDefaultValues: StockPortfolioType = {
  stock_portfolio: [],
}

const StockPortfolioContext = createContext<StockPortfolioType>(
  stockPortfolioContextDefaultValues
)

export function useStockPortfolio() {
  return useContext(StockPortfolioContext)
}

export function StockPortfolioProvider({ children }: { children: ReactNode }) {
  const [stock_portfolio, setStockPortfolio] = useState<StockPortfolio[]>([])
  const authContext = useAuth()

  useEffect(() => {
    const fetchStockPortfolio = async () => {
      try {
        const response = await fetch(
          'http://localhost:8080/getstockportfolio',
          {
            method: 'GET',
            headers: new Headers({
              'Content-Type': 'application/json',
              token: authContext.user?.token || '',
            }),
          }
        )
        const data = await response.json()
        setStockPortfolio(data)
      } catch (error) {
        console.error('Error:', error)
      }
    }

    if (authContext.user?.token) {
      fetchStockPortfolio()
    }
  }, [authContext.user?.token])

  const value = {
    stock_portfolio,
  }

  return (
    <StockPortfolioContext.Provider value={value}>
      {children}
    </StockPortfolioContext.Provider>
  )
}
