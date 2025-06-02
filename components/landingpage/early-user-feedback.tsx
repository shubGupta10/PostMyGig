"use client"

import { useState, useEffect } from "react"

function EarlyUserFeedback() {
  const [currentSlide, setCurrentSlide] = useState(0)

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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(testimonials.length / 3))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(testimonials.length / 3)) % Math.ceil(testimonials.length / 3))
  }

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="py-20 bg-gradient-to-br from-background via-muted/30 to-secondary/20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4" style={{ fontFamily: "var(--font-serif)" }}>
            Why Users <span className="dark:text-accent text-chart-4">Love</span> <span className="text-secondary-foreground">PostMyGig</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" style={{ fontFamily: "var(--font-sans)" }}>
            Real feedback from our early users who are already transforming their work sharing experience
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary-foreground mx-auto rounded-full mt-6"></div>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative">
          {/* Carousel Container */}
          <div className="overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: Math.ceil(testimonials.length / 3) }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid md:grid-cols-3 gap-8 p-4">
                    {testimonials.slice(slideIndex * 3, slideIndex * 3 + 3).map((testimonial) => (
                      <div
                        key={testimonial.id}
                        className="bg-card rounded-2xl shadow-lg border border-border p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                      >
                        {/* Rating Stars */}
                        <div className="flex items-center space-x-1 mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <svg key={i} className="w-5 h-5 text-secondary-foreground" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>

                        {/* Testimonial Text */}
                        <blockquote className="text-card-foreground text-lg leading-relaxed mb-6" style={{ fontFamily: "var(--font-sans)" }}>
                          "{testimonial.feedback}"
                        </blockquote>

                        {/* User Info */}
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${testimonial.color}`}
                          >
                            {testimonial.avatar}
                          </div>
                          <div>
                            <div className="font-semibold text-card-foreground" style={{ fontFamily: "var(--font-sans)" }}>{testimonial.name}</div>
                            <div className="text-sm text-muted-foreground" style={{ fontFamily: "var(--font-sans)" }}>{testimonial.role}</div>
                            <div className="text-sm text-muted-foreground/80" style={{ fontFamily: "var(--font-sans)" }}>{testimonial.location}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-card rounded-full shadow-lg border border-border flex items-center justify-center hover:bg-muted transition-colors duration-200"
            aria-label="Previous testimonials"
          >
            <svg className="w-6 h-6 text-card-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-card rounded-full shadow-lg border border-border flex items-center justify-center hover:bg-muted transition-colors duration-200"
            aria-label="Next testimonials"
          >
            <svg className="w-6 h-6 text-card-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Slide Indicators */}
          <div className="flex justify-center space-x-2 mt-8">
            {Array.from({ length: Math.ceil(testimonials.length / 3) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  currentSlide === index ? "bg-primary" : "bg-muted-foreground/40"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default EarlyUserFeedback