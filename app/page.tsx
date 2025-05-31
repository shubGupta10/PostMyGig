import FinalCTA from '@/components/landingpage/cta-section'
import EarlyUserFeedback from '@/components/landingpage/early-user-feedback'
import FAQsTwo from '@/components/landingpage/faqSection'
import FreelancerClient from '@/components/landingpage/freelancer-client'
import Hero from '@/components/landingpage/Hero'
import HowItWorks from '@/components/landingpage/HowItWorks'
import ProblemSolving from '@/components/landingpage/problemSolving'
import VideoDemo from '@/components/landingpage/video-demo'
import React from 'react'

function Home() {
  return (
    <>
    <Hero/>
    <ProblemSolving/>
    <HowItWorks/>
    <FreelancerClient/>
    <VideoDemo/>
    <FAQsTwo/>
    <EarlyUserFeedback/>
    <FinalCTA/>
    </>
  )
}

export default Home