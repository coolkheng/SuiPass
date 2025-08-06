"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Eye, EyeOff, Copy, Edit, Save, X, Star, Clock, Globe, Shield, Key, Timer } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

// Sample credential data (in a real app, this would come from an API)
const sampleCredentials = {
  "1": {
    id: "1",
    name: "Dropbox",
    username: "wendy.c.appleseed@gmail.com",
    password: "MySecurePassword123!",
    website: "https://www.dropbox.com/account/security",
    category: "Others",
    isFavorite: true,
    lastUsed: "2 days ago",
    lastEdited: "Wednesday, August 7, 2024 at 8:20:04 PM",
    icon: "https://logo.clearbit.com/dropbox.com",
    color: "bg-blue-500",
    notes: "Personal cloud storage account",
    twoFactorEnabled: true,
    totpCode: "871 • 945",
    totpTimer: 27,
    passwordStrength: "Fantastic",
  },
  "2": {
    id: "2",
    name: "Google",
    username: "wendy.c.appleseed@gmail.com",
    password: "GooglePass456!",
    website: "https://accounts.google.com",
    category: "Others",
    isFavorite: true,
    lastUsed: "1 hour ago",
    lastEdited: "Tuesday, August 6, 2024 at 3:15:22 PM",
    icon: "https://logo.clearbit.com/google.com",
    color: "bg-red-500",
    notes: "Main Google account",
    twoFactorEnabled: false,
    passwordStrength: "Good",
  },
  "3": {
    id: "3",
    name: "Facebook",
    username: "wendy.c.appleseed@gmail.com",
    password: "FacebookSecure789!",
    website: "https://www.facebook.com",
    category: "Social Media",
    isFavorite: false,
    lastUsed: "1 week ago",
    lastEdited: "Monday, August 5, 2024 at 10:30:15 AM",
    icon: "https://logo.clearbit.com/facebook.com",
    color: "bg-blue-600",
    notes: "Personal Facebook account",
    twoFactorEnabled: true,
    totpCode: "456 • 789",
    totpTimer: 18,
    passwordStrength: "Good",
  },
  "4": {
    id: "4",
    name: "Instagram",
    username: "wendy.appleseed",
    password: "InstaPass321!",
    website: "https://www.instagram.com",
    category: "Social Media",
    isFavorite: false,
    lastUsed: "3 days ago",
    lastEdited: "Sunday, August 4, 2024 at 4:45:30 PM",
    icon: "https://logo.clearbit.com/instagram.com",
    color: "bg-pink-500",
    notes: "Personal Instagram account",
    twoFactorEnabled: false,
    passwordStrength: "Fair",
  },
  "5": {
    id: "5",
    name: "Netflix",
    username: "wendy.appleseed@gmail.com",
    password: "NetflixWatch456!",
    website: "https://www.netflix.com",
    category: "Entertainment",
    isFavorite: true,
    lastUsed: "Yesterday",
    lastEdited: "Saturday, August 3, 2024 at 7:20:45 PM",
    icon: "https://logo.clearbit.com/netflix.com",
    color: "bg-red-600",
    notes: "Family Netflix account",
    twoFactorEnabled: false,
    passwordStrength: "Good",
  },
  "6": {
    id: "6",
    name: "Amazon",
    username: "wendy.c.appleseed@gmail.com",
    password: "AmazonShop789!",
    website: "https://www.amazon.com",
    category: "Shopping",
    isFavorite: false,
    lastUsed: "5 days ago",
    lastEdited: "Friday, August 2, 2024 at 2:15:20 PM",
    icon: "https://logo.clearbit.com/amazon.com",
    color: "bg-orange-500",
    notes: "Primary Amazon shopping account",
    twoFactorEnabled: true,
    totpCode: "123 • 456",
    totpTimer: 12,
    passwordStrength: "Good",
  },
  "7": {
    id: "7",
    name: "Twitter",
    username: "wendy_appleseed",
    password: "TwitterPost123!",
    website: "https://twitter.com",
    category: "Social Media",
    isFavorite: false,
    lastUsed: "4 days ago",
    lastEdited: "Thursday, August 1, 2024 at 11:30:10 AM",
    icon: "https://logo.clearbit.com/twitter.com",
    color: "bg-blue-400",
    notes: "Personal Twitter account",
    twoFactorEnabled: false,
    passwordStrength: "Fair",
  },
  "8": {
    id: "8",
    name: "Spotify",
    username: "wendy.appleseed@gmail.com",
    password: "SpotifyMusic456!",
    website: "https://www.spotify.com",
    category: "Entertainment",
    isFavorite: false,
    lastUsed: "6 days ago",
    lastEdited: "Wednesday, July 31, 2024 at 6:45:25 PM",
    icon: "https://logo.clearbit.com/spotify.com",
    color: "bg-green-500",
    notes: "Premium Spotify account",
    twoFactorEnabled: false,
    passwordStrength: "Good",
  },
  "9": {
    id: "9",
    name: "eBay",
    username: "wendy.appleseed@gmail.com",
    password: "eBayBid789!",
    website: "https://www.ebay.com",
    category: "Shopping",
    isFavorite: false,
    lastUsed: "1 week ago",
    lastEdited: "Tuesday, July 30, 2024 at 3:20:15 PM",
    icon: "https://logo.clearbit.com/ebay.com",
    color: "bg-yellow-500",
    notes: "eBay selling and buying account",
    twoFactorEnabled: false,
    passwordStrength: "Fair",
  },
}

