"use client"

import type React from "react"
import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { WalletAuthGate } from "@/components/wallet-auth-gate"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [sidebarHovered, setSidebarHovered] = useState(false)
  
  const shouldShowExpanded = sidebarExpanded || sidebarHovered

  return (
    <WalletAuthGate>
      <div className="flex min-h-screen flex-col">
        {/* Header - adjust margin based on sidebar state */}
        <div 
          className={`transition-all duration-300 ${
            shouldShowExpanded ? 'ml-64' : 'ml-16'
          }`}
        >
          <DashboardHeader />
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <DashboardSidebar 
            onExpandChange={setSidebarExpanded}
            onHoverChange={setSidebarHovered}
          />

          {/* Main Content Area - adjust margin based on sidebar state */}
          <main 
            className={`flex-1 overflow-y-auto p-4 md:p-6 transition-all duration-300 ${
              shouldShowExpanded ? 'ml-64' : 'ml-16'
            }`}
          >
            {children}
          </main>
        </div>
      </div>
   </WalletAuthGate>
  )
}

