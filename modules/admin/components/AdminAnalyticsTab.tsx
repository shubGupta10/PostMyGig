import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie,
    XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell
} from "recharts"
import { Loader2, TrendingUp } from "lucide-react"

export default function AdminAnalyticsTab({ chartData }: { chartData: any }) {
    if (!chartData) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    const renderEmptyState = (message: string) => (
        <div className="flex flex-col h-full w-full items-center justify-center text-muted-foreground">
            <TrendingUp className="w-8 h-8 mb-2 opacity-20" />
            <p className="text-sm font-medium">{message}</p>
        </div>
    )

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            
            {/* User Growth Chart */}
            <Card className="border-2 border-border rounded-2xl shadow-sm bg-card">
                <CardHeader>
                    <CardTitle className="text-lg">User Growth (Last 30 Days)</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] w-full">
                    {chartData.userGrowth?.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData.userGrowth} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                <XAxis 
                                    dataKey="_id" 
                                    tickFormatter={(str) => {
                                        const date = new Date(str);
                                        return `${date.getMonth() + 1}/${date.getDate()}`;
                                    }}
                                    stroke="var(--muted-foreground)"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis 
                                    stroke="var(--muted-foreground)"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(val) => Math.floor(val).toString()}
                                />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: "var(--background)", border: "2px solid var(--border)", borderRadius: "16px", color: "var(--foreground)" }}
                                />
                                <Line type="monotone" dataKey="count" name="New Users" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, fill: "var(--primary)", strokeWidth: 0 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        renderEmptyState("No user growth data in the last 30 days")
                    )}
                </CardContent>
            </Card>

            {/* Gigs Posted Chart */}
            <Card className="border-2 border-border rounded-2xl shadow-sm bg-card">
                <CardHeader>
                    <CardTitle className="text-lg">Gigs Posted (Last 30 Days)</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] w-full">
                    {chartData.gigGrowth?.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData.gigGrowth} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                <XAxis 
                                    dataKey="_id" 
                                    tickFormatter={(str) => {
                                        const date = new Date(str);
                                        return `${date.getMonth() + 1}/${date.getDate()}`;
                                    }}
                                    stroke="var(--muted-foreground)"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis 
                                    stroke="var(--muted-foreground)"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(val) => Math.floor(val).toString()}
                                />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: "var(--background)", border: "2px solid var(--border)", borderRadius: "16px", color: "var(--foreground)" }}
                                    cursor={{ fill: "var(--muted)" }} 
                                />
                                <Bar dataKey="count" name="New Gigs" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        renderEmptyState("No gigs posted in the last 30 days")
                    )}
                </CardContent>
            </Card>

            {/* Pings/Engagement Chart */}
            <Card className="border-2 border-border rounded-2xl shadow-sm bg-card">
                <CardHeader>
                    <CardTitle className="text-lg">Platform Engagement (Pings)</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] w-full">
                    {chartData.pingGrowth?.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData.pingGrowth} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <defs>
                                    <linearGradient id="colorPings" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                <XAxis 
                                    dataKey="_id" 
                                    tickFormatter={(str) => {
                                        const date = new Date(str);
                                        return `${date.getMonth() + 1}/${date.getDate()}`;
                                    }}
                                    stroke="var(--muted-foreground)"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis 
                                    stroke="var(--muted-foreground)"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(val) => Math.floor(val).toString()}
                                />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: "var(--background)", border: "2px solid var(--border)", borderRadius: "16px", color: "var(--foreground)" }}
                                />
                                <Area type="monotone" dataKey="count" name="Pings Sent" stroke="var(--primary)" fillOpacity={1} fill="url(#colorPings)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        renderEmptyState("No pings sent in the last 30 days")
                    )}
                </CardContent>
            </Card>

            {/* Role Distribution Pie Chart */}
            <Card className="border-2 border-border rounded-2xl shadow-sm bg-card">
                <CardHeader>
                    <CardTitle className="text-lg">User Role Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] w-full flex items-center justify-center">
                    {chartData.roleDistribution?.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData.roleDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="count"
                                    nameKey="_id"
                                    label={({ name, value }: any) => `${name} (${value})`}
                                >
                                    {chartData.roleDistribution?.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "var(--primary)" : "var(--muted-foreground)"} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ backgroundColor: "var(--background)", border: "2px solid var(--border)", borderRadius: "16px", color: "var(--foreground)" }}
                                    formatter={(value: any, name: any) => {
                                        const formattedName = typeof name === 'string' ? name.charAt(0).toUpperCase() + name.slice(1) : name;
                                        return [value, formattedName];
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        renderEmptyState("No role data available")
                    )}
                </CardContent>
            </Card>

        </div>
    )
}