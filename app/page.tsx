import EarlyUserFeedback from '@/components/landingpage/early-user-feedback'
import FreelancerClient from '@/components/landingpage/freelancer-client'
import Hero from '@/components/landingpage/Hero'
import HowItWorks from '@/components/landingpage/HowItWorks'
import ProblemSolving from '@/components/landingpage/problemSolving'
import React from 'react'

function Home() {
  return (
    <>
    <Hero/>
    <ProblemSolving/>
    <HowItWorks/>
    <FreelancerClient/>
    <EarlyUserFeedback/>
    </>
  )
}

export default Home