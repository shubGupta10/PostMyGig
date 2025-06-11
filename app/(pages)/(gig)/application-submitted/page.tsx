"use client"

import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function ApplicationSubmitted() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="bg-card max-w-2xl text-card-foreground p-8 sm:p-12 rounded-2xl shadow-md w-full text-center space-y-8">
        <CheckCircle size={80} className="mx-auto text-primary" />
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-5xl font-bold">Application Submitted</h1>
          <p className="text-muted-foreground text-base sm:text-lg font-medium">
            We’ve received your application. The freelancer who posted this gig will contact you if they decide to continue.
          </p>
        </div>
        <button 
          onClick={() => window.location.href="/view-gigs"} 
          className="bg-primary text-primary-foreground px-6 py-3 text-lg font-semibold rounded-lg transition-colors hover:bg-primary/90 cursor-pointer"
        >
          View More Gigs
        </button>
      </div>
    </div>
  );
}
