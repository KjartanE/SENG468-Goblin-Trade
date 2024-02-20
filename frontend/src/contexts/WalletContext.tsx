import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react'
import { useAuth } from './AuthContext'

type WalletContextType = {
  wallet: { user_name: string; balance: number } | null
}

const walletContextDefaultValues: WalletContextType = {
  wallet: null,
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

  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const response = await fetch('http://localhost:8080/getwalletbalance', {
          method: 'GET',
          headers: new Headers({
            'Content-Type': 'application/json',
            token: authContext.user?.token || '',
          }),
        })
        const data = await response.json()
        setWalletBalance(data[0].balance)
      } catch (error) {
        console.error('Error:', error)
      }
    }

    if (authContext.user?.token) {
      fetchWalletBalance()
    }
  }, [authContext.user?.token])

  return (
    <WalletContext.Provider value={{ wallet }}>
      {children}
    </WalletContext.Provider>
  )
}
