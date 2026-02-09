import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard, Users2, MessageSquare, Settings, LogOut, ShieldCheck } from "lucide-react"
import { cn } from "../lib/utils"

export function Sidebar() {
    const location = useLocation()

    const links = [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/agents", label: "Active Agents", icon: Users2 },
        { href: "/assistant", label: "AI Assistant", icon: MessageSquare },
        { href: "/settings", label: "Settings", icon: Settings },
    ]

    return (
        <div className="h-screen w-64 bg-slate-900 text-slate-50 flex flex-col border-r border-slate-800">
            <div className="p-6">
                <Link to="/" className="flex items-center space-x-2 mb-8">
                    <div className="bg-blue-600 text-white p-1 rounded-lg">
                        <ShieldCheck className="h-6 w-6" />
                    </div>
                    <span className="font-bold text-xl tracking-tight">
                        Provider<span className="text-blue-400">Agent</span>
                    </span>
                </Link>

                <nav className="space-y-2">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            to={link.href}
                            className={cn(
                                "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                location.pathname === link.href
                                    ? "bg-blue-600 text-white"
                                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                            )}
                        >
                            <link.icon className="h-5 w-5" />
                            <span>{link.label}</span>
                        </Link>
                    ))}
                </nav>
            </div>

            <div className="mt-auto p-6 border-t border-slate-800">
                <button className="flex items-center space-x-3 text-slate-400 hover:text-white transition-colors w-full text-sm font-medium">
                    <LogOut className="h-5 w-5" />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    )
}
