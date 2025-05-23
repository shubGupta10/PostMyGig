import React, { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Clock, Calendar, MapPin, Star, Users, Briefcase, ChevronRight, AlertCircle, RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

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
      day: 'numeric',
      year: 'numeric'
    });
  }

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return formatDate(dateString);
  }

  const getDaysUntilExpiry = (dateString: string) => {
    const now = new Date();
    const expiry = new Date(dateString);
    const diffInDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffInDays;
  }

  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return {
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-100',
          dot: 'bg-emerald-500'
        };
      case 'completed':
        return {
          color: 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-100',
          dot: 'bg-blue-500'
        };
      case 'expired':
        return {
          color: 'bg-red-50 text-red-700 border-red-200 ring-red-100',
          dot: 'bg-red-500'
        };
      default:
        return {
          color: 'bg-gray-50 text-gray-700 border-gray-200 ring-gray-100',
          dot: 'bg-gray-500'
        };
    }
  }

  useEffect(() => {
    fetchAllGigs();
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-emerald-500"></div>
              <div className="absolute inset-0 rounded-full h-12 w-12 border-4 border-transparent border-t-emerald-300 animate-spin" style={{ animationDelay: '0.3s', animationDuration: '1.5s' }}></div>
            </div>
            <p className="mt-6 text-slate-600 font-medium">Loading available gigs...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Oops! Something went wrong</h3>
            <p className="text-slate-600 mb-8 text-center max-w-md">{error}</p>
            <button
              onClick={fetchAllGigs}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {gigs.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No gigs available</h3>
            <p className="text-slate-500 text-lg max-w-md mx-auto">
              Check back later for new opportunities or be the first to post a gig!
            </p>
          </div>
        ) : (
          <div className="grid gap-8 lg:gap-6">
            {gigs.map((gig) => {
              const statusConfig = getStatusConfig(gig.status);
              const daysUntilExpiry = getDaysUntilExpiry(gig.expiresAt);
              const isExpiringSoon = daysUntilExpiry <= 3 && daysUntilExpiry > 0;

              return (
                <div
                  key={gig._id}
                  className="group bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300 overflow-hidden"
                  style={{ boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' }}
                >
                  <div className="p-8">
                    {/* Header Row */}
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-6">
                      {/* Title and Status */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="flex-1">
                            <h2 className="text-2xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors duration-200 leading-tight">
                              {gig.title}
                            </h2>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={`${statusConfig.color} ring-1 font-semibold text-xs px-3 py-1 flex items-center gap-1.5`}
                            >
                              <div className={`w-2 h-2 rounded-full ${statusConfig.dot}`}></div>
                              {gig.status.charAt(0).toUpperCase() + gig.status.slice(1)}
                            </Badge>
                            {gig.isFlagged && (
                              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 ring-orange-100 ring-1">
                                Flagged
                              </Badge>
                            )}
                          </div>
                        </div>

                        <p className="text-slate-600 text-base leading-relaxed">
                          {(gig.description)}
                        </p>
                      </div>
                    </div>

                    {/* Skills Section */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                        <Star className="w-4 h-4 text-emerald-500" />
                        Required Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {gig.skillsRequired.slice(0, 6).map((skill, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-sm bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors px-3 py-1.5 font-medium border border-emerald-200"
                          >
                            {skill.trim()}
                          </Badge>
                        ))}
                        {gig.skillsRequired.length > 6 && (
                          <Badge
                            variant="secondary"
                            className="text-sm bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1.5"
                          >
                            +{gig.skillsRequired.length - 6} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Footer Row */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-6 border-t border-slate-100">
                      {/* Date Information */}
                      <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span>Posted {getTimeAgo(gig.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span className={isExpiringSoon ? 'text-orange-600 font-medium' : ''}>
                            {daysUntilExpiry > 0
                              ? `${daysUntilExpiry} day${daysUntilExpiry === 1 ? '' : 's'} left`
                              : 'Expires today'
                            }
                          </span>
                          {isExpiringSoon && (
                            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-xs ml-2">
                              Expiring Soon
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      <button onClick={() => router.push(`/open-gig/${gig._id}`)} className="group/btn inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 lg:w-auto w-full">
                        Open Gig
                        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default DisplayAllGigs