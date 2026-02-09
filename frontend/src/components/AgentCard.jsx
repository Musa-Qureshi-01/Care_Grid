import { motion } from "framer-motion"
import { CheckCircle2, Bot, ArrowRight, Activity, Database, Shield } from "lucide-react"
import { cn } from "../lib/utils"
import { Card } from "@/components/ui/card"

const icons = {
    "Validation Agent": Shield,
    "Enrichment Agent": Database,
    "QA Scoring Agent": CheckCircle2,
    "Directory Manager": Activity
}

const colors = {
    "Validation Agent": "bg-blue-50 text-blue-600 border-blue-100",
    "Enrichment Agent": "bg-purple-50 text-purple-600 border-purple-100",
    "QA Scoring Agent": "bg-emerald-50 text-emerald-600 border-emerald-100",
    "Directory Manager": "bg-amber-50 text-amber-600 border-amber-100"
}

export function AgentCard({ title, description, role, index }) {
    const Icon = icons[title] || Bot
    const colorClass = colors[title] || "bg-slate-50 text-slate-600 border-slate-100"

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className="group h-full"
        >
            <div className="relative h-full min-h-[340px] p-8 rounded-2xl bg-white border border-slate-100 shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-2 overflow-hidden flex flex-col">
                {/* Hover Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Border Glow on Hover */}
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-6">
                        <div className={cn("p-4 rounded-2xl border transition-all duration-300 group-hover:scale-110", colorClass)}>
                            <Icon className="h-8 w-8" />
                        </div>
                        <div className={cn("px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white border shadow-sm transition-colors duration-300", colorClass.replace('bg-', 'text-'))}>
                            {role}
                        </div>
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">{title}</h3>

                    <p className="text-slate-600 leading-relaxed mb-8 flex-grow font-medium">
                        {description}
                    </p>

                    <div className="flex items-center justify-between pt-6 border-t border-slate-100 group-hover:border-slate-200 transition-colors mt-auto">
                        <div className="flex items-center space-x-2">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                            </span>
                            <span className="text-sm font-medium text-slate-500 group-hover:text-slate-700 transition-colors">Active</span>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-100 group-hover:text-blue-600 transition-all duration-300">
                            <ArrowRight className="h-4 w-4 transform group-hover:translate-x-0.5" />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
