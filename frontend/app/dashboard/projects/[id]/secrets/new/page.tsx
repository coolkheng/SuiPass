"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { CreateSecretForm } from "@/components/create-secret-form"

function AddSecretContent({ projectId }: { projectId: string }) {
  const searchParams = useSearchParams()
  const projectName = searchParams?.get('projectName') || `Project ${projectId}`

  return (
    <>
      <PageHeader
        heading="Add Secret"
        text={`Add a new secret to ${projectName}`}
      />
      <div className="container mx-auto py-6">
        <div className="max-w-2xl mx-auto">
          <CreateSecretForm />
        </div>
      </div>
    </>
  )
}

export default function AddSecretPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddSecretContent projectId={params.id} />
    </Suspense>
  )
}
