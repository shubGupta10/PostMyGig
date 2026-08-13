import { Check, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function LandingPricing() {
  const freePoints = [
    "15 Gig postings per month (Clients)",
    "30 Pitch pings per month (Freelancers)",
    "Standard search placement",
    "In-app & Email notifications",
  ]

  const proPoints = [
    "Everything in Free plan",
    "Up to 50 Gig postings per month (Clients)",
    "Up to 100 Pitch pings per month (Freelancers)",
    "Featured Gig Badge for higher responses",
    "Priority Pitch placement on client dashboards",
  ]

  return (
    <section className="bg-background py-12 md:py-20">
      <div className="mx-auto max-w-3xl lg:max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="mx-auto mb-8 sm:mb-12 md:mb-14 max-w-4xl text-center">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Simple, Transparent Pricing
          </h2>
        </div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-stretch">
          {/* Free Plan */}
          <div className="bg-muted border-2 border-border rounded-2xl p-5 sm:p-8 md:p-10 flex flex-col h-full">
            <div className="mb-4 sm:mb-8 border-b border-border pb-3 sm:pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-muted-foreground">Free Plan</h3>
                <div className="pt-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-foreground">₹0</span>
                  <span className="text-xs sm:text-sm text-muted-foreground font-normal ml-2">/ month forever</span>
                </div>
              </div>
            </div>

            <ul className="space-y-4 sm:space-y-6 flex-1 mb-8">
              {freePoints.map((point, i) => (
                <li key={i} className="flex items-start">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-background border border-border flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
                  </div>
                  <span className="text-sm sm:text-lg text-muted-foreground font-normal sm:font-medium pt-0.5">
                    {point}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-4 border-t border-border">
              <Link
                href="/auth/login"
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 sm:py-4 bg-secondary text-secondary-foreground border border-border rounded-xl font-bold text-base hover:opacity-90 transition-all duration-300 shadow-sm cursor-pointer"
              >
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="bg-card border-2 border-primary rounded-2xl p-5 sm:p-8 md:p-10 flex flex-col h-full shadow-sm relative overflow-hidden">
            <div className="mb-4 sm:mb-8 border-b border-border pb-3 sm:pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-primary">Pro Plan</h3>
                <div className="pt-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-foreground">₹75</span>
                  <span className="text-xs sm:text-sm text-muted-foreground font-normal ml-2">/ month</span>
                </div>
              </div>

              {/* COMING SOON Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5" /> COMING SOON
              </div>
            </div>

            <ul className="space-y-4 sm:space-y-6 flex-1 mb-8">
              {proPoints.map((point, i) => (
                <li key={i} className="flex items-start">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-foreground" />
                  </div>
                  <span className="text-sm sm:text-lg text-foreground font-medium sm:font-semibold pt-0.5">
                    {point}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-4 border-t border-border">
              <button
                disabled
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:py-4 bg-muted text-muted-foreground border border-border rounded-xl font-bold text-base cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
