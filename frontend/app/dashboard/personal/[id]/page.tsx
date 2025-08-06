import { PersonalCredentialDetail } from "@/components/personal-credential-detail"

interface PersonalCredentialPageProps {
  params: {
    id: string
  }
}

export default function PersonalCredentialPage({ params }: PersonalCredentialPageProps) {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PersonalCredentialDetail credentialId={params.id} />
    </div>
  )
}
