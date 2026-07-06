"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import gsap from "gsap"
import { SIGNS } from "@/lib/horoscope/data"

const CX = 400
const CY = 400
const RADIUS = 260
const NODE_R = 52

const ZODIAC_SYMBOLS: Record<string, string> = {
  Aries: "\u2648", Tauro: "\u2649", G\u00e9minis: "\u264a", C\u00e1ncer: "\u264b",
  Leo: "\u264c", Virgo: "\u264d", Libra: "\u264e", Escorpio: "\u264f",
  Sagitario: "\u2650", Capricornio: "\u2651", Acuario: "\u2652", Piscis: "\u2653",
}

interface Particle {
  id: number; x: number; y: number; angle: number; dist: number; color: string
}

interface ZodiacWheelProps {
  onSelect: (sign: string) => void
  selectedSign: string | null
}

export function ZodiacWheel({ onSelect, selectedSign }: ZodiacWheelProps) {
  const wheelRef = useRef<SVGGElement>(null)
  const mandalaRef = useRef<SVGGElement>(null)
  const [particles, setParticles] = useState<Particle[]>([])
  const rot = useRef(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mandalaRef.current) return
    const lines = mandalaRef.current.querySelectorAll("line")
    if (lines.length) {
      gsap.to(lines, {
        rotation: 360, svgOrigin: `${CX} ${CY}`,
        duration: 60, repeat: -1, ease: "none",
        stagger: { each: -0.5, from: "start" },
      })
    }
    const circs = mandalaRef.current.querySelectorAll("circle")
    if (circs.length) {
      gsap.to(circs, {
        rotation: -360, svgOrigin: `${CX} ${CY}`,
        duration: 80, repeat: -1, ease: "none",
        stagger: { each: -0.3, from: "start" },
      })
    }
  }, [])

  const handleClick = useCallback((sign: string, i: number) => {
    const target = -i * 30
    const delta = ((target - rot.current) % 360 + 540) % 360 - 180
    if (wheelRef.current) {
      gsap.to(wheelRef.current, {
        rotation: rot.current + delta,
        svgOrigin: `${CX} ${CY}`,
        duration: 1.5,
        ease: "power4.inOut",
      })
      rot.current += delta
    }

    const a = (i * 30 - 90) * (Math.PI / 180)
    const px = CX + Math.cos(a) * (RADIUS + 40)
    const py = CY + Math.sin(a) * (RADIUS + 40)
    const cols = ["#a78bfa","#818cf8","#c084fc","#60a5fa","#e879f9"]
    const ps: Particle[] = []
    for (let j = 0; j < 24; j++) {
      const ang = (Math.PI * 2 * j) / 24 + Math.random() * 0.3
      ps.push({ id: Date.now() + j, x: px, y: py, angle: ang, dist: 50 + Math.random() * 140, color: cols[j % 5] })
    }
    setParticles(ps)
    setTimeout(() => setParticles([]), 1000)
    setTimeout(() => onSelect(sign), 600)
  }, [onSelect])

  return (
    <div className="relative flex items-center justify-center">
      <svg viewBox="0 0 800 800" className="size-full max-h-[90vh] max-w-[800px]">
        <defs>
          <radialGradient id="wg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(0.6 0.25 270 / 0.08)" />
            <stop offset="60%" stopColor="oklch(0.5 0.2 270 / 0.02)" />
            <stop offset="100%" stopColor="oklch(0 0 0 / 0)" />
          </radialGradient>
          <filter id="gb" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="gw" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="gv" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="10" result="b" />
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        <circle cx={CX} cy={CY} r={RADIUS + 100} fill="url(#wg)" />

        {/* mandala */}
        <g ref={mandalaRef}>
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (Math.PI * 2 * i) / 12
            return (
              <line key={`ml-${i}`}
                x1={CX + Math.cos(a) * 50}
                y1={CY + Math.sin(a) * 50}
                x2={CX + Math.cos(a) * (RADIUS - 15)}
                y2={CY + Math.sin(a) * (RADIUS - 15)}
                stroke="oklch(0.7 0.25 270 / 0.08)"
                strokeWidth="0.5"
              />
            )
          })}
          {[60, 100, 140].map((r, i) => (
            <circle key={`mc-${i}`} cx={CX} cy={CY} r={r}
              fill="none" stroke="oklch(0.7 0.25 270 / 0.06)"
              strokeWidth="0.5" strokeDasharray={`${4 + i * 2} ${6 + i * 2}`}
            />
          ))}
          {Array.from({ length: 6 }).map((_, i) => {
            const a = (Math.PI * 2 * i) / 6
            return (
              <circle key={`md-${i}`}
                cx={CX + Math.cos(a) * 25}
                cy={CY + Math.sin(a) * 25}
                r={2.5} fill="oklch(0.7 0.3 280 / 0.15)"
              />
            )
          })}
        </g>

        {/* outer ring */}
        <circle cx={CX} cy={CY} r={RADIUS + 5} fill="none"
          stroke="oklch(0.6 0.2 270 / 0.06)" strokeWidth="1" strokeDasharray="4 8"
        >
          <animateTransform attributeName="transform" type="rotate"
            from={`0 ${CX} ${CY}`} to={`360 ${CX} ${CY}`}
            dur="120s" repeatCount="indefinite"
          />
        </circle>

        {/* wheel */}
        <g ref={wheelRef}>
          {SIGNS.map((sign, i) => {
            const a = (i * 30 - 90) * (Math.PI / 180)
            const x = CX + Math.cos(a) * RADIUS
            const y = CY + Math.sin(a) * RADIUS
            const sel = selectedSign === sign

            return (
              <motion.g
                key={sign}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: mounted ? (sel ? 1 : 0.5) : 0,
                  scale: mounted ? 1 : 0,
                }}
                transition={{ delay: 0.1 + i * 0.05, duration: 0.5, ease: "backOut" }}
                onClick={() => handleClick(sign, i)}
                className="cursor-pointer"
                style={{ transformOrigin: "center" }}
              >
                <motion.ellipse
                  cx={x} cy={y}
                  rx={NODE_R + 6} ry={NODE_R + 6}
                  fill="oklch(0.7 0.3 280 / 0.04)" filter="url(#gv)"
                  animate={{
                    ry: [NODE_R + 6, NODE_R + 12, NODE_R + 6],
                    opacity: sel ? 0.8 : [0.3, 0.5, 0.3],
                  }}
                  transition={{ duration: 3 + (i % 3), repeat: Infinity, ease: "easeInOut" }}
                  whileHover={{ scale: 1.12 }}
                />

                <circle cx={x} cy={y} r={NODE_R}
                  fill="oklch(0.08 0.04 270 / 0.6)"
                  stroke={sel ? "oklch(0.7 0.3 280 / 0.6)" : "oklch(0.6 0.2 270 / 0.25)"}
                  strokeWidth="2" filter="url(#gb)"
                />
                <circle cx={x} cy={y} r={NODE_R - 3}
                  fill="oklch(0.08 0.04 270 / 0.4)"
                  stroke={sel ? "oklch(0.8 0.3 280 / 0.3)" : "oklch(0.7 0.2 270 / 0.1)"}
                  strokeWidth="0.5"
                />

                <text x={x} y={y - 2} textAnchor="middle" dominantBaseline="central"
                  fontSize="30" fill={sel ? "oklch(0.85 0.3 280)" : "oklch(0.75 0.2 270 / 0.8)"}
                  filter="url(#gw)"
                >
                  {ZODIAC_SYMBOLS[sign]}
                </text>

                <text x={x} y={y + 24} textAnchor="middle" dominantBaseline="central"
                  fontSize="12" fontWeight="600"
                  fill={sel ? "oklch(0.8 0.2 280 / 0.8)" : "oklch(0.6 0.15 270 / 0.5)"}
                >
                  {sign}
                </text>
              </motion.g>
            )
          })}
        </g>

        {/* particles */}
        <AnimatePresence>
          {particles.map((p) => {
            const ex = p.x + Math.cos(p.angle) * p.dist
            const ey = p.y + Math.sin(p.angle) * p.dist
            return (
              <motion.circle key={p.id}
                cx={p.x} cy={p.y} r={3} fill={p.color} filter="url(#gw)"
                initial={{ cx: p.x, cy: p.y, opacity: 1, r: 3 }}
                animate={{ cx: ex, cy: ey, opacity: 0, r: 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
              />
            )
          })}
        </AnimatePresence>
      </svg>
    </div>
  )
}
