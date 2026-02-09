
import { useEffect } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Quote, Star, Sparkles, Zap } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { AgentCard } from "../components/AgentCard"

// Atomic Components
import { Hero } from "../components/Hero"
import { Stats } from "../components/Stats"
import { FeatureCards } from "../components/FeatureCards"
import { ChartsPreview } from "../components/ChartsPreview"

// Smooth scroll animations
import { FadeIn, StaggerContainer, StaggerItem } from "../components/animations/ScrollAnimations"
import { LogoTicker } from "../components/LogoTicker"

import { motion } from "framer-motion"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function LandingPage() {
    useEffect(() => {
        // Hero Animation - Faster (1s → 0.5s)
        gsap.from(".hero-content", {
            opacity: 0,
            y: 30, // Reduced from 50 for subtler effect
            duration: 0.5, // Reduced from 1s
            ease: "power2.out" // Snappier easing
        })

        // Agents Section Stagger - Faster animation
        const agentCards = document.querySelectorAll(".agent-card")
        if (agentCards.length > 0) {
            gsap.from(agentCards, {
                scrollTrigger: {
                    trigger: ".agents-grid",
                    start: "top 85%",
                    toggleActions: "play none none none"
                },
                y: 40, // Reduced from 60
                opacity: 0,
                duration: 0.4, // Reduced from 0.6s
                stagger: 0.1, // Reduced from 0.15 for faster cascade
                ease: "power2.out",
                clearProps: "all"
            })
        }

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill())
        }
    }, [])

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-x-hidden relative">
            {/* Global Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute inset-0 bg-noise opacity-[0.03] z-10 mix-blend-overlay"></div>
                <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full mix-blend-multiply animate-float" />
                <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-indigo-500/20 blur-[140px] rounded-full mix-blend-multiply animate-float-delayed" />
                <div className="absolute top-[40%] left-[-10%] w-[600px] h-[600px] bg-purple-500/10 blur-[120px] rounded-full mix-blend-multiply animate-pulse-slow" />
            </div>

            {/* SECTION 1: HERO (Includes Stats) */}
            <Hero />

            {/* LOGO TICKER - Trusted Brands */}
            <LogoTicker />

            {/* SECTION 2: PROBLEM & IMPACT */}
            <FeatureCards />

            {/* SECTION 3: AGENTS (SOLUTION) */}
            <section id="agents-section" className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
                <div className="max-w-7xl mx-auto px-8">
                    <div className="mb-16 md:flex md:items-end md:justify-between">
                        <div className="max-w-2xl">
                            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4 text-slate-900">Meet Your AI Workforce</h2>
                            <p className="text-lg text-slate-600">
                                Specialized autonomous agents that handle the heavy lifting.
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <button className="text-blue-600 font-semibold hover:text-blue-700 inline-flex items-center gap-2">
                                View all agents <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>



                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 agents-grid">
                        <div className="agent-card">
                            <AgentCard
                                index={0}
                                title="Validation Agent"
                                role="Verifier"
                                description="Cross-references provider data against NPI registry, state boards, and federal databases."
                            />
                        </div>
                        <div className="agent-card">
                            <AgentCard
                                index={1}
                                title="Enrichment Agent"
                                role="Researcher"
                                description="Scrapes and aggregates missing data points like office hours from public sources."
                            />
                        </div>
                        <div className="agent-card">
                            <AgentCard
                                index={2}
                                title="QA Scoring Agent"
                                role="Auditor"
                                description="Assigns confidence scores to every record. Flags anomalies for human review."
                            />
                        </div>
                        <div className="agent-card">
                            <AgentCard
                                index={3}
                                title="Directory Manager"
                                role="Administrator"
                                description="Orchestrates updates to your core database and maintains version history."
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 4: ANALYTICS PREVIEW */}
            <ChartsPreview />

            {/* SECTION 5: TESTIMONIALS */}
            <section className="py-24 relative">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="text-center mb-16">
                        <FadeIn delay={0}>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider mb-4">
                                <Star className="h-3 w-3 fill-blue-600" /> Trusted Reviews
                            </div>
                        </FadeIn>
                        <FadeIn delay={0.1}>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
                                Trusted by Industry Leaders
                            </h2>
                        </FadeIn>
                        <FadeIn delay={0.2}>
                            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                                See how forward-thinking payers are transforming their provider operations.
                            </p>
                        </FadeIn>
                    </div>

                    <StaggerContainer staggerDelay={0.15} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                quote: "CareGrid reduced our directory error rate by 40% in the first month. The ROI was immediate.",
                                author: "Sarah Jenkins",
                                role: "VP of Network Ops",
                                company: "HealthPlus Payer",
                                initials: "SJ",
                                gradient: "from-blue-500 to-cyan-500"
                            },
                            {
                                quote: "The automated verification agent is a game changer. We save 20 hours/week on manual phone calls.",
                                author: "Michael Chen",
                                role: "Credentialing Manager",
                                company: "United Care Group",
                                initials: "MC",
                                gradient: "from-purple-500 to-pink-500"
                            },
                            {
                                quote: "Finally, a tool that actually understands provider data complexity. Compliance is no longer a headache.",
                                author: "Dr. Robert Vance",
                                role: "Chief Medical Officer",
                                company: "Select Health",
                                initials: "RV",
                                gradient: "from-amber-500 to-orange-500"
                            }
                        ].map((t, i) => (
                            <StaggerItem key={i}>
                                <motion.div
                                    whileHover={{ y: -10, scale: 1.02 }}
                                    className="bg-slate-50 p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300 flex flex-col group relative overflow-hidden h-full"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/0 to-white/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 rounded-bl-full transition-all duration-500" />
                                    <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur-sm" />

                                    <div className="flex items-center gap-4 mb-6 relative z-10">
                                        <div className={`h-12 w-12 rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-br ${t.gradient} shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300`}>
                                            {t.initials}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900">{t.author}</div>
                                            <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">{t.company}</div>
                                        </div>
                                        <div className="ml-auto bg-green-100 p-1.5 rounded-full group-hover:bg-green-200 transition-colors">
                                            <Quote className="h-4 w-4 text-green-600" />
                                        </div>
                                    </div>

                                    <div className="flex gap-1 mb-4">
                                        {[1, 2, 3, 4, 5].map(s => <Star key={s} className="h-4 w-4 text-amber-400 fill-amber-400 group-hover:scale-110 transition-transform duration-300" style={{ transitionDelay: `${s * 50}ms` }} />)}
                                    </div>

                                    <p className="text-slate-700 leading-relaxed relative z-10 flex-1">
                                        "{t.quote}"
                                    </p>

                                    <div className="mt-6 pt-6 border-t border-slate-200/60 group-hover:border-slate-300 transition-colors">
                                        <p className="text-sm font-semibold text-slate-500">{t.role}</p>
                                    </div>
                                </motion.div>
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                </div>
            </section>

            {/* SECTION 6: PREMIUM CTA */}
            <section className="relative py-24 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9nPjwvc3ZnPg==')] opacity-20" />
                </div>

                <div className="max-w-7xl mx-auto px-8 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-wider mb-8 backdrop-blur-sm"
                        >
                            <Sparkles className="h-3 w-3 text-amber-400" /> Ready to Scale?
                        </motion.div>

                        {/* Heading */}
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight"
                        >
                            Start Validating Your Network Today
                        </motion.h2>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed"
                        >
                            Join forward-thinking payer organizations using CareGrid to automate provider intelligence.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col sm:flex-row justify-center gap-4"
                        >
                            <Link to="/contact">
                                <Button
                                    size="lg"
                                    className="h-14 px-10 text-lg font-bold bg-white text-slate-900 hover:bg-blue-50 shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 w-full sm:w-auto rounded-full"
                                >
                                    Schedule a Demo
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link to="/dashboard">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="h-14 px-10 text-lg font-bold border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 backdrop-blur-sm w-full sm:w-auto transition-all duration-300 rounded-full"
                                >
                                    Try Live Demo
                                </Button>
                            </Link>
                        </motion.div>

                        {/* Trust Indicators */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="mt-16 pt-12 border-t border-white/10"
                        >
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                                {[
                                    { value: '99.9%', label: 'Accuracy Rate' },
                                    { value: '50K+', label: 'Providers Verified' },
                                    { value: '24/7', label: 'Monitoring' },
                                    { value: 'HIPAA', label: 'Compliant' }
                                ].map((stat, i) => (
                                    <div key={i}>
                                        <div className="text-3xl md:text- font-bold text-white mb-2">{stat.value}</div>
                                        <div className="text-sm text-blue-200">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

        </div>
    )
}
