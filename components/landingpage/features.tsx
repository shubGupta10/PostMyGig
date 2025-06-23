import type React from "react"
import { MessageCircle, Share2, Zap, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"

const features = [
  {
    Icon: Zap,
    name: "Post Excess Gigs Instantly",
    description:
      "Quickly post your extra gigs when you have too much work. Help meet deadlines, manage workload, and support the freelance community.",
    href: "#",
    cta: "Start Posting",
    className: "col-span-3 lg:col-span-2",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/20">
        <div className="absolute top-4 right-4 w-32 h-32 bg-primary/20 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-8 left-8 w-24 h-24 bg-secondary/30 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-16 h-16 border-2 border-primary/30 rounded-lg rotate-12 animate-bounce" />
          <div className="w-12 h-12 border-2 border-secondary/40 rounded-lg -rotate-12 animate-bounce delay-500 ml-8 -mt-8" />
        </div>
      </div>
    ),
  },
  {
    Icon: Share2,
    name: "Share Gigs Anywhere",
    description:
      "Instantly share gigs on X, WhatsApp, or copy direct links. Reach freelancers quickly across multiple platforms.",
    href: "#",
    cta: "Learn More",
    className: "col-span-3 lg:col-span-1",
    background: (
      <div className="absolute inset-0 bg-gradient-to-t from-secondary/10 to-transparent">
        <div className="absolute top-6 left-6 flex space-x-2">
          <div className="w-8 h-8 bg-primary/20 rounded-full animate-ping" />
          <div className="w-8 h-8 bg-secondary/30 rounded-full animate-ping delay-300" />
          <div className="w-8 h-8 bg-accent/20 rounded-full animate-ping delay-700" />
        </div>
        <div className="absolute bottom-6 right-6">
          <div className="w-20 h-20 border border-primary/20 rounded-full flex items-center justify-center">
            <Share2 className="w-8 h-8 text-primary/40 animate-pulse" />
          </div>
        </div>
      </div>
    ),
  },
  {
    Icon: MessageCircle,
    name: "Direct, Real-Time Chat",
    description:
      "Chat directly with freelancers in real-time. Connect through WhatsApp, Email, or X with full control over conversations.",
    href: "#",
    cta: "Start Chatting",
    className: "col-span-3 lg:col-span-1",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-secondary/10">
        <div className="absolute top-4 left-4 space-y-2">
          <div className="w-16 h-3 bg-primary/20 rounded-full animate-pulse" />
          <div className="w-12 h-3 bg-secondary/30 rounded-full animate-pulse delay-300" />
          <div className="w-20 h-3 bg-accent/20 rounded-full animate-pulse delay-600" />
        </div>
        <div className="absolute bottom-4 right-4 space-y-2">
          <div className="w-14 h-3 bg-primary/30 rounded-full animate-pulse delay-200" />
          <div className="w-18 h-3 bg-secondary/20 rounded-full animate-pulse delay-500" />
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <MessageCircle className="w-12 h-12 text-primary/30 animate-bounce" />
        </div>
      </div>
    ),
  },
  {
    Icon: DollarSign,
    name: "No Middleman, No Platform Fees",
    description:
      "Connect directly with freelancers. No commissions, no hidden charges, no communication limits. Simple, fast, and freelancer-first.",
    href: "#",
    cta: "Get Started",
    className: "col-span-3 lg:col-span-2",
    background: (
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/10 to-primary/5">
        <div className="absolute top-6 left-6">
          <div className="relative">
            <div className="w-16 h-16 border-2 border-primary/30 rounded-full flex items-center justify-center">
              <DollarSign className="w-8 h-8 text-primary/50" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-destructive rounded-full flex items-center justify-center">
              <span className="text-xs text-destructive-foreground font-bold">✕</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-6 right-6 flex items-center space-x-2">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center animate-pulse">
            <span className="text-primary font-bold">0%</span>
          </div>
          <div className="text-primary/60 font-semibold">Fees</div>
        </div>
      </div>
    ),
  },
]

function BentoCard({
  Icon,
  name,
  description,
  href,
  cta,
  className,
}: {
  Icon: any
  name: string
  description: string
  href: string
  cta: string
  className: string
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-card p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]",
        "border-border hover:border-primary/20",
        className,
      )}
    >
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-card-foreground">{name}</h3>
        </div>
        <p className="text-muted-foreground mb-6 leading-relaxed">{description}</p>
        <a
          href={href}
          className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors"
        >
          {cta}
          <svg
            className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  )
}

function BentoGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-3 gap-6 max-w-7xl mx-auto">{children}</div>
}

export default function Features() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
         <h2
  className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4"
  style={{ fontFamily: "var(--font-serif)" }}
>
  Key Features of <span className="text-primary">PostMyGig</span>
</h2>

        </div>

        <BentoGrid>
          {features.map((feature, idx) => (
            <BentoCard key={idx} {...feature} />
          ))}
        </BentoGrid>
      </div>
    </section>
  )
}
