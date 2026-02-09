import { motion } from 'framer-motion'
import { ShieldCheck } from 'lucide-react'

export function LoadingAnimation({ message = "Loading...", fullScreen = true }) {
    const containerClass = fullScreen
        ? "fixed inset-0 z-50 flex items-center justify-center bg-slate-950"
        : "flex items-center justify-center w-full h-full"

    return (
        <div className={containerClass}>
            {/* Animated background gradients */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [360, 180, 0],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
                />
            </div>

            {/* Main loading content */}
            <div className="relative z-10 flex flex-col items-center">
                {/* Animated logo with rings */}
                <div className="relative mb-8">
                    {/* Outer rotating ring */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute inset-0 w-32 h-32"
                    >
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="url(#gradient1)"
                                strokeWidth="2"
                                strokeDasharray="70 200"
                                strokeLinecap="round"
                            />
                            <defs>
                                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#3b82f6" />
                                    <stop offset="100%" stopColor="#8b5cf6" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </motion.div>

                    {/* Middle pulsing ring */}
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute inset-0 w-32 h-32"
                    >
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                            <circle
                                cx="50"
                                cy="50"
                                r="38"
                                fill="none"
                                stroke="url(#gradient2)"
                                strokeWidth="1.5"
                                opacity="0.6"
                            />
                            <defs>
                                <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#60a5fa" />
                                    <stop offset="100%" stopColor="#a78bfa" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </motion.div>

                    {/* Center logo */}
                    <motion.div
                        animate={{
                            scale: [1, 1.05, 1],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="relative flex items-center justify-center w-32 h-32"
                    >
                        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-2xl shadow-blue-500/50">
                            <ShieldCheck className="h-12 w-12 text-white" />

                            {/* Glow effect */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [0.5, 0, 0.5]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeOut"
                                }}
                                className="absolute inset-0 rounded-2xl bg-blue-400 blur-xl"
                            />
                        </div>
                    </motion.div>
                </div>

                {/* Loading text with gradient */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center"
                >
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 mb-2 bg-[length:200%_auto] animate-gradient">
                        {message}
                    </h2>

                    {/* Animated dots */}
                    <div className="flex items-center justify-center gap-2 mt-4">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [0.3, 1, 0.3]
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                    ease: "easeInOut"
                                }}
                                className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"
                            />
                        ))}
                    </div>
                </motion.div>

                {/* Progress bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 w-64 h-1 bg-slate-800 rounded-full overflow-hidden"
                >
                    <motion.div
                        animate={{
                            x: ['-100%', '100%']
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="h-full w-1/3 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-full shadow-lg shadow-blue-500/50"
                    />
                </motion.div>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="mt-6 text-slate-400 text-sm font-medium"
                >
                    Preparing your experience...
                </motion.p>
            </div>
        </div>
    )
}

// Inline loader variant (for buttons, cards, etc.)
export function InlineLoader({ size = "md", color = "blue" }) {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-6 h-6",
        lg: "w-8 h-8"
    }

    const colorClasses = {
        blue: "border-blue-500",
        purple: "border-purple-500",
        white: "border-white"
    }

    return (
        <motion.div
            animate={{ rotate: 360 }}
            transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear"
            }}
            className={`${sizeClasses[size]} border-2 ${colorClasses[color]} border-t-transparent rounded-full`}
        />
    )
}

// Skeleton loader for content
export function SkeletonLoader({ lines = 3, className = "" }) {
    return (
        <div className={`space-y-3 ${className}`}>
            {Array.from({ length: lines }).map((_, i) => (
                <motion.div
                    key={i}
                    animate={{
                        opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.1,
                        ease: "easeInOut"
                    }}
                    className="h-4 bg-slate-200 rounded-lg"
                    style={{ width: `${100 - (i * 10)}%` }}
                />
            ))}
        </div>
    )
}
