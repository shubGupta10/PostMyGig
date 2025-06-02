"use client"

import { motion } from "framer-motion"
import { ArrowRight, Briefcase, Globe, Shield, Users, Star, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function FinalCTA() {
  return (
    <section className="py-20 bg-primary relative transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Content */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-4xl sm:text-5xl lg:text-6xl font-bold dark:text-accent-foreground text-primary-foreground mb-6 leading-tight" style={{ fontFamily: "var(--font-serif)" }}>
            Your Next Great Project
            <br />
            <span className="dark:text-accent-foreground text-primary-foreground">Starts Here</span>
          </h3>

          <p className="text-xl text-primary-foreground/80 mb-8 leading-relaxed max-w-3xl mx-auto" style={{ fontFamily: "var(--font-sans)" }}>
            Stop scrolling through endless platforms with hidden fees. Start building real connections and growing your
            freelance business today.
          </p>

        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link
            href="/add-gigs"
            className="group inline-flex items-center gap-3 px-10 py-5 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-2xl font-bold text-lg shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            <Briefcase className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
            Post Your Project
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>

          <Link
            href="/view-gigs"
            className="group inline-flex items-center gap-3 px-10 py-5 bg-transparent text-primary-foreground border-2 border-primary-foreground/30 rounded-2xl font-bold text-lg hover:bg-primary-foreground/10 hover:border-primary-foreground/50 transition-all duration-300"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            <Users className="w-6 h-6" />
            Find Opportunities
          </Link>
        </motion.div>


        {/* Final Message */}
        <motion.div
          className="text-center pt-12 border-t border-primary-foreground/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p className="text-primary-foreground/80 text-lg" style={{ fontFamily: "var(--font-sans)" }}>Ready to transform your freelancing journey? Start today!</p>
        </motion.div>
      </div>
    </section>
  )
}