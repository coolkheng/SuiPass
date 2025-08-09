'use client'

// Import polyfills first
import '@/lib/polyfills.js'
import { PropsWithChildren } from 'react'
import dynamic from 'next/dynamic'
import { ThemeProvider } from "@/components/theme-provider"

const WalletConfigProvider = dynamic(
  () => import("@/components/providers/wallet-config-provider").then(mod => ({ default: mod.WalletConfigProvider })),
  { ssr: false }
)

export function ClientProviders({ children }: PropsWithChildren) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange={false}
      storageKey="suipass-theme"
    >
      <WalletConfigProvider>
        {children}
      </WalletConfigProvider>
    </ThemeProvider>
  )
}
