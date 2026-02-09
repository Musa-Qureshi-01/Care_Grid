import { motion } from 'framer-motion'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'

/**
 * Smooth fade-in animation component
 * Prevents layout shift and janky animations
 */
export function FadeIn({ children, delay = 0, duration = 0.5, className = '' }) {
    const [ref, isVisible] = useScrollAnimation({ threshold: 0.1, triggerOnce: true })

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{
                duration,
                delay,
                ease: [0.25, 0.1, 0.25, 1], // Custom easing for smoothness
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

/**
 * Stagger children animations
 */
export function StaggerContainer({ children, staggerDelay = 0.1, className = '' }) {
    const [ref, isVisible] = useScrollAnimation({ threshold: 0.1, triggerOnce: true })

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={{
                visible: {
                    transition: {
                        staggerChildren: staggerDelay,
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

/**
 * Individual stagger item
 */
export function StaggerItem({ children, className = '' }) {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                        duration: 0.5,
                        ease: [0.25, 0.1, 0.25, 1],
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

/**
 * Slide in from direction
 */
export function SlideIn({ children, direction = 'left', delay = 0, className = '' }) {
    const [ref, isVisible] = useScrollAnimation({ threshold: 0.1, triggerOnce: true })

    const directions = {
        left: { x: -50, y: 0 },
        right: { x: 50, y: 0 },
        up: { x: 0, y: 50 },
        down: { x: 0, y: -50 },
    }

    const initial = { opacity: 0, ...directions[direction] }

    return (
        <motion.div
            ref={ref}
            initial={initial}
            animate={isVisible ? { opacity: 1, x: 0, y: 0 } : initial}
            transition={{
                duration: 0.6,
                delay,
                ease: [0.25, 0.1, 0.25, 1],
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

/**
 * Scale animation
 */
export function ScaleIn({ children, delay = 0, className = '' }) {
    const [ref, isVisible] = useScrollAnimation({ threshold: 0.1, triggerOnce: true })

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{
                duration: 0.5,
                delay,
                ease: [0.25, 0.1, 0.25, 1],
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}
