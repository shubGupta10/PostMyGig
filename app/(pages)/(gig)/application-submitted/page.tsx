"use client"

import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function ApplicationSubmitted() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="bg-card text-card-foreground p-8 rounded-2xl shadow-lg w-full max-w-lg text-center">
        <CheckCircle size={60} className="mx-auto text-primary mb-4" />
        <h1 className="text-2xl font-bold mb-2">Application Submitted Successfully</h1>
        <p className="text-muted-foreground mb-6">
          Your application has been received. The freelancer will contact you if they choose to proceed with your request.
        </p>
        <button onClick={() => window.location.href="/view-gigs"} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg cursor-pointer">
          View More Gigs
        </button>
      </div>
    </div>
  );
}