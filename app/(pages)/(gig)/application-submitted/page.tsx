"use client"

import React from 'react';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ApplicationSubmitted() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto mt-12 sm:mt-24">
        <div className="bg-card rounded-2xl border-2 border-border shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8 text-center space-y-6">
            <CheckCircle size={48} className="mx-auto text-primary" />
            
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Application Submitted</h1>
              <p className="text-sm font-normal text-muted-foreground max-w-md mx-auto">
                We’ve received your application. The freelancer who posted this gig will contact you if they decide to continue.
              </p>
            </div>
            
            <div className="pt-4">
              <Link 
                href="/view-gigs" 
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-primary text-primary-foreground transition-all"
              >
                View More Gigs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
