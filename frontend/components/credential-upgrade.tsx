"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Lock, Key, Database, ArrowRight, CheckCircle, Sparkles, Eye, EyeOff, Copy, ArrowLeft } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface CredentialUpgradeProps {
  credential: {
    id: string
    name: string
    username: string
    password: string
    website?: string
    category: string
    icon?: string
    color: string
  }
}

export function CredentialUpgrade({ credential }: CredentialUpgradeProps) {
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState<'details' | 'upgrading' | 'complete'>('details')
  const router = useRouter()

  const handleUpgrade = async () => {
    // Immediately redirect to advanced security page with auto-encrypt params
    const params = new URLSearchParams({
      tab: 'showcase',
      autoEncrypt: 'true',
      itemName: credential.name,
      itemData: `Username: ${credential.username}\nPassword: ${credential.password}`,
      credentialId: credential.id
    })
    
    router.push(`/dashboard/personal?${params.toString()}`)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  if (step === 'upgrading') {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
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
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Shield className="h-6 w-6 text-blue-500 animate-pulse" />
              Upgrading to Advanced Security
            </CardTitle>
            <CardDescription>
              Migrating {credential.name} to Walrus & Seal encryption
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              {/* Progress Steps */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm">Encrypting credential data...</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm">Generating Seal encryption keys...</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm">Storing on Walrus network...</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 bg-gray-300 rounded-full"></div>
                  <span className="text-sm text-muted-foreground">Finalizing security protocols...</span>
                </div>
              </div>

              {/* Visual Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
              </div>
            </div>
          </CardContent>
        </div>
      </div>
    )
  }

  if (step === 'complete') {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
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
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl text-green-600">
              <CheckCircle className="h-6 w-6" />
              Upgrade Complete!
            </CardTitle>
            <CardDescription>
              {credential.name} is now secured with Walrus & Seal technology
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Redirecting to Advanced Security showcase...
              </div>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              </div>
            </div>
          </CardContent>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/personal">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Vault
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Credential Details</h1>
          <p className="text-muted-foreground">Upgrade to advanced security</p>
        </div>
      </div>

      {/* Credential Details */}
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
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={credential.icon || "/placeholder.svg"} alt={credential.name} />
              <AvatarFallback className={credential.color}>
                {credential.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{credential.name}</CardTitle>
              <CardDescription>
                <Badge variant="outline">{credential.category}</Badge>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Credential Info */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Username/Email</label>
                <div className="flex items-center gap-2 mt-1">
                  <div className="font-mono text-sm">{credential.username}</div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => copyToClipboard(credential.username)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Password</label>
                <div className="flex items-center gap-2 mt-1">
                  <div className="font-mono text-sm">
                    {showPassword ? credential.password : "••••••••••"}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => copyToClipboard(credential.password)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
            {credential.website && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Website</label>
                <div className="mt-1">
                  <a href={credential.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    {credential.website}
                  </a>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </div>

      {/* Upgrade Section */}
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
            <Shield className="h-5 w-5 text-blue-500" />
            Upgrade to Advanced Security
            <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <Sparkles className="h-3 w-3 mr-1" />
              Recommended
            </Badge>
          </CardTitle>
          <CardDescription>
            Enhance your credential security with Walrus decentralized storage and Seal threshold encryption
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Security Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-blue-50/50 dark:bg-blue-950/20">
              <Database className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-medium">Walrus Storage</h3>
              <p className="text-xs text-muted-foreground">Decentralized, redundant storage</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-blue-50/50 dark:bg-blue-950/20">
              <Key className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-medium">Seal Encryption</h3>
              <p className="text-xs text-muted-foreground">Threshold cryptography</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-blue-50/50 dark:bg-blue-950/20">
              <Lock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-medium">Zero Trust</h3>
              <p className="text-xs text-muted-foreground">Client-side encryption</p>
            </div>
          </div>

          {/* Upgrade Benefits */}
          <div className="space-y-3">
            <h4 className="font-medium">What you'll get:</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Military-grade threshold encryption</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Decentralized storage across Walrus network</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Quantum-resistant security protocols</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Cross-device synchronization</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Advanced access controls</span>
              </li>
            </ul>
          </div>

          {/* Upgrade Button */}
          <div className="flex gap-3">
            <Button 
              onClick={handleUpgrade}
              disabled={isUpgrading}
              className="btn-blue-gradient flex-1"
            >
              {isUpgrading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Upgrading...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Upgrade to Advanced Security
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </div>
    </div>
  )
}
