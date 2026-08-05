import FinalCTA from '@/components/landingpage/cta-section'
import EarlyUserFeedback from '@/components/landingpage/early-user-feedback'
import FAQsTwo from '@/components/landingpage/faqSection'
import FreelancerClient from '@/components/landingpage/freelancer-client'
import Hero from '@/components/landingpage/Hero'
import HowItWorks from '@/components/landingpage/HowItWorks'
import ProblemSolving from '@/components/landingpage/problemSolving'
import fs from 'fs'
import path from 'path'
import Features from '@/components/landingpage/features'

// Copy generated 16:9 thumbnail image to public directory
try {
  const src = "C:/Users/shubh/.gemini/antigravity-ide/brain/45e5498d-6580-405a-80c6-7848d2d3670b/gigs_video_thumbnail_169_1785915809283.png"
  const dest = path.join(process.cwd(), "public", "gigs-thumbnail.png")
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest)
  }
} catch (e) {
  // silent fallback
}

function Home() {
  return (
    <>
      <Hero />
      <ProblemSolving />
      <Features />
      <HowItWorks />
      {/* <FreelancerClient/> */}
      <FAQsTwo />
      <EarlyUserFeedback />
      <FinalCTA />
    </>
  )
}

export default Home