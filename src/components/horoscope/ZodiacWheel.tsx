"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import gsap from "gsap"
import { SIGNS, SIGN_DATES } from "@/lib/horoscope/data"

const CX = 400
const CY = 400
const RADIUS = 250
const NODE_RADIUS = 42
const DEG = (Math.PI * 2) / 12

const ZODIAC_EMOJIS: Record<string, string> = {
  Aries: "\u2648", Tauro: "\u2649", G\u00e9minis: "\u264a", C\u00e1ncer: "\u264b",
  Leo: "\u264c", Virgo: "\u264d", Libra: "\u264e", Escorpio: "\u264f",
  Sagitario: "\u2650", Capricornio: "\u2651", Acuario: "\u2652", Piscis: "\u2653",
}

interface Particle {
  id: number
  x: number
  y: number
  angle: number
  distance: number
  color: string
}

interface ZodiacWheelProps {
  onSelect: (sign: string) => void
  selectedSign: string | null
}

export function ZodiacWheel({ onSelect, selectedSign }: ZodiacWheelProps) {
  const wheelRef = useRef<SVGGElement>(null)
  const [particles, setParticles] = useState<Particle[]>([])
  const currentRotation = useRef(0)
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    setEntered(true)
  }, [])

  const handleSignClick = useCallback(
    (sign: string, index: number) => {
      const targetAngle = -index * 30
      const delta = ((targetAngle - currentRotation.current) % 360 + 540) % 360 - 180

      if (wheelRef.current) {
        gsap.to(wheelRef.current, {
          rotation: currentRotation.current + delta,
          svgOrigin: `${CX} ${CY}`,
          duration: 1.5,
          ease: "power4.inOut",
        })
        currentRotation.current += delta
      }

      const angleRad = (index * 30 - 90) * (Math.PI / 180)
      const px = CX + Math.cos(angleRad) * (RADIUS + 20)
      const py = CY + Math.sin(angleRad) * (RADIUS + 20)

      const newParticles: Particle[] = []
      for (let i = 0; i < 24; i++) {
        const a = (Math.PI * 2 * i) / 24 + Math.random() * 0.3
        newParticles.push({
          id: Date.now() + i,
          x: px,
          y: py,
          angle: a,
          distance: 40 + Math.random() * 120,
          color: ["#a78bfa", "#818cf8", "#c084fc", "#60a5fa", "#e879f9"][Math.floor(Math.random() * 5)],
        })
      }
      setParticles(newParticles)
      setTimeout(() => setParticles([]), 1000)

      setTimeout(() => onSelect(sign), 600)
    },
    [onSelect]
  )

  const mandalaRef = useRef<SVGGElement>(null)

  useEffect(() => {
    if (!mandalaRef.current) return
    const lines = mandalaRef.current.querySelectorAll("line")
    gsap.to(lines, {
      rotation: 360,
      svgOrigin: `${CX} ${CY}`,
      duration: 60,
      repeat: -1,
      ease: "none",
      stagger: { each: -0.5, from: "start" },
    })
    const circles = mandalaRef.current.querySelectorAll("circle")
    gsap.to(circles, {
      rotation: -360,
      svgOrigin: `${CX} ${CY}`,
      duration: 80,
      repeat: -1,
      ease: "none",
      stagger: { each: -0.3, from: "start" },
    })
  }, [])

  return (
    <div className="relative flex items-center justify-center">
      <svg viewBox="0 0 800 800" className="size-full max-h-[80vh] max-w-[800px]">
        <defs>
          <radialGradient id="wheelGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(0.6 0.25 270 / 0.06)" />
            <stop offset="60%" stopColor="oklch(0.5 0.2 270 / 0.02)" />
            <stop offset="100%" stopColor="oklch(0 0 0 / 0)" />
          </radialGradient>
          <filter id="glowBlue">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glowWhite">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glowViolet">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle cx={CX} cy={CY} r={RADIUS + 80} fill="url(#wheelGlow)" />

        <g ref={mandalaRef}>
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (Math.PI * 2 * i) / 12
            const r1 = 40
            const r2 = RADIUS - 10
            return (
              <line
                key={`mandala-${i}`}
                x1={CX + Math.cos(angle) * r1}
                y1={CY + Math.sin(angle) * r1}
                x2={CX + Math.cos(angle) * r2}
                y2={CY + Math.sin(angle) * r2}
                stroke="oklch(0.7 0.25 270 / 0.08)"
                strokeWidth="0.5"
              />
            )
          })}
          {Array.from({ length: 3 }).map((_, i) => (
            <circle
              key={`mandala-circle-${i}`}
              cx={CX}
              cy={CY}
              r={60 + i * 40}
              fill="none"
              stroke="oklch(0.7 0.25 270 / 0.06)"
              strokeWidth="0.5"
              strokeDasharray={`${4 + i * 2} ${6 + i * 2}`}
            />
          ))}
          {Array.from({ length: 6 }).map((_, i) => (
            <circle
              key={`mandala-dot-${i}`}
              cx={CX + Math.cos((Math.PI * 2 * i) / 6) * 20}
              cy={CY + Math.sin((Math.PI * 2 * i) / 6) * 20}
              r={2}
              fill="oklch(0.7 0.3 280 / 0.15)"
            />
          ))}
        </g>

        <circle cx={CX} cy={CY} r={RADIUS + 5} fill="none" stroke="oklch(0.6 0.2 270 / 0.06)" strokeWidth="1" strokeDasharray="4 8">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from={`0 ${CX} ${CY}`}
            to={`360 ${CX} ${CY}`}
            dur="120s"
            repeatCount="indefinite"
          />
        </circle>

        <g ref={wheelRef}>
          {SIGNS.map((sign, i) => {
            const angleRad = (i * 30 - 90) * (Math.PI / 180)
            const x = CX + Math.cos(angleRad) * RADIUS
            const y = CY + Math.sin(angleRad) * RADIUS
            const isSelected = selectedSign === sign

            return (
              <motion.g
                key={sign}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: entered ? (isSelected ? 1 : 0.4) : 0,
                  scale: entered ? 1 : 0,
                }}
                transition={{ delay: 0.1 + i * 0.05, duration: 0.5, ease: "backOut" }}
                whileHover={{ scale: 1.15 }}
                onClick={() => handleSignClick(sign, i)}
                className="cursor-pointer"
                style={{ transformOrigin: `${x}px ${y}px` }}
              >
                <motion.ellipse
                  cx={x}
                  cy={y}
                  rx={NODE_RADIUS + 4}
                  ry={NODE_RADIUS + 4}
                  fill="oklch(0.7 0.3 280 / 0.04)"
                  filter="url(#glowViolet)"
                  animate={{
                    ry: [NODE_RADIUS + 4, NODE_RADIUS + 8, NODE_RADIUS + 4],
                    opacity: isSelected ? 0.8 : [0.3, 0.5, 0.3],
                  }}
                  transition={{ duration: 3 + (i % 3), repeat: Infinity, ease: "easeInOut" }}
                />

                <circle cx={x} cy={y} r={NODE_RADIUS} fill="oklch(0.08 0.04 270 / 0.6)" stroke={isSelected ? "oklch(0.7 0.3 280 / 0.6)" : "oklch(0.6 0.2 270 / 0.2)"} strokeWidth="1.5" filter="url(#glowBlue)" />

                <circle cx={x} cy={y} r={NODE_RADIUS - 2} fill="oklch(0.08 0.04 270 / 0.4)" stroke={isSelected ? "oklch(0.8 0.3 280 / 0.3)" : "oklch(0.7 0.2 270 / 0.1)"} strokeWidth="0.5" />

                <text x={x} y={y - 4} textAnchor="middle" dominantBaseline="central" fontSize="22" fontWeight="400" fill={isSelected ? "oklch(0.85 0.3 280)" : "oklch(0.7 0.2 270 / 0.7)"} filter="url(#glowWhite)">
                  {ZODIAC_EMOJIS[sign]}
                </text>

                <text x={x} y={y + 22} textAnchor="middle" dominantBaseline="central" fontSize="10" fontWeight="500" fill={isSelected ? "oklch(0.8 0.2 280 / 0.7)" : "oklch(0.6 0.15 270 / 0.4)"}>
                  {sign}
                </text>
              </motion.g>
            )
          })}
        </g>

        <AnimatePresence>
          {particles.map((p) => {
            const endX = p.x + Math.cos(p.angle) * p.distance
            const endY = p.y + Math.sin(p.angle) * p.distance
            return (
              <motion.circle
                key={p.id}
                cx={p.x}
                cy={p.y}
                r={2}
                fill={p.color}
                initial={{ cx: p.x, cy: p.y, opacity: 1, r: 2 }}
                animate={{ cx: endX, cy: endY, opacity: 0, r: 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            )
          })}
        </AnimatePresence>
      </svg>
    </div>
  )
}
