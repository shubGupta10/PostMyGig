import { FeedbackForm } from "@/modules/admin/components/FeedbackForm"

export default function FeedbackPage() {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <FeedbackForm />
      </div>
    </div>
  )
}