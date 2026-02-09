import { Outlet, NavLink } from "react-router-dom"
import { LayoutDashboard, Users2, MessageSquare, Settings, LogOut, ShieldCheck, Bell, Search, PanelLeft } from "lucide-react"
import { cn } from "../lib/utils"
import { useState } from "react"
import { useAuth } from "../hooks/useAuth.jsx"
import { UserButton } from "@clerk/clerk-react"

export function DashboardLayout() {
    const [collapsed, setCollapsed] = useState(false)
    const { user, logout } = useAuth()

    const links = [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/dashboard?tab=agents", label: "Agent Network", icon: Users2 },
        { href: "/dashboard?tab=assistant", label: "AI Assistant", icon: MessageSquare },
        { href: "/dashboard?tab=settings", label: "Settings", icon: Settings },
    ]

    return (
        <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
            {/* Sidebar */}
            <aside
                className={cn(
                    "bg-slate-900 text-slate-300 flex flex-col transition-all duration-300 border-r border-slate-800 z-20 relative",
                    collapsed ? "w-20" : "w-72"
                )}
            >
                <div className="h-16 flex items-center px-6 border-b border-slate-800">
                    {!collapsed ? (
                        <div className="flex items-center space-x-2">
                            <div className="bg-blue-600 p-1.5 rounded-lg">
                                <ShieldCheck className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-bold text-white tracking-tight text-lg">CareGrid</span>
                        </div>
                    ) : (
                        <div className="bg-blue-600 p-2 rounded-lg mx-auto">
                            <ShieldCheck className="h-6 w-6 text-white" />
                        </div>
                    )}
                </div>

                <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                    <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {!collapsed && "Menu"}
                    </div>
                    {links.map((link) => (
                        <NavLink
                            key={link.href}
                            to={link.href}
                            className={({ isActive }) => cn(
                                "flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                                isActive
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50"
                                    : "hover:bg-slate-800 hover:text-white"
                            )}
                        >
                            <link.icon className={cn("h-5 w-5 shrink-0 transition-colors", collapsed ? "mx-auto" : "mr-3")} />
                            {!collapsed && <span className="font-medium text-sm">{link.label}</span>}

                            {/* Tooltip for collapsed state */}
                            {collapsed && (
                                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                                    {link.label}
                                </div>
                            )}
                        </NavLink>
                    ))}
                </div>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="flex items-center justify-center w-full p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800"
                    >
                        <PanelLeft className="h-5 w-5" />
                    </button>
                    {/* Logout (Demo) */}
                    <button
                        onClick={logout}
                        className="flex items-center justify-center w-full p-2 text-red-400 hover:text-red-300 hover:bg-slate-800 rounded-lg mt-2 transition-colors"
                        title="Sign Out"
                    >
                        <LogOut className="h-5 w-5" />
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">

                {/* Top Navbar */}
                <header className="h-16 bg-white border-b border-slate-200 shadow-sm flex items-center justify-between px-6 z-10">
                    <div className="flex items-center flex-1">
                        <div className="relative w-full max-w-md hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search providers, NPIs, or agents..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                        </button>
                        <div className="h-8 w-8 flex items-center justify-center">
                            <UserButton afterSignOutUrl="/" />
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-auto bg-slate-50/50 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
