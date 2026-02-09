import { motion } from "framer-motion"
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
    BarChart, Bar, PieChart, Pie, Cell
} from 'recharts'
import { Download, Calendar, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"

const volumeData = [
    { name: 'Mon', validated: 400, enriched: 240, scored: 240 },
    { name: 'Tue', validated: 300, enriched: 139, scored: 221 },
    { name: 'Wed', validated: 200, enriched: 980, scored: 229 },
    { name: 'Thu', validated: 278, enriched: 390, scored: 200 },
    { name: 'Fri', validated: 189, enriched: 480, scored: 218 },
    { name: 'Sat', validated: 239, enriched: 380, scored: 250 },
    { name: 'Sun', validated: 349, enriched: 430, scored: 210 },
]

const riskData = [
    { name: 'Low Risk', value: 400, color: '#4ade80' },
    { name: 'Medium Risk', value: 300, color: '#fbbf24' },
    { name: 'High Risk', value: 100, color: '#f87171' },
    { name: 'Critical', value: 50, color: '#ef4444' },
]

export function Insights() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                        Deep Insights
                    </h1>
                    <p className="text-slate-400 mt-1">Advanced analytics and trend analysis.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" className="border-white/10 text-slate-400 hover:text-white hover:bg-white/5">
                        <Calendar className="mr-2 h-4 w-4" /> Last 30 Days
                    </Button>
                    <Button variant="outline" className="border-white/10 text-slate-400 hover:text-white hover:bg-white/5">
                        <Filter className="mr-2 h-4 w-4" /> Filter
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-500">
                        <Download className="mr-2 h-4 w-4" /> Export Report
                    </Button>
                </div>
            </div>

            {/* Top Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <h3 className="text-lg font-semibold text-white mb-6">Agent Volume Trends</h3>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={volumeData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" />
                                <YAxis stroke="#64748b" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)' }}
                                    itemStyle={{ color: '#e2e8f0' }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="validated" stroke="#3b82f6" strokeWidth={2} dot={false} />
                                <Line type="monotone" dataKey="enriched" stroke="#a855f7" strokeWidth={2} dot={false} />
                                <Line type="monotone" dataKey="scored" stroke="#22c55e" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <h3 className="text-lg font-semibold text-white mb-6">Risk Profile Segmentation</h3>
                    <div className="h-[350px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={riskData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {riskData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0.5)" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)' }}
                                    itemStyle={{ color: '#e2e8f0' }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Detailed Table Placeholder / Heatmap */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden">
                <h3 className="text-lg font-semibold text-white mb-6">Geographic Heatmap (Top States)</h3>
                <div className="h-[200px] flex items-end gap-1 px-4">
                    {[45, 78, 30, 90, 20, 60, 50, 80, 40, 70, 35, 65, 55, 85].map((h, i) => (
                        <div key={i} className="flex-1 h-full bg-blue-500/10 hover:bg-blue-500/20 transition-colors rounded-t-sm relative group">
                            <div style={{ height: `${h}%` }} className="absolute bottom-0 w-full bg-blue-600 rounded-t-sm opacity-60 group-hover:opacity-100 transition-opacity" />
                        </div>
                    ))}
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-2 px-4">
                    <span>CA</span>
                    <span>NY</span>
                    <span>TX</span>
                    <span>FL</span>
                    <span>IL</span>
                    <span>PA</span>
                    <span>OH</span>
                </div>
            </div>
        </div>
    )
}
