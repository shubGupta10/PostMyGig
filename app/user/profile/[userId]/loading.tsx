export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-card rounded-2xl shadow-sm overflow-hidden mb-6 sm:mb-8 border-2 border-border animate-pulse">
          <div className="h-28 sm:h-36 bg-muted"></div>
          <div className="px-4 sm:px-8 pb-6 sm:pb-8 flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 -mt-14 sm:-mt-16">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-muted border-2 border-border shrink-0"></div>
            <div className="flex-1 w-full space-y-3 sm:space-y-4">
              <div className="h-7 sm:h-8 w-1/3 bg-muted rounded"></div>
              <div className="h-4 w-1/2 bg-muted rounded"></div>
              <div className="flex gap-2 sm:gap-3 mt-3 sm:mt-4 justify-center sm:justify-start">
                <div className="h-8 sm:h-10 w-20 sm:w-24 bg-muted rounded"></div>
                <div className="h-8 sm:h-10 w-20 sm:w-24 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
