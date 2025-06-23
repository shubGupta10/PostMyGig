"use client"

import { useState, useEffect } from "react"

// Custom Marquee Component using only Tailwind classes
import { ReactNode } from "react"

interface MarqueeProps {
  children: ReactNode
  reverse?: boolean
  pauseOnHover?: boolean
  className?: string
}

const Marquee = ({ children, reverse = false, pauseOnHover = false, className = "" }: MarqueeProps) => {
  return (
    <div className={`flex overflow-hidden ${className}`}>
      <div className={`flex gap-4 ${reverse ? 'animate-scroll-reverse' : 'animate-scroll'} ${pauseOnHover ? 'hover:animate-none' : ''}`}>
        <div className="flex gap-4 shrink-0">
          {children}
        </div>
        <div className="flex gap-4 shrink-0">
          {children}
        </div>
      </div>
    </div>
  )
}

function EarlyUserFeedback() {
  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      role: "Full Stack Developer",
      location: "Bangalore",
      avatar: "PS",
      feedback: "Posted a project, got quick pings, and connected easily. Love the privacy!",
      rating: 5,
      color: "bg-accent text-accent-foreground",
    },
    {
      id: 2,
      name: "Amit Kumar",
      role: "Startup Founder",
      location: "Delhi",
      avatar: "AK",
      feedback: "Found a great freelancer for my app in hours. Super simple!",
      rating: 5,
      color: "bg-secondary text-secondary-foreground",
    },
    {
      id: 3,
      name: "Rahul Verma",
      role: "React Developer",
      location: "Mumbai",
      avatar: "RV",
      feedback: "Finally, a platform that doesn't take cuts! Direct WhatsApp connection is brilliant.",
      rating: 5,
      color: "bg-primary/20 text-primary",
    },
    {
      id: 4,
      name: "Sneha Patel",
      role: "UI/UX Designer",
      location: "Pune",
      avatar: "SP",
      feedback: "Shared my extra design work and found the perfect collaborator. Game changer!",
      rating: 5,
      color: "bg-muted text-muted-foreground",
    },
    {
      id: 5,
      name: "Vikash Singh",
      role: "Backend Developer",
      location: "Lucknow",
      avatar: "VS",
      feedback: "Love how secure it is. My contact stays private until I decide to share.",
      rating: 5,
      color: "bg-accent/60 text-accent-foreground",
    },
    {
      id: 6,
      name: "Anita Gupta",
      role: "Product Manager",
      location: "Hyderabad",
      avatar: "AG",
      feedback: "Posted a urgent requirement and got responses within minutes. Impressed!",
      rating: 5,
      color: "bg-secondary/60 text-secondary-foreground",
    },
  ]

  const firstRow = testimonials.slice(0, Math.ceil(testimonials.length / 2))
  const secondRow = testimonials.slice(Math.ceil(testimonials.length / 2))

  const ReviewCard = ({ testimonial }: { testimonial: typeof testimonials[0] }) => {
    return (
      <figure className="relative w-80 cursor-pointer overflow-hidden rounded-xl border border-border bg-card hover:bg-muted/50 p-6 shadow-sm hover:shadow-md transition-all duration-200 shrink-0">
        {/* Rating Stars */}
        <div className="flex items-center space-x-1 mb-4">
          {[...Array(testimonial.rating)].map((_, i) => (
            <svg key={i} className="w-4 h-4 text-secondary-foreground fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>

        {/* Testimonial Text */}
        <blockquote className="text-sm text-card-foreground mb-4 leading-relaxed">
          "{testimonial.feedback}"
        </blockquote>

        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${testimonial.color}`}>
            {testimonial.avatar}
          </div>
          <div className="flex flex-col">
            <figcaption className="text-sm font-medium text-card-foreground">
              {testimonial.name}
            </figcaption>
            <p className="text-xs font-medium text-muted-foreground">
              {testimonial.role}
            </p>
            <p className="text-xs text-muted-foreground/80">
              {testimonial.location}
            </p>
          </div>
        </div>
      </figure>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-br from-background via-muted/30 to-secondary/20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4" style={{ fontFamily: "var(--font-serif)" }}>
            Why Users <span className="text-primary">Love</span> <span className="text-secondary-foreground">PostMyGig</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" style={{ fontFamily: "var(--font-sans)" }}>
            Real feedback from our early users who are already transforming their work sharing experience
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary-foreground mx-auto rounded-full mt-6"></div>
        </div>

        {/* Marquee Testimonials */}
        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-8 space-y-8">
          <Marquee pauseOnHover className="w-full">
            {firstRow.map((testimonial) => (
              <ReviewCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </Marquee>
          
          <Marquee reverse pauseOnHover className="w-full">
            {secondRow.map((testimonial) => (
              <ReviewCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </Marquee>
          
          {/* Gradient overlays for fade effect */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent"></div>
        </div>
      </div>

      {/* Add custom animations using Tailwind's arbitrary properties */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-100% - 1rem)); }
          }
          @keyframes scroll-reverse {
            0% { transform: translateX(calc(-100% - 1rem)); }
            100% { transform: translateX(0); }
          }
          .animate-scroll {
            animation: scroll 30s linear infinite;
          }
          .animate-scroll-reverse {
            animation: scroll-reverse 30s linear infinite;
          }
        `
      }} />
    </section>
  )
}

export default EarlyUserFeedback