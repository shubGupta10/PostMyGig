import React from 'react'
import { Zap } from "lucide-react"
import { ActivityCard } from "@/components/activity/ActivityCard"
import { fetchActivityData } from "./services/activityService"
import type { ActivityItem } from "./types"

export default async function ActivityPage() {
  const activities = await fetchActivityData()

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-4">
          {activities.length > 0 ? (
            activities.map((activity: ActivityItem) => (
              <ActivityCard key={activity._id} activity={activity} />
            ))
          ) : (
            <div className="bg-muted rounded-xl p-10 text-center border border-border">
              <Zap className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-foreground font-semibold">No activity yet</p>
              <p className="text-muted-foreground text-sm mt-1">Activity will appear here when users interact with gigs</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}