import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, CheckCircle2, AlertCircle, Search, MapPin, Building2, Terminal, FileBadge, Loader2 } from "lucide-react"
import { api } from "@/services/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Import Local Data
// Import Local Data
// import { providersData } from "../../data/providers" 

export function AgentOperations() {
    const [formData, setFormData] = useState({
        name: "",
        npi: "",
        address: "",
        specialty: ""
    })

    // Hardcoded Fallback Providers
    const [providers, setProviders] = useState([])

    // Execution State
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [error, setError] = useState(null)
    const [logs, setLogs] = useState([])
    const [currentStep, setCurrentStep] = useState(0) // For progress tracking

    // Load providers from Backend API
    useEffect(() => {
        const fetchProviders = async () => {
            try {
                const res = await fetch('http://localhost:8000/api/providers')
                if (res.ok) {
                    const data = await res.json()
                    if (data.providers) {
                        // Sort alphabetically
                        if (Array.isArray(data.providers)) {
                            const sorted = data.providers.sort((a, b) => a.name.localeCompare(b.name));
                            setProviders(sorted);
                        } else {
                            setProviders(data.providers);
                        }
                    }
                }
            } catch (e) {
                console.error("Failed to load providers", e)
            }
        }
        fetchProviders()
    }, [])

    const handleSelectProvider = (providerName) => {
        const selected = providers.find(p => p.name === providerName)
        if (selected) {
            setFormData({
                name: selected.name,
                npi: selected.npi ? String(selected.npi) : "",
                address: selected.address || "",
                specialty: selected.specialty || ""
            })
        }
    }

    const addLog = (msg) => setLogs(prev => [...prev, `> ${msg}`])

    const handleRun = async () => {
        if (!formData.name) {
            setError("Provider Name is required")
            return
        }

        setLoading(true)
        setError(null)
        setResult(null)
        setLogs([])
        setCurrentStep(1)

        try {
            const response = await fetch('http://localhost:8000/api/run-stream', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    npi: formData.npi,
                    address: formData.address,
                    specialty: formData.specialty
                })
            })

            if (!response.ok) throw new Error("Failed to start pipeline")

            const reader = response.body.getReader()
            const decoder = new TextDecoder()
            let buffer = ""

            // Live result accumulator
            let liveResult = {
                validated_data: {}, // Validation Agent
                enriched_data: {},  // Enrichment Agent
                quality_data: {},   // QA Agent
                final_profile: {},  // Directory Agent
                summary_report: {}  // Directory Agent
            }

            while (true) {
                const { done, value } = await reader.read()
                if (done) break

                buffer += decoder.decode(value, { stream: true })
                const lines = buffer.split('\n\n')
                buffer = lines.pop()

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const dataStr = line.slice(6)
                        if (dataStr === '[DONE]') break

                        try {
                            const event = JSON.parse(dataStr)

                            if (event.type === 'on_tool_start') {
                                addLog(`Running tool: ${event.name}...`)
                            }
                            else if (event.type === 'on_tool_end') {
                                addLog(`Tool ${event.name} finished.`)
                            }

                            if (event.type === 'on_chain_end') {
                                const output = event.output || {}

                                // Validation Agent Output
                                if (output.validated_data) {
                                    setCurrentStep(2)
                                    addLog("Validation Agent completed.")
                                    liveResult.validated_data = {
                                        ...output.validated_data,
                                        npi_result: output.npi_result,
                                        google_result: output.google_result
                                    }
                                }

                                // Enrichment Agent Output
                                if (output.enriched_data) {
                                    setCurrentStep(3)
                                    addLog("Enrichment Agent completed.")
                                    liveResult.enriched_data = output.enriched_data
                                }

                                // QA Agent Output
                                if (output.quality_data) {
                                    setCurrentStep(4)
                                    addLog("QA Agent completed.")
                                    liveResult.quality_data = output.quality_data
                                }

                                // Directory Agent Output (Final)
                                if (output.final_profile) {
                                    setCurrentStep(5)
                                    addLog("Directory Agent completed.")
                                    liveResult.final_profile = output.final_profile
                                    liveResult.summary_report = output.summary_report
                                    liveResult.last_updated = new Date().toLocaleTimeString()

                                    setResult({ ...liveResult })
                                }
                            }
                        } catch (e) {
                            console.error("Error parsing SSE event", e)
                        }
                    }
                }
            }
        } catch (err) {
            console.error(err)
            setError("Pipeline execution failed. Is the backend running?")
            addLog("Error: Connection failed.")
        } finally {
            setLoading(false)
        }
    }

    const handleDownload = (type) => {
        if (!result) return

        let data, filename, mimeType;
        if (type === 'json') {
            data = JSON.stringify(result.summary_report, null, 2)
            filename = 'provider_summary.json'
            mimeType = 'application/json'
        } else if (type === 'csv') {
            // Simple flatten for CSV
            const headers = Object.keys(result.final_profile).join(',')
            const values = Object.values(result.final_profile).map(v => `"${v}"`).join(',')
            data = `${headers}\n${values}`
            filename = 'provider_directory_row.csv'
            mimeType = 'text/csv'
        }

        const blob = new Blob([data], { type: mimeType })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = filename
        a.click()
    }

    // -- Styling similar to Streamlit CSS --
    const cardClass = "bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-xl transition-all duration-300 hover:bg-white/[0.07]"
    const neonButtonClass = "flex items-center justify-center px-6 py-3 rounded-lg bg-slate-700 text-white font-semibold transition-all duration-200 hover:scale-105 hover:shadow-[0_0_20px_rgba(148,163,184,0.5)] disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
    const metricCardClass = "bg-[#151824] p-4 rounded-xl border border-white/10 text-center shadow-lg"

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-20 animate-in fade-in duration-700">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-white">Agent Execution Studio</h1>
                <p className="text-slate-400">Run the full 4-Agent Pipeline for comprehensive provider validation</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT COLUMN: Input & Controls */}
                <div className="lg:col-span-1 space-y-6">
                    <div className={cardClass}>
                        <h3 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">Provider Input</h3>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-slate-300">Use dataset provider?</Label>
                                <Select onValueChange={handleSelectProvider}>
                                    <SelectTrigger className="bg-black/20 border-white/10 text-white">
                                        <SelectValue placeholder="Choose from CSV..." />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-white/10 text-white">
                                        {providers.map((p, i) => (
                                            <SelectItem key={i} value={p.name}>{p.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-slate-300">Name</Label>
                                <Input
                                    className="bg-black/20 border-white/10 text-white"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-300">Address</Label>
                                <Input
                                    className="bg-black/20 border-white/10 text-white"
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-300">Phone</Label>
                                <Input
                                    className="bg-black/20 border-white/10 text-white"
                                    value={formData.phone || ""}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-300">Specialty</Label>
                                <Input
                                    className="bg-black/20 border-white/10 text-white"
                                    value={formData.specialty}
                                    onChange={e => setFormData({ ...formData, specialty: e.target.value })}
                                />
                            </div>

                            <button
                                onClick={handleRun}
                                disabled={loading}
                                className={cn(neonButtonClass, "w-full mt-4")}
                            >
                                {loading ? (
                                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Running...</>
                                ) : (
                                    <><Play className="mr-2 h-5 w-5" /> Run Full 4-Agent Pipeline</>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Logs Panel */}
                    {(loading || logs.length > 0) && (
                        <div className="bg-black/40 border border-white/10 rounded-xl p-4 font-mono text-xs max-h-[300px] overflow-y-auto custom-scrollbar">
                            <div className="flex items-center gap-2 text-slate-400 mb-2 border-b border-white/10 pb-2 sticky top-0 bg-black/40 backdrop-blur">
                                <Terminal size={14} /> Pipeline Logs
                            </div>
                            <div className="space-y-1">
                                {logs.map((log, i) => (
                                    <div key={i} className="text-slate-300 break-words">{log}</div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT COLUMN: Output Tabs */}
                <div className="lg:col-span-2">
                    {!result ? (
                        <div className="h-full flex flex-col items-center justify-center p-12 text-slate-500 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.02]">
                            <Play size={48} className="mb-4 opacity-20" />
                            <p className="text-lg">Ready to Launch</p>
                            <p className="text-sm opacity-60">Enter details and click Run to see agent outputs here.</p>
                        </div>
                    ) : (
                        <Tabs defaultValue="validation" className="w-full">
                            <div className="flex justify-between items-center mb-6 bg-black/40 p-1 rounded-xl">
                                <TabsList className="grid w-full grid-cols-4 bg-transparent">
                                    <TabsTrigger value="validation">Validation</TabsTrigger>
                                    <TabsTrigger value="enrichment">Enrichment</TabsTrigger>
                                    <TabsTrigger value="qa">QA / Risks</TabsTrigger>
                                    <TabsTrigger value="directory">Directory</TabsTrigger>
                                </TabsList>
                                {result.last_updated && (
                                    <span className="text-xs text-slate-500 px-4 whitespace-nowrap">
                                        Last Run: {result.last_updated}
                                    </span>
                                )}
                            </div>

                            {/* Validation Tab */}
                            <TabsContent value="validation" className="animate-in fade-in slide-in-from-bottom-4">
                                <div className={cardClass}>
                                    <div className="flex items-center gap-3 mb-6">
                                        <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">Data Validation Agent</Badge>
                                        <p className="text-sm text-slate-400">Validates phone, address & specialty using Google & NPI.</p>
                                    </div>
                                    <AnimatePresence>
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                            <div className="bg-black/30 p-4 rounded-lg border border-white/5">
                                                <h4 className="text-white font-semibold mb-2 flex items-center gap-2"><MapPin size={16} className="text-blue-400" /> Google Search Data</h4>
                                                <pre className="text-xs text-slate-300 overflow-auto max-h-[200px]">{JSON.stringify(result.validated_data?.google_result || {}, null, 2)}</pre>
                                            </div>
                                            <div className="bg-black/30 p-4 rounded-lg border border-white/5">
                                                <h4 className="text-white font-semibold mb-2 flex items-center gap-2"><FileBadge size={16} className="text-purple-400" /> NPI Registry Data</h4>
                                                <pre className="text-xs text-slate-300 overflow-auto max-h-[200px]">{JSON.stringify(result.validated_data?.npi_result || {}, null, 2)}</pre>
                                            </div>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </TabsContent>

                            {/* Enrichment Tab */}
                            <TabsContent value="enrichment" className="animate-in fade-in slide-in-from-bottom-4">
                                <div className={cardClass}>
                                    <div className="flex items-center gap-3 mb-6">
                                        <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20">Information Enrichment Agent</Badge>
                                        <p className="text-sm text-slate-400">Enriches profile with education, certifications & affiliations.</p>
                                    </div>
                                    <div className="bg-black/30 p-4 rounded-lg border border-white/5">
                                        <pre className="text-xs text-slate-300 overflow-auto max-h-[400px]">{JSON.stringify(result.enriched_data, null, 2)}</pre>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* QA Tab */}
                            <TabsContent value="qa" className="animate-in fade-in slide-in-from-bottom-4">
                                <div className={cardClass}>
                                    <div className="flex items-center gap-3 mb-6">
                                        <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/20">Quality Assurance Agent</Badge>
                                        <p className="text-sm text-slate-400">Computes confidence scores, flags discrepancies & risk.</p>
                                    </div>

                                    {/* Metrics Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                        <div className={metricCardClass}>
                                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Phone</p>
                                            <p className="text-2xl font-bold text-white">{result.quality_data?.confidence_scores?.phone || 0.0}</p>
                                        </div>
                                        <div className={metricCardClass}>
                                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Address</p>
                                            <p className="text-2xl font-bold text-white">{result.quality_data?.confidence_scores?.address || 0.0}</p>
                                        </div>
                                        <div className={metricCardClass}>
                                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Specialty</p>
                                            <p className="text-2xl font-bold text-white">{result.quality_data?.confidence_scores?.specialty || 0.0}</p>
                                        </div>
                                        <div className={metricCardClass}>
                                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Overall</p>
                                            <p className="text-2xl font-bold text-emerald-400">{result.quality_data?.confidence_scores?.overall || 0.0}</p>
                                        </div>
                                    </div>

                                    <div className="bg-black/30 p-4 rounded-lg border border-white/5">
                                        <h4 className="text-white font-semibold mb-2">Detailed QA Report</h4>
                                        <pre className="text-xs text-slate-300 overflow-auto max-h-[200px]">{JSON.stringify(result.quality_data, null, 2)}</pre>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Directory Tab */}
                            <TabsContent value="directory" className="animate-in fade-in slide-in-from-bottom-4">
                                <div className={cardClass}>
                                    <div className="flex items-center gap-3 mb-6">
                                        <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">Directory Management Agent</Badge>
                                        <p className="text-sm text-slate-400">Produces final directory entry and summary report.</p>
                                    </div>

                                    {/* Summary Metrics */}
                                    <div className="grid grid-cols-3 gap-4 mb-6">
                                        <div className={metricCardClass}>
                                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Overall Confidence</p>
                                            <p className="text-xl font-bold text-white">{result.summary_report?.["Overall Confidence"] || "NA"}</p>
                                        </div>
                                        <div className={metricCardClass}>
                                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Risk Level</p>
                                            <p className={`text-xl font-bold ${result.summary_report?.["Risk Level"] === 'HIGH' ? 'text-red-400' : 'text-green-400'}`}>
                                                {result.summary_report?.["Risk Level"] || "NA"}
                                            </p>
                                        </div>
                                        <div className={metricCardClass}>
                                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Manual Review</p>
                                            <p className="text-xl font-bold text-white">{result.summary_report?.["Needs Manual Review"] || "NA"}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="text-white font-semibold mb-2">Final Directory Row</h4>
                                            <div className="bg-black/30 p-4 rounded-lg border border-white/5 font-mono text-xs text-green-300 overflow-auto">
                                                {JSON.stringify(result.final_profile, null, 2)}
                                            </div>
                                        </div>

                                        <div>
                                            <h5 className="text-sm font-semibold text-slate-400 mb-3 flex items-center gap-2"><Loader2 className="animate-spin hidden" /> Download Options</h5>
                                            <div className="flex gap-4">
                                                <Button variant="outline" className="border-white/10 text-slate-300 hover:bg-white/5" onClick={() => handleDownload('json')}>
                                                    Download Summary (JSON)
                                                </Button>
                                                <Button variant="outline" className="border-white/10 text-slate-300 hover:bg-white/5" onClick={() => handleDownload('csv')}>
                                                    Download Directory Row (CSV)
                                                </Button>
                                                <Button variant="outline" disabled className="border-white/10 text-slate-500 cursor-not-allowed">
                                                    Download PDF (Coming Soon)
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    )}
                </div>
            </div>
        </div>
    )
}
