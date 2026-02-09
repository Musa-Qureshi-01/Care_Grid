import { motion } from "framer-motion"
import { useState } from "react"
import { Activity } from "lucide-react"

/**
 * LogoItem Component
 * Renders a logo in a distinct white card to ensure visibility.
 * Fallback: Clearbit -> Google -> Icon
 */
const LogoItem = ({ brand }) => {
    // Start with a reliable size (128)
    const [imgSrc, setImgSrc] = useState(`https://logo.clearbit.com/${brand.domain}?size=128`)
    const [hasError, setHasError] = useState(false)

    const handleError = () => {
        if (imgSrc.includes("logo.clearbit.com")) {
            // Fallback 1: Google Favicon (Backup)
            setImgSrc(`https://www.google.com/s2/favicons?domain=${brand.domain}&sz=128`)
        } else {
            // Fallback 2: Show Generic Icon
            setHasError(true)
        }
    }

    return (
        <div className="flex items-center gap-4 group cursor-pointer opacity-100 hover:scale-105 transition-all duration-300">
            {/* Logo Container: White Card + Shadow for guaranteed visibility */}
            <div className={`relative overflow-hidden rounded-xl p-2 h-14 w-14 flex items-center justify-center bg-white shadow-sm border border-slate-100 group-hover:border-blue-100 transition-colors`}>
                {!hasError ? (
                    <img
                        src={imgSrc}
                        alt={brand.name}
                        className="h-full w-full object-contain"
                        // Removed mix-blend-mode to prevent white logos from vanishing
                        onError={handleError}
                    />
                ) : (
                    // Fallback Icon
                    <Activity className="text-slate-400 opacity-80" size={24} strokeWidth={2} />
                )}

                {/* Shine Effect */}
                {!hasError && (
                    <div className="absolute inset-0 -translate-x-[150%] skew-x-[-25deg] bg-gradient-to-r from-transparent via-white/60 to-transparent group-hover:animate-shine z-10" />
                )}
            </div>

            {/* Brand Name */}
            <span className="text-lg md:text-xl font-bold text-slate-700 tracking-tight font-sans group-hover:text-blue-700 transition-colors">
                {brand.name}
            </span>
        </div>
    )
}

/**
 * Premium SaaS Logo Ticker
 * Layout: [Logo Card] [Name]
 */
export function LogoTicker() {
    const logos = [
        { name: "Apollo Hospitals", domain: "apollohospitals.com" },
        { name: "Fortis", domain: "fortishealthcare.com" },
        { name: "Max Healthcare", domain: "maxhealthcare.in" },
        { name: "Manipal", domain: "manipalhospitals.com" },
        { name: "Medanta", domain: "medanta.org" },
        { name: "Narayana Health", domain: "narayanahealth.org" },
        { name: "HDFC ERGO", domain: "hdfcergo.com" },
        { name: "Star Health", domain: "starhealth.in" },
        { name: "Practo", domain: "practo.com" },
        { name: "PharmEasy", domain: "pharmeasy.in" },
        { name: "1mg", domain: "1mg.com" },
        { name: "ICICI Lombard", domain: "icicilombard.com" },
        { name: "Tata AIG", domain: "tataaig.com" },
        { name: "Care Insurance", domain: "careinsurance.com" },
        { name: "GoDigit", domain: "godigit.com" },
    ]

    const tickerLogos = [...logos, ...logos]

    return (
        <section className="py-24 bg-transparent border-y border-slate-100/50 overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-4 mb-20 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h3
                        className="text-2xl font-semibold text-slate-600 mb-2 cursor-default transition-all duration-300 hover:text-blue-600"
                    >
                        Trusted by 500+ Healthcare Leaders
                    </h3>
                </motion.div>
            </div>

            <div
                className="relative flex overflow-hidden"
                style={{
                    maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
                }}
            >
                <motion.div
                    className="flex gap-32 items-center whitespace-nowrap pr-32"
                    animate={{
                        x: ["0%", "-50%"],
                    }}
                    transition={{
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 35,
                        ease: "linear",
                    }}
                >
                    {tickerLogos.map((brand, index) => (
                        <LogoItem key={`${brand.domain}-${index}`} brand={brand} />
                    ))}
                </motion.div>
            </div>

            <style jsx>{`
                @keyframes shine {
                    0% { transform: translateX(-150%) skewX(-25deg); }
                    100% { transform: translateX(150%) skewX(-25deg); }
                }
                .animate-shine {
                    animation: shine 1s ease-in-out infinite;
                }
            `}</style>
        </section>
    )
}
