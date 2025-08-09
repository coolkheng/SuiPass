"use client"

import { CredentialUpgrade } from "@/components/credential-upgrade"
import { notFound } from "next/navigation"
import { use } from "react"

// Sample credential data (in a real app, this would come from your database)
const sampleCredentials = [
  {
    id: "1",
    name: "Dropbox",
    username: "wendy.c.appleseed@gmail.com",
    password: "MySecurePassword123!",
    website: "https://www.dropbox.com",
    category: "Others",
    icon: "https://logo.clearbit.com/dropbox.com",
    color: "bg-blue-500",
  },
  {
    id: "2",
    name: "Google",
    username: "wendy.c.appleseed@gmail.com",
    password: "GooglePass456@",
    website: "https://accounts.google.com",
    category: "Others",
    icon: "https://logo.clearbit.com/google.com",
    color: "bg-red-500",
  },
  {
    id: "3",
    name: "Facebook",
    username: "wendy.c.appleseed@gmail.com",
    password: "FacebookSecure789#",
    website: "https://www.facebook.com",
    category: "Social Media",
    icon: "https://logo.clearbit.com/facebook.com",
    color: "bg-blue-600",
  },
  {
    id: "4",
    name: "Instagram",
    username: "wendy.appleseed",
    password: "InstaPass321$",
    website: "https://www.instagram.com",
    category: "Social Media",
    icon: "https://logo.clearbit.com/instagram.com",
    color: "bg-pink-500",
  },
  {
    id: "5",
    name: "Netflix",
    username: "wendy.appleseed@gmail.com",
    password: "NetflixWatch999%",
    website: "https://www.netflix.com",
    category: "Entertainment",
    icon: "https://logo.clearbit.com/netflix.com",
    color: "bg-red-600",
  },
  {
    id: "6",
    name: "Amazon",
    username: "wendy.c.appleseed@gmail.com",
    password: "AmazonShop888&",
    website: "https://www.amazon.com",
    category: "Shopping",
    icon: "https://logo.clearbit.com/amazon.com",
    color: "bg-orange-500",
  },
  {
    id: "7",
    name: "Twitter",
    username: "wendy_appleseed",
    password: "TwitterPost777*",
    website: "https://twitter.com",
    category: "Social Media",
    icon: "https://logo.clearbit.com/twitter.com",
    color: "bg-blue-400",
  },
  {
    id: "8",
    name: "Spotify",
    username: "wendy.appleseed@gmail.com",
    password: "SpotifyMusic555+",
    website: "https://www.spotify.com",
    category: "Entertainment",
    icon: "https://logo.clearbit.com/spotify.com",
    color: "bg-green-500",
  },
  {
    id: "9",
    name: "eBay",
    username: "wendy.appleseed@gmail.com",
    password: "eBayBid222=",
    website: "https://www.ebay.com",
    category: "Shopping",
    icon: "https://logo.clearbit.com/ebay.com",
    color: "bg-yellow-500",
  },
]

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default function CredentialUpgradePage({ params }: PageProps) {
  const { id } = use(params)
  const credential = sampleCredentials.find(cred => cred.id === id)
  
  if (!credential) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CredentialUpgrade credential={credential} />
    </div>
  )
}
