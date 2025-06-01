import Link from "next/link"
import { Mail, Twitter, Linkedin, Github, Instagram } from "lucide-react"
import Image from "next/image"

function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-transparent rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <Image src='/AppIcon.png' alt="App Icon" width={100} height={100} />
              </div>
              <span className="text-xl font-bold text-primary">PostMy<span className="text-accent-foreground">Gig</span></span>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Solving freelance project sharing. Connect safely, share work effortlessly, and build your network without
              platform fees.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-foreground">Product</h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="#about"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center space-x-2"
                >
                  <span>About PostMyGig</span>
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/view-gigs" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                  Browse Projects
                </Link>
              </li>
              <li>
                <Link href="/add-gigs" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                  Post a Project
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-foreground">Support</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/user/feedback" className="text-muted-foreground hover:text-accent-foreground transition-colors duration-200">
                  Send Feedback
                </Link>
              </li>
            </ul>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-muted-foreground">
              <span>© 2025 PostMyGig. Securely built with Next.js.</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-6">
              <a
                href="https://twitter.com/postmygig"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors duration-200"
                aria-label="Follow PostMyGig on X (Twitter)"
              >
                <Twitter className="w-5 h-5" />
              </a>

              <a
                href="https://linkedin.com/company/postmygig"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors duration-200"
                aria-label="Follow PostMyGig on LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>

              <a
                href="https://github.com/postmygig"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent-foreground transition-colors duration-200"
                aria-label="View PostMyGig on GitHub"
              >
                <Github className="w-5 h-5" />
              </a>

              <a
                href="https://instagram.com/postmygig"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent-foreground transition-colors duration-200"
                aria-label="Follow PostMyGig on Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </footer>
  )
}

export default Footer