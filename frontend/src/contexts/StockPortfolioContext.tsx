import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react'
import { useAuth } from './AuthContext'
import { useApi } from './ApiContext'
import { IStockPortfolio } from '../types/stocks'

type StockPortfolioType = {
  stock_portfolio: IStockPortfolio[]
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
  const [stock_portfolio, setStockPortfolio] = useState<IStockPortfolio[]>([])
  const authContext = useAuth()
  const api = useApi()

  useEffect(() => {
    const fetchStockPortfolio = async () => {
      try {
        if (!authContext.user?.token) return

        const data = await api.stocks.getStockPortfolio()
        setStockPortfolio(data)
      } catch (error) {
        console.error('Error:', error)
      }
    }

    // Fetch stock portfolio
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
