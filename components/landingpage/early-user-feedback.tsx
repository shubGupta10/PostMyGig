"use client"

import { ReactNode } from "react"

interface MarqueeProps {
  children: ReactNode
  reverse?: boolean
  className?: string
}

const VerticalMarquee = ({ children, reverse = false, className = "" }: MarqueeProps) => {
  return (
    <div className={`flex flex-col overflow-hidden h-[500px] sm:h-[600px] ${className}`}>
      <div className={`flex flex-col gap-4 sm:gap-6 ${reverse ? 'animate-scroll-up' : 'animate-scroll-down'}`}>
        <div className="flex flex-col gap-4 sm:gap-6 shrink-0">
          {children}
        </div>
        <div className="flex flex-col gap-4 sm:gap-6 shrink-0">
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
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      feedback: "Posted a project, got quick pings, and connected easily. Love the privacy!",
      rating: 5,
    },
    {
      id: 2,
      name: "Amit Kumar",
      role: "Startup Founder",
      location: "Delhi",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      feedback: "Found a great freelancer for my app in hours. Super simple!",
      rating: 5,
    },
    {
      id: 3,
      name: "Rahul Verma",
      role: "React Developer",
      location: "Mumbai",
      avatar: "https://randomuser.me/api/portraits/men/46.jpg",
      feedback: "Finally, a platform that doesn't take cuts! Direct WhatsApp connection is brilliant.",
      rating: 5,
    },
    {
      id: 4,
      name: "Sneha Patel",
      role: "UI/UX Designer",
      location: "Pune",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      feedback: "Shared my extra design work and found the perfect collaborator. Game changer!",
      rating: 5,
    },
    {
      id: 5,
      name: "Vikash Singh",
      role: "Backend Developer",
      location: "Lucknow",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      feedback: "Love how secure it is. My contact stays private until I decide to share.",
      rating: 5,
    },
    {
      id: 6,
      name: "Anita Gupta",
      role: "Product Manager",
      location: "Hyderabad",
      avatar: "https://randomuser.me/api/portraits/women/90.jpg",
      feedback: "Posted a urgent requirement and got responses within minutes. Impressed!",
      rating: 5,
    },
    {
      id: 7,
      name: "Neha Desai",
      role: "Graphic Designer",
      location: "Ahmedabad",
      avatar: "https://randomuser.me/api/portraits/women/22.jpg",
      feedback: "I can easily showcase my portfolio items here and get direct DMs from clients.",
      rating: 5,
    },
    {
      id: 8,
      name: "Rohan Nair",
      role: "Mobile App Dev",
      location: "Kochi",
      avatar: "https://randomuser.me/api/portraits/men/11.jpg",
      feedback: "The zero commission structure is exactly what the Indian freelance market needed.",
      rating: 5,
    },
    {
      id: 9,
      name: "Karthik Reddy",
      role: "Data Scientist",
      location: "Chennai",
      avatar: "https://randomuser.me/api/portraits/men/51.jpg",
      feedback: "The real-time chat is incredibly snappy. Better than sharing emails back and forth.",
      rating: 5,
    },
    {
      id: 10,
      name: "Meera Iyer",
      role: "Content Writer",
      location: "Mysore",
      avatar: "https://randomuser.me/api/portraits/women/33.jpg",
      feedback: "Got my first content gig within 2 days of signing up for the beta. Highly recommend!",
      rating: 5,
    },
    {
      id: 11,
      name: "Anjali Kapoor",
      role: "Marketing Expert",
      location: "Chandigarh",
      avatar: "https://randomuser.me/api/portraits/women/12.jpg",
      feedback: "I love the clean UI and how fast I can find talented creators for my agency.",
      rating: 5,
    },
    {
      id: 12,
      name: "Sanjay Joshi",
      role: "DevOps Engineer",
      location: "Indore",
      avatar: "https://randomuser.me/api/portraits/men/61.jpg",
      feedback: "No hidden fees, no complicated bidding. Just straightforward connections with people.",
      rating: 5,
    },
  ]

  const col1 = testimonials.slice(0, 4)
  const col2 = testimonials.slice(4, 8)
  const col3 = testimonials.slice(8, 12)

  const ReviewCard = ({ testimonial }: { testimonial: typeof testimonials[0] }) => {
    return (
      <figure className="relative w-full cursor-pointer overflow-hidden rounded-2xl bg-muted p-5 sm:p-8 shrink-0 flex flex-col">
        {/* Rating Stars */}
        <div className="flex items-center space-x-1 mb-3 sm:mb-6">
          {[...Array(testimonial.rating)].map((_, i) => (
            <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-primary fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>

        {/* Testimonial Text */}
        <blockquote className="text-sm sm:text-base text-card-foreground mb-4 sm:mb-8 leading-relaxed flex-grow font-normal sm:font-medium">
          "{testimonial.feedback}"
        </blockquote>

        {/* User Info */}
        <div className="flex items-center gap-3 sm:gap-4 mt-auto">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-background flex-shrink-0">
            <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <figcaption className="text-sm sm:text-base font-bold text-card-foreground">
              {testimonial.name}
            </figcaption>
            <p className="text-xs sm:text-sm font-normal sm:font-semibold text-muted-foreground">
              {testimonial.role} • {testimonial.location}
            </p>
          </div>
        </div>
      </figure>
    )
  }

  return (
    <section className="bg-background py-12 md:py-20">
      <div className="mx-auto max-w-3xl lg:max-w-6xl px-4 sm:px-6">

        {/* Section Header */}
        <div className="mx-auto mb-8 sm:mb-12 md:mb-14 max-w-4xl text-center">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Why Users <span className="text-primary">Love</span> Us
          </h2>
        </div>

        {/* Marquee Testimonials Grid */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 overflow-hidden h-[500px] sm:h-[600px] w-full">
          <VerticalMarquee reverse={false}>
            {col1.map((testimonial, i) => (
              <ReviewCard key={i} testimonial={testimonial} />
            ))}
          </VerticalMarquee>

          <VerticalMarquee reverse={true} className="hidden md:flex">
            {col2.map((testimonial, i) => (
              <ReviewCard key={i} testimonial={testimonial} />
            ))}
          </VerticalMarquee>

          <VerticalMarquee reverse={false} className="hidden lg:flex">
            {col3.map((testimonial, i) => (
              <ReviewCard key={i} testimonial={testimonial} />
            ))}
          </VerticalMarquee>

          {/* Solid background overlays for fade effect (matching bg-background) */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 sm:h-32 bg-gradient-to-b from-background to-transparent z-10"></div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 sm:h-32 bg-gradient-to-t from-background to-transparent z-10"></div>
        </div>
      </div>

      {/* Marquee Animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes scroll-up {
            0% { transform: translateY(0); }
            100% { transform: translateY(calc(-50% - 0.75rem)); }
          }
          @keyframes scroll-down {
            0% { transform: translateY(calc(-50% - 0.75rem)); }
            100% { transform: translateY(0); }
          }
          .animate-scroll-up {
            animation: scroll-up 30s linear infinite;
          }
          .animate-scroll-down {
            animation: scroll-down 30s linear infinite;
          }
        `
      }} />
    </section>
  )
}

export default EarlyUserFeedback