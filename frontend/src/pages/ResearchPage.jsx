import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Send,
    Bot,
    User,
    Loader2,
    Search,
    BookOpen,
    Pill,
    HeadphonesIcon,
    Sparkles,
    RotateCcw,
    Globe,
    Brain
} from "lucide-react"
import { Button } from "../components/ui/button"
import { Navbar } from "../components/Navbar"
import { cn } from "../lib/utils"

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000"

// Tool icons mapping
const toolIcons = {
    "Wikipedia": BookOpen,
    "WebSearch": Globe,
    "DrugDatabase": Pill,
    "CustomerCare": HeadphonesIcon,
}

// Suggested queries
const suggestedQueries = [
    { icon: Pill, text: "What are the side effects of aspirin?", category: "Drug Info" },
    { icon: BookOpen, text: "Explain hypertension and its treatments", category: "Medical" },
    { icon: HeadphonesIcon, text: "How do I update provider information?", category: "Support" },
    { icon: Brain, text: "What is diabetes type 2?", category: "Medical" },
]

export function ResearchPage() {
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [agentStatus, setAgentStatus] = useState(null)
    const messagesEndRef = useRef(null)
    const inputRef = useRef(null)

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    // Check agent status on mount
    useEffect(() => {
        checkAgentStatus()
    }, [])

    const checkAgentStatus = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/research/status`)
            const data = await res.json()
            setAgentStatus(data)
        } catch (error) {
            console.error("Failed to check agent status:", error)
        }
    }

    const sendMessage = async (query = input) => {
        if (!query.trim() || isLoading) return

        const userMessage = { role: "user", content: query, timestamp: new Date().toISOString() }
        setMessages(prev => [...prev, userMessage])
        setInput("")
        setIsLoading(true)

        try {
            // Call real backend API
            const res = await fetch(`${API_BASE}/api/research/query`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    query,
                    session_id: "default"
                })
            })

            const data = await res.json()

            let assistantMessage
            if (data.status === "success") {
                assistantMessage = {
                    role: "assistant",
                    content: data.response,
                    timestamp: data.timestamp,
                    tools_used: data.tools_used || [],
                    error: false
                }
            } else {
                assistantMessage = {
                    role: "assistant",
                    content: data.error || data.message || "Failed to get response. Please check your API key.",
                    timestamp: new Date().toISOString(),
                    error: true
                }
            }

            setMessages(prev => [...prev, assistantMessage])
        } catch (error) {
            console.error("Research API error:", error)
            const errorMessage = {
                role: "assistant",
                content: `⚠️ Connection error: ${error.message}. Make sure the backend is running and GOOGLE_API_KEY is set.`,
                timestamp: new Date().toISOString(),
                error: true
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
            inputRef.current?.focus()
        }
    }

    const clearChat = () => {
        setMessages([])
    }

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <Navbar theme="dark" />

            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-20 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-20 left-20 w-[400px] h-[400px] bg-purple-500/10 blur-[120px] rounded-full" />
            </div>

            <main className="relative z-10 pt-24 pb-4 px-8 max-w-7xl mx-auto w-full">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-4"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4">
                        <Sparkles className="h-4 w-4" />
                        AI-Powered Research
                    </div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-2">
                        CareGrid Research Agent
                    </h1>
                    <p className="text-slate-400 max-w-xl mx-auto">
                        Ask questions about medical topics, drug information, or get help with the platform.
                    </p>

                    {/* Status indicator */}
                    {agentStatus && (
                        <div className={cn(
                            "inline-flex items-center gap-2 mt-4 px-3 py-1.5 rounded-full text-xs font-medium",
                            agentStatus.api_key_configured
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        )}>
                            <span className={cn("w-2 h-2 rounded-full", agentStatus.api_key_configured ? "bg-emerald-400" : "bg-amber-400")} />
                            {agentStatus.api_key_configured ? "Agent Online" : "API Key Required"}
                        </div>
                    )}
                </motion.div>

                {/* Chat Container */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                >
                    {/* Messages Area */}
                    <div className="h-[550px] overflow-y-auto p-6 space-y-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center">
                                <Bot className="h-16 w-16 text-slate-600 mb-4" />
                                <h3 className="text-lg font-semibold text-slate-300 mb-2">Start a Conversation</h3>
                                <p className="text-slate-500 mb-6 max-w-md">
                                    Ask me about medical conditions, drug information, or how to use the CareGrid platform.
                                </p>

                                {/* Suggested Queries */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
                                    {suggestedQueries.map((q, i) => (
                                        <motion.button
                                            key={i}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 + i * 0.1 }}
                                            onClick={() => sendMessage(q.text)}
                                            className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-white/5 hover:border-blue-500/30 hover:bg-slate-800 transition-all text-left group"
                                        >
                                            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                                                <q.icon className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <span className="text-xs text-slate-500">{q.category}</span>
                                                <p className="text-sm text-slate-300 line-clamp-1">{q.text}</p>
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <AnimatePresence>
                                {messages.map((msg, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={cn(
                                            "flex gap-3",
                                            msg.role === "user" ? "justify-end" : "justify-start"
                                        )}
                                    >
                                        {msg.role === "assistant" && (
                                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                                <Bot className="h-5 w-5 text-white" />
                                            </div>
                                        )}
                                        <div className={cn(
                                            "max-w-[80%] px-4 py-3 rounded-2xl",
                                            msg.role === "user"
                                                ? "bg-blue-600 text-white rounded-br-md"
                                                : msg.error
                                                    ? "bg-red-500/10 border border-red-500/20 text-red-300 rounded-bl-md"
                                                    : "bg-slate-800 text-slate-200 rounded-bl-md"
                                        )}>
                                            <p className="whitespace-pre-wrap text-sm">{msg.content}</p>

                                            {/* Show which tools were used */}
                                            {msg.tools_used && msg.tools_used.length > 0 && (
                                                <div className="mt-2 pt-2 border-t border-white/10 flex items-center gap-2 text-xs text-slate-400">
                                                    <Sparkles className="h-3 w-3" />
                                                    <span>Tools used: {msg.tools_used.join(", ")}</span>
                                                </div>
                                            )}
                                        </div>
                                        {msg.role === "user" && (
                                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center">
                                                <User className="h-5 w-5 text-slate-300" />
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        )}

                        {/* Loading indicator */}
                        {isLoading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex gap-3"
                            >
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                    <Bot className="h-5 w-5 text-white" />
                                </div>
                                <div className="bg-slate-800 px-4 py-3 rounded-2xl rounded-bl-md">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span className="text-sm">Researching...</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="border-t border-white/10 p-4 bg-slate-900/80">
                        <div className="flex items-center gap-3">
                            {messages.length > 0 && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={clearChat}
                                    className="text-slate-400 hover:text-white"
                                >
                                    <RotateCcw className="h-5 w-5" />
                                </Button>
                            )}
                            <div className="flex-1 relative">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Ask about medical topics, drugs, or platform help..."
                                    className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    disabled={isLoading}
                                />
                                <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                            </div>
                            <Button
                                onClick={() => sendMessage()}
                                disabled={!input.trim() || isLoading}
                                className="h-12 px-6"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <Send className="h-5 w-5" />
                                )}
                            </Button>
                        </div>

                        {/* Tools indicator */}
                        <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                            <span>Powered by:</span>
                            <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> Wikipedia</span>
                                <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> Web Search</span>
                                <span className="flex items-center gap-1"><Pill className="h-3 w-3" /> Drug DB</span>
                                <span className="flex items-center gap-1"><HeadphonesIcon className="h-3 w-3" /> Support KB</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Disclaimer */}
                <p className="text-center text-slate-500 text-xs mt-6">
                    ⚠️ This is for informational purposes only. Always consult a healthcare professional for medical advice.
                </p>
            </main>
        </div>
    )
}
