import { useState } from "react"
import { motion } from "framer-motion"
import {
    LayoutDashboard,
    Users,
    FileText,
    Activity,
    Settings,
    LogOut,
    Menu,
    ChevronLeft,
    Database,
    Sparkles,
    ShieldCheck
} from "lucide-react"
import { cn } from "@/lib/utils"
// import { useAuth } from "@/hooks/useAuth" // Assumption: Auth hook exists

const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "agent", label: "Run Agent", icon: Sparkles },
    { id: "batch", label: "Batch Processing", icon: Database },
    { id: "logs", label: "System Logs", icon: FileText },
    { id: "insights", label: "Insights", icon: Activity },
    { id: "home", label: "Back to Home", icon: LogOut, action: "link", href: "/" },
]

export function Sidebar({ activeTab, onTabChange }) {
    const [collapsed, setCollapsed] = useState(false)

    return (
        <motion.div
            animate={{ width: collapsed ? 80 : 280 }}
            className="h-screen bg-slate-950 border-r border-white/10 flex flex-col relative z-20 transition-all duration-300 ease-in-out"
        >
            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-white/5">
                {!collapsed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2 font-bold text-xl text-white"
                    >
                        <ShieldCheck className="w-6 h-6 text-blue-500" />
                        CareGrid
                    </motion.div>
                )}
                {!activeTab && !onTabChange && ( // Hacky check if we want to pass isMobile properly we should add it to props destructuring
                    null
                )}
                {/* Only show collapse toggle on desktop */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors md:block hidden"
                >
                    {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon
                    const isActive = activeTab === item.id

                    return (
                        <button
                            key={item.id}
                            onClick={() => {
                                if (item.action === 'link') {
                                    window.location.href = item.href
                                } else {
                                    onTabChange(item.id)
                                }
                            }}
                            className={cn(
                                "relative w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group text-sm font-medium overflow-hidden",
                                isActive
                                    ? "bg-blue-600/10 text-blue-400 shadow-[inset_0_0_20px_rgba(59,130,246,0.05)]"
                                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="active-nav"
                                    className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-md shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                />
                            )}

                            <Icon size={20} className={cn(
                                "transition-colors relative z-10",
                                isActive ? "text-blue-400" : "text-slate-500 group-hover:text-blue-200"
                            )} />

                            {!collapsed && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="relative z-10"
                                >
                                    {item.label}
                                </motion.span>
                            )}
                        </button>
                    )
                })}
            </nav>

            {/* Footer / User Profile */}
            <div className="p-4 border-t border-white/5">
                <div className={cn(
                    "flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors cursor-pointer",
                    collapsed && "justify-center p-2"
                )}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                        MQ
                    </div>
                    {!collapsed && (
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium text-white truncate">Musa Qureshi</p>
                            <p className="text-xs text-slate-500 truncate">Admin</p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    )
}
