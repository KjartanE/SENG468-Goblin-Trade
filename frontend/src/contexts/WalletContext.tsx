import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
  useCallback,
} from 'react'
import { useAuth } from './AuthContext'

type WalletContextType = {
  wallet: { user_name: string; balance: number } | null
  refreshWallet: () => void
}

const walletContextDefaultValues: WalletContextType = {
  wallet: null,
  refreshWallet: () => {
    null
  },
}

const WalletContext = createContext<WalletContextType>(
  walletContextDefaultValues
)

export function useWallet() {
  return useContext(WalletContext)
}

interface WalletProviderProps {
  children: ReactNode
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [wallet, setWalletBalance] = useState<{
    user_name: string
    balance: number
  } | null>(null)
  const authContext = useAuth()

  const fetchWalletBalance = useCallback(async () => {
    if (!authContext.user?.token) return

    try {
      const response = await fetch('http://localhost:8080/getwalletbalance', {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
          token: authContext.user?.token,
        }),
      })
      const data = await response.json()
      setWalletBalance({
        user_name: data[0].user_name,
        balance: data[0].balance,
      })
    } catch (error) {
      console.error('Error:', error)
    }
  }, [authContext.user?.token])

  useEffect(() => {
    fetchWalletBalance()
  }, [fetchWalletBalance])

  const refreshWallet = () => {
    fetchWalletBalance()
  }

  return (
    <WalletContext.Provider value={{ wallet, refreshWallet }}>
      {children}
    </WalletContext.Provider>
  )
}
