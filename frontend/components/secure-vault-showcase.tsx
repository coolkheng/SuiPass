"use client"

import { useState, useEffect } from "react"
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
  Sparkles
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

// Simulated encryption/decryption process for demo
interface SecureItem {
  id: string
  name: string
  type: 'credential' | 'document' | 'note'
  encryptedData: string
  blobId?: string
  policyId?: string
  status: 'encrypting' | 'stored' | 'decrypting' | 'ready'
  progress: number
  timestamp: string
  size: string
  threshold: string
}

export function SecureVaultShowcase() {
  const { toast } = useToast()
  const [secureItems, setSecureItems] = useState<SecureItem[]>([])
  const [isEncrypting, setIsEncrypting] = useState(false)
  const [isDecrypting, setIsDecrypting] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<SecureItem | null>(null)
  const [newItemData, setNewItemData] = useState("")
  const [newItemName, setNewItemName] = useState("")
  const [showDecrypted, setShowDecrypted] = useState<Record<string, boolean>>({})
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [realTimeStats, setRealTimeStats] = useState({
    totalEncrypted: 0,
    storageNodes: 12,
    networkLatency: 45,
    encryptionStrength: 256
  })

  // Simulate real-time network stats
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeStats(prev => ({
        ...prev,
        storageNodes: Math.floor(Math.random() * 5) + 10,
        networkLatency: Math.floor(Math.random() * 20) + 35,
        encryptionStrength: 256 // Always secure
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Simulate the encryption and storage process
  const encryptAndStore = async (name: string, data: string, type: SecureItem['type']) => {
    setIsEncrypting(true)
    const newItem: SecureItem = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      type,
      encryptedData: data,
      status: 'encrypting',
      progress: 0,
      timestamp: new Date().toLocaleString(),
      size: `${(data.length * 1.5).toFixed(1)} KB`,
      threshold: "2/3"
    }

    setSecureItems(prev => [...prev, newItem])

    // Simulate encryption progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 200))
      setSecureItems(prev => 
        prev.map(item => 
          item.id === newItem.id 
            ? { ...item, progress, status: progress === 100 ? 'stored' : 'encrypting' }
            : item
        )
      )
    }

    // Simulate getting blob and policy IDs
    setTimeout(() => {
      setSecureItems(prev => 
        prev.map(item => 
          item.id === newItem.id 
            ? { 
                ...item, 
                blobId: `blob_${Math.random().toString(36).substr(2, 12)}`,
                policyId: `policy_${Math.random().toString(36).substr(2, 10)}`
              }
            : item
        )
      )
      setRealTimeStats(prev => ({ ...prev, totalEncrypted: prev.totalEncrypted + 1 }))
    }, 500)

    setIsEncrypting(false)
    toast({
      title: "🔐 Encryption Complete",
      description: `${name} has been securely encrypted and stored on Walrus network`,
    })
  }

  // Simulate decryption process
  const decryptItem = async (item: SecureItem) => {
    setIsDecrypting(item.id)
    
    // Simulate decryption progress
    setSecureItems(prev => 
      prev.map(i => 
        i.id === item.id 
          ? { ...i, status: 'decrypting', progress: 0 }
          : i
      )
    )

    for (let progress = 0; progress <= 100; progress += 15) {
      await new Promise(resolve => setTimeout(resolve, 150))
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

    setIsDecrypting(null)
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
      title: "Copied to clipboard",
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
      case 'encrypting': return 'text-orange-500'
      case 'stored': return 'text-green-500'
      case 'decrypting': return 'text-blue-500'
      case 'ready': return 'text-emerald-500'
      default: return 'text-gray-500'
    }
  }

  const getTypeIcon = (type: SecureItem['type']) => {
    switch (type) {
      case 'credential': return <Key className="h-4 w-4" />
      case 'document': return <Database className="h-4 w-4" />
      case 'note': return <Shield className="h-4 w-4" />
      default: return <Lock className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Real-time Stats */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border-blue-200 dark:border-blue-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Sparkles className="h-6 w-6 text-blue-500" />
                Secure Vault Powered by Walrus & Seal
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                Decentralized storage with threshold encryption on Sui blockchain
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {realTimeStats.totalEncrypted}
              </div>
              <div className="text-sm text-muted-foreground">Items Secured</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg backdrop-blur-sm">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Network className="h-5 w-5 text-green-500" />
                <span className="font-semibold">{realTimeStats.storageNodes}</span>
              </div>
              <div className="text-xs text-muted-foreground">Storage Nodes</div>
            </div>
            <div className="text-center p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg backdrop-blur-sm">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Activity className="h-5 w-5 text-blue-500" />
                <span className="font-semibold">{realTimeStats.networkLatency}ms</span>
              </div>
              <div className="text-xs text-muted-foreground">Network Latency</div>
            </div>
            <div className="text-center p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg backdrop-blur-sm">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-purple-500" />
                <span className="font-semibold">{realTimeStats.encryptionStrength}-bit</span>
              </div>
              <div className="text-xs text-muted-foreground">Encryption</div>
            </div>
            <div className="text-center p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg backdrop-blur-sm">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Globe className="h-5 w-5 text-orange-500" />
                <span className="font-semibold">99.9%</span>
              </div>
              <div className="text-xs text-muted-foreground">Availability</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
              <Upload className="mr-2 h-4 w-4" />
              Encrypt & Store on Walrus
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>🔐 Secure Encryption Demo</DialogTitle>
              <DialogDescription>
                Experience threshold encryption with Seal and decentralized storage on Walrus
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="item-name">Item Name</Label>
                <Input 
                  id="item-name" 
                  placeholder="e.g., Secret Note, API Key"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="item-data">Sensitive Data</Label>
                <Textarea 
                  id="item-data" 
                  placeholder="Enter any sensitive information to encrypt..."
                  className="min-h-[100px]"
                  value={newItemData}
                  onChange={(e) => setNewItemData(e.target.value)}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                ⚡ This will be encrypted using Seal's threshold cryptography and stored on Walrus decentralized network
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
                🔐 Encrypt & Store
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
          <Cloud className="mr-2 h-4 w-4" />
          Walrus Network Status
        </Button>
        
        <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
          <Cpu className="mr-2 h-4 w-4" />
          Seal Cryptography Info
        </Button>
      </div>

      {/* Secure Items List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Encrypted Vault Items
          </CardTitle>
          <CardDescription>
            Items secured with threshold encryption and stored on decentralized Walrus network
          </CardDescription>
        </CardHeader>
        <CardContent>
          {secureItems.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Shield className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p className="text-lg">No encrypted items yet</p>
              <p className="text-sm">Add some sensitive data to see the encryption magic! ✨</p>
            </div>
          ) : (
            <div className="space-y-4">
              {secureItems.map((item) => (
                <div 
                  key={item.id}
                  className="group border rounded-lg p-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950 dark:hover:to-purple-950 transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <Avatar className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-500">
                        <AvatarFallback className="text-white">
                          {getTypeIcon(item.type)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{item.name}</h4>
                          <Badge variant="outline" className="capitalize">
                            {item.type}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className={`${getStatusColor(item.status)} border-current`}
                          >
                            {item.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">Size: </span>
                            <span className="font-medium">{item.size}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Threshold: </span>
                            <span className="font-medium">{item.threshold}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Created: </span>
                            <span className="font-medium">{item.timestamp}</span>
                          </div>
                          {item.blobId && (
                            <div>
                              <span className="text-muted-foreground">Blob ID: </span>
                              <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded">
                                {item.blobId.substring(0, 8)}...
                              </span>
                            </div>
                          )}
                        </div>

                        {(item.status === 'encrypting' || item.status === 'decrypting') && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>{item.status === 'encrypting' ? 'Encrypting...' : 'Decrypting...'}</span>
                              <span>{item.progress}%</span>
                            </div>
                            <Progress value={item.progress} className="h-2" />
                          </div>
                        )}

                        {item.status === 'ready' && showDecrypted[item.id] && (
                          <div className="mt-3 p-3 bg-white/80 dark:bg-gray-800/80 rounded border border-green-200 dark:border-green-700">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm font-medium text-green-700 dark:text-green-400">
                                Decrypted Content
                              </span>
                            </div>
                            <p className="text-sm font-mono bg-gray-100 dark:bg-gray-700 p-2 rounded">
                              {item.encryptedData}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-1">
                      {item.status === 'stored' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => decryptItem(item)}
                          disabled={isDecrypting === item.id}
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          <Unlock className="h-3 w-3 mr-1" />
                          Decrypt
                        </Button>
                      )}
                      
                      {item.status === 'ready' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleDecryptedView(item.id)}
                            className="text-green-600 border-green-200 hover:bg-green-50"
                          >
                            {showDecrypted[item.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(item.encryptedData)}
                            className="text-purple-600 border-purple-200 hover:bg-purple-50"
                          >
                            <Copy className="h-3 w-3" />
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

      {/* Technology Showcase */}
      <Tabs defaultValue="walrus" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="walrus">🐋 Walrus Storage</TabsTrigger>
          <TabsTrigger value="seal">🔐 Seal Encryption</TabsTrigger>
        </TabsList>
        
        <TabsContent value="walrus" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="h-5 w-5 text-blue-500" />
                Walrus Decentralized Storage Network
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <Network className="mx-auto h-8 w-8 text-blue-500 mb-2" />
                  <div className="font-semibold">Decentralized</div>
                  <div className="text-sm text-muted-foreground">No single point of failure</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                  <Zap className="mx-auto h-8 w-8 text-green-500 mb-2" />
                  <div className="font-semibold">Fast Retrieval</div>
                  <div className="text-sm text-muted-foreground">Optimized for speed</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                  <Shield className="mx-auto h-8 w-8 text-purple-500 mb-2" />
                  <div className="font-semibold">Immutable</div>
                  <div className="text-sm text-muted-foreground">Tamper-proof storage</div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                <AlertCircle className="inline h-4 w-4 mr-1" />
                Data is distributed across multiple storage nodes for maximum availability and redundancy.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="seal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-purple-500" />
                Seal Threshold Cryptography
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                  <Key className="mx-auto h-8 w-8 text-purple-500 mb-2" />
                  <div className="font-semibold">Threshold Keys</div>
                  <div className="text-sm text-muted-foreground">Multiple keys required</div>
                </div>
                <div className="text-center p-4 bg-red-50 dark:bg-red-950/30 rounded-lg">
                  <Shield className="mx-auto h-8 w-8 text-red-500 mb-2" />
                  <div className="font-semibold">Zero Trust</div>
                  <div className="text-sm text-muted-foreground">No single key holder</div>
                </div>
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                  <Cpu className="mx-auto h-8 w-8 text-orange-500 mb-2" />
                  <div className="font-semibold">Quantum Safe</div>
                  <div className="text-sm text-muted-foreground">Future-proof encryption</div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                <AlertCircle className="inline h-4 w-4 mr-1" />
                Each encryption uses a 2/3 threshold scheme - at least 2 out of 3 key shares are needed for decryption.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
