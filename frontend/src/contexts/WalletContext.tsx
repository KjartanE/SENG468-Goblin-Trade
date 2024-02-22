import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
  useCallback,
} from 'react'
import { useAuth } from './AuthContext'
import { useApi } from './ApiContext'
import { IWallet } from '@/types/wallet'

type WalletContextType = {
  wallet: IWallet | null
  refreshWallet: () => void
  updateWallet: (amount: number) => void
}

const walletContextDefaultValues: WalletContextType = {
  wallet: null,
  refreshWallet: () => {
    null
  },
  updateWallet: () => {
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
  const [wallet, setWalletBalance] = useState<IWallet | null>(null)

  const authContext = useAuth()
  const api = useApi()

  const fetchWalletBalance = useCallback(async () => {
    try {
      if (!authContext.user?.token) return

      const data = await api.wallet.getWalletBalance()

      setWalletBalance(data)
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

  const updateWallet = async (amount: number) => {
    try {
      if (!authContext.user?.token) return

      await api.wallet.updateWalletBalance(amount)
      fetchWalletBalance()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <WalletContext.Provider value={{ wallet, refreshWallet, updateWallet }}>
      {children}
    </WalletContext.Provider>
  )
}
