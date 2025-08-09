"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Star, Clock, Eye, EyeOff, Copy, Edit, Trash2, Shield } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample credential data
const sampleCredentials = [
  {
    id: "1",
    name: "Dropbox",
    username: "wendy.c.appleseed@gmail.com",
    password: "••••••••••",
    website: "https://www.dropbox.com",
    category: "Others",
    isFavorite: true,
    lastUsed: "2 days ago",
    icon: "https://logo.clearbit.com/dropbox.com",
    color: "bg-blue-500",
  },
  {
    id: "2",
    name: "Google",
    username: "wendy.c.appleseed@gmail.com",
    password: "••••••••••",
    website: "https://accounts.google.com",
    category: "Others",
    isFavorite: true,
    lastUsed: "1 hour ago",
    icon: "https://logo.clearbit.com/google.com",
    color: "bg-red-500",
  },
  {
    id: "3",
    name: "Facebook",
    username: "wendy.c.appleseed@gmail.com",
    password: "••••••••••",
    website: "https://www.facebook.com",
    category: "Social Media",
    isFavorite: false,
    lastUsed: "1 week ago",
    icon: "https://logo.clearbit.com/facebook.com",
    color: "bg-blue-600",
  },
  {
    id: "4",
    name: "Instagram",
    username: "wendy.appleseed",
    password: "••••••••••",
    website: "https://www.instagram.com",
    category: "Social Media",
    isFavorite: false,
    lastUsed: "3 days ago",
    icon: "https://logo.clearbit.com/instagram.com",
    color: "bg-pink-500",
  },
  {
    id: "5",
    name: "Netflix",
    username: "wendy.appleseed@gmail.com",
    password: "••••••••••",
    website: "https://www.netflix.com",
    category: "Entertainment",
    isFavorite: true,
    lastUsed: "Yesterday",
    icon: "https://logo.clearbit.com/netflix.com",
    color: "bg-red-600",
  },
  {
    id: "6",
    name: "Amazon",
    username: "wendy.c.appleseed@gmail.com",
    password: "••••••••••",
    website: "https://www.amazon.com",
    category: "Shopping",
    isFavorite: false,
    lastUsed: "5 days ago",
    icon: "https://logo.clearbit.com/amazon.com",
    color: "bg-orange-500",
  },
  {
    id: "7",
    name: "Twitter",
    username: "wendy_appleseed",
    password: "••••••••••",
    website: "https://twitter.com",
    category: "Social Media",
    isFavorite: false,
    lastUsed: "4 days ago",
    icon: "https://logo.clearbit.com/twitter.com",
    color: "bg-blue-400",
  },
  {
    id: "8",
    name: "Spotify",
    username: "wendy.appleseed@gmail.com",
    password: "••••••••••",
    website: "https://www.spotify.com",
    category: "Entertainment",
    isFavorite: false,
    lastUsed: "6 days ago",
    icon: "https://logo.clearbit.com/spotify.com",
    color: "bg-green-500",
  },
  {
    id: "9",
    name: "eBay",
    username: "wendy.appleseed@gmail.com",
    password: "••••••••••",
    website: "https://www.ebay.com",
    category: "Shopping",
    isFavorite: false,
    lastUsed: "1 week ago",
    icon: "https://logo.clearbit.com/ebay.com",
    color: "bg-yellow-500",
  },
]

const categories = ["All", "Social Media", "Entertainment", "Shopping", "Others"]

