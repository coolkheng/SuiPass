"use client"

import React, { FC } from 'react'
import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SUI_WALLET_CONFIG } from '@/lib/wallet-adapter'
import '@mysten/dapp-kit/dist/index.css'

interface WalletConfigProviderProps {
  children: React.ReactNode
}

const queryClient = new QueryClient()

export const WalletConfigProvider: FC<WalletConfigProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={SUI_WALLET_CONFIG.networks} defaultNetwork={SUI_WALLET_CONFIG.defaultNetwork}>
        <WalletProvider autoConnect>
          {children}
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  )
}
