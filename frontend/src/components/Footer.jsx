import { ShieldCheck, Mail, MapPin, Phone, Github, Twitter, Linkedin, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { useState } from "react"

export function Footer() {
    const [email, setEmail] = useState('')

    const handleNewsletterSubmit = (e) => {
        e.preventDefault()
        alert('Thank you for subscribing!')
        setEmail('')
    }

    return (
        <footer className="relative bg-slate-900 text-slate-300 border-t border-slate-800">
            {/* Top Gradient Line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-8 mb-12 sm:mb-16">

                    {/* Brand Section */}
                    <div className="lg:col-span-4">
                        <Link to="/" className="flex items-center space-x-2 mb-6 group">
                            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 transition-all group-hover:shadow-blue-500/40">
                                <ShieldCheck className="h-6 w-6" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-xl tracking-tight text-white leading-none">
                                    Care<span className="text-blue-400">Grid</span>
                                </span>
                                <span className="text-xs font-medium text-slate-500 tracking-wider uppercase">Provider Intelligence</span>
                            </div>
                        </Link>
                        <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-sm">
                            AI-powered provider directory intelligence for healthcare payers. Automated verification, enrichment, and compliance management.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-3 text-slate-400 hover:text-blue-400 transition-colors">
                                <Mail className="h-4 w-4 flex-shrink-0" />
                                <a href="mailto:musaqureshi0000@gmail.com">musaqureshi0000@gmail.com</a>
                            </div>
                            <div className="flex items-center gap-3 text-slate-400">
                                <Phone className="h-4 w-4 flex-shrink-0" />
                                <span>+91 6263473208</span>
                            </div>
                            <div className="flex items-start gap-3 text-slate-400">
                                <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                <span>Bhopal, MP,<br />India</span>
                            </div>
                        </div>
                    </div>

                    {/* Product Links */}
                    <div className="lg:col-span-2">
                        <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Product</h3>
                        <ul className="space-y-4 text-sm">
                            {['Overview', 'Agents', 'Security', 'Enterprise', 'API', 'Integrations'].map((item) => (
                                <li key={item}>
                                    <Link
                                        to={`/${item.toLowerCase()}`}
                                        className="text-slate-400 hover:text-blue-400 transition-colors inline-flex items-center gap-1 group"
                                    >
                                        <span>{item}</span>
                                        <ArrowRight className="h-3 w-3 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div className="lg:col-span-2">
                        <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Company</h3>
                        <ul className="space-y-4 text-sm">
                            {[
                                { label: 'About Us', href: '/about' },
                                { label: 'Careers', href: '/careers' },
                                { label: 'Blog', href: '/blog' },
                                { label: 'Contact', href: '/contact' },
                                { label: 'Press Kit', href: '/press' }
                            ].map((item) => (
                                <li key={item.label}>
                                    <Link
                                        to={item.href}
                                        className="text-slate-400 hover:text-blue-400 transition-colors inline-flex items-center gap-1 group"
                                    >
                                        <span>{item.label}</span>
                                        <ArrowRight className="h-3 w-3 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="lg:col-span-4">
                        <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Stay Updated</h3>
                        <p className="text-sm text-slate-400 mb-4">
                            Get the latest updates on AI-powered provider intelligence and healthcare technology.
                        </p>
                        <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                                className="flex-1 px-4 py-3 sm:py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition-colors shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 min-h-[44px] sm:min-h-0"
                            >
                                Subscribe
                            </button>
                        </form>

                        {/* Social Links */}
                        <div className="mt-6">
                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Follow Us</p>
                            <div className="flex gap-3">
                                {[
                                    { Icon: Linkedin, href: 'https://www.linkedin.com/in/musaqureshi' },
                                    { Icon: Github, href: 'https://github.com/Musa-Qureshi-01' }
                                ].map(({ Icon, href }, i) => (
                                    <motion.a
                                        key={i}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.1, rotate: 5, backgroundColor: "#2563EB", color: "#ffffff" }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex items-center justify-center h-10 w-10 rounded-xl bg-slate-800 text-slate-400 transition-colors"
                                    >
                                        <Icon className="h-5 w-5" />
                                    </motion.a>
                                ))}
                                {/* Peerlist link with custom styling */}
                                <motion.a
                                    href="https://peerlist.io/musaqureshi"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.1, rotate: 5, backgroundColor: "#2563EB", color: "#ffffff" }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center justify-center h-10 w-10 rounded-xl bg-slate-800 text-slate-400 transition-colors text-xs font-bold"
                                >
                                    PL
                                </motion.a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-6 sm:pt-8 border-t border-slate-800">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-500">
                        <div className="text-center md:text-left">
                            © {new Date().getFullYear()} CareGrid AI. Made by Musa • Bhopal, MP, India
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                            <Link to="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link>
                            <Link to="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link>
                            <Link to="/security" className="hover:text-blue-400 transition-colors">Security</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
