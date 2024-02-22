import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react'
import { useAuth } from './AuthContext'
import { useApi } from './ApiContext'
import { IWalletTransactions } from '../types/wallet'

type WalletTransactionsType = {
  wallet_transactions: IWalletTransactions[]
}

const walletTransactionsContextDefaultValues: WalletTransactionsType = {
  wallet_transactions: [],
}

const walletTransactionsContext = createContext<WalletTransactionsType>(
  walletTransactionsContextDefaultValues
)

export function useWalletTransactions() {
  return useContext(walletTransactionsContext)
}

export function WalletTransactionsProvider({
  children,
}: {
  children: ReactNode
}) {
  const [wallet_transactions, setWalletTransactions] = useState<
    IWalletTransactions[]
  >([])
  const authContext = useAuth()
  const api = useApi()

  useEffect(() => {
    const fetchWalletTransactions = async () => {
      try {
        if (!authContext.user?.token) return

        const data = await api.wallet.getWalletTransactions()
        setWalletTransactions(data)
      } catch (error) {
        console.error('Error:', error)
      }
    }

    if (authContext.user?.token) {
      fetchWalletTransactions()
    }
  }, [authContext.user?.token])

  const value = {
    wallet_transactions,
  }

  return (
    <walletTransactionsContext.Provider value={value}>
      {children}
    </walletTransactionsContext.Provider>
  )
}
