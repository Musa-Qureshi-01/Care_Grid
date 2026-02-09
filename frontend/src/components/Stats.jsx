import { motion } from "framer-motion"

export function Stats() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-0 pb-20 grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto divide-x divide-slate-200/50"
        >
            {[
                { label: "Data Accuracy", value: "99.9%" },
                { label: "Manual Effort", value: "-80%" },
                { label: "Processing Speed", value: "10x" },
                { label: "Compliance Risk", value: "0%" },
            ].map((stat, i) => (
                <div key={i} className="text-center">
                    <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-slate-900 to-slate-700 tracking-tight">{stat.value}</div>
                    <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider mt-1">{stat.label}</div>
                </div>
            ))}
        </motion.div>
    )
}
