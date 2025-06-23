"use client"

import { motion } from "framer-motion"
import { CheckIcon, AlertTriangleIcon, ShieldCheckIcon } from "lucide-react"

export default function ProblemSolving() {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Solving the <span className="text-primary">Work Sharing</span> Challenge
          </h2>
        </motion.div>

        {/* Problem-Solution Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16 sm:mb-20">
          {/* Problem Side */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-card rounded-2xl p-6 sm:p-8 border border-destructive/20 shadow-lg">
              <div className="text-center mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                  <AlertTriangleIcon className="w-8 h-8 sm:w-10 sm:h-10 text-destructive" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">The Problem</h3>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                 Freelancers struggle with project overload and sharing.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { text: "Overwhelmed with too many projects", icon: "🔥" },
                  { text: "Inefficient sharing on social platforms", icon: "📱" },
                  { text: "Hard to find the right collaborators", icon: "🔍" },
                ].map((point, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-4 p-4 bg-muted/50 rounded-xl"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  >
                    <div className="text-2xl flex-shrink-0">{point.icon}</div>
                    <span className="text-sm sm:text-base text-muted-foreground font-medium">{point.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Solution Side */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-card rounded-2xl p-6 sm:p-8 border border-primary/20 shadow-lg">
              <div className="text-center mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                  <CheckIcon className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">The Solution</h3>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  PostMyGig streamlines work sharing with instant connections
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { text: "Easy project listing and sharing", icon: "✨" },
                  { text: "Instant chat and email connections", icon: "💬" },
                  { text: "Privacy-first secure platform", icon: "🔒" },
                ].map((point, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-4 p-4 bg-primary/5 rounded-xl border border-primary/10"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  >
                    <div className="text-2xl flex-shrink-0">{point.icon}</div>
                    <span className="text-sm sm:text-base text-foreground font-medium">{point.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
