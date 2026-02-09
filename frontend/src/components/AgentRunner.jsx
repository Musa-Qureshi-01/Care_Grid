import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
    CheckCircle2, Loader2, Play, Terminal, Database, ShieldCheck, Search, FileText,
    User, Building, CreditCard, MapPin, ChevronDown, Sparkles, AlertTriangle,
    GraduationCap, Award, Building2, Shield, XCircle
} from "lucide-react"
import { Button } from "./ui/Button"
import { Card } from "./ui/Card"
import { api } from "../services/api"
import { Skeleton } from "./ui/skeleton"

const steps = [
    { id: "validation", title: "Validation Agent", description: "Verifies NPI, License, Address via Google + NPI Registry", icon: ShieldCheck, color: "text-blue-500" },
    { id: "enrichment", title: "Enrichment Agent", description: "Fetches education, certifications, affiliations, insurances", icon: Search, color: "text-purple-500" },
    { id: "scoring", title: "QA Scoring Agent", description: "Calculates confidence score & fraud detection", icon: FileText, color: "text-amber-500" },
    { id: "directory", title: "Directory Manager", description: "Creates final profile with priority scoring", icon: Database, color: "text-emerald-500" },
]

export function AgentRunner() {
    const [inputMode, setInputMode] = useState("dropdown")
    const [selectedProvider, setSelectedProvider] = useState("")
    const [providers, setProviders] = useState([])
    const [loadingProviders, setLoadingProviders] = useState(true)
    const [formData, setFormData] = useState({
        name: "",
        npi: "",
        specialty: "",
        address: "",
        phone: ""
    })
    const [activeStep, setActiveStep] = useState(-1)
    const [logs, setLogs] = useState([])
    const [results, setResults] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)

    // Load providers from backend on mount
    useEffect(() => {
        loadProviders()
    }, [])

    const loadProviders = async () => {
        try {
            const response = await api.getProviders()
            setProviders(response.providers || [])
        } catch (error) {
            console.error("Failed to load providers:", error)
            setProviders([])
        } finally {
            setLoadingProviders(false)
        }
    }

    const addLog = (message, type = "info") => {
        setLogs(prev => [...prev, { message, type, timestamp: new Date().toLocaleTimeString() }])
    }

    const getProviderData = () => {
        if (inputMode === "dropdown" && selectedProvider) {
            return providers.find(p => p.name === selectedProvider) || null
        }
        if (formData.name) {
            return formData
        }
        return null
    }

    const runAgentPipeline = async () => {
        const providerData = getProviderData()
        if (!providerData) {
            alert("Please enter provider information or select from dropdown")
            return
        }

        setIsProcessing(true)
        setActiveStep(0)
        setLogs([])
        setResults(null)

        try {
            addLog(`🚀 Starting pipeline for ${providerData.name}...`, "info")

            // Simulate step progress for UI
            addLog("Running Validation Agent (Google Maps + NPI)...", "info")
            setActiveStep(0)
            await new Promise(r => setTimeout(r, 400))

            addLog("Running Enrichment Agent (Education, Certifications)...", "info")
            setActiveStep(1)
            await new Promise(r => setTimeout(r, 400))

            addLog("Running QA Scoring Agent (Confidence + Fraud)...", "info")
            setActiveStep(2)
            await new Promise(r => setTimeout(r, 400))

            addLog("Running Directory Manager (Final Profile)...", "info")
            setActiveStep(3)

            // Call the real API with provider data
            addLog(`📤 Sending provider data: ${providerData.name} (NPI: ${providerData.npi})`, "info")
            const response = await api.runFullPipeline(providerData)

            if (response.status === "success") {
                setResults(response)
                setActiveStep(4)

                const confidence = response.quality_data?.confidence_scores?.overall || 0
                const risk = response.quality_data?.risk_level || "UNKNOWN"
                addLog(`✓ Validation Complete for ${providerData.name}`, "success")
                addLog(`✓ Enrichment Complete - Education: ${response.enriched_data?.education || "N/A"}`, "success")
                addLog(`✓ QA Score: ${confidence}% | Risk: ${risk}`, "success")
                addLog(`✓ Provider Status: ${response.final_profile?.provider_status || "Processed"}`, "success")
                addLog(`🎉 Pipeline Completed Successfully for ${providerData.name}!`, "success")
            } else {
                throw new Error("Pipeline failed")
            }

        } catch (error) {
            addLog(`❌ Error: ${error.message}`, "error")
            setActiveStep(-1)
        } finally {
            setIsProcessing(false)
        }
    }

    const resetForm = () => {
        setFormData({ name: "", npi: "", specialty: "", address: "", phone: "" })
        setSelectedProvider("")
        setActiveStep(-1)
        setLogs([])
        setResults(null)
    }

    const getRiskColor = (risk) => {
        if (risk === "LOW") return "text-emerald-400 bg-emerald-500/20"
        if (risk === "MEDIUM") return "text-amber-400 bg-amber-500/20"
        return "text-red-400 bg-red-500/20"
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Sparkles className="h-6 w-6 text-yellow-400" />
                        Real-Time Agent Pipeline
                    </h2>
                    <p className="text-slate-400 mt-1">Run the full 4-agent LangGraph pipeline on any provider</p>
                </div>
                {results && (
                    <Button variant="outline" onClick={resetForm} className="border-slate-600 text-slate-300">
                        Run Another
                    </Button>
                )}
            </div>

            {/* Input Section */}
            <Card className="bg-slate-800/50 border-slate-700 p-6">
                {/* Mode Toggle */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setInputMode("dropdown")}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 border ${inputMode === "dropdown"
                            ? "bg-blue-600/20 border-blue-500/50 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                            : "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                            }`}
                    >
                        <Database className={`h-4 w-4 inline mr-2 transition-transform ${inputMode === "dropdown" ? "scale-110" : ""}`} />
                        Select from CSV
                    </button>
                    <button
                        onClick={() => setInputMode("manual")}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 border ${inputMode === "manual"
                            ? "bg-blue-600/20 border-blue-500/50 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                            : "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                            }`}
                    >
                        <User className={`h-4 w-4 inline mr-2 transition-transform ${inputMode === "manual" ? "scale-110" : ""}`} />
                        Enter Manually
                    </button>
                </div>

                {inputMode === "dropdown" ? (
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Select Provider from data/providers.csv
                        </label>
                        <div className="relative">
                            {loadingProviders ? (
                                <div className="space-y-2">
                                    <Skeleton className="h-12 w-full rounded-lg" />
                                </div>
                            ) : (
                                <select
                                    value={selectedProvider}
                                    onChange={(e) => setSelectedProvider(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">-- Select a Provider ({providers.length} available) --</option>
                                    {providers.map((p, i) => (
                                        <option key={i} value={p.name}>
                                            {p.name} - {p.specialty || "N/A"} ({p.address?.substring(0, 30) || ""}...)
                                        </option>
                                    ))}
                                </select>
                            )}
                            {!loadingProviders && <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                <User className="h-3.5 w-3.5 inline mr-1" /> Provider Name *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Dr. John Doe"
                                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                <MapPin className="h-3.5 w-3.5 inline mr-1" /> Address
                            </label>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                placeholder="123 Medical Drive, City, State"
                                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                <CreditCard className="h-3.5 w-3.5 inline mr-1" /> Phone
                            </label>
                            <input
                                type="text"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="(555) 123-4567"
                                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                <Building className="h-3.5 w-3.5 inline mr-1" /> Specialty
                            </label>
                            <input
                                type="text"
                                value={formData.specialty}
                                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                                placeholder="Cardiology"
                                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                )}

                {/* Run Button */}
                <div className="mt-6">
                    <Button
                        onClick={runAgentPipeline}
                        disabled={isProcessing}
                        className="w-full h-14 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-[length:200%_100%] hover:bg-[100%_0] transition-all duration-500 font-bold text-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 border border-white/10"
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                <span className="animate-pulse">Processing Pipeline...</span>
                            </>
                        ) : (
                            <>
                                <Play className="h-5 w-5 mr-2 fill-current" />
                                Run Intelligent Pipeline
                            </>
                        )}
                    </Button>
                </div>
            </Card>

            {/* Pipeline + Console */}
            {(isProcessing || activeStep >= 0) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Pipeline Steps */}
                    <Card className="bg-slate-800/50 border-slate-700 p-6">
                        <h3 className="font-bold text-white mb-4">Agent Pipeline Progress</h3>
                        <div className="space-y-3">
                            {steps.map((step, index) => {
                                const isActive = activeStep === index
                                const isCompleted = activeStep > index
                                const Icon = step.icon

                                return (
                                    <motion.div
                                        key={step.id}
                                        className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${isActive
                                            ? "bg-blue-900/20 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.15)] scale-[1.02]"
                                            : isCompleted
                                                ? "bg-emerald-900/10 border-emerald-500/30 opacity-70"
                                                : "bg-slate-800/50 border-slate-700/50 opacity-50"
                                            }`}
                                    >
                                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${isActive ? "bg-blue-500" :
                                            isCompleted ? "bg-emerald-500" : "bg-slate-700"
                                            }`}>
                                            {isCompleted ? (
                                                <CheckCircle2 className="h-5 w-5 text-white" />
                                            ) : isActive ? (
                                                <Loader2 className="h-5 w-5 text-white animate-spin" />
                                            ) : (
                                                <Icon className={`h-5 w-5 ${step.color}`} />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className={`font-semibold text-sm ${isActive ? "text-blue-400" : isCompleted ? "text-emerald-400" : "text-white"}`}>
                                                {step.title}
                                            </h4>
                                            <p className="text-xs text-slate-400">{step.description}</p>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </Card>

                    {/* Live Console */}
                    <Card className="bg-slate-950 border-slate-800 p-6">
                        <div className="flex items-center gap-2 text-slate-400 mb-4 border-b border-slate-800 pb-3">
                            <Terminal className="h-4 w-4" />
                            <span className="text-xs font-mono uppercase tracking-wider">System Output</span>
                        </div>
                        <div className="h-52 overflow-y-auto space-y-2 font-mono text-sm">
                            {logs.length === 0 && <span className="text-slate-600">Waiting for execution...</span>}
                            {logs.map((log, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex items-start gap-2 ${log.type === "error" ? "text-red-400" :
                                        log.type === "success" ? "text-emerald-400" : "text-blue-300"
                                        }`}
                                >
                                    <span className="text-slate-600 text-[10px] mt-0.5 shrink-0">{log.timestamp}</span>
                                    <span>{log.message}</span>
                                </motion.div>
                            ))}
                        </div>
                    </Card>
                </div>
            )}

            {/* Results Display */}
            {results && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                >
                    {/* Summary Card */}
                    <Card className={`p-6 border ${results.quality_data?.risk_level === "LOW"
                        ? "bg-gradient-to-r from-emerald-900/50 to-blue-900/50 border-emerald-500/50"
                        : results.quality_data?.risk_level === "MEDIUM"
                            ? "bg-gradient-to-r from-amber-900/50 to-orange-900/50 border-amber-500/50"
                            : "bg-gradient-to-r from-red-900/50 to-rose-900/50 border-red-500/50"
                        }`}>
                        <div className="flex items-center gap-4">
                            <div className={`h-16 w-16 rounded-full flex items-center justify-center ${results.quality_data?.risk_level === "LOW" ? "bg-emerald-500" :
                                results.quality_data?.risk_level === "MEDIUM" ? "bg-amber-500" : "bg-red-500"
                                }`}>
                                {results.quality_data?.risk_level === "LOW" ? (
                                    <CheckCircle2 className="h-8 w-8 text-white" />
                                ) : results.quality_data?.risk_level === "MEDIUM" ? (
                                    <AlertTriangle className="h-8 w-8 text-white" />
                                ) : (
                                    <XCircle className="h-8 w-8 text-white" />
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-white">{results.final_profile?.name || results.provider_input?.name}</h3>
                                <p className="text-slate-300">Status: <span className="font-semibold">{results.final_profile?.provider_status}</span></p>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold text-white">{results.quality_data?.confidence_scores?.overall || 0}%</div>
                                <div className={`text-sm font-medium px-3 py-1 rounded-full inline-block ${getRiskColor(results.quality_data?.risk_level)}`}>
                                    {results.quality_data?.risk_level} RISK
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Detail Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Enriched Data */}
                        <Card className="bg-slate-800/50 border-slate-700 p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <GraduationCap className="h-5 w-5 text-purple-400" />
                                <h4 className="font-semibold text-white">Education</h4>
                            </div>
                            <p className="text-sm text-slate-300">{results.enriched_data?.education || "N/A"}</p>
                        </Card>

                        <Card className="bg-slate-800/50 border-slate-700 p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Award className="h-5 w-5 text-amber-400" />
                                <h4 className="font-semibold text-white">Board Certification</h4>
                            </div>
                            <p className="text-sm text-slate-300">{results.enriched_data?.board_certification || "N/A"}</p>
                        </Card>

                        <Card className="bg-slate-800/50 border-slate-700 p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Building2 className="h-5 w-5 text-blue-400" />
                                <h4 className="font-semibold text-white">Affiliations</h4>
                            </div>
                            <p className="text-sm text-slate-300">
                                {Array.isArray(results.enriched_data?.affiliations)
                                    ? results.enriched_data.affiliations.join(", ")
                                    : results.enriched_data?.affiliations || "N/A"}
                            </p>
                        </Card>

                        <Card className="bg-slate-800/50 border-slate-700 p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Shield className="h-5 w-5 text-emerald-400" />
                                <h4 className="font-semibold text-white">Fraud Score</h4>
                            </div>
                            <p className="text-2xl font-bold text-white">{results.quality_data?.fraud_score || 0}</p>
                            {results.quality_data?.fraud_flags?.length > 0 && (
                                <p className="text-xs text-red-400 mt-1">
                                    Flags: {results.quality_data.fraud_flags.join(", ")}
                                </p>
                            )}
                        </Card>
                    </div>

                    {/* Full JSON (Collapsible) */}
                    <details className="bg-slate-950 border border-slate-800 rounded-xl">
                        <summary className="px-4 py-3 cursor-pointer text-slate-400 hover:text-white font-medium">
                            View Full Pipeline Output (JSON)
                        </summary>
                        <pre className="px-4 pb-4 text-xs font-mono text-slate-300 overflow-x-auto">
                            {JSON.stringify(results, null, 2)}
                        </pre>
                    </details>
                </motion.div>
            )}
        </div>
    )
}
