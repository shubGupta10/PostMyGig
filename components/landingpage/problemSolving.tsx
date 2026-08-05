import { X, Check } from "lucide-react"

export default function ProblemSolving() {
  return (
    <section className="bg-background py-12 md:py-20">
      <div className="mx-auto max-w-3xl lg:max-w-6xl px-4 sm:px-6">

        {/* Header */}
        <div className="mx-auto mb-8 sm:mb-12 md:mb-14 max-w-4xl text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground" style={{ fontFamily: "var(--font-serif)" }}>
            The old way of freelancing is <span className="text-destructive">broken</span>
          </h2>
        </div>

        {/* Contrast Grid */}
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-stretch">

          {/* Without PostMyGig */}
          <div className="bg-muted border-2 border-border rounded-2xl p-5 sm:p-8 md:p-10 flex flex-col h-full">
            <div className="mb-4 sm:mb-8 border-b border-border pb-3 sm:pb-4">
              <h3 className="text-xl sm:text-2xl font-bold text-muted-foreground">Without PostMyGig</h3>
            </div>

            <ul className="space-y-4 sm:space-y-6 flex-1">
              {[
                "Drowning in scattered DMs and emails to find reliable freelancers.",
                "Turning down excess work and permanently losing good clients.",
                "Paying 20% platform fees to middlemen for every single gig.",
              ].map((point, i) => (
                <li key={i} className="flex items-start">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-background border border-border flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                    <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
                  </div>
                  <span className="text-sm sm:text-lg text-muted-foreground font-normal sm:font-medium pt-0.5">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* With PostMyGig */}
          <div className="bg-card border-2 border-primary rounded-2xl p-5 sm:p-8 md:p-10 flex flex-col h-full shadow-sm">
            <div className="mb-4 sm:mb-8 border-b border-border pb-3 sm:pb-4">
              <h3 className="text-xl sm:text-2xl font-bold text-primary">With PostMyGig</h3>
            </div>

            <ul className="space-y-4 sm:space-y-6 flex-1">
              {[
                "Share excess gigs instantly with a trusted community in one place.",
                "Keep your clients happy by ensuring their projects always get done.",
                "0% platform fees. Direct connections. Absolute freedom.",
              ].map((point, i) => (
                <li key={i} className="flex items-start">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-foreground" />
                  </div>
                  <span className="text-sm sm:text-lg text-foreground font-medium sm:font-semibold pt-0.5">{point}</span>
                </li>
              ))}
            </ul>

          </div>
        </div>

      </div>
    </section>
  )
}
