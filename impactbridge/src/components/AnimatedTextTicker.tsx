'use client'

import { useEffect, useState } from 'react'

const phrases = [
  'Real Impact.',
  'Real Solutions.',
  'Real Transparency.',
  'Real Community.',
]

export default function AnimatedTextTicker() {
  const [index, setIndex] = useState(0)
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in')

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeState('out')
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % phrases.length)
        setFadeState('in')
      }, 300) // 300ms fade-out transition
    }, 3200) // change every 3.2s

    return () => clearInterval(interval)
  }, [])

  return (
    <span className="inline-block relative min-w-[280px] sm:min-w-[380px] text-shimmer">
      <span
        className={`inline-block transition-all duration-300 transform ${
          fadeState === 'in'
            ? 'opacity-100 translate-y-0 filter blur-0'
            : 'opacity-0 -translate-y-3 filter blur-xs'
        }`}
      >
        {phrases[index]}
      </span>
    </span>
  )
}
