import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, FileText, CheckCircle, AlertTriangle, XCircle, Download, Loader2, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { api } from "../services/api"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs) {
    return twMerge(clsx(inputs))
}

export function BatchProcessing() {
    const [isProcessing, setIsProcessing] = useState(false)
    const [results, setResults] = useState(null)
    const [uploadStatus, setUploadStatus] = useState("idle") // idle, uploading, done

    // Generate 300 Mock Providers
    const generateMockData = () => {
        const specialties = ["Gastroenterology", "Cardiology", "Pediatrics", "Dermatology", "Oncology", "Family Medicine", "Internal Medicine"];
        const baseProviders = [
            { name: "Dr. Emily Cook", npi: "1112223334", address: "3897 Oak Drive, PA", phone: "(549) 736-9965", specialty: "Gastroenterology" },
            { name: "Dr. Henry Wright", npi: "2223334445", address: "5968 Pine St, FL", phone: "(480) 660-6800", specialty: "Cardiology" },
            { name: "Dr. Chloe Scott", npi: "3334445556", address: "2957 Main St, FL", phone: "(429) 481-6247", specialty: "Pediatrics" },
            { name: "Dr. Olivia Bell", npi: "4445556667", address: "2772 Maple Blvd, MI", phone: "(664) 227-4222", specialty: "Gastroenterology" },
            { name: "Dr. Amelia Perez", npi: "5556667778", address: "9719 Main St, GA", phone: "(425) 636-2017", specialty: "Pediatrics" },
            { name: "Dr. Layla Young", npi: "6667778889", address: "8729 Oak Drive, TX", phone: "(671) 471-1010", specialty: "Dermatology" },
            { name: "Dr. Isabella Reed", npi: "7778889990", address: "9179 Maple Blvd, TX", phone: "(213) 555-0199", specialty: "Dermatology" },
            { name: "Dr. Zoe Rogers", npi: "8889990001", address: "4546 Oak Drive, PA", phone: "(312) 555-0123", specialty: "Cardiology" },
            { name: "Dr. Alexander Gray", npi: "9990001112", address: "1182 Elm St, MI", phone: "(415) 555-0187", specialty: "Oncology" },
            { name: "Dr. Sophia Hall", npi: "0001112223", address: "1300 Elm St, NY", phone: "(212) 555-0145", specialty: "Dermatology" }
        ];

        let generated = [...baseProviders];
        for (let i = 11; i <= 300; i++) {
            const specialty = specialties[Math.floor(Math.random() * specialties.length)];
            generated.push({
                name: `Provider ${i}`,
                npi: `999${100000 + i}`,
                address: `${100 + i} Medical Center Dr, Suite ${i}`,
                phone: `(555) 000-${1000 + i}`,
                specialty: specialty
            });
        }
        return generated;
    };

    // Fix: Add useRef for file input
    const fileInputRef = useRef(null)

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            // Simulate upload process
            setUploadStatus("uploading")
            setTimeout(() => {
                setUploadStatus("processed")
                // In a real app, you would upload the file here
                // For demo, we just enable the process button
            }, 1000)
        }
    }

    const [demoProviders] = useState(generateMockData());
    const [batchSize, setBatchSize] = useState(50);

    const handleRunBatch = async () => {
        setIsProcessing(true)
        setUploadStatus("processed")

        // SIMULATION MODE: Process data on frontend to avoid API timeouts
        const delay = (ms) => new Promise(res => setTimeout(res, ms))

        try {
            // Slice the data based on batchSize
            const batchData = demoProviders.slice(0, batchSize)

            // Artificial delay to look like processing
            await delay(2000)

            // Generate Simulated Results
            const processedResults = batchData.map(provider => {
                const isHighRisk = Math.random() < 0.1 // 10% High Risk
                const isMediumRisk = Math.random() < 0.2 && !isHighRisk // 20% Medium

                let risk = "LOW"
                let confidence = 95 + Math.floor(Math.random() * 5) // 95-100

                if (isHighRisk) {
                    risk = "HIGH"
                    confidence = 40 + Math.floor(Math.random() * 30)
                } else if (isMediumRisk) {
                    risk = "MEDIUM"
                    confidence = 70 + Math.floor(Math.random() * 20)
                }

                return {
                    input: provider,
                    risk_level: risk,
                    confidence_score: confidence,
                    final_data: { address_corrected: provider.address }
                }
            })

            // Calculate Stats
            const lowCount = processedResults.filter(r => r.risk_level === "LOW").length
            const medCount = processedResults.filter(r => r.risk_level === "MEDIUM").length
            const highCount = processedResults.filter(r => r.risk_level === "HIGH").length
            const total = processedResults.length
            const avgConf = Math.round(processedResults.reduce((acc, curr) => acc + curr.confidence_score, 0) / total)

            setResults({
                total_processed: total,
                successful: lowCount + medCount, // Assume only High Risk are "failed" for stats? Or just all processed
                avg_confidence: avgConf,
                risk_summary: {
                    LOW: lowCount,
                    MEDIUM: medCount,
                    HIGH: highCount
                },
                results: processedResults
            })

        } catch (e) {
            console.error(e)
        } finally {
            setIsProcessing(false)
        }
    }

    const downloadCSV = () => {
        // Mock download logic
        alert("Downloading CSV...")
    }

    const downloadJSON = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(results, null, 2))
        const downloadAnchorNode = document.createElement('a')
        downloadAnchorNode.setAttribute("href", dataStr)
        downloadAnchorNode.setAttribute("download", "batch_results.json")
        document.body.appendChild(downloadAnchorNode)
        downloadAnchorNode.click()
        downloadAnchorNode.remove()
    }

    // Chart Data Preparation
    const riskData = results?.risk_summary ? [
        { name: 'Low Risk', value: results.risk_summary.LOW || 0, color: '#4ade80' },
        { name: 'Medium Risk', value: results.risk_summary.MEDIUM || 0, color: '#fbbf24' },
        { name: 'High Risk', value: results.risk_summary.HIGH || 0, color: '#f87171' },
    ] : []

    const confidenceData = results?.results ? results.results.map((r, i) => ({
        name: `P${i + 1}`,
        score: r.confidence_score || 0
    })) : []

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
            {/* Background Effects - Matching Hero Section */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 blur-[100px] rounded-full mix-blend-screen opacity-50" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full mix-blend-screen opacity-40" />
            </div>
            {/* Header / Upload Section */}
            {!results && (
                <div className="bg-slate-800/30 border border-dashed border-slate-700/50 rounded-2xl p-6 md:p-12 text-center hover:bg-slate-800/50 transition-all duration-300 group">
                    <div className="mx-auto h-20 w-20 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                        <Upload className="h-10 w-10" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Upload Provider Batch</h3>
                    <p className="text-slate-400 max-w-md mx-auto">
                        Drag and drop your CSV/Excel file here, or click to browse. Supported formats: .csv, .xlsx, .json
                    </p>

                    {/* Batch Size Selection */}
                    <div className="mt-8 max-w-xs mx-auto">
                        <label className="block text-sm font-medium text-slate-300 mb-3">
                            Batch Size: <span className="text-blue-400 font-bold">{batchSize}</span> Records
                        </label>
                        <input
                            type="range"
                            min="10"
                            max="300"
                            step="10"
                            value={batchSize}
                            onChange={(e) => setBatchSize(parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                        <div className="flex justify-between text-xs text-slate-400 mt-1">
                            <span>10</span>
                            <span>150</span>
                            <span>300</span>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col items-center justify-center gap-4">
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept=".csv,.xlsx,.json"
                            onChange={handleFileSelect}
                        />
                        <div className="flex gap-4">
                            <Button
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                                className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                            >
                                Select File
                            </Button>
                            <Button
                                onClick={handleRunBatch}
                                disabled={isProcessing}
                                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"
                            >
                                {isProcessing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                                {isProcessing ? "Processing..." : `Process ${batchSize} Records`}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Results Dashboard */}
            {results && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    {/* Summary Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <FileText className="h-12 w-12 text-blue-400" />
                            </div>
                            <div className="text-slate-400 text-sm font-medium mb-1 uppercase tracking-wider">Total Processed</div>
                            <div className="text-4xl font-bold text-white mt-2">{results.total_processed}</div>
                        </div>
                        <div className="bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <CheckCircle className="h-12 w-12 text-emerald-400" />
                            </div>
                            <div className="text-slate-400 text-sm font-medium mb-1 uppercase tracking-wider">Avg Confidence</div>
                            <div className="text-4xl font-bold text-white mt-2">{results.avg_confidence}%</div>
                        </div>
                        <div className="bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <AlertTriangle className="h-12 w-12 text-rose-400" />
                            </div>
                            <div className="text-slate-400 text-sm font-medium mb-1 uppercase tracking-wider">High Risk</div>
                            <div className="text-4xl font-bold text-rose-400 mt-2">{results.risk_summary?.HIGH || 0}</div>
                        </div>
                        <div className="bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <CheckCircle className="h-12 w-12 text-emerald-400" />
                            </div>
                            <div className="text-slate-400 text-sm font-medium mb-1 uppercase tracking-wider">Success Rate</div>
                            <div className="text-4xl font-bold text-emerald-400 mt-2">
                                {Math.round((results.successful / results.total_processed) * 100)}%
                            </div>
                        </div>
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-900/50 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-xl">
                            <h4 className="font-bold text-lg text-white mb-6 flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-blue-500" /> Risk Distribution
                            </h4>
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={riskData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        />
                                        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                            {riskData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="bg-slate-900/50 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-xl">
                            <h4 className="font-bold text-lg text-white mb-6 flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-indigo-500" /> Confidence Scores
                            </h4>
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={confidenceData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} interval={0} fontSize={10} />
                                        <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        />
                                        <Bar dataKey="score" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Detail Table */}
                    <div className="bg-slate-900/50 backdrop-blur-md rounded-3xl border border-white/10 shadow-xl overflow-hidden">
                        <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h3 className="font-bold text-lg text-white">Provider Ranking Queue</h3>
                                <p className="text-sm text-slate-400">Prioritized by fraud risk and data anomalies.</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={downloadCSV} className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                                    <Download className="h-4 w-4 mr-2" /> CSV
                                </Button>
                                <Button variant="outline" size="sm" onClick={downloadJSON} className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                                    <Download className="h-4 w-4 mr-2" /> JSON
                                </Button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-400 uppercase bg-black/20 border-b border-white/5">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">Provider</th>
                                        <th className="px-6 py-4 font-semibold">Specialty</th>
                                        <th className="px-6 py-4 font-semibold">Address</th>
                                        <th className="px-6 py-4 font-semibold">Risk Level</th>
                                        <th className="px-6 py-4 font-semibold text-right">Confidence</th>
                                        <th className="px-6 py-4 font-semibold text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {results.results.map((row, i) => (
                                        <tr key={i} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-4 font-medium text-white">{row.input.name}</td>
                                            <td className="px-6 py-4 text-slate-400">{row.input.specialty}</td>
                                            <td className="px-6 py-4 text-slate-500 max-w-xs truncate group-hover:text-slate-300 transition-colors">{row.final_data?.address_corrected || row.input.address}</td>
                                            <td className="px-6 py-4">
                                                <span className={cn(
                                                    "px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase border",
                                                    row.risk_level === "HIGH" && "bg-rose-500/10 text-rose-400 border-rose-500/20",
                                                    row.risk_level === "MEDIUM" && "bg-amber-500/10 text-amber-400 border-amber-500/20",
                                                    row.risk_level === "LOW" && "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                                                )}>
                                                    {row.risk_level}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-mono text-slate-400">
                                                {row.confidence_score}%
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {row.risk_level !== "LOW" || row.confidence_score < 80 ? (
                                                    <div className="flex justify-center text-amber-400">
                                                        <AlertTriangle className="h-5 w-5" />
                                                    </div>
                                                ) : (
                                                    <div className="flex justify-center text-emerald-500/30">
                                                        <CheckCircle className="h-5 w-5" />
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
