"use client"

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

function AddGigs() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skillsRequired: '',
    contact: '',
    expiresAt: ''
  })
  interface FormErrors {
    [key: string]: string;
  }
  const [errors, setErrors] = useState<FormErrors>({})

  const handleInputChange = (e: any) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }


  const handleSubmit = async (e: any) => {
    e.preventDefault()

    setIsLoading(true)

    try {
      const response = await fetch('/api/gigs/add-gigs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
          skillsRequired: formData.skillsRequired.trim(),
          contact: formData.contact.trim(),
          expiresAt: formData.expiresAt
        }),
      });

      const data = await response.json();

      if (response.status === 201) {
        alert('Gig created successfully!')
        setFormData({
          title: '',
          description: '',
          skillsRequired: '',
          contact: '',
          expiresAt: ''
        })
        router.push('/view-gigs')
      } else if (response.status === 401) {
        alert('Please login to create a gig')
        router.push('/login')
      } else {
        alert(data.message || 'Failed to create gig')
      }

    } catch (error) {
      console.error('Error creating gig:', error)
      alert('An error occurred while creating the gig')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='w-full bg-gradient-to-br from-slate-50 to-white min-h-screen py-8'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='mb-8'>
          <h1 className='text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-3 py-2'>
            Add Your Gig
          </h1>
          <p className='text-lg text-slate-600 font-medium'>
            Fill in the information correctly to attract the right candidates
          </p>
        </div>

        <div className='bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-slate-200'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Title Field */}
            <div className='space-y-2'>
              <Label htmlFor="title" className='text-lg font-semibold text-slate-700'>
                Gig Title
              </Label>
              <Input
                id="title"
                name="title"
                type='text'
                placeholder='e.g., Full Stack Developer for E-commerce Website'
                value={formData.title}
                onChange={handleInputChange}
                className={`text-lg py-6 ${errors.title ? 'border-red-500 focus:border-red-500' : ''}`}
              />
              {errors.title && <p className='text-red-500 text-sm'>{errors.title}</p>}
            </div>

            {/* Description Field */}
            <div className='space-y-2'>
              <Label htmlFor="description" className='text-lg font-semibold text-slate-700'>
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder='Describe your project in detail, including requirements, goals, and expectations...'
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
                className={`text-lg resize-none ${errors.description ? 'border-red-500 focus:border-red-500' : ''}`}
              />
              {errors.description && <p className='text-red-500 text-sm'>{errors.description}</p>}
            </div>

            {/* Skills Required Field */}
            <div className='space-y-2'>
              <Label htmlFor="skillsRequired" className='text-lg font-semibold text-slate-700'>
                Skills Required
              </Label>
              <Input
                id="skillsRequired"
                name="skillsRequired"
                type='text'
                placeholder='react, nextjs, nodejs, mongodb'
                value={formData.skillsRequired}
                onChange={handleInputChange}
                className={`text-lg py-6 ${errors.skillsRequired ? 'border-red-500 focus:border-red-500' : ''}`}
              />
              <p className='text-sm text-slate-500 flex items-center gap-2'>
                <span className='w-2 h-2 bg-blue-500 rounded-full'></span>
                Write skills separated by commas like: <span className='font-mono bg-slate-100 px-2 py-1 rounded'>react, nextjs, nodejs, mongodb</span>
              </p>
              {errors.skillsRequired && <p className='text-red-500 text-sm'>{errors.skillsRequired}</p>}
            </div>

            {/* Contact Field */}
            <div className='space-y-2'>
              <Label htmlFor="contact" className='text-lg font-semibold text-slate-700'>
                Contact Information
              </Label>
              <Input
                id="contact"
                name="contact"
                type='text'
                placeholder='your.email@example.com or +1234567890'
                value={formData.contact}
                onChange={handleInputChange}
                className={`text-lg py-6 ${errors.contact ? 'border-red-500 focus:border-red-500' : ''}`}
              />
              {errors.contact && <p className='text-red-500 text-sm'>{errors.contact}</p>}
            </div>

            {/* Expires At Field */}
            <div className='space-y-2'>
              <Label htmlFor="expiresAt" className='text-lg font-semibold text-slate-700'>
                Gig Deadline
              </Label>
              <Input
                id="expiresAt"
                name="expiresAt"
                type='date'
                value={formData.expiresAt}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className={`text-lg py-6 ${errors.expiresAt ? 'border-red-500 focus:border-red-500' : ''}`}
              />
              {errors.expiresAt && <p className='text-red-500 text-sm'>{errors.expiresAt}</p>}
            </div>

            {/* Submit Button */}
            <div className='pt-6'>
              <Button
                type="submit"
                disabled={isLoading}
                className='w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
              >
                {isLoading ? 'Creating Gig...' : 'Create Gig'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddGigs