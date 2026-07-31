export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-card rounded-3xl shadow-sm overflow-hidden mb-8 border-2 border-border animate-pulse">
          <div className="h-32 sm:h-40 bg-muted"></div>
          <div className="px-6 sm:px-8 pb-8 flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16 sm:-mt-20">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-muted border-2 border-border shrink-0"></div>
            <div className="flex-1 w-full space-y-4">
              <div className="h-8 w-1/3 bg-muted rounded"></div>
              <div className="h-4 w-1/2 bg-muted rounded"></div>
              <div className="flex gap-3 mt-4">
                <div className="h-10 w-24 bg-muted rounded"></div>
                <div className="h-10 w-24 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
