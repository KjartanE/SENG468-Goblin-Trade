import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react'
import { useAuth } from './AuthContext'
import { useApi } from './ApiContext'
import IWalletTransactions from '../hooks/useWalletApi'

export interface IWalletTransactions {
  wallet_tx_id?: string
  stock_tx_id?: string
  is_debit?: boolean
  amount?: number
  time_stamp?: string
  __v?: number
}

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
        console.log(data)
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
