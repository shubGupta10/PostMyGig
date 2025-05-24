import { ArrowRight, Briefcase, Globe, Shield, Users } from "lucide-react";
import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-900 via-blue-900 to-blue-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-green-400 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-400 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">

        <h3 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
          Your Next Great Project
          <br />
          <span className="text-green-300">Starts Here</span>
        </h3>

        <p className="text-xl text-gray-300 mb-12 leading-relaxed">
          Stop scrolling through endless platforms with hidden fees. Start building real connections and growing your
          freelance business today.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
          <Link
            href="/add-gigs"
            className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300"
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
        </div>

      </div>
    </section>
  )
}