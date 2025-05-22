import React, { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Clock, Calendar, MapPin } from 'lucide-react'

interface Gig {
  _id: string;
  title: string;
  description: string;
  skillsRequired: string[];
  status: string;
  createdAt: string;
  expiresAt: string;
  createdBy: string;
  isFlagged: boolean;
  reportCount: number;
}

function DisplayAllGigs() {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllGigs = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/gigs/fetch-gigs", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch gigs');
      }
      
      const data = await response.json();
      setGigs(data.gigs || []);
      console.log(data.gigs);
    } catch (error) {
      console.error("Failed to fetch gigs", error);
      setError("Failed to load gigs. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'completed':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'expired':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  }

  const truncateDescription = (description: string, maxLength: number = 100) => {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + '...';
  }

  useEffect(() => {
    fetchAllGigs();
  }, [])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchAllGigs}
            className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      {gigs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-500 text-lg">No gigs available at the moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {gigs.map((gig) => (
            <div key={gig._id} className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left Section - Main Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-slate-900 truncate pr-4">
                      {gig.title}
                    </h3>
                    <Badge 
                      variant="outline" 
                      className={`${getStatusColor(gig.status)} flex-shrink-0 font-medium`}
                    >
                      {gig.status}
                    </Badge>
                  </div>
                  
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    {truncateDescription(gig.description)}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Posted {formatDate(gig.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>Expires {formatDate(gig.expiresAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Right Section - Skills and Action */}
                <div className="flex flex-col lg:items-end gap-4 lg:w-80">
                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    {gig.skillsRequired.slice(0, 4).map((skill, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="text-xs bg-slate-100 text-slate-700 hover:bg-slate-200"
                      >
                        {skill.trim()}
                      </Badge>
                    ))}
                    {gig.skillsRequired.length > 4 && (
                      <Badge 
                        variant="secondary" 
                        className="text-xs bg-slate-100 text-slate-700"
                      >
                        +{gig.skillsRequired.length - 4} more
                      </Badge>
                    )}
                  </div>

                  <button className="w-full lg:w-auto px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md">
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DisplayAllGigs