import type { Metadata } from "next"
import { PersonalVault } from "@/components/personal-vault"

export const metadata: Metadata = {
  title: "Personal Vault - SolSecure",
  description: "Manage your personal passwords and credentials securely",
}

export default function PersonalPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Personal Vault</h2>
        <p className="text-muted-foreground">
          Securely store and manage your personal credentials
        </p>
      </div>
      <PersonalVault />
    </div>
  )
}
