"use client"

import React, { useState, useEffect, FC } from 'react';
import { Clock, User, Briefcase, Zap, RefreshCw, Heart, MessageCircle, Share, Bookmark } from 'lucide-react';

interface ActivityMetadata {
  FullName: string;
  gigTitle: string;
}

interface ActivityItem {
  _id: string;
  userId: string;
  gigId: string;
  type: string;
  metadata: ActivityMetadata;
  createdAt: string;
}

interface ApiResponse {
  activityData: ActivityItem[];
}

const Activity: FC = () => {
  const [activityData, setActivityData] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivityData = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/activity/fetch-activities", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch activity data');
        }

        const data: ApiResponse = await response.json();
        setActivityData(data.activityData || []);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch data", error);
        setError(error instanceof Error ? error.message : 'Unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivityData();
  }, []);

  const formatTimeAgo = (dateString: string): string => {
    const now = new Date();
    const activityDate = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - activityDate.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return activityDate.toLocaleDateString();
  };

  const getActivityText = (activity: ActivityItem): string => {
    const { type } = activity;

    switch (type) {
      case 'pings':
        return 'pinged the gig';
      case 'posted':
        return 'posted a new gig';
      default:
        return 'interacted with';
    }
  };



  const refetchData = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/activity/fetch-activities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch activity data');
      }

      const data: ApiResponse = await response.json();
      setActivityData(data.activityData || []);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch data", error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && activityData.length === 0) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-lg border border-border p-8 text-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading activity data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-lg border border-border p-8 text-center">
            <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Failed to load activity</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <button
              onClick={refetchData}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Live Activity Feed</h1>
              <p className="text-muted-foreground">Track user interactions and gig engagements</p>
            </div>
          </div>

          <button
            onClick={refetchData}
            disabled={isLoading}
            className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/80 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Activity List */}
        <div className="bg-card rounded-lg border border-border">

          <div className="divide-y divide-border">
            {activityData.length > 0 ? (
              activityData.map((activity: ActivityItem) => (
                <div key={activity._id} className="p-6 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-primary-foreground" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex items-center gap-1 text-muted-foreground text-sm">
                          <Clock className="w-3 h-3" />
                          {formatTimeAgo(activity.createdAt)}
                        </div>
                      </div>

                      {/* Instagram-like activity text */}
                      <p className="text-sm text-foreground mb-3">
                        <span className="font-semibold">{activity.metadata.FullName}</span>{' '}
                        <span className="text-muted-foreground">{getActivityText(activity)} </span>
                        <span className="font-medium text-primary">{activity.metadata.gigTitle}</span>
                      </p>


                      <div className="flex items-center gap-2 bg-secondary/30 rounded-md px-3 py-2 w-fit">
                        <Briefcase className="w-4 h-4 text-secondary-foreground" />
                        <span className="text-sm font-medium text-secondary-foreground">
                          {activity.metadata.gigTitle}
                        </span>
                      </div>
                    </div>

                    {/* Action indicator */}
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2"></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No activity yet</h3>
                <p className="text-muted-foreground">Activity will appear here when users interact with gigs</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activity;