"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { 
  Sparkles, 
  Shield, 
  Database, 
  Network, 
  Lock, 
  Unlock, 
  Key, 
  Cloud, 
  Zap, 
  Globe,
  Cpu,
  Activity,
  TrendingUp,
  Users,
  Timer,
  Layers,
  CheckCircle,
  ArrowRight,
  Wallet,
  Code,
  Rocket,
  Star,
  Upload
} from 'lucide-react'
import { EnhancedSecureVaultShowcase } from "./enhanced-secure-vault-showcase"

interface DemoMetrics {
  totalTransactions: number
  encryptionOps: number
  storageNodes: number
  networkLatency: number
  dataStored: string
  usersProtected: number
}

export function WalrusSealDemoPage() {
  const [activeDemo, setActiveDemo] = useState<'overview' | 'encryption' | 'storage' | 'integration'>('overview')
  const [metrics, setMetrics] = useState<DemoMetrics>({
    totalTransactions: 156234,
    encryptionOps: 8942,
    storageNodes: 15,
    networkLatency: 42,
    dataStored: "247.8 GB",
    usersProtected: 12567
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        totalTransactions: prev.totalTransactions + Math.floor(Math.random() * 10),
        encryptionOps: prev.encryptionOps + Math.floor(Math.random() * 3),
        storageNodes: Math.floor(Math.random() * 5) + 12,
        networkLatency: Math.floor(Math.random() * 20) + 35
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse"></div>
        <div className="relative container mx-auto px-6 py-16">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <Badge className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white text-lg px-6 py-2 rounded-full shadow-lg">
                <Rocket className="h-5 w-5 mr-2" />
                ADVANCED SECURITY PLATFORM
              </Badge>
            </div>
            
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              SuiPass
            </h1>
            
            <p className="text-3xl font-semibold text-gray-700 dark:text-gray-300">
              Next-Generation Security Platform
            </p>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto">
              Powered by <span className="font-bold text-blue-600">Walrus</span> decentralized storage and <span className="font-bold text-purple-600">Seal</span> threshold encryption on the <span className="font-bold text-cyan-600">Sui</span> blockchain
            </p>

            {/* Live Metrics Banner */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 max-w-6xl mx-auto mt-12">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-lg">
                <div className="text-2xl font-bold text-blue-600">{metrics.totalTransactions.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Transactions</div>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-lg">
                <div className="text-2xl font-bold text-purple-600">{metrics.encryptionOps.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Encryptions</div>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-lg">
                <div className="text-2xl font-bold text-green-600">{metrics.storageNodes}</div>
                <div className="text-xs text-muted-foreground">Storage Nodes</div>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-lg">
                <div className="text-2xl font-bold text-orange-600">{metrics.networkLatency}ms</div>
                <div className="text-xs text-muted-foreground">Latency</div>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-lg">
                <div className="text-2xl font-bold text-cyan-600">{metrics.dataStored}</div>
                <div className="text-xs text-muted-foreground">Data Stored</div>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-lg">
                <div className="text-2xl font-bold text-pink-600">{metrics.usersProtected.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Users Protected</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-center mb-8">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-2 border border-white/50 shadow-lg">
            <div className="flex gap-2">
              {[
                { id: 'overview', label: 'Overview', icon: Star },
                { id: 'encryption', label: 'Seal Encryption', icon: Lock },
                { id: 'storage', label: 'Walrus Storage', icon: Database },
                { id: 'integration', label: 'Full Integration', icon: Zap }
              ].map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeDemo === tab.id ? "default" : "ghost"}
                  className={`px-6 py-3 text-sm font-medium transition-all duration-300 ${
                    activeDemo === tab.id 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setActiveDemo(tab.id as any)}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Demo Content */}
        <div className="space-y-8">
          {activeDemo === 'overview' && (
            <div className="space-y-8">
              {/* Technology Stack */}
              <Card className="border-2 border-blue-200 dark:border-blue-700 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50">
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <Code className="h-6 w-6 text-blue-500" />
                    Technology Stack
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Advanced security infrastructure built on Sui blockchain
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Sui Blockchain */}
                    <div className="text-center p-8 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 rounded-2xl border-2 border-cyan-200 dark:border-cyan-700 shadow-lg">
                      <div className="relative mb-6">
                        <Wallet className="mx-auto h-16 w-16 text-cyan-500" />
                        <div className="absolute -top-2 -right-2 h-6 w-6 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-cyan-700 dark:text-cyan-300 mb-2">Sui Blockchain</h3>
                      <p className="text-cyan-600 dark:text-cyan-400 text-sm mb-4">
                        High-performance L1 blockchain with parallel execution and low fees
                      </p>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span>TPS:</span>
                          <span className="font-bold">{metrics.totalTransactions > 100000 ? '100K+' : '50K+'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Finality:</span>
                          <span className="font-bold">~400ms</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Gas Cost:</span>
                          <span className="font-bold">$0.0003</span>
                        </div>
                      </div>
                    </div>

                    {/* Walrus Storage */}
                    <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-2xl border-2 border-blue-200 dark:border-blue-700 shadow-lg">
                      <div className="relative mb-6">
                        <Database className="mx-auto h-16 w-16 text-blue-500" />
                        <div className="absolute -top-2 -right-2 h-6 w-6 bg-green-500 rounded-full flex items-center justify-center">
                          <Network className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-2">Walrus Storage</h3>
                      <p className="text-blue-600 dark:text-blue-400 text-sm mb-4">
                        Decentralized blob storage with content addressing and redundancy
                      </p>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span>Nodes:</span>
                          <span className="font-bold">{metrics.storageNodes} Active</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Redundancy:</span>
                          <span className="font-bold">3x Replicated</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Availability:</span>
                          <span className="font-bold">99.99%</span>
                        </div>
                      </div>
                    </div>

                    {/* Seal Encryption */}
                    <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-2xl border-2 border-purple-200 dark:border-purple-700 shadow-lg">
                      <div className="relative mb-6">
                        <Shield className="mx-auto h-16 w-16 text-purple-500" />
                        <div className="absolute -top-2 -right-2 h-6 w-6 bg-green-500 rounded-full flex items-center justify-center">
                          <Lock className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-purple-700 dark:text-purple-300 mb-2">Seal Encryption</h3>
                      <p className="text-purple-600 dark:text-purple-400 text-sm mb-4">
                        Threshold cryptography with distributed key management
                      </p>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span>Threshold:</span>
                          <span className="font-bold">2/3 Keys</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Encryption:</span>
                          <span className="font-bold">256-bit AES</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Security:</span>
                          <span className="font-bold">Quantum-Safe</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Key Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    icon: Shield,
                    title: "Zero Trust Security",
                    description: "No single point of failure with distributed key management",
                    color: "from-red-500 to-pink-500"
                  },
                  {
                    icon: Network,
                    title: "Decentralized Storage",
                    description: "Global distribution across multiple storage nodes",
                    color: "from-blue-500 to-cyan-500"
                  },
                  {
                    icon: Zap,
                    title: "Lightning Fast",
                    description: "Sub-second transactions with parallel execution",
                    color: "from-yellow-500 to-orange-500"
                  },
                  {
                    icon: Globe,
                    title: "Global Scale",
                    description: "Built for millions of users worldwide",
                    color: "from-green-500 to-emerald-500"
                  }
                ].map((feature, index) => (
                  <Card key={index} className="border-2 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <div className={`mx-auto w-12 h-12 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeDemo === 'encryption' && (
            <Card className="border-2 border-purple-200 dark:border-purple-700 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50">
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Lock className="h-6 w-6 text-purple-500" />
                  Seal Threshold Cryptography Demo
                </CardTitle>
                <CardDescription className="text-lg">
                  Experience next-generation encryption with distributed key management
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 p-6 rounded-lg border border-purple-200 dark:border-purple-700 mb-6">
                  <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-300 mb-3">
                    🔐 How Seal Threshold Cryptography Works
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white/80 dark:bg-gray-800/80 p-4 rounded-lg">
                      <div className="font-medium text-purple-600 mb-2">1. Key Generation</div>
                      <div className="text-purple-500">Master key split into 3 shares using Shamir's Secret Sharing</div>
                    </div>
                    <div className="bg-white/80 dark:bg-gray-800/80 p-4 rounded-lg">
                      <div className="font-medium text-purple-600 mb-2">2. Threshold Encryption</div>
                      <div className="text-purple-500">Data encrypted using threshold scheme - any 2 of 3 shares can decrypt</div>
                    </div>
                    <div className="bg-white/80 dark:bg-gray-800/80 p-4 rounded-lg">
                      <div className="font-medium text-purple-600 mb-2">3. Secure Decryption</div>
                      <div className="text-purple-500">Multiple parties must collaborate to reconstruct the key</div>
                    </div>
                  </div>
                </div>
                <EnhancedSecureVaultShowcase />
              </CardContent>
            </Card>
          )}

          {activeDemo === 'storage' && (
            <Card className="border-2 border-blue-200 dark:border-blue-700 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50">
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Database className="h-6 w-6 text-blue-500" />
                  Walrus Decentralized Storage
                </CardTitle>
                <CardDescription className="text-lg">
                  Immutable, distributed storage on the Sui blockchain
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 p-6 rounded-lg border border-blue-200 dark:border-blue-700 mb-6">
                  <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-3">
                    Walrus Storage Architecture
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div className="bg-white/80 dark:bg-gray-800/80 p-4 rounded-lg text-center">
                      <Network className="mx-auto h-8 w-8 text-blue-500 mb-2" />
                      <div className="font-medium text-blue-600 mb-1">Distributed Network</div>
                      <div className="text-blue-500">{metrics.storageNodes} active nodes globally</div>
                    </div>
                    <div className="bg-white/80 dark:bg-gray-800/80 p-4 rounded-lg text-center">
                      <Shield className="mx-auto h-8 w-8 text-green-500 mb-2" />
                      <div className="font-medium text-green-600 mb-1">Redundant Storage</div>
                      <div className="text-green-500">3x replication across nodes</div>
                    </div>
                    <div className="bg-white/80 dark:bg-gray-800/80 p-4 rounded-lg text-center">
                      <Zap className="mx-auto h-8 w-8 text-yellow-500 mb-2" />
                      <div className="font-medium text-yellow-600 mb-1">Fast Retrieval</div>
                      <div className="text-yellow-500">{metrics.networkLatency}ms average latency</div>
                    </div>
                    <div className="bg-white/80 dark:bg-gray-800/80 p-4 rounded-lg text-center">
                      <Lock className="mx-auto h-8 w-8 text-purple-500 mb-2" />
                      <div className="font-medium text-purple-600 mb-1">Immutable</div>
                      <div className="text-purple-500">Cryptographically secured</div>
                    </div>
                  </div>
                </div>
                <EnhancedSecureVaultShowcase />
              </CardContent>
            </Card>
          )}

          {activeDemo === 'integration' && (
            <div className="space-y-8">
              <Card className="border-2 border-gradient-to-r from-blue-200 to-purple-200 dark:border-blue-700 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/50 dark:via-purple-950/50 dark:to-pink-950/50">
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <Sparkles className="h-6 w-6 text-purple-500" />
                    Complete Sui Ecosystem Integration
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Full demonstration of Walrus + Seal + Sui working together
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4 text-center">End-to-End Security Workflow</h3>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                      {[
                        { icon: Key, label: "User Data", color: "text-gray-600" },
                        { icon: Lock, label: "Seal Encrypt", color: "text-purple-600" },
                        { icon: Upload, label: "Walrus Store", color: "text-blue-600" },
                        { icon: Shield, label: "Sui Secure", color: "text-green-600" }
                      ].map((step, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className={`p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg ${step.color}`}>
                            <step.icon className="h-6 w-6" />
                          </div>
                          <span className="font-medium">{step.label}</span>
                          {index < 3 && <ArrowRight className="h-5 w-5 text-gray-400 hidden md:block" />}
                        </div>
                      ))}
                    </div>
                  </div>
                  <EnhancedSecureVaultShowcase />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
