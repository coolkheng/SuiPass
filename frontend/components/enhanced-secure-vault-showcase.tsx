"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Shield, 
  Database, 
  Network, 
  Lock, 
  Unlock, 
  Key, 
  Cloud, 
  Zap, 
  CheckCircle, 
  AlertCircle,
  Eye,
  EyeOff,
  Copy,
  Download,
  Upload,
  Globe,
  Cpu,
  Activity,
  Sparkles,
  Wallet,
  Users,
  Timer,
  Layers,
  TrendingUp,
  ArrowRight
} from 'lucide-react'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

// Enhanced encryption/decryption process for demo
interface SecureItem {
  id: string
  name: string
  type: 'credential' | 'document' | 'note' | 'api-key'
  encryptedData: string
  originalData: string
  blobId?: string
  policyId?: string
  status: 'encrypting' | 'uploading' | 'stored' | 'downloading' | 'decrypting' | 'ready'
  progress: number
  timestamp: string
  size: string
  threshold: string
  networkNodes: number
  encryptionMethod: string
}

interface LiveMetrics {
  totalEncrypted: number
  storageNodes: number
  networkLatency: number
  encryptionStrength: number
  activeConnections: number
  dataTransferred: string
  uptime: string
}

export function EnhancedSecureVaultShowcase() {
  const { toast } = useToast()
  const [secureItems, setSecureItems] = useState<SecureItem[]>([])
  const [migratedCredentials, setMigratedCredentials] = useState<SecureItem[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStage, setProcessingStage] = useState("")
  const [selectedItem, setSelectedItem] = useState<SecureItem | null>(null)
  const [newItemData, setNewItemData] = useState("")
  const [newItemName, setNewItemName] = useState("")
  const [showDecrypted, setShowDecrypted] = useState<Record<string, boolean>>({})
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [showMigrationFlow, setShowMigrationFlow] = useState(false)
  const processedCredentialsRef = useRef<Set<string>>(new Set())
  const [liveMetrics, setLiveMetrics] = useState<LiveMetrics>({
    totalEncrypted: 0,
    storageNodes: 12,
    networkLatency: 45,
    encryptionStrength: 256,
    activeConnections: 8,
    dataTransferred: "2.4 MB",
    uptime: "99.98%"
  })

  // Check for new migrated credentials from URL params OR auto-encrypt
  useEffect(() => {
    // Parse URL parameters
    const urlParams = new URLSearchParams(window.location.search)
    const newCredentialId = urlParams.get('newCredential')
    const autoEncrypt = urlParams.get('autoEncrypt')
    const itemName = urlParams.get('itemName')
    const itemData = urlParams.get('itemData')
    const credentialId = urlParams.get('credentialId')
    
    if (autoEncrypt === 'true') {
      // Auto-encrypt flow - extract real credential data automatically  
      // Default to Google account (ID "2") if no credentialId provided
      const useCredentialId = credentialId || "2"
      
      // Check if this credential has already been processed to prevent duplicates
      const credentialKey = `autoEncrypt_${useCredentialId}`
      if (processedCredentialsRef.current.has(credentialKey)) {
        // Clean up URL if credential already processed
        setTimeout(() => {
          const newUrl = window.location.pathname + '?tab=showcase'
          window.history.replaceState({}, '', newUrl)
        }, 100)
        return
      }
      
      // Mark this credential as being processed
      processedCredentialsRef.current.add(credentialKey)
      
      toast({
        title: "� Credential Upgrade Started",
        description: `Encrypting credentials with Seal & Walrus`,
      })
      
      // Start the encryption process immediately with real data
      const realCredentialData = getCredentialData(useCredentialId)
      const realItemName = `${realCredentialData.name} Account`
      const realItemData = `Username: ${realCredentialData.username}\nPassword: ${realCredentialData.password}\nWebsite: ${realCredentialData.website}`
      
      toast({
        title: "🔄 Starting Encryption Process",
        description: `Encrypting ${realCredentialData.name} credentials with Seal & Walrus`,
      })
      
      encryptAndStore(realItemName, realItemData, 'credential')
      
      // Clean up URL
      setTimeout(() => {
        const newUrl = window.location.pathname + '?tab=showcase'
        window.history.replaceState({}, '', newUrl)
      }, 2000)
      
    } else if (newCredentialId) {
      // Original migration flow
      const exists = secureItems.some(item => item.id === newCredentialId)
      if (exists) return
      
      setShowMigrationFlow(true)
      
      // Get credential data
      const credentialData = getCredentialData(newCredentialId)
      
      const newMigratedCredential: SecureItem = {
        id: newCredentialId,
        name: `${credentialData.name} Account`,
        type: 'credential',
        encryptedData: `${credentialData.username}:${credentialData.password}`,
        originalData: `Username: ${credentialData.username}\nPassword: ${credentialData.password}\nWebsite: ${credentialData.website}`,
        blobId: "blob_" + Math.random().toString(36).substring(7),
        policyId: "policy_" + Math.random().toString(36).substring(7),
        status: 'stored',
        progress: 100,
        timestamp: new Date().toISOString(),
        size: "2.1 KB",
        threshold: "2/3",
        networkNodes: 5,
        encryptionMethod: "Seal AES-256-GCM"
      }
      
      // Add to both arrays
      setMigratedCredentials(prev => [newMigratedCredential, ...prev])
      setSecureItems(prev => [newMigratedCredential, ...prev])
      setLiveMetrics(prev => ({ ...prev, totalEncrypted: prev.totalEncrypted + 1 }))
      
      toast({
        title: "Credential Successfully Migrated!",
        description: `${credentialData.name} is now secured with Walrus & Seal technology`,
      })
      
      // Clean up URL
      setTimeout(() => {
        const newUrl = window.location.pathname + window.location.search.replace(/[?&]newCredential=[^&]*/, '').replace(/^&/, '?')
        window.history.replaceState({}, '', newUrl)
      }, 2000)
    }
  }, []) // Run once on mount and check for URL param

  const getCredentialData = (id: string) => {
    const credentialData: Record<string, any> = {
      "1": { name: "Dropbox", username: "wendy.c.appleseed@gmail.com", password: "MySecurePassword123!", website: "https://www.dropbox.com" },
      "2": { name: "Google", username: "wendy.c.appleseed@gmail.com", password: "GooglePass456@", website: "https://accounts.google.com" },
      "3": { name: "Facebook", username: "wendy.c.appleseed@gmail.com", password: "FacebookSecure789#", website: "https://www.facebook.com" },
      "4": { name: "Instagram", username: "wendy.appleseed", password: "InstaPass321$", website: "https://www.instagram.com" },
      "5": { name: "Netflix", username: "wendy.appleseed@gmail.com", password: "NetflixWatch999%", website: "https://www.netflix.com" },
      "6": { name: "Amazon", username: "wendy.c.appleseed@gmail.com", password: "AmazonShop888&", website: "https://www.amazon.com" },
      "7": { name: "Twitter", username: "wendy_appleseed", password: "TwitterPost777*", website: "https://twitter.com" },
      "8": { name: "Spotify", username: "wendy.appleseed@gmail.com", password: "SpotifyMusic555+", website: "https://www.spotify.com" },
      "9": { name: "eBay", username: "wendy.appleseed@gmail.com", password: "eBayBid222=", website: "https://www.ebay.com" }
    }
    return credentialData[id] || { name: "Unknown Service", username: "unknown@example.com", password: "********", website: "https://example.com" }
  }

  const getCredentialName = (id: string) => {
    const credentialNames: Record<string, string> = {
      "1": "Dropbox",
      "2": "Google", 
      "3": "Facebook",
      "4": "Instagram",
      "5": "Netflix",
      "6": "Amazon",
      "7": "Twitter",
      "8": "Spotify",
      "9": "eBay"
    }
    return credentialNames[id] || "Unknown Service"
  }

  // Simulate real-time network metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics(prev => ({
        ...prev,
        storageNodes: Math.floor(Math.random() * 5) + 10,
        networkLatency: Math.floor(Math.random() * 20) + 35,
        activeConnections: Math.floor(Math.random() * 4) + 6,
        dataTransferred: `${(parseFloat(prev.dataTransferred) + Math.random() * 0.1).toFixed(1)} MB`
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  // Enhanced encryption and storage simulation
  const encryptAndStore = async (name: string, data: string, type: SecureItem['type']) => {
    setIsProcessing(true)
    const newItem: SecureItem = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      type,
      encryptedData: "",
      originalData: data,
      status: 'encrypting',
      progress: 0,
      timestamp: new Date().toLocaleString(),
      size: `${(data.length * 1.5).toFixed(1)} KB`,
      threshold: "2/3",
      networkNodes: Math.floor(Math.random() * 5) + 8,
      encryptionMethod: "Seal Threshold Cryptography"
    }

    setSecureItems(prev => [...prev, newItem])

    // Stage 1: Encryption
    setProcessingStage("Initializing Seal encryption...")
    for (let progress = 0; progress <= 100; progress += 20) {
      await new Promise(resolve => setTimeout(resolve, 300))
      setSecureItems(prev => 
        prev.map(item => 
          item.id === newItem.id 
            ? { ...item, progress }
            : item
        )
      )
    }

    // Stage 2: Upload to Walrus
    setProcessingStage("Uploading to Walrus decentralized network...")
    setSecureItems(prev => 
      prev.map(item => 
        item.id === newItem.id 
          ? { ...item, status: 'uploading', progress: 0 }
          : item
      )
    )

    for (let progress = 0; progress <= 100; progress += 25) {
      await new Promise(resolve => setTimeout(resolve, 250))
      setSecureItems(prev => 
        prev.map(item => 
          item.id === newItem.id 
            ? { ...item, progress }
            : item
        )
      )
    }

    // Complete
    setSecureItems(prev => 
      prev.map(item => 
        item.id === newItem.id 
          ? { 
              ...item, 
              status: 'stored',
              progress: 100,
              encryptedData: btoa(data + "_encrypted_seal"),
              blobId: `blob_${Math.random().toString(36).substr(2, 12)}`,
              policyId: `policy_${Math.random().toString(36).substr(2, 10)}`
            }
          : item
      )
    )

    setLiveMetrics(prev => ({ 
      ...prev, 
      totalEncrypted: prev.totalEncrypted + 1,
      dataTransferred: `${(parseFloat(prev.dataTransferred) + (data.length / 1000)).toFixed(1)} MB`
    }))

    setIsProcessing(false)
    setProcessingStage("")
    
    toast({
      title: "🔐 Encryption & Storage Complete",
      description: `${name} has been secured using Seal encryption and stored on Walrus network`,
    })
  }

  // Auto-encrypt credential when upgrade happens (uses credentialId from URL or defaults to Google)
  const autoEncryptCredential = async (credentialId?: string) => {
    const useCredentialId = credentialId || "2" // Default to Google if no ID provided
    const credentialData = getCredentialData(useCredentialId)
    const itemName = `${credentialData.name} Account`
    const itemData = `Username: ${credentialData.username}\nPassword: ${credentialData.password}\nWebsite: ${credentialData.website}`
    
    toast({
      title: "🔄 Starting Encryption Process",
      description: `Encrypting ${credentialData.name} credentials with Seal & Walrus`,
    })
    
    // Auto-encrypt the credential
    await encryptAndStore(itemName, itemData, 'credential')
  }

  // Enhanced decryption simulation
  const decryptItem = async (item: SecureItem) => {
    setIsProcessing(true)
    
    // Stage 1: Download from Walrus
    setProcessingStage("Downloading from Walrus network...")
    setSecureItems(prev => 
      prev.map(i => 
        i.id === item.id 
          ? { ...i, status: 'downloading', progress: 0 }
          : i
      )
    )

    for (let progress = 0; progress <= 100; progress += 25) {
      await new Promise(resolve => setTimeout(resolve, 200))
      setSecureItems(prev => 
        prev.map(i => 
          i.id === item.id 
            ? { ...i, progress }
            : i
        )
      )
    }

    // Stage 2: Decryption
    setProcessingStage("Decrypting with Seal threshold cryptography...")
    setSecureItems(prev => 
      prev.map(i => 
        i.id === item.id 
          ? { ...i, status: 'decrypting', progress: 0 }
          : i
      )
    )

    for (let progress = 0; progress <= 100; progress += 20) {
      await new Promise(resolve => setTimeout(resolve, 200))
      setSecureItems(prev => 
        prev.map(i => 
          i.id === item.id 
            ? { ...i, progress }
            : i
        )
      )
    }

    setSecureItems(prev => 
      prev.map(i => 
        i.id === item.id 
          ? { ...i, status: 'ready', progress: 100 }
          : i
      )
    )

    setIsProcessing(false)
    setProcessingStage("")
    
    toast({
      title: "🔓 Decryption Complete",
      description: `${item.name} has been successfully decrypted using threshold cryptography`,
    })
  }

  const toggleDecryptedView = (itemId: string) => {
    setShowDecrypted(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "📋 Copied to clipboard",
      description: "Content has been copied to your clipboard",
    })
  }

  const handleAddSecureItem = () => {
    if (!newItemName.trim() || !newItemData.trim()) return
    
    encryptAndStore(newItemName, newItemData, 'note')
    setNewItemName("")
    setNewItemData("")
    setIsDialogOpen(false)
  }

  const getStatusColor = (status: SecureItem['status']) => {
    switch (status) {
      case 'encrypting': return 'text-orange-500 bg-orange-50 border-orange-200'
      case 'uploading': return 'text-blue-500 bg-blue-50 border-blue-200'
      case 'stored': return 'text-green-500 bg-green-50 border-green-200'
      case 'downloading': return 'text-purple-500 bg-purple-50 border-purple-200'
      case 'decrypting': return 'text-indigo-500 bg-indigo-50 border-indigo-200'
      case 'ready': return 'text-emerald-500 bg-emerald-50 border-emerald-200'
      default: return 'text-gray-500 bg-gray-50 border-gray-200'
    }
  }

  const getTypeIcon = (type: SecureItem['type']) => {
    switch (type) {
      case 'credential': return <Key className="h-4 w-4" />
      case 'document': return <Database className="h-4 w-4" />
      case 'note': return <Shield className="h-4 w-4" />
      case 'api-key': return <Cpu className="h-4 w-4" />
      default: return <Lock className="h-4 w-4" />
    }
  }

  const getProcessingIcon = (status: SecureItem['status']) => {
    switch (status) {
      case 'encrypting': return <Lock className="h-4 w-4 animate-pulse" />
      case 'uploading': return <Upload className="h-4 w-4 animate-bounce" />
      case 'downloading': return <Download className="h-4 w-4 animate-bounce" />
      case 'decrypting': return <Unlock className="h-4 w-4 animate-pulse" />
      default: return <CheckCircle className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Live Metrics */}
      <Card className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/50 dark:via-purple-950/50 dark:to-pink-950/50 border-blue-200 dark:border-blue-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 animate-pulse"></div>
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-3 text-3xl">
                <div className="relative">
                  <Sparkles className="h-8 w-8 text-blue-500 animate-pulse" />
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-ping"></div>
                </div>
                Advanced Security Platform
                <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white animate-pulse">
                  LIVE
                </Badge>
              </CardTitle>
              <CardDescription className="text-lg mt-3 text-gray-700 dark:text-gray-300">
                Next-generation security with decentralized storage and threshold encryption
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {liveMetrics.totalEncrypted}
              </div>
              <div className="text-sm text-muted-foreground">Items Secured</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/80 dark:bg-gray-800/80 rounded-xl backdrop-blur-sm border border-white/50 shadow-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Network className="h-6 w-6 text-green-500" />
                <span className="text-xl font-bold">{liveMetrics.storageNodes}</span>
              </div>
              <div className="text-xs text-muted-foreground font-medium">Storage Nodes</div>
              <div className="text-xs text-green-600">Active & Distributed</div>
            </div>
            <div className="text-center p-4 bg-white/80 dark:bg-gray-800/80 rounded-xl backdrop-blur-sm border border-white/50 shadow-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Activity className="h-6 w-6 text-blue-500" />
                <span className="text-xl font-bold">{liveMetrics.networkLatency}ms</span>
              </div>
              <div className="text-xs text-muted-foreground font-medium">Network Latency</div>
              <div className="text-xs text-blue-600">Ultra-Fast</div>
            </div>
            <div className="text-center p-4 bg-white/80 dark:bg-gray-800/80 rounded-xl backdrop-blur-sm border border-white/50 shadow-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Shield className="h-6 w-6 text-purple-500" />
                <span className="text-xl font-bold">{liveMetrics.encryptionStrength}</span>
              </div>
              <div className="text-xs text-muted-foreground font-medium">Bit Encryption</div>
              <div className="text-xs text-purple-600">Quantum-Safe</div>
            </div>
            <div className="text-center p-4 bg-white/80 dark:bg-gray-800/80 rounded-xl backdrop-blur-sm border border-white/50 shadow-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="h-6 w-6 text-orange-500" />
                <span className="text-xl font-bold">{liveMetrics.activeConnections}</span>
              </div>
              <div className="text-xs text-muted-foreground font-medium">Active Peers</div>
              <div className="text-xs text-orange-600">Global Network</div>
            </div>
          </div>
          
          {/* Live Processing Status */}
          {isProcessing && (
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-lg border border-blue-200 dark:border-blue-700">
              <div className="flex items-center gap-3">
                <div className="animate-spin">
                  <Cpu className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-blue-700 dark:text-blue-300">{processingStage}</div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">Sui blockchain securing your data...</div>
                </div>
              </div>
            </div>
          )}
          
          {/* Migration Flow Status */}
          {showMigrationFlow && !isProcessing && (
            <div className="mt-4 p-4 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/50 dark:to-blue-900/50 rounded-lg border border-green-200 dark:border-green-700">
              <div className="flex items-center gap-3">
                <div className="animate-pulse">
                  <Shield className="h-5 w-5 text-green-500" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-green-700 dark:text-green-300">Credential Upgrade in Progress</div>
                  <div className="text-sm text-green-600 dark:text-green-400">Preparing advanced security encryption...</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              disabled={isProcessing}
            >
              <Upload className="mr-2 h-5 w-5" />
              Encrypt & Store Data
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-500" />
                Secure Data Encryption
              </DialogTitle>
              <DialogDescription>
                Encrypt your sensitive data using threshold encryption and store securely
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="item-name">Item Name</Label>
                <Input 
                  id="item-name" 
                  placeholder="e.g., Secret API Key, Private Note"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="item-data">Sensitive Data</Label>
                <Textarea 
                  id="item-data" 
                  placeholder="Enter any sensitive information to encrypt and store securely..."
                  className="min-h-[120px] resize-none"
                  value={newItemData}
                  onChange={(e) => setNewItemData(e.target.value)}
                />
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 p-3 rounded-lg border border-blue-200 dark:border-blue-700">
                <div className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                  Security Features:
                </div>
                <ul className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
                  <li>• Seal threshold encryption (2/3 key shares required)</li>
                  <li>• Distributed storage across Walrus network nodes</li>
                  <li>• Immutable and tamper-proof on Sui blockchain</li>
                </ul>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                onClick={handleAddSecureItem}
                disabled={!newItemName.trim() || !newItemData.trim()}
              >
                Encrypt & Store
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button 
          variant="outline" 
          className="border-purple-200 text-purple-600 hover:bg-purple-50 shadow-md hover:shadow-lg transition-all duration-300"
        >
          <Cloud className="mr-2 h-4 w-4" />
          Network Analytics
        </Button>
        
        <Button 
          variant="outline" 
          className="border-blue-200 text-blue-600 hover:bg-blue-50 shadow-md hover:shadow-lg transition-all duration-300"
        >
          <Layers className="mr-2 h-4 w-4" />
          Security Stats
        </Button>
      </div>

      {/* Secure Items Display */}
      <Card className="border-2 border-dashed border-blue-200 dark:border-blue-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-6 w-6 text-blue-500" />
            Encrypted Vault Items
            <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
              {secureItems.length} Secured
            </Badge>
          </CardTitle>
          <CardDescription>
            Items protected by Seal threshold encryption and stored on Walrus decentralized network
          </CardDescription>
        </CardHeader>
        <CardContent>
          {secureItems.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <div className="relative mb-6">
                <Shield className="mx-auto h-16 w-16 opacity-30" />
                <div className="absolute -top-2 -right-2 h-6 w-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
              </div>
              <p className="text-xl font-medium mb-2">No encrypted items yet</p>
              <p className="text-sm mb-4">Secure your sensitive data with advanced encryption</p>
              <div className="space-y-2">
                <Button 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                  onClick={() => setIsDialogOpen(true)}
                >
                  Encrypt Your Data
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {secureItems.map((item) => (
                <div 
                  key={item.id}
                  className="group border-2 rounded-xl p-6 bg-gradient-to-r from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950 hover:from-blue-50 hover:via-purple-50 hover:to-pink-50 dark:hover:from-blue-950 dark:hover:via-purple-950 dark:hover:to-pink-950 transition-all duration-500 border-blue-200 dark:border-blue-700 hover:border-purple-300 dark:hover:border-purple-600 shadow-lg hover:shadow-xl"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <Avatar className="h-12 w-12 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-lg">
                        <AvatarFallback className="text-white font-bold">
                          {getTypeIcon(item.type)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200">{item.name}</h4>
                          <Badge variant="outline" className="capitalize font-medium">
                            {item.type.replace('-', ' ')}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className={`${getStatusColor(item.status)} font-medium`}
                          >
                            {getProcessingIcon(item.status)}
                            <span className="ml-1 capitalize">{item.status.replace('-', ' ')}</span>
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                          <div className="bg-white/60 dark:bg-gray-800/60 p-2 rounded-lg">
                            <span className="text-muted-foreground">Size: </span>
                            <span className="font-semibold">{item.size}</span>
                          </div>
                          <div className="bg-white/60 dark:bg-gray-800/60 p-2 rounded-lg">
                            <span className="text-muted-foreground">Threshold: </span>
                            <span className="font-semibold">{item.threshold}</span>
                          </div>
                          <div className="bg-white/60 dark:bg-gray-800/60 p-2 rounded-lg">
                            <span className="text-muted-foreground">Nodes: </span>
                            <span className="font-semibold">{item.networkNodes}</span>
                          </div>
                          <div className="bg-white/60 dark:bg-gray-800/60 p-2 rounded-lg">
                            <span className="text-muted-foreground">Method: </span>
                            <span className="font-semibold text-xs">Seal 256-bit</span>
                          </div>
                        </div>

                        {item.blobId && item.policyId && (
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-xs">
                            <div className="bg-green-50 dark:bg-green-950/30 p-2 rounded-lg border border-green-200 dark:border-green-700">
                              <span className="text-green-600 dark:text-green-400 font-medium">Walrus Blob ID: </span>
                              <code className="font-mono bg-green-100 dark:bg-green-900 px-1 rounded text-green-700 dark:text-green-300">
                                {item.blobId}
                              </code>
                            </div>
                            <div className="bg-purple-50 dark:bg-purple-950/30 p-2 rounded-lg border border-purple-200 dark:border-purple-700">
                              <span className="text-purple-600 dark:text-purple-400 font-medium">Seal Policy ID: </span>
                              <code className="font-mono bg-purple-100 dark:bg-purple-900 px-1 rounded text-purple-700 dark:text-purple-300">
                                {item.policyId}
                              </code>
                            </div>
                          </div>
                        )}

                        {(item.status === 'encrypting' || item.status === 'uploading' || item.status === 'downloading' || item.status === 'decrypting') && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm font-medium">
                              <span className="flex items-center gap-2">
                                {getProcessingIcon(item.status)}
                                {item.status === 'encrypting' && 'Encrypting with Seal...'}
                                {item.status === 'uploading' && 'Uploading to Walrus...'}
                                {item.status === 'downloading' && 'Downloading from Walrus...'}
                                {item.status === 'decrypting' && 'Decrypting with Seal...'}
                              </span>
                              <span className="text-blue-600 dark:text-blue-400">{item.progress}%</span>
                            </div>
                            <Progress value={item.progress} className="h-3 bg-gray-200 dark:bg-gray-700" />
                          </div>
                        )}

                        {item.status === 'ready' && showDecrypted[item.id] && (
                          <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 rounded-lg border-2 border-green-200 dark:border-green-700 shadow-inner">
                            <div className="flex items-center gap-2 mb-3">
                              <CheckCircle className="h-5 w-5 text-green-500" />
                              <span className="font-semibold text-green-700 dark:text-green-400">
                                Decrypted Content
                              </span>
                            </div>
                            <div className="bg-white/80 dark:bg-gray-800/80 p-3 rounded border border-green-300 dark:border-green-600">
                              <p className="font-mono text-sm break-all">
                                {item.originalData}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {item.status === 'stored' && (
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                          onClick={() => decryptItem(item)}
                          disabled={isProcessing}
                        >
                          <Unlock className="h-4 w-4 mr-1" />
                          Decrypt
                        </Button>
                      )}
                      
                      {item.status === 'ready' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleDecryptedView(item.id)}
                            className="text-green-600 border-green-200 hover:bg-green-50 shadow-md hover:shadow-lg transition-all duration-300"
                          >
                            {showDecrypted[item.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(item.originalData)}
                            className="text-purple-600 border-purple-200 hover:bg-purple-50 shadow-md hover:shadow-lg transition-all duration-300"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Migrated Credentials Section */}
      {migratedCredentials.length > 0 && (
        <div 
          className="spotlight-card group bg-blue-50/50 dark:bg-blue-950/20 backdrop-blur-sm border border-blue-200/60 dark:border-blue-700/30 rounded-2xl overflow-hidden transition-all duration-300 shadow-lg"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
            e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
          }}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Recently Migrated Credentials
              <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                <Sparkles className="h-3 w-3 mr-1" />
                Enhanced Security
              </Badge>
            </CardTitle>
            <CardDescription>
              Credentials successfully upgraded from traditional vault to advanced security
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {migratedCredentials.map((item) => (
                <div 
                  key={item.id} 
                  className="spotlight-card group bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 backdrop-blur-sm border border-green-200/60 dark:border-green-700/30 rounded-lg overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 relative shadow-sm hover:shadow-md"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
                    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
                  }}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                              {item.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-2 w-2 text-white" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium group-hover:text-blue-600 transition-colors duration-300">
                            {item.name} Credential
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Migrated • {item.encryptionMethod} • {item.threshold} threshold
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                          Secured
                        </Badge>
                        <div className="text-right text-xs text-muted-foreground">
                          <div>Blob ID: {item.blobId?.slice(0, 8)}...</div>
                          <div>Policy: {item.policyId?.slice(0, 8)}...</div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2 ml-2">
                          {item.status === 'stored' && (
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                              onClick={() => decryptItem(item)}
                              disabled={isProcessing}
                            >
                              <Unlock className="h-4 w-4 mr-1" />
                              Decrypt
                            </Button>
                          )}
                          
                          {item.status === 'ready' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => toggleDecryptedView(item.id)}
                                className="text-green-600 border-green-200 hover:bg-green-50 shadow-md hover:shadow-lg transition-all duration-300"
                              >
                                {showDecrypted[item.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyToClipboard(item.originalData)}
                                className="text-purple-600 border-purple-200 hover:bg-purple-50 shadow-md hover:shadow-lg transition-all duration-300"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Decrypted Content Display */}
                    {item.status === 'ready' && showDecrypted[item.id] && (
                      <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 rounded-lg border-2 border-green-200 dark:border-green-700 shadow-inner">
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span className="font-semibold text-green-700 dark:text-green-400">
                            Decrypted Credential Details
                          </span>
                        </div>
                        <div className="bg-white/80 dark:bg-gray-800/80 p-3 rounded border border-green-300 dark:border-green-600">
                          <p className="font-mono text-sm break-all">
                            {item.originalData}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Progress Bar for Decryption */}
                    {(item.status === 'downloading' || item.status === 'decrypting') && (
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm font-medium">
                          <span className="flex items-center gap-2">
                            {item.status === 'downloading' && 'Downloading from Walrus...'}
                            {item.status === 'decrypting' && 'Decrypting with Seal...'}
                          </span>
                          <span className="text-blue-600 dark:text-blue-400">{item.progress}%</span>
                        </div>
                        <Progress value={item.progress} className="h-3 bg-gray-200 dark:bg-gray-700" />
                      </div>
                    )}
                    
                    {/* Security Flow Visualization */}
                    <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30 rounded-lg border border-green-200 dark:border-green-700">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                          <span>Traditional Vault</span>
                        </div>
                        <ArrowRight className="h-3 w-3 text-gray-400" />
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
                          <span>Seal Encryption</span>
                        </div>
                        <ArrowRight className="h-3 w-3 text-gray-400" />
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-2 bg-purple-500 rounded-full animate-pulse"></div>
                          <span>Walrus Storage</span>
                        </div>
                        <ArrowRight className="h-3 w-3 text-gray-400" />
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                          <span>Advanced Vault</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </div>
      )}

      {/* Technology Deep Dive */}
      <Tabs defaultValue="walrus" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
          <TabsTrigger value="walrus" className="text-base font-semibold">Walrus Storage</TabsTrigger>
          <TabsTrigger value="seal" className="text-base font-semibold">Seal Encryption</TabsTrigger>
        </TabsList>
        
        <TabsContent value="walrus" className="space-y-6">
          <Card className="border-2 border-blue-200 dark:border-blue-700">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50">
              <CardTitle className="flex items-center gap-3 text-xl">
                <Cloud className="h-6 w-6 text-blue-500" />
                Walrus Decentralized Storage Network
                <Badge className="bg-blue-500 text-white">Live on Sui</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-xl border border-blue-200 dark:border-blue-700 shadow-lg">
                  <Network className="mx-auto h-10 w-10 text-blue-500 mb-3" />
                  <div className="text-lg font-bold text-blue-700 dark:text-blue-300">Decentralized</div>
                  <div className="text-sm text-blue-600 dark:text-blue-400 mt-2">No single point of failure across global nodes</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl border border-green-200 dark:border-green-700 shadow-lg">
                  <Zap className="mx-auto h-10 w-10 text-green-500 mb-3" />
                  <div className="text-lg font-bold text-green-700 dark:text-green-300">Lightning Fast</div>
                  <div className="text-sm text-green-600 dark:text-green-400 mt-2">Optimized retrieval with content addressing</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl border border-purple-200 dark:border-purple-700 shadow-lg">
                  <Shield className="mx-auto h-10 w-10 text-purple-500 mb-3" />
                  <div className="text-lg font-bold text-purple-700 dark:text-purple-300">Immutable</div>
                  <div className="text-sm text-purple-600 dark:text-purple-400 mt-2">Tamper-proof storage on Sui blockchain</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <div className="font-semibold text-blue-700 dark:text-blue-300 mb-1">How Walrus Works</div>
                    <div className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                      <p>• Data is distributed across multiple storage nodes for maximum availability</p>
                      <p>• Content-addressed storage ensures data integrity and deduplication</p>
                      <p>• Built on Sui blockchain for transparent and decentralized operation</p>
                      <p>• Automatic redundancy and self-healing network architecture</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border shadow-sm">
                  <div className="text-2xl font-bold text-blue-600">{liveMetrics.dataTransferred}</div>
                  <div className="text-xs text-muted-foreground">Data Transferred</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border shadow-sm">
                  <div className="text-2xl font-bold text-green-600">{liveMetrics.uptime}</div>
                  <div className="text-xs text-muted-foreground">Network Uptime</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border shadow-sm">
                  <div className="text-2xl font-bold text-purple-600">∞</div>
                  <div className="text-xs text-muted-foreground">Scalability</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border shadow-sm">
                  <div className="text-2xl font-bold text-orange-600">0</div>
                  <div className="text-xs text-muted-foreground">Single Points</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="seal" className="space-y-6">
          <Card className="border-2 border-purple-200 dark:border-purple-700">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50">
              <CardTitle className="flex items-center gap-3 text-xl">
                <Lock className="h-6 w-6 text-purple-500" />
                Seal Threshold Cryptography
                <Badge className="bg-purple-500 text-white">Quantum-Safe</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl border border-purple-200 dark:border-purple-700 shadow-lg">
                  <Key className="mx-auto h-10 w-10 text-purple-500 mb-3" />
                  <div className="text-lg font-bold text-purple-700 dark:text-purple-300">Threshold Keys</div>
                  <div className="text-sm text-purple-600 dark:text-purple-400 mt-2">Multiple key shares required for decryption</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 rounded-xl border border-red-200 dark:border-red-700 shadow-lg">
                  <Shield className="mx-auto h-10 w-10 text-red-500 mb-3" />
                  <div className="text-lg font-bold text-red-700 dark:text-red-300">Zero Trust</div>
                  <div className="text-sm text-red-600 dark:text-red-400 mt-2">No single entity can decrypt alone</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-950/30 dark:to-yellow-950/30 rounded-xl border border-orange-200 dark:border-orange-700 shadow-lg">
                  <Cpu className="mx-auto h-10 w-10 text-orange-500 mb-3" />
                  <div className="text-lg font-bold text-orange-700 dark:text-orange-300">Future-Proof</div>
                  <div className="text-sm text-orange-600 dark:text-orange-400 mt-2">Quantum-resistant encryption algorithms</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-purple-500 mt-0.5" />
                  <div>
                    <div className="font-semibold text-purple-700 dark:text-purple-300 mb-1">Threshold Cryptography</div>
                    <div className="text-sm text-purple-600 dark:text-purple-400 space-y-1">
                      <p>• Uses a 2/3 threshold scheme - at least 2 out of 3 key shares needed for decryption</p>
                      <p>• Each key share is distributed to different parties or systems</p>
                      <p>• Provides security even if one key share is compromised</p>
                      <p>• Built on mathematically proven cryptographic primitives</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border shadow-sm">
                  <div className="text-2xl font-bold text-purple-600">2/3</div>
                  <div className="text-xs text-muted-foreground">Threshold Ratio</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border shadow-sm">
                  <div className="text-2xl font-bold text-blue-600">256</div>
                  <div className="text-xs text-muted-foreground">Bit Encryption</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border shadow-sm">
                  <div className="text-2xl font-bold text-green-600">∞</div>
                  <div className="text-xs text-muted-foreground">Years to Break</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border shadow-sm">
                  <div className="text-2xl font-bold text-orange-600">✓</div>
                  <div className="text-xs text-muted-foreground">Quantum Safe</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
