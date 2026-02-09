import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Activity, Users, AlertTriangle, CheckCircle2 } from "lucide-react"
import { Skeleton } from "../ui/skeleton"
import { AnalyticsCharts } from "../AnalyticsCharts"
import { JobHistory } from "../JobHistory"

/* Mock Stats Data */
const StatCard = ({ title, value, change, icon: Icon, color, isLoading }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md relative overflow-hidden group hover:bg-white/10 transition-all duration-300 shadow-lg hover:shadow-xl"
    >
        {isLoading ? (
            <div className="space-y-3 relative z-10">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
            </div>
        ) : (
            <>
                <div className={`absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-300 ${color} blur-2xl`}>
                    <Icon size={120} />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-lg bg-white/5 ${color} text-white`}>
                            <Icon size={20} />
                        </div>
                        <h3 className="text-slate-400 font-medium text-sm">{title}</h3>
                    </div>

                    <div className="flex items-baseline gap-2">
                        <h2 className="text-3xl font-bold text-white">{value}</h2>
                        <span className={`text-xs font-medium ${change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                            {change}
                        </span>
                    </div>
                </div>
            </>
        )}
    </motion.div>
)

export function Overview() {
    const [isLoading, setIsLoading] = useState(true)
    const [stats, setStats] = useState({
        total_providers: 0,
        validation_success_rate: 0,
        high_risk_count: 0,
        avg_confidence: 0
    })

    // Fetch real stats from backend
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/jobs/stats")
                if (response.ok) {
                    const data = await response.json()
                    setStats(data)
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchStats()
        // Refresh every 30 seconds
        const interval = setInterval(fetchStats, 30000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                    System Overview
                </h1>
                <p className="text-slate-400 mt-1">Real-time metrics and performance indicators.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    isLoading={isLoading}
                    title="Total Jobs Run"
                    value={(stats.total_providers || 0).toLocaleString()}
                    change="Active"
                    icon={Users}
                    color="bg-blue-500"
                />
                <StatCard
                    isLoading={isLoading}
                    title="Success Rate"
                    value={`${stats.validation_success_rate}%`}
                    change="Validation"
                    icon={CheckCircle2}
                    color="bg-green-500"
                />
                <StatCard
                    isLoading={isLoading}
                    title="Issues Detected"
                    value={stats.high_risk_count}
                    change="Rel. to failures"
                    icon={AlertTriangle}
                    color="bg-red-500"
                />
                <StatCard
                    isLoading={isLoading}
                    title="Avg Confidence"
                    value={stats.avg_confidence}
                    change="AI Score"
                    icon={Activity}
                    color="bg-purple-500"
                />
            </div>

            {/* Analytics and Job History */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-6">
                    {/* Replace Mocks with Real Analytics Charts */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                        <AnalyticsCharts />
                    </div>
                </div>

                <div className="xl:col-span-1">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm h-full max-h-[500px] overflow-hidden">
                        <JobHistory />
                    </div>
                </div>
            </div>
        </div >
    )
}
