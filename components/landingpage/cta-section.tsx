"use client"

import { motion } from "framer-motion"
import { ArrowRight, Briefcase, Users } from "lucide-react"
import Link from "next/link"

export default function FinalCTA() {
  return (
    <section className="bg-background py-12 md:py-20 relative">
      <div className="mx-auto max-w-4xl lg:max-w-6xl px-4 sm:px-6 relative z-10">
        <motion.div 
          className="bg-primary rounded-2xl p-6 sm:p-12 md:p-20 text-center shadow-2xl relative overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 
            className="relative z-10 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4 sm:mb-8" 
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Ready to start <br className="hidden sm:block"/> working together?
          </h2>
          
          <p className="relative z-10 text-base sm:text-lg md:text-2xl text-primary-foreground font-normal sm:font-medium mb-6 sm:mb-12 max-w-2xl mx-auto">
            Stop scrolling through endless platforms with hidden fees. Start building real connections and growing your freelance business today.
          </p>

          <div className="relative z-10 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <Link
              href="/auth/login"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 sm:gap-3 px-6 sm:px-10 py-3.5 sm:py-5 bg-background text-foreground rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:scale-105 transition-all duration-300 shadow-md"
            >
              <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-12 transition-transform duration-300" />
              Post Your Project
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>

            <Link
              href="/view-gigs"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 sm:gap-3 px-6 sm:px-10 py-3.5 sm:py-5 bg-transparent text-primary-foreground border-2 border-primary-foreground rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:bg-primary-foreground hover:text-primary transition-all duration-300"
            >
              <Users className="w-5 h-5 sm:w-6 sm:h-6" />
              Find Opportunities
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}