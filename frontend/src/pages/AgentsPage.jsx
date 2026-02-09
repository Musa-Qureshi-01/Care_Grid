import { AgentCard } from "../components/AgentCard"
import { motion } from "framer-motion"
import { Activity, Server, Shield, Zap, Loader2, Play, Users } from "lucide-react"
import { api } from "../services/api"
import { useState, useEffect } from "react"
import { AgentWorkflow } from "../components/AgentWorkflow"
import { BatchProcessing } from "../components/BatchProcessing"
import { AgentAutomation } from "../components/AgentAutomation"
import { Button } from "@/components/ui/button"

export function AgentsPage() {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState("live") // 'live' | 'batch' | 'monitor'

    useEffect(() => {
        async function loadStats() {
            try {
                const data = await api.getAnalytics()
                setStats(data)
            } catch (e) {
                console.error("Failed to load agent stats", e)
            } finally {
                setLoading(false)
            }
        }
        loadStats()
    }, [])

    return (
        <div className="space-y-8 relative">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[100px] rounded-full mix-blend-screen opacity-50 pointer-events-none -z-10" />

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-3xl font-bold text-slate-900 tracking-tight"
                    >
                        Agent Network Status
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-500 mt-2"
                    >
                        Real-time monitoring of your active AI workforce.
                    </motion.p>
                </div>

                <div className="flex space-x-2 bg-slate-100 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab("live")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "live" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
                    >
                        <span className="flex items-center gap-2"><Zap className="h-4 w-4" /> Live Studio</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("batch")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "batch" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
                    >
                        <span className="flex items-center gap-2"><Users className="h-4 w-4" /> Batch Operations</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("monitor")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "monitor" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
                    >
                        <span className="flex items-center gap-2"><Activity className="h-4 w-4" /> Network Monitor</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("automation")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "automation" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
                    >
                        <span className="flex items-center gap-2"><Play className="h-4 w-4" /> Automation</span>
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="min-h-[600px]">
                {activeTab === "monitor" && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        {/* Status Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {[
                                { label: "Active Threads", value: loading ? "..." : "24", icon: Activity, color: "text-blue-600", bg: "bg-blue-50" },
                                { label: "Providers Verified", value: loading ? "..." : (stats?.total_providers || 0).toLocaleString(), icon: Shield, color: "text-indigo-600", bg: "bg-indigo-50" },
                                { label: "Accuracy Score", value: loading ? "..." : `${stats?.validation_accuracy}%`, icon: Server, color: "text-emerald-600", bg: "bg-emerald-50" },
                                { label: "Avg Response Time", value: "0.8s", icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
                            ].map((stat, i) => (
                                <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
                                    <div className={`p-3 rounded-xl ${stat.bg}`}>
                                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-slate-900 flex items-center">
                                            {loading && stat.value === "..." ? <Loader2 className="h-4 w-4 animate-spin" /> : stat.value}
                                        </div>
                                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{stat.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Agents Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <AgentCard
                                index={0}
                                title="Validation Agent"
                                role="Verifier"
                                description="Cross-references provider data against NPI registry, state boards, and federal databases."
                            />
                            <AgentCard
                                index={1}
                                title="Enrichment Agent"
                                role="Researcher"
                                description="Scrapes and aggregates missing data points like office hours, languages spoken, and telehealth availability."
                            />
                            <AgentCard
                                index={2}
                                title="QA Scoring Agent"
                                role="Auditor"
                                description="Assigns confidence scores to every record based on data completeness and source reliability."
                            />
                            <AgentCard
                                index={3}
                                title="Directory Manager"
                                role="Administrator"
                                description="Orchestrates updates to your core database, ensuring changes are propagated correctly."
                            />
                        </div>
                    </motion.div>
                )}

                {activeTab === "live" && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <AgentWorkflow />
                    </motion.div>
                )}

                {activeTab === "automation" && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <AgentAutomation />
                    </motion.div>
                )}

                {activeTab === "batch" && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <BatchProcessing />
                    </motion.div>
                )}
            </div>
        </div>
    )
}
