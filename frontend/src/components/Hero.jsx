import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { ArrowRight, ChevronRight, Play } from "lucide-react"
import { Button } from "./ui/button"

export function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center pt-24 pb-24 lg:pt-24 lg:pb-24 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent" />

            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full mix-blend-multiply opacity-60"
            />

            {/* Original blobs, moved outside the main content container if they were meant to be global background elements */}
            {/* Secondary Indigo Blob */}
            <motion.div
                animate={{
                    y: [0, -50, 0],
                    x: [0, 30, 0],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-[10%] right-[-10%] w-[400px] lg:w-[800px] h-[400px] lg:h-[800px] bg-indigo-500/20 blur-[100px] rounded-full mix-blend-screen opacity-50"
            />

            {/* Tertiary Teal/Cyan Blob for Depth */}
            <motion.div
                animate={{
                    y: [0, 40, 0],
                    x: [0, -20, 0],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                }}
                className="absolute bottom-[-10%] left-[30%] w-[600px] h-[600px] bg-teal-500/10 blur-[120px] rounded-full mix-blend-screen opacity-40"
            />

            <div className="max-w-7xl mx-auto px-8 relative z-10 text-center">

                {/* Badge - Faster animation (0.6s→0.35s) */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    whileHover={{ scale: 1.05 }}
                    className="inline-flex items-center rounded-full border border-blue-200 bg-white/50 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-blue-800 mb-8 shadow-sm hover:shadow-md transition-all duration-200 cursor-default"
                >
                    <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
                    <span className="mr-1">v2.0 Released:</span> Multi-Agent Orchestration
                    <ChevronRight className="ml-1 h-3 w-3 text-blue-500" />
                </motion.div>

                {/* Headline - Faster animation with stagger */}
                <motion.h1
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.08, ease: "easeOut" }}
                    className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-6 max-w-5xl mx-auto leading-[1.1]"
                >
                    The New Standard for <br className="hidden md:block" />
                    Provider <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 animate-gradient-x">Intelligence</span>
                </motion.h1>

                {/* Description - Faster animation */}
                <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.14, ease: "easeOut" }}
                    className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed"
                >
                    Automated provider verification, directory enrichment, and network compliance.
                    <span className="block mt-2 text-slate-500">Eliminate manual roster checks forever.</span>
                </motion.p>

                {/* CTA Buttons - Enhanced with Premium Effects */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.2, ease: "easeOut" }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
                >
                    <Link to="/dashboard">
                        <motion.button
                            whileHover={{
                                scale: 1.05,
                                boxShadow: "0 20px 60px -15px rgba(59, 130, 246, 0.5)",
                            }}
                            whileTap={{ scale: 0.98 }}
                            className="group relative h-14 px-8 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-xl shadow-blue-500/25 rounded-full font-semibold flex items-center justify-center transition-all duration-300 overflow-hidden border border-white/20"
                        >
                            {/* Animated gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />

                            {/* Glow effect */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 blur-xl" />
                            </div>

                            <span className="relative z-10 flex items-center">
                                View Live Dashboard
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                            </span>
                        </motion.button>
                    </Link>

                    <motion.button
                        onClick={() => {
                            document.getElementById('agents-section')?.scrollIntoView({ behavior: 'smooth' })
                        }}
                        whileHover={{
                            scale: 1.05,
                            backgroundColor: "#ffffff",
                            boxShadow: "0 10px 40px -10px rgba(0, 0, 0, 0.15)",
                        }}
                        whileTap={{ scale: 0.98 }}
                        className="group relative h-14 px-8 text-lg bg-white/80 backdrop-blur-md border-2 border-slate-200 hover:border-slate-300 text-slate-700 rounded-full font-semibold flex items-center justify-center transition-all duration-300 cursor-pointer overflow-hidden"
                    >
                        {/* Hover background effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <span className="relative z-10 flex items-center">
                            <Play className="mr-2 h-5 w-5 fill-slate-700 group-hover:fill-blue-600 transition-colors duration-300" />
                            Watch Demo
                        </span>
                    </motion.button>
                </motion.div>

                {/* Stats Section Integrated into Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="mt-24 grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto divide-x divide-blue-200/30"
                >
                    {[
                        { label: "Data Accuracy", value: "99.9%" },
                        { label: "Manual Effort", value: "-80%" },
                        { label: "Processing Speed", value: "10x" },
                        { label: "Compliance Risk", value: "0%" },
                    ].map((stat, i) => (
                        <div key={i} className="text-center px-4">
                            <div className="text-4xl font-bold text-slate-900 tracking-tight">{stat.value}</div>
                            <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider mt-1">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
