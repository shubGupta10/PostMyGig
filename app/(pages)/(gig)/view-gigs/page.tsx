import DisplayAllGigs from "@/components/DisplayAllGigs"

export default function ViewGigs() {
  return (
    <div className="w-full min-h-screen bg-background p-4 sm:p-6 sm:py-10">
      <div className="max-w-7xl mx-auto">
        <DisplayAllGigs />
      </div>
    </div>
  )
}