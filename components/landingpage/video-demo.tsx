"use client"

export default function VideoDemo() {
  return (
    <section id="demo-video" className="bg-muted py-48 px-4 lg:px-8">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex flex-col items-center text-center">
          {/* Title with primary underline */}
          <div className="mb-4">
            <h2
              className="text-4xl lg:text-5xl font-bold text-foreground mb-3"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              See <span className="text-primary">PostMyGig</span> in Action
            </h2>
            <div className="w-20 h-1 bg-primary rounded mx-auto"></div>
          </div>
          {/* Description */}
          <p
            className="text-base lg:text-lg text-muted-foreground max-w-3xl mx-auto mb-6 leading-relaxed"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Watch our demo to discover how PostMyGig connects India's freelancers with exciting projects in minutes.
            Post gigs, ping clients, and collaborate securely all for free.
          </p>
          {/* Video Container */}
          <div className="w-full max-w-5xl mx-auto mt-6">
            <div className="relative bg-card rounded-2xl shadow-lg border border-border p-1 hover:scale-[1.02] transition-transform duration-300">
              <div className="relative w-full" style={{ paddingBottom: "56.25%" /* 16:9 aspect ratio */ }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-xl"
                   src="https://www.youtube.com/embed/NrLeJsz3iGg"
                  title="PostMyGig Demo Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            </div>
            {/* Fallback content (hidden by default, shown if video fails) */}
            <div className="hidden bg-secondary rounded-2xl shadow-lg border border-border aspect-video items-center justify-center flex-col">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-muted-foreground text-center" style={{ fontFamily: "var(--font-sans)" }}>
                Video unavailable.{" "}
                <a href="https://www.youtube.com/watch?v=NrLeJsz3iGg" className="text-primary hover:underline">
                  Watch on YouTube
                </a>
              </p>
            </div>
          </div>
          {/* Privacy Note */}
          <p className="text-sm text-muted-foreground/80 mt-4 max-w-2xl mx-auto" style={{ fontFamily: "var(--font-sans)" }}>
            Our platform prioritizes your privacy, with secure connections and optional contact sharing.
          </p>
        </div>
      </div>
    </section>
  )
}