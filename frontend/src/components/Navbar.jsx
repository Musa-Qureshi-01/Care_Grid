import { Link, useLocation } from "react-router-dom"
import { ShieldCheck, LayoutDashboard, Menu, X, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "./ui/button"
import { cn } from "../lib/utils"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react"

export function Navbar({ theme = "light", className }) {
    const location = useLocation()
    const [scrolled, setScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const isDark = theme === "dark"

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Product", href: "/dashboard" },
        { name: "Agent", href: "/research" },
        { name: "Contact", href: "/contact" },
    ]

    return (
        <>
            <motion.header
                className={cn(
                    // Faster transition (300ms→200ms), refined glass effect
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b border-transparent",
                    scrolled
                        ? (isDark ? "bg-slate-950/80 backdrop-blur-xl border-white/10 shadow-sm" : "bg-white/90 backdrop-blur-xl border-slate-200/60 shadow-sm")
                        : "bg-transparent",
                    className
                )}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                // Reduced from 0.5s to 0.25s for snappier entrance
                transition={{ duration: 0.25, ease: "easeOut" }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20 sm:h-24 relative">
                    <Link to="/" className="flex items-center space-x-2 group">
                        <motion.div
                            whileHover={{ rotate: 180, scale: 1.1 }}
                            transition={{ duration: 0.5 }}
                            className="relative flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20"
                        >
                            <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6" />
                        </motion.div>
                        <div className="flex flex-col">
                            <span className={cn("font-bold text-lg sm:text-xl tracking-tight leading-none", isDark ? "text-white" : "text-slate-900")}>
                                Care<span className="text-blue-500">Grid</span>
                            </span>
                            <span className={cn("text-[10px] sm:text-xs font-medium tracking-wider uppercase", isDark ? "text-slate-400" : "text-slate-500")}>Provider Intelligence</span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    {/* Desktop Nav - Absolutely Centered */}
                    <nav className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.href}
                                onClick={(e) => {
                                    // If clicking Home and already on home page, scroll to top
                                    if (link.href === "/" && location.pathname === "/") {
                                        e.preventDefault()
                                        window.scrollTo({ top: 0, behavior: "smooth" })
                                    }
                                }}
                                className={cn(
                                    "text-sm font-medium transition-colors relative group py-2",
                                    isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-blue-600"
                                )}
                            >
                                {link.name}
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        <SignedOut>
                            <SignInButton mode="modal">
                                <Button variant="ghost" className={cn(isDark ? "text-slate-300 hover:text-white hover:bg-white/10" : "text-slate-600 hover:text-blue-600 hover:bg-blue-50")}>
                                    Log in
                                </Button>
                            </SignInButton>
                            <SignInButton mode="modal">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button className={cn(isDark ? "bg-blue-600 text-white hover:bg-blue-500" : "bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/20 border border-slate-700/50")}>
                                        Get Started <ChevronRight className="ml-1 h-4 w-4" />
                                    </Button>
                                </motion.div>
                            </SignInButton>
                        </SignedOut>
                        <SignedIn>
                            <Link to="/dashboard">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button
                                        className={cn(
                                            "mr-2 group relative overflow-hidden",
                                            isDark
                                                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 border border-white/20"
                                                : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 border border-blue-400/30"
                                        )}
                                    >
                                        <LayoutDashboard className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                                        Dashboard
                                        <ChevronRight className="ml-1 h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                    </Button>
                                </motion.div>
                            </Link>
                            <UserButton afterSignOutUrl="/" />
                        </SignedIn>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className={cn("md:hidden p-2 rounded-lg", isDark ? "text-slate-300 hover:bg-white/10" : "text-slate-600 hover:bg-slate-100")}
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </motion.header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className={cn("fixed inset-0 z-40 pt-20 sm:pt-24 px-4 sm:px-6 md:hidden overflow-y-auto", isDark ? "bg-slate-950 text-white" : "bg-white text-slate-900")}
                    >
                        <nav className="flex flex-col space-y-4 sm:space-y-6 text-base sm:text-lg font-medium py-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={cn("border-b pb-3 sm:pb-4 min-h-[44px] flex items-center", isDark ? "border-white/10 text-slate-200" : "border-slate-100 text-slate-900")}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="flex flex-col space-y-4 pt-4">
                                <SignedOut>
                                    <SignInButton mode="modal">
                                        <Button variant="outline" className="w-full justify-center h-12 text-lg">
                                            Log in
                                        </Button>
                                    </SignInButton>
                                    <SignInButton mode="modal">
                                        <Button className="w-full justify-center h-12 text-lg">
                                            Get Started
                                        </Button>
                                    </SignInButton>
                                </SignedOut>
                                <SignedIn>
                                    <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                                        <Button className="w-full justify-center h-12 text-lg">
                                            Go to Dashboard
                                        </Button>
                                    </Link>
                                    <div className="flex justify-center py-4">
                                        <UserButton afterSignOutUrl="/" />
                                    </div>
                                </SignedIn>
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
