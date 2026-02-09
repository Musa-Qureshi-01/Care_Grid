import { useState } from 'react'
import { LoadingAnimation, InlineLoader, SkeletonLoader } from '../components/LoadingAnimation'
import { Navbar } from '../components/Navbar'
import { Button } from '../components/ui/button'
import { Loader2, Sparkles, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

export function LoadingDemoPage() {
    const [showFullScreen, setShowFullScreen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const simulateLoading = () => {
        setIsLoading(true)
        setTimeout(() => setIsLoading(false), 3000)
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <div className="pt-20 pb-12 px-8 max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">
                        <Sparkles className="h-4 w-4" />
                        Loading Components Demo
                    </div>
                    <h1 className="text-4xl font-bold text-slate-900 mb-3">
                        Premium Loading Animations
                    </h1>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Exceptional loading states that keep users engaged with smooth animations and beautiful design.
                    </p>
                </motion.div>

                {/* Demo Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Full Screen Loader Demo */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Loader2 className="h-5 w-5 text-blue-600" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">Full Screen Loader</h2>
                        </div>
                        <p className="text-slate-600 mb-6">
                            Premium full-screen loading animation with animated rings, pulsing logo, and gradient effects.
                        </p>
                        <Button
                            onClick={() => setShowFullScreen(true)}
                            className="w-full"
                        >
                            <Zap className="h-4 w-4 mr-2" />
                            Show Full Screen Loader
                        </Button>

                        <div className="mt-6 p-4 bg-slate-50 rounded-xl">
                            <p className="text-xs font-mono text-slate-600">
                                {'<LoadingAnimation message="Loading..." fullScreen={true} />'}
                            </p>
                        </div>
                    </motion.div>

                    {/* Inline Loaders Demo */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Loader2 className="h-5 w-5 text-purple-600" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">Inline Loaders</h2>
                        </div>
                        <p className="text-slate-600 mb-6">
                            Compact spinners for buttons, cards, and inline elements.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-slate-600 w-20">Small:</span>
                                <InlineLoader size="sm" color="blue" />
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-slate-600 w-20">Medium:</span>
                                <InlineLoader size="md" color="purple" />
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-slate-600 w-20">Large:</span>
                                <InlineLoader size="lg" color="blue" />
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-slate-50 rounded-xl">
                            <p className="text-xs font-mono text-slate-600">
                                {'<InlineLoader size="md" color="blue" />'}
                            </p>
                        </div>
                    </motion.div>

                    {/* Skeleton Loader Demo */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Loader2 className="h-5 w-5 text-green-600" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">Skeleton Loader</h2>
                        </div>
                        <p className="text-slate-600 mb-6">
                            Content placeholders that mimic the layout being loaded.
                        </p>

                        <SkeletonLoader lines={4} />

                        <div className="mt-6 p-4 bg-slate-50 rounded-xl">
                            <p className="text-xs font-mono text-slate-600">
                                {'<SkeletonLoader lines={4} />'}
                            </p>
                        </div>
                    </motion.div>

                    {/* Button Loading States Demo */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <Zap className="h-5 w-5 text-orange-600" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">Button States</h2>
                        </div>
                        <p className="text-slate-600 mb-6">
                            Loading states integrated into buttons for better UX.
                        </p>

                        <div className="space-y-3">
                            <Button
                                onClick={simulateLoading}
                                disabled={isLoading}
                                className="w-full"
                            >
                                {isLoading ? (
                                    <>
                                        <InlineLoader size="sm" color="white" />
                                        <span className="ml-2">Processing...</span>
                                    </>
                                ) : (
                                    'Click to Simulate Loading'
                                )}
                            </Button>

                            <Button
                                variant="outline"
                                disabled
                                className="w-full"
                            >
                                <InlineLoader size="sm" color="blue" />
                                <span className="ml-2">Loading...</span>
                            </Button>
                        </div>

                        <div className="mt-6 p-4 bg-slate-50 rounded-xl">
                            <p className="text-xs font-mono text-slate-600">
                                {'<InlineLoader size="sm" color="white" />'}
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Features */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100"
                >
                    <h3 className="text-xl font-bold text-slate-900 mb-4">✨ Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <div className="font-semibold text-blue-900 mb-1">🎨 Beautiful Design</div>
                            <p className="text-slate-600">Gradient animations and smooth transitions</p>
                        </div>
                        <div>
                            <div className="font-semibold text-purple-900 mb-1">⚡ Performance</div>
                            <p className="text-slate-600">GPU-accelerated animations</p>
                        </div>
                        <div>
                            <div className="font-semibold text-indigo-900 mb-1">🔧 Customizable</div>
                            <p className="text-slate-600">Multiple sizes and color variants</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Full Screen Loader Overlay */}
            {showFullScreen && (
                <div className="fixed inset-0 z-50" onClick={() => setShowFullScreen(false)}>
                    <LoadingAnimation message="Click anywhere to close" fullScreen={true} />
                </div>
            )}
        </div>
    )
}
