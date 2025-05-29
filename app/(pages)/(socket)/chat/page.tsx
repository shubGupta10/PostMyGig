'use client'

import ChatSystem from '@/components/ChatSystem'
import { useSearchParams } from 'next/navigation'
import React from 'react'

export default function Chat() {
  const searcParams = useSearchParams();
  const projectId = searcParams.get("projectId");
  return (
    <ChatSystem projectId={projectId as string} />
  )
}
