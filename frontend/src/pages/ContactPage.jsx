import { motion } from "framer-motion"
import { Send, MapPin, Phone, Mail, ArrowRight, Check, User } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { useState } from "react"
import { useToast } from "../context/ToastContext"

export function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { addToast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.target);
        formData.append("access_key", "2ef6e302-a3d1-42c0-a78a-d5e79bb7f35e");

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                addToast("Message sent successfully!", "success");
                e.target.reset();
            } else {
                addToast("Something went wrong. Please try again.", "error");
            }
        } catch (error) {
            console.error("Submission error:", error);
            addToast("Failed to send message.", "error");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center py-20 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Background Mesh */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute inset-0 bg-noise opacity-[0.03] z-10 mix-blend-overlay"></div>
                <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full mix-blend-multiply animate-float" />
                <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-indigo-500/20 blur-[140px] rounded-full mix-blend-multiply animate-float-delayed" />
            </div>

            <div className="container max-w-5xl px-4 relative z-10">

                <div className="text-center mb-12">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-slate-900 mb-4"
                    >
                        Let's Clean Up Your Data
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-slate-600 max-w-2xl mx-auto"
                    >
                        Schedule a consultation or demo with our solutions engineering team.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                >
                    {/* Contact Info Card */}
                    <div className="lg:col-span-1 flex flex-col gap-6">
                        <Card className="bg-slate-900 text-white border-slate-800 shadow-2xl overflow-hidden relative flex-1">
                            {/* Keep Dark Card for Contact Info for contrast */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none animate-pulse-slow" />
                            <div className="p-6 relative z-10 h-full flex flex-col justify-center">
                                <h3 className="text-xl font-bold mb-6">Contact Information</h3>
                                <div className="space-y-6 text-slate-300">
                                    <div className="flex items-start space-x-4">
                                        <div className="bg-white/10 p-2 rounded-lg flex-shrink-0 backdrop-blur-sm">
                                            <User className="h-5 w-5 text-blue-400" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-white font-medium mb-1">Name</div>
                                            <span>Musa</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-4">
                                        <div className="bg-white/10 p-2 rounded-lg flex-shrink-0 backdrop-blur-sm">
                                            <Mail className="h-5 w-5 text-blue-400" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-white font-medium mb-1">Email</div>
                                            <a href="mailto:musaqureshi0000@gmail.com" className="hover:text-blue-400 transition-colors break-all">musaqureshi0000@gmail.com</a>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-4">
                                        <div className="bg-white/10 p-2 rounded-lg flex-shrink-0 backdrop-blur-sm">
                                            <Phone className="h-5 w-5 text-blue-400" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-white font-medium mb-1">Phone</div>
                                            <span>+91 6263473208</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-4">
                                        <div className="bg-white/10 p-2 rounded-lg flex-shrink-0 backdrop-blur-sm">
                                            <MapPin className="h-5 w-5 text-blue-400" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-white font-medium mb-1">Office</div>
                                            <span>Bhopal, MP,<br />India</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 bg-white/40 backdrop-blur-md border border-white/40 shadow-xl hidden lg:block">
                            <h4 className="font-bold text-slate-900 mb-4">Why Partner With Us?</h4>
                            <ul className="space-y-3">
                                {[
                                    "Dedicated Success Manager",
                                    "HIPAA Compliant",
                                    "SLA Guarantees",
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center text-sm text-slate-700">
                                        <div className="h-5 w-5 rounded-full bg-blue-100/50 flex items-center justify-center mr-3 text-blue-600 shrink-0">
                                            <Check className="h-3 w-3" />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    </div>

                    {/* Form Card - Glass Effect */}
                    <div className="lg:col-span-2">
                        <Card className="p-8 h-full shadow-2xl border border-white/30 bg-white/60 backdrop-blur-2xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/0 pointer-events-none" />
                            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                                <input type="hidden" name="subject" value="New Submission from CareGrid Website" />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">First Name</label>
                                        <input type="text" name="name" className="w-full px-4 py-3 rounded-xl border border-slate-200/60 bg-white/40 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm" placeholder="Musa" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">Last Name</label>
                                        <input type="text" name="last_name" className="w-full px-4 py-3 rounded-xl border border-slate-200/60 bg-white/40 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm" placeholder="Qureshi" required />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Work Email</label>
                                    <input type="email" name="email" className="w-full px-4 py-3 rounded-xl border border-slate-200/60 bg-white/40 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm" placeholder="musaqureshi0000@gmail.com" required />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Organization Type</label>
                                    <select name="organization_type" className="w-full px-4 py-3 rounded-xl border border-slate-200/60 bg-white/40 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm">
                                        <option>Health Payer / Insurer</option>
                                        <option>Hospital System</option>
                                        <option>Digital Health / Telehealth</option>
                                        <option>Other</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Message</label>
                                    <textarea name="message" rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-200/60 bg-white/40 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm resize-none" placeholder="Tell us about your directory challenges..." required />
                                </div>

                                <Button size="lg" disabled={isSubmitting} className="w-full h-12 text-base font-bold shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.01] transition-transform disabled:opacity-70">
                                    {isSubmitting ? "Sending..." : "Send Request"} <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </form>
                        </Card>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
