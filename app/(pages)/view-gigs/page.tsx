"use client"

import DisplayAllGigs from '@/components/DisplayAllGigs';
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'
import React from 'react'

function ViewGigs() {
    const {status } = useSession();
    const router = useRouter();

    if (status === 'loading') {
        return (
            <div className='w-full h-16 flex items-center justify-center'>
                <Loader2 className='h-6 w-6 animate-spin text-slate-600' />
            </div>
        )
    }

    const handleAddGigs = () => {
        if(status === 'unauthenticated'){
            router.push("/auth/login")
        }else{
            router.push("/add-gigs")
        }
    }

    return (
        <div className='w-full bg-gradient-to-br from-slate-50 to-white min-h-screen'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center py-8 gap-6'>
                    <div className='space-y-2'>
                        <h1 className='text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text py-2 text-transparent'>
                            Discover Gigs
                        </h1>
                        <p className='text-lg text-slate-600 font-medium max-w-md'>
                            Find perfect opportunities and apply to gigs that match your skills
                        </p>
                    </div>

                    <div className='w-full sm:w-auto'>
                        <Button onClick={handleAddGigs} className='w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer'>
                            Post Your Gig
                        </Button>
                    </div>
                </div>
            </div>

            <DisplayAllGigs/>
        </div>
    )
}

export default ViewGigs