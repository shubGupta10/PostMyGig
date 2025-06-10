"use client"

import { User2Icon } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link"

function FreelancerClient() {
  const { data: session } = useSession();
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4" style={{ fontFamily: "var(--font-serif)" }}>
            Built for <span className="text-primary">You</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Whether you're sharing work or seeking talent, PostMyGig has you covered
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent-foreground mx-auto rounded-full mt-6"></div>
        </div>

        {/* Two-Column Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Freelancers Card */}
          <div className="group">
            <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              {/* Image Section */}
              <div className="relative h-64 bg-gradient-to-br from-primary/80 to-primary overflow-hidden">
                {/* Placeholder for Indian freelancer coding */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Laptop mockup */}
                    <div className="w-32 h-20 bg-muted-foreground rounded-lg shadow-lg transform rotate-12">
                      <div className="w-full h-14 bg-foreground rounded-t-lg p-2">
                        <div className="w-full h-full bg-accent rounded opacity-80"></div>
                      </div>
                    </div>

                    {/* Freelancer avatar */}
                    <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-card rounded-full shadow-lg flex items-center justify-center">
                      <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Overlay pattern */}
                <div className="absolute inset-0 bg-primary/20 dark:bg-primary/30"></div>
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                ></div>
              </div>

              {/* Content Section */}
              <div className="p-8">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-card-foreground">For Freelancers</h3>
                </div>

                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  List your skills, share extra projects, or find work. Connect safely, no hassle.
                </p>

                {/* Benefits */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-muted-foreground">Share excess work easily</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-muted-foreground">Connect via WhatsApp/Email</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-muted-foreground">No platform fees</span>
                  </div>
                </div>

                {/* CTA */}
                <Link
                  href={ session ? `/add-gigs` : '/auth/login'}
                  className="w-full inline-flex items-center justify-center px-6 py-4 text-lg font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl group-hover:scale-105 transform"
                  aria-label="Post your skills and start sharing work"
                >
                  Post Your Skills
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Clients Card */}
          <div className="group">
            <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              {/* Image Section */}
              <div className="relative h-64 bg-gradient-to-br from-accent-foreground/80 to-accent-foreground overflow-hidden">
                {/* Placeholder for startup team */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Team avatars */}
                    <div className="flex items-center space-x-2">
                      <div className="w-12 h-12 bg-card rounded-full shadow-lg flex items-center justify-center">
                        <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-secondary-foreground" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-card rounded-full shadow-lg flex items-center justify-center">
                        <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-accent-foreground" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-card rounded-full shadow-lg flex items-center justify-center">
                        <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Overlay pattern */}
                <div className="absolute inset-0 bg-accent-foreground/20 dark:bg-accent-foreground/30"></div>
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                ></div>
              </div>

              {/* Content Section */}
              <div className="p-8">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-accent-foreground rounded-full flex items-center justify-center">
                    <User2Icon className="text-accent font-bold"/>
                  </div>
                  <h3 className="text-2xl font-bold text-card-foreground">For Clients</h3>
                </div>

                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  Need talent? Post projects and connect with freelancers fast, securely.
                </p>

                {/* Benefits */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-accent-foreground" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-muted-foreground">Find talent quickly</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-accent-foreground" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-muted-foreground">Direct communication</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-accent-foreground" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-muted-foreground">Secure connections</span>
                  </div>
                </div>

                {/* CTA */}
                <Link
                  href={ session ? `/view-gigs` : '/auth/login'}
                  className="w-full inline-flex items-center justify-center px-6 py-4 text-lg font-semibold text-accent bg-accent-foreground hover:bg-accent-foreground/90 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl group-hover:scale-105 transform"
                  aria-label="Post a project and find freelancers"
                >
                  Find Freelancers
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FreelancerClient