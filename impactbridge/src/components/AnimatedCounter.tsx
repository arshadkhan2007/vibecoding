'use client'

import { useEffect, useRef, useState } from 'react'

interface AnimatedCounterProps {
  value: number
  duration?: number // duration in ms
  prefix?: string
  suffix?: string
  decimals?: number
  className?: string
  formatIndian?: boolean
}

export default function AnimatedCounter({
  value,
  duration = 1800,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
  formatIndian = true,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState<number>(0)
  const [hasAnimated, setHasAnimated] = useState<boolean>(false)
  const elementRef = useRef<HTMLSpanElement | null>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    // Trigger animation when element enters viewport
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          startAnimation()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [hasAnimated, value])

  const startAnimation = () => {
    let startTimestamp: number | null = null
    const startValue = 0
    const endValue = value

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      
      // Ease out exponential curve for sleek decelerating motion
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      const current = startValue + (endValue - startValue) * easeProgress

      setDisplayValue(current)

      if (progress < 1) {
        requestAnimationFrame(step)
      } else {
        setDisplayValue(endValue)
      }
    }

    requestAnimationFrame(step)
  }

  const formatNumber = (num: number) => {
    const fixed = num.toFixed(decimals)
    const [intPart, decPart] = fixed.split('.')
    
    let formattedInt = intPart
    if (formatIndian) {
      formattedInt = Number(intPart).toLocaleString('en-IN')
    } else {
      formattedInt = Number(intPart).toLocaleString()
    }

    return decPart ? `${formattedInt}.${decPart}` : formattedInt
  }

  return (
    <span 
      ref={elementRef} 
      className={`tabular-nums inline-block transition-transform duration-200 ${className}`}
    >
      {prefix}
      {formatNumber(displayValue)}
      {suffix}
    </span>
  )
}
