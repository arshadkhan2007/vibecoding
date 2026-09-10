'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

interface NodeItem {
  id: string
  label: string
  category?: string
  baseX: number
  baseY: number
  radius: number
  color: string
  glowColor: string
  desc: string
  isCenter?: boolean
}

export default function ImpactNetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const router = useRouter()
  const [hoveredNode, setHoveredNode] = useState<NodeItem | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = 0
    let height = 0
    let mouseX = -1000
    let mouseY = -1000

    // Initial node definitions
    const nodes: NodeItem[] = [
      {
        id: 'center',
        label: 'IMPACT',
        baseX: 0.5,
        baseY: 0.48,
        radius: 36,
        color: '#2563eb',
        glowColor: 'rgba(37, 99, 235, 0.35)',
        desc: 'Central Verified Impact Network',
        isCenter: true,
      },
      {
        id: 'water',
        label: 'Clean Water',
        category: 'Water',
        baseX: 0.22,
        baseY: 0.32,
        radius: 26,
        color: '#0284c7',
        glowColor: 'rgba(2, 132, 199, 0.25)',
        desc: 'Safe drinking water in rural villages',
      },
      {
        id: 'education',
        label: 'Education',
        category: 'Education',
        baseX: 0.78,
        baseY: 0.28,
        radius: 26,
        color: '#6366f1',
        glowColor: 'rgba(99, 102, 241, 0.25)',
        desc: 'Computers & digital labs for students',
      },
      {
        id: 'health',
        label: 'Healthcare',
        category: 'Health',
        baseX: 0.82,
        baseY: 0.64,
        radius: 25,
        color: '#e11d48',
        glowColor: 'rgba(225, 29, 72, 0.25)',
        desc: 'Community medical outreach & camps',
      },
      {
        id: 'infrastructure',
        label: 'Infrastructure',
        category: 'Infrastructure',
        baseX: 0.18,
        baseY: 0.66,
        radius: 25,
        color: '#059669',
        glowColor: 'rgba(5, 150, 105, 0.25)',
        desc: 'School repairs & clean sanitation',
      },
      {
        id: 'food',
        label: 'Nutrition',
        category: 'Food',
        baseX: 0.36,
        baseY: 0.82,
        radius: 23,
        color: '#d97706',
        glowColor: 'rgba(217, 119, 6, 0.25)',
        desc: 'Elderly meals & food support packs',
      },
      {
        id: 'community',
        label: 'Community',
        category: 'Community',
        baseX: 0.64,
        baseY: 0.82,
        radius: 23,
        color: '#9333ea',
        glowColor: 'rgba(147, 51, 234, 0.25)',
        desc: 'Verified grassroots civic action',
      },
      {
        id: 'sanitation',
        label: 'Pure Wells',
        category: 'Water',
        baseX: 0.36,
        baseY: 0.16,
        radius: 21,
        color: '#0369a1',
        glowColor: 'rgba(3, 105, 161, 0.25)',
        desc: 'Clean storage tanks & reverse osmosis',
      },
      {
        id: 'literacy',
        label: 'Digital Skills',
        category: 'Education',
        baseX: 0.64,
        baseY: 0.16,
        radius: 21,
        color: '#4f46e5',
        glowColor: 'rgba(79, 70, 229, 0.25)',
        desc: 'STEM connectivity for children',
      },
    ]

    const connections = [
      [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8],
      [1, 7], [2, 8], [7, 8], [1, 4], [2, 3], [4, 5], [5, 6], [6, 3]
    ]

    const particles = connections.map(([from, to], i) => ({
      from,
      to,
      progress: (i * 0.12) % 1,
      speed: 0.003 + (i % 3) * 0.0015,
    }))

    const handleResize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      width = parent.clientWidth
      height = parent.clientHeight || 460
      const dpr = window.devicePixelRatio || 1
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.scale(dpr, dpr)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseX = e.clientX - rect.left
      mouseY = e.clientY - rect.top

      let found: NodeItem | null = null
      nodes.forEach((node) => {
        const nx = node.baseX * width
        const ny = node.baseY * height
        const dist = Math.hypot(mouseX - nx, mouseY - ny)
        if (dist <= node.radius + 10) {
          found = node
          setTooltipPos({ x: nx, y: ny - node.radius - 12 })
        }
      })
      setHoveredNode(found)
    }

    const handleMouseLeave = () => {
      mouseX = -1000
      mouseY = -1000
      setHoveredNode(null)
    }

    const handleClick = () => {
      if (hoveredNode) {
        router.push('/problems')
      }
    }

    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)
    canvas.addEventListener('click', handleClick)

    let time = 0

    const render = () => {
      time += 0.02
      ctx.clearRect(0, 0, width, height)

      const currentPositions = nodes.map((node, i) => {
        const floatX = Math.sin(time + i * 1.3) * (node.isCenter ? 2 : 6)
        const floatY = Math.cos(time + i * 1.7) * (node.isCenter ? 2 : 6)
        return {
          x: node.baseX * width + floatX,
          y: node.baseY * height + floatY,
        }
      })

      // 1. Draw connections
      connections.forEach(([fromIdx, toIdx]) => {
        const p1 = currentPositions[fromIdx]
        const p2 = currentPositions[toIdx]
        const isConnectedToHover = 
          hoveredNode && 
          (nodes[fromIdx].id === hoveredNode.id || nodes[toIdx].id === hoveredNode.id)

        ctx.beginPath()
        ctx.moveTo(p1.x, p1.y)
        ctx.lineTo(p2.x, p2.y)

        if (isConnectedToHover) {
          ctx.strokeStyle = '#2563eb'
          ctx.lineWidth = 2.5
        } else {
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)'
          ctx.lineWidth = 1
        }
        ctx.stroke()
      })

      // 2. Draw moving particles
      particles.forEach((p) => {
        p.progress += p.speed
        if (p.progress > 1) p.progress = 0

        const p1 = currentPositions[p.from]
        const p2 = currentPositions[p.to]
        const px = p1.x + (p2.x - p1.x) * p.progress
        const py = p1.y + (p2.y - p1.y) * p.progress

        ctx.beginPath()
        ctx.arc(px, py, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = '#2563eb'
        ctx.fill()
      })

      // 3. Draw nodes
      nodes.forEach((node, i) => {
        const pos = currentPositions[i]
        const isHover = hoveredNode?.id === node.id
        const currentRadius = node.radius + (isHover ? 4 : 0)

        // Outer glow
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, currentRadius + 6, 0, Math.PI * 2)
        ctx.fillStyle = isHover ? node.glowColor : 'rgba(241, 245, 249, 0.6)'
        ctx.fill()

        // Node circle
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, currentRadius, 0, Math.PI * 2)
        ctx.fillStyle = node.isCenter ? '#2563eb' : '#ffffff'
        ctx.fill()

        ctx.strokeStyle = node.color
        ctx.lineWidth = node.isCenter ? 3 : 2
        ctx.stroke()

        // Label
        ctx.font = `${node.isCenter ? 'bold 11px' : '600 11px'} sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = node.isCenter ? '#ffffff' : '#0f172a'
        ctx.fillText(node.label, pos.x, pos.y)
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      canvas.removeEventListener('click', handleClick)
    }
  }, [router, hoveredNode])

  return (
    <div className="relative w-full h-[400px] sm:h-[460px] select-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-pointer touch-none block"
      />

      {/* Floating Glass Tooltip */}
      {hoveredNode && (
        <div 
          className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-full z-30 transition-all duration-150"
          style={{ left: tooltipPos.x, top: tooltipPos.y }}
        >
          <div className="bg-white/95 border border-blue-200 rounded-xl px-3.5 py-2 shadow-xl shadow-blue-500/10 backdrop-blur-md text-center whitespace-nowrap">
            <div className="text-xs font-black text-slate-900 flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
              {hoveredNode.label}
            </div>
            <div className="text-[11px] text-slate-600 mt-0.5 font-normal">
              {hoveredNode.desc}
            </div>
            <div className="text-[10px] text-blue-600 font-bold mt-1">
              Click to explore node →
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
