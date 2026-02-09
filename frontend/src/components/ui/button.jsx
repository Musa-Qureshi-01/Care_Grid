import React from "react"
import { cn } from "../../lib/utils"
import { Loader2 } from "lucide-react"

const Button = React.forwardRef(({ className, variant = "default", size = "default", isLoading, children, ...props }, ref) => {
    const variants = {
        default: `
            bg-gradient-to-r from-blue-600 to-indigo-600 text-white 
            shadow-lg shadow-blue-500/25 
            hover:shadow-2xl hover:shadow-blue-500/50 
            hover:from-blue-500 hover:to-indigo-500
            hover:scale-105 hover:-translate-y-0.5
            border border-white/20
            relative overflow-hidden
            before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/0 before:via-white/25 before:to-white/0 
            before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700
            after:absolute after:inset-0 after:rounded-xl after:opacity-0 hover:after:opacity-100 
            after:bg-gradient-to-r after:from-blue-400 after:to-indigo-400 after:blur-xl after:-z-10 after:transition-opacity after:duration-300
        `,
        destructive: `
            bg-gradient-to-r from-red-600 to-rose-600 text-white 
            shadow-lg shadow-red-500/25 
            hover:shadow-2xl hover:shadow-red-500/50
            hover:from-red-500 hover:to-rose-500
            hover:scale-105 hover:-translate-y-0.5
            border border-white/20
            relative overflow-hidden
            before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/0 before:via-white/20 before:to-white/0 
            before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700
        `,
        outline: `
            border-2 border-slate-300 bg-transparent 
            text-slate-700 
            hover:bg-slate-50 hover:text-slate-900 hover:border-slate-400
            hover:shadow-xl hover:shadow-slate-200/50
            hover:scale-105 hover:-translate-y-0.5
            relative overflow-hidden
            before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-slate-100 before:to-transparent 
            before:translate-y-[-200%] hover:before:translate-y-[200%] before:transition-transform before:duration-500
        `,
        secondary: `
            bg-slate-800/80 text-white 
            border border-slate-600 
            hover:bg-slate-700 hover:border-slate-500
            hover:shadow-xl hover:shadow-slate-900/50
            hover:scale-105 hover:-translate-y-0.5
            backdrop-blur-sm
        `,
        ghost: `
            text-slate-600 
            hover:bg-slate-100 hover:text-slate-900
            hover:shadow-lg hover:shadow-slate-200/50
            hover:scale-105
        `,
        link: `
            text-blue-600 underline-offset-4 
            hover:underline hover:text-blue-700
            hover:scale-105
        `,
        glass: `
            bg-white/10 backdrop-blur-xl 
            border border-white/20 text-white 
            hover:bg-white/20 hover:border-white/30
            shadow-xl shadow-black/10
            hover:shadow-2xl hover:shadow-black/20
            hover:scale-105 hover:-translate-y-0.5
            relative overflow-hidden
            before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/0 before:via-white/10 before:to-white/0 
            before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700
        `,
        success: `
            bg-gradient-to-r from-emerald-600 to-green-600 text-white 
            shadow-lg shadow-emerald-500/25 
            hover:shadow-2xl hover:shadow-emerald-500/50
            hover:from-emerald-500 hover:to-green-500
            hover:scale-105 hover:-translate-y-0.5
            border border-white/20
            relative overflow-hidden
            before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/0 before:via-white/20 before:to-white/0 
            before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700
        `,
        glow: `
            bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white 
            shadow-lg shadow-purple-500/30
            hover:shadow-2xl hover:shadow-purple-500/60
            hover:scale-110 hover:-translate-y-1
            border border-white/20
            animate-gradient-x
            relative overflow-hidden
            before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/0 before:via-white/30 before:to-white/0 
            before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-500
        `,
    }

    const sizes = {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-12 rounded-xl px-8 text-base font-bold",
        xl: "h-14 rounded-xl px-10 text-lg font-bold",
        icon: "h-10 w-10",
    }

    return (
        <button
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold",
                "ring-offset-background transition-all duration-300 ease-out",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                "disabled:pointer-events-none disabled:opacity-50",
                "active:scale-[0.98] active:transition-transform active:duration-100",
                variants[variant],
                sizes[size],
                className
            )}
            ref={ref}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </button>
    )
})
Button.displayName = "Button"

export { Button }

