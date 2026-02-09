import { motion } from "framer-motion"
import { cn } from "../lib/utils"

export function FeatureCard({ icon: Icon, title, description, className }) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={cn("p-6 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-shadow", className)}
        >
            <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">{title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
        </motion.div>
    )
}