interface PersonalCredentialDetailProps {
  credentialId: string
}

export function PersonalCredentialDetail({ credentialId }: PersonalCredentialDetailProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [credential, setCredential] = useState(sampleCredentials[credentialId as keyof typeof sampleCredentials])

  if (!credential) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center">
        <Shield className="h-10 w-10 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">Credential not found</h3>
        <p className="text-sm text-muted-foreground">The requested credential could not be found.</p>
        <Link href="/dashboard/personal">
          <Button className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Personal Vault
          </Button>
        </Link>
      </div>
    )
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  const handleSave = () => {
    setIsEditing(false)
    // In a real app, you would save to an API here
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset any changes
  }

  const toggleFavorite = () => {
    setCredential(prev => ({ ...prev, isFavorite: !prev.isFavorite }))
  }

  const getPasswordStrengthColor = (strength: string) => {
    switch (strength) {
      case "Fantastic":
        return "text-green-600"
      case "Good":
        return "text-blue-600"
      case "Fair":
        return "text-yellow-600"
      case "Weak":
        return "text-red-600"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/personal">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to Personal Vault</span>
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={credential.icon || "/placeholder.svg"} alt={credential.name} />
              <AvatarFallback className={credential.color}>
                {credential.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{credential.name}</h1>
              <p className="text-muted-foreground">{credential.category}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleFavorite}>
            <Star className={`h-4 w-4 ${credential.isFavorite ? 'text-yellow-500 fill-current' : 'text-muted-foreground'}`} />
            <span className="sr-only">Toggle favorite</span>
          </Button>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Credential Details */}
          <Card>
            <CardHeader>
              <CardTitle>Credential Details</CardTitle>
              <CardDescription>
                {isEditing ? "Edit your credential information" : "View your stored credential information"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                {isEditing ? (
                  <Input
                    id="username"
                    value={credential.username}
                    onChange={(e) => setCredential(prev => ({ ...prev, username: e.target.value }))}
                  />
                ) : (
                  <div className="flex items-center justify-between rounded-md border p-3">
                    <span className="font-mono">{credential.username}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => copyToClipboard(credential.username)}
                    >
                      <Copy className="h-4 w-4" />
                      <span className="sr-only">Copy username</span>
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                {isEditing ? (
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={credential.password}
                    onChange={(e) => setCredential(prev => ({ ...prev, password: e.target.value }))}
                  />
                ) : (
                  <div className="flex items-center justify-between rounded-md border p-3">
                    <span className="font-mono">
                      {showPassword ? credential.password : "••••••••••"}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className={`text-sm font-medium ${getPasswordStrengthColor(credential.passwordStrength)}`}>
                        {credential.passwordStrength}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">Toggle password visibility</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => copyToClipboard(credential.password)}
                      >
                        <Copy className="h-4 w-4" />
                        <span className="sr-only">Copy password</span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {credential.twoFactorEnabled && credential.totpCode && (
                <div className="space-y-2">
                  <Label>One-time Password</Label>
                  <div className="flex items-center justify-between rounded-md border p-3 bg-muted/50">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-lg font-bold">{credential.totpCode}</span>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Timer className="h-3 w-3" />
                        <span>{credential.totpTimer}s</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => copyToClipboard(credential.totpCode.replace(" • ", ""))}
                    >
                      <Copy className="h-4 w-4" />
                      <span className="sr-only">Copy TOTP code</span>
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                {isEditing ? (
                  <Input
                    id="website"
                    value={credential.website}
                    onChange={(e) => setCredential(prev => ({ ...prev, website: e.target.value }))}
                  />
                ) : (
                  <div className="flex items-center justify-between rounded-md border p-3">
                    <a
                      href={credential.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-mono"
                    >
                      {credential.website}
                    </a>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => window.open(credential.website, '_blank')}
                      >
                        <Globe className="h-4 w-4" />
                        <span className="sr-only">Open website</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => copyToClipboard(credential.website)}
                      >
                        <Copy className="h-4 w-4" />
                        <span className="sr-only">Copy website URL</span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {isEditing && (
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={credential.category}
                    onValueChange={(value) => setCredential(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Social Media">Social Media</SelectItem>
                      <SelectItem value="Entertainment">Entertainment</SelectItem>
                      <SelectItem value="Shopping">Shopping</SelectItem>
                      <SelectItem value="Others">Others</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Info */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{credential.category}</Badge>
                {credential.isFavorite && (
                  <Badge variant="secondary">
                    <Star className="mr-1 h-3 w-3" />
                    Favorite
                  </Badge>
                )}
              </div>
              
              <Separator />
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Last used:</span>
                  <span>{credential.lastUsed}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Edit className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Last edited:</span>
                </div>
                <div className="text-xs text-muted-foreground ml-6">
                  {credential.lastEdited}
                </div>
                
                {credential.twoFactorEnabled && (
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="text-green-600">2FA Enabled</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Password Strength</span>
                <span className={`text-sm font-medium ${getPasswordStrengthColor(credential.passwordStrength)}`}>
                  {credential.passwordStrength}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Two-Factor Auth</span>
                <span className={`text-sm ${credential.twoFactorEnabled ? 'text-green-600' : 'text-muted-foreground'}`}>
                  {credential.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              
              <Button variant="outline" size="sm" className="w-full">
                <Key className="mr-2 h-4 w-4" />
                Generate New Password
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
