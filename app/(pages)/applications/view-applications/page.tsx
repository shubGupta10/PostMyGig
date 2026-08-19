import { Suspense } from "react"
import { ApplicationsList } from "@/modules/applications/components/ApplicationsList"

export default function ViewApplicationsPage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <Suspense>
          <ApplicationsList />
        </Suspense>
      </div>
    </div>
  )
}