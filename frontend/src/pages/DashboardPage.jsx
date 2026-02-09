import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { DashboardLayout } from "../components/dashboard/DashboardLayout"
import { Overview } from "../components/dashboard/Overview"
import { Insights } from "../components/dashboard/Insights"
import { BatchProcessing } from "../components/BatchProcessing"
import { AgentOperations } from "../components/dashboard/AgentOperations"
import { JobHistory } from "../components/JobHistory"
import { motion, AnimatePresence } from "framer-motion"

export default function DashboardPage() {
    const [searchParams] = useSearchParams()
    const [activeTab, setActiveTab] = useState("overview")

    useEffect(() => {
        const tab = searchParams.get("tab")
        if (tab) {
            setActiveTab(tab)
        }
    }, [searchParams])

    return (
        <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
            {/* Global Background Effects for Dashboard */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 blur-[100px] rounded-full mix-blend-screen opacity-50" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full mix-blend-screen opacity-40" />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                >
                    {activeTab === "overview" && <Overview />}
                    {activeTab === "agent" && <AgentOperations />}
                    {activeTab === "batch" && <BatchProcessing />}
                    {activeTab === "logs" && (
                        <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                                System Logs
                            </h1>
                            <div className="flex-1 bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-sm overflow-hidden flex flex-col">
                                <JobHistory />
                            </div>
                        </div>
                    )}
                    {activeTab === "insights" && <Insights />}
                </motion.div>
            </AnimatePresence>
        </DashboardLayout>
    )
}

