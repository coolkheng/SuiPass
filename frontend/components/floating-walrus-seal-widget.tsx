"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Sparkles, 
  Shield, 
  Network, 
  Zap, 
  ChevronUp, 
  ChevronDown,
  Activity,
  Database,
  Lock
} from 'lucide-react'

interface NetworkStats {
  suiTps: number
  walrusNodes: number
  sealEncryptions: number
  networkHealth: number
}

export function FloatingWalrusSealWidget() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [stats, setStats] = useState<NetworkStats>({
    suiTps: 2800,
    walrusNodes: 12,
    sealEncryptions: 45,
    networkHealth: 99.8
  })

  // Simulate real-time stats
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        suiTps: Math.floor(Math.random() * 500) + 2500,
        walrusNodes: Math.floor(Math.random() * 5) + 10,
        sealEncryptions: Math.floor(Math.random() * 20) + 35,
        networkHealth: Math.floor(Math.random() * 10) + 99
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/90 dark:via-purple-950/90 dark:to-pink-950/90 border-2 border-blue-200 dark:border-blue-700 shadow-2xl backdrop-blur-md">
        <CardContent className="p-0">
          {/* Header - Always Visible */}
          <div 
            className="flex items-center gap-3 p-4 cursor-pointer hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="relative">
              <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
              <div className="absolute -top-1 -right-1 h-2 w-2 bg-blue-500 rounded-full animate-ping"></div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-500" />
                <span className="font-semibold text-sm">Sui Ecosystem</span>
                <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white text-xs px-1.5 py-0.5">
                  LIVE
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">Walrus & Seal</div>
            </div>
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </div>

          {/* Expanded Content */}
          {isExpanded && (
            <div className="border-t border-blue-200 dark:border-blue-700 p-4 space-y-4 animate-in slide-in-from-bottom-2 duration-300">
              {/* Live Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg backdrop-blur-sm border border-white/50">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Activity className="h-3 w-3 text-blue-500" />
                    <span className="text-sm font-bold text-blue-600">{stats.suiTps.toLocaleString()}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Sui TPS</div>
                </div>
                
                <div className="text-center p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg backdrop-blur-sm border border-white/50">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Network className="h-3 w-3 text-green-500" />
                    <span className="text-sm font-bold text-green-600">{stats.walrusNodes}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Walrus Nodes</div>
                </div>
                
                <div className="text-center p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg backdrop-blur-sm border border-white/50">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Lock className="h-3 w-3 text-purple-500" />
                    <span className="text-sm font-bold text-purple-600">{stats.sealEncryptions}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Seal Ops/min</div>
                </div>
                
                <div className="text-center p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg backdrop-blur-sm border border-white/50">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Shield className="h-3 w-3 text-orange-500" />
                    <span className="text-sm font-bold text-orange-600">{stats.networkHealth}%</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Health</div>
                </div>
              </div>

              {/* Technology Highlights */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-700">
                  <Database className="h-4 w-4 text-blue-500" />
                  <div className="flex-1">
                    <div className="text-xs font-medium text-blue-700 dark:text-blue-300">Walrus Storage</div>
                    <div className="text-xs text-blue-600 dark:text-blue-400">Decentralized & Immutable</div>
                  </div>
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                
                <div className="flex items-center gap-2 p-2 bg-purple-50 dark:bg-purple-950/50 rounded-lg border border-purple-200 dark:border-purple-700">
                  <Lock className="h-4 w-4 text-purple-500" />
                  <div className="flex-1">
                    <div className="text-xs font-medium text-purple-700 dark:text-purple-300">Seal Encryption</div>
                    <div className="text-xs text-purple-600 dark:text-purple-400">Threshold Cryptography</div>
                  </div>
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* Network Status */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 p-3 rounded-lg border border-green-200 dark:border-green-700">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-semibold text-green-700 dark:text-green-300">Network Status: Optimal</span>
                </div>
                <div className="text-xs text-green-600 dark:text-green-400">
                  All systems operational • Low latency • High throughput
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-xs h-8"
                  onClick={() => {
                    // Navigate to demo or open modal
                    window.location.hash = 'walrus-seal-demo'
                  }}
                >
                  View Security
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="flex-1 text-xs h-8 border-blue-200 text-blue-600 hover:bg-blue-50"
                  onClick={() => {
                    // Show more stats or analytics
                    console.log('Analytics view')
                  }}
                >
                  Analytics
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
