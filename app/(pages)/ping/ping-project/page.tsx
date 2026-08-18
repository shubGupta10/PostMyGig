import { Suspense } from "react"
import { PingForm } from "@/components/ping/PingForm"
import PingLoading from "./loading"

export default function PingProjectPage() {
  return (
    <Suspense fallback={<PingLoading />}>
      <div className="min-h-screen bg-background p-4 sm:p-6 sm:py-10">
        <div className="max-w-7xl mx-auto">
          <PingForm />
        </div>
      </div>
    </Suspense>
  )
}