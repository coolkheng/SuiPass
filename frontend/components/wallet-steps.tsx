"use client"

import { useCurrentAccount } from "@mysten/dapp-kit"
import { Check } from "lucide-react"
import { ConnectWalletButton } from "@/components/connect-wallet-button"

export function WalletSteps() {
  const currentAccount = useCurrentAccount()

  // Since wallet-auth-gate.tsx handles the full authentication flow,
  // this component can simply show the connection status or redirect
  if (currentAccount) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-full border border-green-100 dark:border-green-800/30">
          <Check className="h-4 w-4 text-green-500" />
          <span className="text-sm font-medium text-green-600 dark:text-green-400">Wallet Connected</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-4">
      <ConnectWalletButton />
    </div>
  )
}
