"use client"

import { motion } from "framer-motion"
import { ArrowRight, Briefcase, Globe, Shield, Users, Star, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function FinalCTA() {
  return (
    <section className="py-20 bg-blue-900 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Content */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Your Next Great Project
            <br />
            <span className="text-green-300">Starts Here</span>
          </h3>

          <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
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
            className="group inline-flex items-center gap-3 px-10 py-5 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-bold text-lg shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
          >
            <Briefcase className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
            Post Your Project
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>

          <Link
            href="/view-gigs"
            className="group inline-flex items-center gap-3 px-10 py-5 bg-transparent text-white border-2 border-white/30 rounded-2xl font-bold text-lg hover:bg-white/10 hover:border-white/50 transition-all duration-300"
          >
            <Users className="w-6 h-6" />
            Find Opportunities
          </Link>
        </motion.div>


        {/* Final Message */}
        <motion.div
          className="text-center pt-12 border-t border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p className="text-gray-300 text-lg">Ready to transform your freelancing journey? Start today!</p>
        </motion.div>
      </div>
    </section>
  )
}
