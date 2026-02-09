import { useEffect, useRef, useState } from 'react'

/**
 * Custom hook for smooth scroll animations
 * Prevents janky animations and layout shift
 */
export function useScrollAnimation(options = {}) {
    const {
        threshold = 0.1,
        rootMargin = '0px',
        triggerOnce = true,
    } = options

    const ref = useRef(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const element = ref.current
        if (!element) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    if (triggerOnce) {
                        observer.unobserve(element)
                    }
                } else if (!triggerOnce) {
                    setIsVisible(false)
                }
            },
            {
                threshold,
                rootMargin,
            }
        )

        observer.observe(element)

        return () => {
            if (element) {
                observer.unobserve(element)
            }
        }
    }, [threshold, rootMargin, triggerOnce])

    return [ref, isVisible]
}

/**
 * Debounced scroll hook for performance
 */
export function useDebounceScroll(delay = 100) {
    const [scrollY, setScrollY] = useState(0)

    useEffect(() => {
        let timeoutId

        const handleScroll = () => {
            clearTimeout(timeoutId)
            timeoutId = setTimeout(() => {
                setScrollY(window.scrollY)
            }, delay)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => {
            window.removeEventListener('scroll', handleScroll)
            clearTimeout(timeoutId)
        }
    }, [delay])

    return scrollY
}
