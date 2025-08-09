import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ClientProviders } from "@/components/client-providers"
import { FloatingWalrusSealWidget } from "@/components/floating-walrus-seal-widget"

const inter = Inter({ subsets: ["latin"] })

// Update the title and description
export const metadata: Metadata = {
  title: "SuiPass - Lock Down Your Secrets. Only Your Sui Wallet Holds the Key",
  description: "SuiPass protects your API keys and environment variables with end-to-end encryption tied to your Sui wallet — no passwords, no leaks, no compromises. Just pure, wallet-based control.",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientProviders>
          {children}
          <FloatingWalrusSealWidget />
        </ClientProviders>
      </body>
    </html>
  )
}
