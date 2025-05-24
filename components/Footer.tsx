import Link from "next/link"
import { Heart, Mail, Shield, CheckCircle, Twitter, Linkedin, Github, Instagram, Zap, Lock, Code } from "lucide-react"

function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">PG</span>
              </div>
              <span className="text-xl font-bold">PostMyGig</span>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6">
              Solving freelance project sharing. Connect safely, share work effortlessly, and build your network without
              platform fees.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Heart className="w-4 h-4 text-green-500" />
              <span>Made with love in Lucknow, India</span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Product</h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200 flex items-center space-x-2"
                >
                  <span>About PostMyGig</span>
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                  Browse Projects
                </Link>
              </li>
              <li>
                <Link href="/post-project" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                  Post a Project
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Support</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:support@postmygig.com"
                  className="text-gray-400 hover:text-green-400 transition-colors duration-200 flex items-center space-x-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>support@postmygig.com</span>
                </a>
              </li>
              <li>
                <Link href="/help" className="text-gray-400 hover:text-green-400 transition-colors duration-200">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-green-400 transition-colors duration-200">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-green-400 transition-colors duration-200">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="text-gray-400 hover:text-green-400 transition-colors duration-200">
                  Send Feedback
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Community */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Legal & Community</h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200 flex items-center space-x-2"
                >
                  <Shield className="w-4 h-4" />
                  <span>Privacy Policy</span>
                </Link>
                <p className="text-xs text-gray-500 mt-1 ml-6">DPDP Compliant</p>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/security" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                  Security
                </Link>
              </li>
              <li>
                <a
                  href="https://twitter.com/postmygig"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200 flex items-center space-x-2"
                >
                  <Twitter className="w-4 h-4" />
                  <span>#buildinpublic</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-gray-400">
              <span>© 2025 PostMyGig, India. Securely built with Next.js.</span>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-blue-500" />
                <span className="text-xs">SSL Secured</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-6">
              <a
                href="https://twitter.com/postmygig"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                aria-label="Follow PostMyGig on X (Twitter)"
              >
                <Twitter className="w-5 h-5" />
              </a>

              <a
                href="https://linkedin.com/company/postmygig"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                aria-label="Follow PostMyGig on LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>

              <a
                href="https://github.com/postmygig"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-400 transition-colors duration-200"
                aria-label="View PostMyGig on GitHub"
              >
                <Github className="w-5 h-5" />
              </a>

              <a
                href="https://instagram.com/postmygig"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-400 transition-colors duration-200"
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
