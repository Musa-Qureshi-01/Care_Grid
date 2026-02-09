import * as React from "react"
import { cn } from "@/lib/utils"

const TabsContext = React.createContext({})

const Tabs = React.forwardRef(({ defaultValue, value, onValueChange, className, children, ...props }, ref) => {
    const [selected, setSelected] = React.useState(defaultValue || value)

    // Update internal state if controlled value changes
    React.useEffect(() => {
        if (value !== undefined) setSelected(value)
    }, [value])

    const handleSelect = (val) => {
        setSelected(val)
        if (onValueChange) onValueChange(val)
    }

    return (
        <TabsContext.Provider value={{ selected, handleSelect }}>
            <div ref={ref} className={cn("", className)} {...props}>
                {children}
            </div>
        </TabsContext.Provider>
    )
})
Tabs.displayName = "Tabs"

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
            className
        )}
        {...props}
    />
))
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef(({ className, value, ...props }, ref) => {
    const { selected, handleSelect } = React.useContext(TabsContext)
    const isSelected = selected === value

    return (
        <button
            ref={ref}
            type="button"
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                isSelected && "bg-background text-foreground shadow-sm",
                className
            )}
            onClick={() => handleSelect(value)}
            {...props}
        />
    )
})
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef(({ className, value, ...props }, ref) => {
    const { selected } = React.useContext(TabsContext)

    if (selected !== value) return null

    return (
        <div
            ref={ref}
            className={cn(
                "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                className
            )}
            {...props}
        />
    )
})
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }
