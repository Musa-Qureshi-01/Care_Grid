import { motion } from "framer-motion"
import { CheckCircle, AlertTriangle, Zap, Activity, Loader2 } from "lucide-react"
import { Button } from "./ui/Button"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from "../services/api"
import { useState, useEffect } from "react"

export function ChartsPreview() {
    const [stats, setStats] = useState({
        total_providers: 0,
        validation_accuracy: 0,
        correction_rate: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadStats() {
            try {
                // Fetch real analytics data from FastAPI backend
                const data = await api.getAnalytics()
                if (data) {
                    setStats(data)
                }
            } catch (e) {
                console.error("Failed to load analytics, using fallback", e)
                // Fallback mock data if API fails
                setStats({
                    total_providers: 12450,
                    validation_accuracy: 99.8,
                    correction_rate: 12.5
                })
            } finally {
                setLoading(false)
            }
        }
        loadStats()
    }, [])

    // Mock data for chart visualization
    // In a real production app, this would also come from the API
    const data = [
        { name: 'Jan', processed: 4000, accuracy: 2400 },
        { name: 'Feb', processed: 3000, accuracy: 1398 },
        { name: 'Mar', processed: 2000, accuracy: 9800 },
        { name: 'Apr', processed: 2780, accuracy: 3908 },
        { name: 'May', processed: 1890, accuracy: 4800 },
        { name: 'Jun', processed: 2390, accuracy: 3800 },
        { name: 'Jul', processed: 3490, accuracy: 4300 },
    ];

    return (
        <section className="min-h-screen flex items-center justify-center py-24 px-4 md:px-8 relative bg-[#0B1121]">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-[95%] lg:max-w-[1800px] bg-slate-900/80 backdrop-blur-2xl rounded-[3rem] overflow-hidden relative shadow-2xl border border-white/10"
            >
                {/* Soft Ambient Background - Adjusted for seamlessness */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 blur-[120px] rounded-full opacity-40 mix-blend-screen pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full opacity-40 mix-blend-screen pointer-events-none" />

                <div className="p-8 md:p-12 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
                                <Activity className="h-3 w-3" /> Live Network Monitor
                            </div>
                            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight text-white">
                                Real-Time Insight into <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Network Health</span>
                            </h2>
                            <p className="text-slate-400 text-lg md:text-xl mb-12 leading-relaxed max-w-2xl">
                                Monitor processing volumes, accuracy rates, and agent performance in real-time. Gain actionable intelligence on network adequacy.
                            </p>

                            {/* Dynamic Stats Grid - Connected to Backend */}
                            <div className="flex flex-row gap-6 mb-12">
                                <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/5 flex-1 hover:bg-white/10 transition-colors">
                                    <div className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-2">Total Providers</div>
                                    <div className="text-3xl md:text-5xl font-bold text-white flex items-center">
                                        {loading ? <Loader2 className="h-8 w-8 animate-spin text-blue-500" /> : (stats?.total_providers || 0).toLocaleString()}
                                    </div>
                                </div>
                                <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/5 flex-1 hover:bg-white/10 transition-colors">
                                    <div className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-2">Accuracy Rate</div>
                                    <div className="text-3xl md:text-5xl font-bold text-emerald-400 flex items-center shadow-emerald-500/20 drop-shadow-sm">
                                        {loading ? <span className="text-sm">Loading...</span> : `${stats?.validation_accuracy}%`}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-8">
                                {[
                                    "Live Validation",
                                    "Geospatial Vis",
                                    "Compliance Reports",
                                    "Agent Metrics"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center space-x-3 group">
                                        <div className="bg-blue-500/10 p-1.5 rounded-full text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                                            <CheckCircle className="h-3.5 w-3.5" />
                                        </div>
                                        <span className="font-medium text-sm text-slate-300 group-hover:text-white transition-colors">{item}</span>
                                    </div>
                                ))}
                            </div>

                            <Button size="default" className="h-10 px-6 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-900/40 hover:shadow-blue-900/60 transition-all duration-300 hover:-translate-y-0.5">
                                Explore Analytics
                            </Button>
                        </div>

                        {/* Chart Card */}
                        <div className="relative h-full flex items-center">
                            {/* Glow Effect behind chart */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-blue-600/20 rounded-full blur-3xl opacity-30" />

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8 }}
                                className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 shadow-2xl relative w-full"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="font-bold text-lg text-white">Validation Accuracy</h3>
                                        <p className="text-xs text-slate-400">Last 7 Months Trend</p>
                                    </div>
                                    <div className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-emerald-500/20">
                                        +{loading ? "..." : stats?.correction_rate}% YOY
                                    </div>
                                </div>

                                <div className="h-[300px] md:h-[500px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={data} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5} />
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                            <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                            <YAxis stroke="#64748b" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dx={-10} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(8px)', fontSize: '12px' }}
                                                itemStyle={{ color: '#fff' }}
                                                cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
                                            />
                                            <Area type="monotone" dataKey="accuracy" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorAcc)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}
