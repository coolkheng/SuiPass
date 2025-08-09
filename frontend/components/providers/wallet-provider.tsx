"use client"

import { FC } from 'react'
import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SUI_WALLET_CONFIG } from '@/lib/wallet-adapter'
import '@mysten/dapp-kit/dist/index.css'

interface WalletConfigProps {
  children: React.ReactNode
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
})

export const WalletConfig: FC<WalletConfigProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider 
        networks={SUI_WALLET_CONFIG.networks} 
        defaultNetwork={SUI_WALLET_CONFIG.defaultNetwork}
      >
        <WalletProvider 
          autoConnect={false}
          storageAdapter={typeof window !== 'undefined' ? {
            getItem: (key: string) => localStorage.getItem(key),
            setItem: (key: string, value: string) => localStorage.setItem(key, value),
            removeItem: (key: string) => localStorage.removeItem(key),
          } : undefined}
        >
          {children}
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  )
}