export function PersonalVault() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [credentials, setCredentials] = useState(sampleCredentials)
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({})

  // Filter credentials based on search and category
  const filteredCredentials = credentials.filter((cred) => {
    const matchesSearch =
      cred.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cred.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cred.category.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === "All" || cred.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const favoriteCredentials = filteredCredentials.filter((cred) => cred.isFavorite)
  const recentCredentials = filteredCredentials
    .filter((cred) => !cred.isFavorite)
    .sort((a, b) => {
      // Simple sorting by last used (in a real app, you'd use actual dates)
      const order = ["1 hour ago", "Yesterday", "2 days ago", "3 days ago", "4 days ago", "5 days ago", "6 days ago", "1 week ago"]
      return order.indexOf(a.lastUsed) - order.indexOf(b.lastUsed)
    })
    .slice(0, 6)

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  return (
    <div className="space-y-6">
      {/* Search and Add Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search credentials..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-blue-gradient">
              <Plus className="mr-2 h-4 w-4" />
              Add Credential
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Credential</DialogTitle>
              <DialogDescription>Add a new password or credential to your personal vault.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="service-name">Service Name</Label>
                <Input id="service-name" placeholder="e.g., Facebook, Instagram" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username/Email</Label>
                <Input id="username" placeholder="your.email@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Enter password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website (Optional)</Label>
                <Input id="website" placeholder="https://example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Social Media">Social Media</SelectItem>
                    <SelectItem value="Entertainment">Entertainment</SelectItem>
                    <SelectItem value="Shopping">Shopping</SelectItem>
                    <SelectItem value="Others">Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="btn-blue-gradient" onClick={() => setIsAddDialogOpen(false)}>Add Credential</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            className={selectedCategory === category ? "btn-blue-gradient" : ""}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Favorites Section */}
      {favoriteCredentials.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <CardTitle>Favorites</CardTitle>
            </div>
            <CardDescription>Your most frequently used credentials</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {favoriteCredentials.map((cred) => (
                <Link key={cred.id} href={`/dashboard/personal/${cred.id}`}>
                  <div 
                    className="spotlight-card group bg-blue-50/50 dark:bg-blue-950/20 backdrop-blur-sm border border-blue-200/60 dark:border-blue-700/30 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:border-blue-300/80 dark:hover:border-blue-600/50 cursor-pointer relative shadow-sm hover:shadow-lg"
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const y = e.clientY - rect.top;
                      e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
                      e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
                    }}
                  >
                    <div className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={cred.icon || "/placeholder.svg"} alt={cred.name} />
                          <AvatarFallback className={cred.color}>
                            {cred.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium group-hover:text-blue-400 transition-colors duration-300">{cred.name}</div>
                          <div className="text-sm text-muted-foreground truncate">{cred.username}</div>
                        </div>
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recently Used Section */}
      {recentCredentials.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Recently Used</CardTitle>
            </div>
            <CardDescription>Your recently accessed credentials</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recentCredentials.map((cred) => (
                <Link key={cred.id} href={`/dashboard/personal/${cred.id}`}>
                  <div 
                    className="spotlight-card group bg-blue-50/50 dark:bg-blue-950/20 backdrop-blur-sm border border-blue-200/60 dark:border-blue-700/30 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:border-blue-300/80 dark:hover:border-blue-600/50 cursor-pointer relative shadow-sm hover:shadow-lg"
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const y = e.clientY - rect.top;
                      e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
                      e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
                    }}
                  >
                    <div className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={cred.icon || "/placeholder.svg"} alt={cred.name} />
                          <AvatarFallback className={cred.color}>
                            {cred.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium group-hover:text-blue-400 transition-colors duration-300">{cred.name}</div>
                          <div className="text-sm text-muted-foreground truncate">{cred.username}</div>
                          <div className="text-xs text-muted-foreground">{cred.lastUsed}</div>
                        </div>
                        <Badge variant="outline">{cred.category}</Badge>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Credentials List */}
      <Card>
        <CardHeader>
          <CardTitle>All Credentials</CardTitle>
          <CardDescription>
            {filteredCredentials.length} credential{filteredCredentials.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredCredentials.map((cred) => (
              <Link key={cred.id} href={`/dashboard/personal/${cred.id}`}>
                <div 
                  className="spotlight-card group bg-blue-50/50 dark:bg-blue-950/20 backdrop-blur-md border border-gray-200/60 dark:border-white/20 rounded-lg overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:border-gray-300/80 dark:hover:border-white/30 cursor-pointer relative shadow-sm hover:shadow-md"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
                    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
                  }}
                >
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={cred.icon || "/placeholder.svg"} alt={cred.name} />
                        <AvatarFallback className={cred.color}>{cred.name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium group-hover:text-blue-400 transition-colors duration-300">{cred.name}</span>
                          {cred.isFavorite && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                        </div>
                        <div className="text-sm text-muted-foreground">{cred.username}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{cred.category}</Badge>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            togglePasswordVisibility(cred.id)
                          }}
                        >
                          {visiblePasswords[cred.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          <span className="sr-only">Toggle password visibility</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            copyToClipboard(cred.username)
                          }}
                        >
                          <Copy className="h-4 w-4" />
                          <span className="sr-only">Copy username</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit credential</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {filteredCredentials.length === 0 && (
        <div className="flex h-[300px] flex-col items-center justify-center rounded-md border border-dashed">
          <div className="text-center">
            <Shield className="mx-auto h-10 w-10 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No credentials found</h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery || selectedCategory !== "All"
                ? "Try adjusting your search or filter"
                : "Get started by adding your first credential"}
            </p>
            {!searchQuery && selectedCategory === "All" && (
              <Button className="btn-blue-gradient mt-4" onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Credential
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
