import { useState, useRef, useEffect } from "react"
import { Send, User, Bot, Loader2, Sparkles, AlertCircle } from "lucide-react"
import { Button } from "./ui/button"
import { cn } from "../lib/utils"
import { motion, AnimatePresence } from "framer-motion"

export function ChatUI() {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hello! I'm your CareGrid assistant. I have access to your full directory database. How can I verify or enrich your data today?",
            sender: "bot",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSend = async () => {
        if (!input.trim()) return

        const newMsg = {
            id: Date.now(),
            text: input,
            sender: "user",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
        setMessages([...messages, newMsg])
        setInput("")
        setIsLoading(true)

        // Call Backend API
        try {
            const response = await fetch('http://localhost:8000/api/research/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: input, session_id: 'default' })
            })
            const data = await response.json()

            const botResponse = {
                id: Date.now() + 1,
                text: data.response || data.message || "I couldn't process that request.",
                sender: "bot",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
            setMessages(prev => [...prev, botResponse])
        } catch (error) {
            console.error("Chat API error:", error)
            const errorResponse = {
                id: Date.now() + 1,
                text: "Sorry, I'm having trouble connecting. Please try again.",
                sender: "bot",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
            setMessages(prev => [...prev, errorResponse])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] rounded-3xl overflow-hidden border border-slate-200 shadow-sm bg-white">
            {/* Header */}
            <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                        <Sparkles className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-slate-900">AI Assistant</h1>
                        <p className="text-slate-500 text-xs">Powered by GPT-4 • Directory Context Active</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></span>
                    <span className="text-xs font-medium text-slate-600 uppercase tracking-wide">Online</span>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-50/50">
                <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                                "flex w-full items-end gap-3 max-w-3xl",
                                msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                            )}
                        >
                            <div className={cn(
                                "h-8 w-8 rounded-full flex items-center justify-center shrink-0 shadow-sm border",
                                msg.sender === "user" ? "bg-slate-900 text-white border-slate-800" : "bg-white text-blue-600 border-blue-100"
                            )}>
                                {msg.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                            </div>

                            <div className="flex flex-col space-y-1">
                                <div
                                    className={cn(
                                        "rounded-2xl px-5 py-3 text-sm shadow-sm",
                                        msg.sender === "user"
                                            ? "bg-slate-900 text-white rounded-br-none"
                                            : "bg-white border border-slate-200 text-slate-700 rounded-bl-none"
                                    )}
                                >
                                    <p className="leading-relaxed">{msg.text}</p>
                                </div>
                                <span className={cn("text-[10px] text-slate-400", msg.sender === "user" ? "text-right" : "text-left")}>
                                    {msg.timestamp}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex w-full items-end gap-3 max-w-3xl mr-auto"
                    >
                        <div className="h-8 w-8 rounded-full bg-white text-blue-600 border border-blue-100 flex items-center justify-center shrink-0 shadow-sm">
                            <Bot className="h-4 w-4" />
                        </div>
                        <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-none px-5 py-4 shadow-sm flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-200">
                <div className="max-w-4xl mx-auto flex gap-2 relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Ask about your provider data..."
                        className="flex-1 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl px-5 py-3 text-sm outline-none transition-all shadow-inner"
                    />
                    <Button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="h-[46px] w-[46px] rounded-xl p-0 shrink-0 bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20"
                    >
                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                    </Button>
                </div>
                <div className="mt-2 text-center">
                    <p className="text-[10px] text-slate-400 flex items-center justify-center">
                        <AlertCircle className="h-3 w-3 mr-1" /> AI can make mistakes. Verify critical data.
                    </p>
                </div>
            </div>
        </div>
    )
}
