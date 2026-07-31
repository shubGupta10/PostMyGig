import DisplayAllGigs from "@/components/DisplayAllGigs"

export default function ViewGigs() {
  return (
    <div className="w-full min-h-screen bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <DisplayAllGigs />
      </div>
    </div>
  )
}