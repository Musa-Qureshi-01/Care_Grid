import { Activity, Lock, Users, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardContent } from "./ui/card"

export function FeatureCards() {
    const features = [
        {
            icon: Activity,
            title: "Outdated Records",
            desc: "30% of provider records usually contain errors, leading to member frustration and access issues.",
            stat: "30%",
            statLabel: "Error Rate",
            color: "text-red-500",
            bg: "bg-red-50",
            hoverBg: "hover:bg-red-50/50",
            border: "border-red-100",
            gradient: "from-red-500 to-rose-500"
        },
        {
            icon: Lock,
            title: "Compliance Fines",
            desc: "New federal regulations mandate 48-hour turnaround on updates. Fines can reach millions.",
            stat: "$2M+",
            statLabel: "Potential Fines",
            color: "text-orange-500",
            bg: "bg-orange-50",
            hoverBg: "hover:bg-orange-50/50",
            border: "border-orange-100",
            gradient: "from-orange-500 to-amber-500"
        },
        {
            icon: Users,
            title: "Member Churn",
            desc: "Inaccurate directories are the #1 driver of member dissatisfaction and complaints.",
            stat: "#1",
            statLabel: "Complaint Driver",
            color: "text-amber-500",
            bg: "bg-amber-50",
            hoverBg: "hover:bg-amber-50/50",
            border: "border-amber-100",
            gradient: "from-amber-500 to-yellow-500"
        }
    ]

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Animated Background Blobs */}
            <motion.div
                className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-500/5 blur-[120px] rounded-full mix-blend-multiply opacity-40 pointer-events-none"
                animate={{
                    x: [0, 30, 0],
                    y: [0, -20, 0],
                    scale: [1, 1.1, 1]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-500/5 blur-[120px] rounded-full mix-blend-multiply opacity-40 pointer-events-none"
                animate={{
                    x: [0, -20, 0],
                    y: [0, 30, 0],
                    scale: [1, 1.15, 1]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="container px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-100 text-red-600 text-xs font-bold uppercase tracking-wider mb-6"
                    >
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        Industry Problem
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-3xl lg:text-4xl font-bold tracking-tight mb-4 text-slate-900"
                    >
                        The "Ghost Network" Crisis is Over
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-lg text-slate-600"
                    >
                        Manual verification is slow, expensive, and error-prone. Stop relying on spreadsheets and call centers.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((item, i) => (
                        <motion.div
                            key={i}
                            className="h-full"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.15 }}
                        >
                            <motion.div
                                whileHover={{ y: -8, scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="h-full"
                            >
                                <Card
                                    className={`h-full border ${item.border} shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 bg-white/80 backdrop-blur-xl flex flex-col transition-all duration-300 group relative overflow-hidden cursor-pointer ${item.hoverBg}`}
                                >
                                    {/* Animated gradient border on hover */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                                    <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${item.gradient} opacity-0 group-hover:opacity-100 transition-all duration-300`} />

                                    <CardContent className="pt-8 pb-6 text-center flex-1 flex flex-col items-center relative z-10">
                                        {/* Animated Icon Container */}
                                        <motion.div
                                            className={`inline-flex p-4 rounded-2xl ${item.bg} ${item.color} mb-6 shadow-sm ring-1 ring-black/5 relative`}
                                            whileHover={{ rotate: [0, -5, 5, 0], scale: 1.15 }}
                                            transition={{ duration: 0.4 }}
                                        >
                                            <item.icon className="h-8 w-8" />
                                            {/* Pulse effect */}
                                            <span className="absolute inset-0 rounded-2xl bg-current opacity-0 group-hover:opacity-20 group-hover:animate-ping" />
                                        </motion.div>

                                        <h3 className="text-xl font-bold mb-2 text-slate-900 group-hover:text-slate-800 transition-colors">
                                            {item.title}
                                        </h3>

                                        {/* Stat Badge */}
                                        <div className={`inline-flex items-baseline gap-1 px-3 py-1 rounded-full ${item.bg} ${item.color} text-sm font-bold mb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0`}>
                                            <span className="text-lg">{item.stat}</span>
                                            <span className="text-xs font-medium opacity-70">{item.statLabel}</span>
                                        </div>

                                        <p className="text-slate-600 leading-relaxed flex-grow text-sm">
                                            {item.desc}
                                        </p>

                                        {/* Learn More Link */}
                                        <motion.div
                                            className={`mt-4 flex items-center gap-1 ${item.color} text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300`}
                                            initial={{ x: -10 }}
                                            whileHover={{ x: 0 }}
                                        >
                                            Learn more
                                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </motion.div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

