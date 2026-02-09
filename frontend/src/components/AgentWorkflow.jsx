import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, Circle, Loader2, Play, ChevronRight, Terminal, Database, ShieldCheck, Search, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "../lib/utils"
import { api } from "../services/api"

const steps = [
    {
        id: "validation",
        title: "Validation Agent",
        description: "Verifies NPI, State License, and DEA.",
        icon: ShieldCheck,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        border: "border-blue-200"
    },
    {
        id: "enrichment",
        title: "Enrichment Agent",
        description: "Scrapes web for missing office hours & fax.",
        icon: Search,
        color: "text-purple-500",
        bg: "bg-purple-500/10",
        border: "border-purple-200"
    },
    {
        id: "scoring",
        title: "QA Scoring Agent",
        description: "Calculates confidence score (0-100%).",
        icon: FileText,
        color: "text-amber-500",
        bg: "bg-amber-500/10",
        border: "border-amber-200"
    },
    {
        id: "directory",
        title: "Directory Manager",
        description: "Commits clean record to Golden Database.",
        icon: Database,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
        border: "border-emerald-200"
    }
]

export function AgentWorkflow() {
    const [activeStep, setActiveStep] = useState(-1) // -1: not started
    const [logs, setLogs] = useState([])
    const [results, setResults] = useState({})
    const [isProcessing, setIsProcessing] = useState(false)

    const addLog = (message, type = "info") => {
        setLogs(prev => [...prev, { message, type, timestamp: new Date().toLocaleTimeString() }])
    }

    const runPipeline = async () => {
        setIsProcessing(true)
        setActiveStep(0)
        setLogs([])
        setResults({})

        // Mock Input Data
        const providerData = {
            name: "Dr. Sarah Smith",
            npi: "1234567890",
            specialty: "Cardiology",
            address: "123 Heart Lane, NY"
        }

        try {
            // Step 1: Validation
            addLog("Starting Validation Agent...", "info")
            const valRes = await api.validateProvider(providerData)
            addLog(`Validation Complete: Verified ${valRes.data.validated_data?.name}`, "success")
            setResults(prev => ({ ...prev, validation: valRes.data }))
            setActiveStep(1)

            // Step 2: Enrichment
            await new Promise(r => setTimeout(r, 800)) // Visual delay
            addLog("Starting Enrichment Agent...", "info")
            const enrichRes = await api.enrichProvider(valRes.data.validated_data || providerData)
            addLog(`Enrichment Complete: Found ${Object.keys(enrichRes.data.enriched_fields || {}).length} new fields`, "success")
            setResults(prev => ({ ...prev, enrichment: enrichRes.data }))
            setActiveStep(2)

            // Step 3: Scoring
            await new Promise(r => setTimeout(r, 800))
            addLog("Starting QA Scoring Agent...", "info")
            const scoreRes = await api.scoreProvider(enrichRes.data.enriched_data || providerData)
            addLog(`QA Score Calculated: ${scoreRes.data.trust_score}%`, "success")
            setResults(prev => ({ ...prev, scoring: scoreRes.data }))
            setActiveStep(3)

            // Step 4: Directory
            await new Promise(r => setTimeout(r, 800))
            addLog("Updating Directory...", "info")
            const dirRes = await api.updateDirectory(scoreRes.data.scored_data || providerData)
            addLog("Directory Updated Successfully", "success")
            setResults(prev => ({ ...prev, directory: dirRes.data }))
            setActiveStep(4) // Complete

            addLog("Pipeline Completed Successfully", "success")

        } catch (error) {
            addLog(`Pipeline Error: ${error.message}`, "error")
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            {/* Left: Pipeline Visualizer */}
            <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-sm">
                <div className="mb-6 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-slate-900">Agent Pipeline</h3>
                    <Button
                        size="sm"
                        onClick={runPipeline}
                        disabled={isProcessing}
                        className={cn("transition-all", isProcessing ? "opacity-50" : "")}
                    >
                        {isProcessing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                        {isProcessing ? "Running..." : "Run Pipeline"}
                    </Button>
                </div>

                <div className="space-y-6 relative flex-1">
                    {/* Connecting Line */}
                    <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-slate-100 -z-10" />

                    {steps.map((step, index) => {
                        const isActive = activeStep === index
                        const isCompleted = activeStep > index
                        const Icon = step.icon

                        return (
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0.5, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={cn(
                                    "relative flex items-start space-x-4 p-4 rounded-xl border transition-all duration-300",
                                    isActive ? "bg-white border-blue-500 shadow-md scale-105" : "bg-white border-transparent",
                                    isCompleted ? "opacity-60" : ""
                                )}
                            >
                                <div className={cn(
                                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2",
                                    isActive ? "border-blue-500 bg-blue-50" :
                                        isCompleted ? "border-green-500 bg-green-50" : "border-slate-100 bg-slate-50"
                                )}>
                                    {isCompleted ? (
                                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                                    ) : isActive ? (
                                        <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
                                    ) : (
                                        <Icon className={cn("h-5 w-5", step.color)} />
                                    )}
                                </div>
                                <div>
                                    <h4 className={cn("font-semibold", isActive ? "text-blue-700" : "text-slate-900")}>{step.title}</h4>
                                    <p className="text-xs text-slate-500 mt-1">{step.description}</p>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>

            {/* Right: Live Console & Data View */}
            <div className="lg:col-span-2 flex flex-col gap-6">

                {/* Console Log */}
                <div className="bg-slate-950 rounded-2xl p-6 shadow-lg flex flex-col h-1/2 overflow-hidden border border-slate-800">
                    <div className="flex items-center space-x-2 text-slate-400 mb-4 border-b border-slate-800 pb-2">
                        <Terminal className="h-4 w-4" />
                        <span className="text-xs font-mono uppercase tracking-wider">System Output</span>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-2 font-mono text-sm">
                        {logs.length === 0 && <span className="text-slate-600">Waiting for execution...</span>}
                        {logs.map((log, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={cn(
                                    "flex items-start space-x-2",
                                    log.type === "error" ? "text-red-400" :
                                        log.type === "success" ? "text-emerald-400" : "text-blue-300"
                                )}
                            >
                                <span className="text-slate-600 text-[10px] mt-0.5">{log.timestamp}</span>
                                <span>{log.type === "success" && "✓ "} {log.message}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* JSON Data Viewer */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col h-1/2 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 bg-gradient-to-l from-white via-white to-transparent">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-1 rounded">Live Data Object</span>
                    </div>
                    <div className="flex-1 overflow-auto">
                        <pre className="text-xs font-mono text-slate-700 leading-relaxed">
                            {Object.keys(results).length > 0 ? JSON.stringify(results, null, 2) : "// Data will appear here..."}
                        </pre>
                    </div>
                </div>

            </div>
        </div>
    )
}
