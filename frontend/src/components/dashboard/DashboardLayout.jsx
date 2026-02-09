import { Sidebar } from "./Sidebar"
import { Navbar } from "../Navbar"
import { useState } from "react"
import { Menu, LayoutDashboard } from "lucide-react"
import { cn } from "@/lib/utils"

export function DashboardLayout({ children, activeTab, onTabChange }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <div className="flex h-screen w-full bg-[#020617] text-white overflow-hidden font-sans selection:bg-blue-500/30">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[128px]" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[128px]" />
            </div>

            {/* Desktop Sidebar (Hidden on mobile) */}
            <div className="hidden md:block relative z-20 h-full">
                <Sidebar activeTab={activeTab} onTabChange={onTabChange} />
            </div>

            {/* Mobile Sidebar (Drawer) */}
            <div className={cn(
                "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm md:hidden transition-opacity duration-300",
                mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            )} onClick={() => setMobileMenuOpen(false)}>
                <div
                    className={cn(
                        "absolute top-0 left-0 h-full w-[280px] bg-slate-950 shadow-2xl transition-transform duration-300 transform",
                        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                    )}
                    onClick={e => e.stopPropagation()}
                >
                    <Sidebar activeTab={activeTab} onTabChange={(tab) => { onTabChange(tab); setMobileMenuOpen(false); }} isMobile />
                </div>
            </div>

            <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
                <Navbar
                    theme="dark"
                    className="sticky top-0 w-full border-b border-white/5 bg-[#020617]/80 backdrop-blur-md py-3 shrink-0"
                    mobileMenuTrigger={
                        <button onClick={() => setMobileMenuOpen(true)} className="md:hidden mr-4 text-slate-400 hover:text-white">
                            <Menu className="h-6 w-6" />
                        </button>
                    }
                />

                {/* Mobile Menu Trigger (Fab) - If Navbar trigger isn't sufficient or if Navbar is hidden */}
                <button
                    onClick={() => setMobileMenuOpen(true)}
                    className="md:hidden fixed bottom-6 right-6 h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-600/30 z-40 hover:scale-105 transition-transform"
                >
                    <LayoutDashboard className="h-5 w-5" />
                </button>

                <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 pt-6 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                    <div className="max-w-7xl mx-auto space-y-8 pb-20 md:pb-0">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
