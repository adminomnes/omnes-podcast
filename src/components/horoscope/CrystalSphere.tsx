"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface CrystalSphereProps {
  isActive: boolean
  signName?: string
}

export function CrystalSphere({ isActive, signName }: CrystalSphereProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId: number
    let particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number }[] = []
    let time = 0

    function resize() {
      if (!canvas) return
      canvas.width = canvas.offsetWidth * 2
      canvas.height = canvas.offsetHeight * 2
      ctx!.scale(1, 1)
    }

    function initParticles() {
      particles = []
      for (let i = 0; i < 40; i++) {
        const angle = Math.random() * Math.PI * 2
        const radius = Math.random() * 80
        particles.push({
          x: canvas!.width / 2 + Math.cos(angle) * radius,
          y: canvas!.height / 2 + Math.sin(angle) * radius,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: Math.random() * 2 + 0.5,
          alpha: Math.random() * 0.5 + 0.2,
        })
      }
    }

    resize()
    initParticles()

    function draw() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time += 0.02

      const cx = canvas.width / 2
      const cy = canvas.height / 2
      const maxR = Math.min(cx, cy) * 0.8
      const pulse = isActive ? 1 + Math.sin(time * 2) * 0.05 : 1
      const r = maxR * pulse

      const gradient = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, 0, cx, cy, r)
      if (isActive) {
        gradient.addColorStop(0, "rgba(180, 130, 255, 0.4)")
        gradient.addColorStop(0.3, "rgba(100, 80, 255, 0.25)")
        gradient.addColorStop(0.6, "rgba(60, 40, 200, 0.15)")
        gradient.addColorStop(1, "rgba(30, 20, 100, 0.05)")
      } else {
        gradient.addColorStop(0, "rgba(150, 120, 220, 0.2)")
        gradient.addColorStop(0.5, "rgba(80, 60, 180, 0.1)")
        gradient.addColorStop(1, "rgba(30, 20, 100, 0.02)")
      }

      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()

      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 1.5)
      if (isActive) {
        glow.addColorStop(0, "rgba(150, 100, 255, 0.15)")
        glow.addColorStop(0.5, "rgba(100, 60, 255, 0.06)")
        glow.addColorStop(1, "rgba(0, 0, 0, 0)")
      } else {
        glow.addColorStop(0, "rgba(100, 80, 220, 0.05)")
        glow.addColorStop(0.5, "rgba(50, 40, 180, 0.02)")
        glow.addColorStop(1, "rgba(0, 0, 0, 0)")
      }
      ctx.beginPath()
      ctx.arc(cx, cy, r * 1.5, 0, Math.PI * 2)
      ctx.fillStyle = glow
      ctx.fill()

      particles.forEach((p) => {
        p.x += p.vx + Math.sin(time + p.y * 0.01) * 0.2
        p.y += p.vy + Math.cos(time + p.x * 0.01) * 0.2
        p.alpha = isActive
          ? 0.3 + Math.sin(time * 3 + p.x * 0.1) * 0.3
          : 0.1 + Math.sin(time + p.x * 0.1) * 0.1

        const dx = p.x - cx
        const dy = p.y - cy
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist > r * 0.9) {
          p.x = cx + (dx / dist) * r * 0.5
          p.y = cy + (dy / dist) * r * 0.5
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200, 180, 255, ${p.alpha})`
        ctx.fill()
      })

      const shine = ctx.createRadialGradient(
        cx - r * 0.3, cy - r * 0.4, 0,
        cx - r * 0.3, cy - r * 0.4, r * 0.5
      )
      shine.addColorStop(0, "rgba(255, 255, 255, 0.08)")
      shine.addColorStop(1, "rgba(255, 255, 255, 0)")
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.fillStyle = shine
      ctx.fill()

      animId = requestAnimationFrame(draw)
    }

    draw()

    const resizeHandler = () => {
      resize()
      initParticles()
    }
    window.addEventListener("resize", resizeHandler)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resizeHandler)
    }
  }, [isActive])

  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        animate={isActive ? { scale: [1, 1.08, 1], transition: { duration: 2, repeat: Infinity } } : { scale: 1 }}
        className="relative size-[300px] md:size-[400px]"
      >
        <canvas ref={canvasRef} className="size-full" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`rounded-full transition-all duration-1000 ${isActive ? "shadow-[0_0_80px_oklch(0.7_0.3_280/0.3),0_0_150px_oklch(0.6_0.3_260/0.15)]" : "shadow-[0_0_40px_oklch(0.6_0.2_280/0.1)]"} size-[200px] md:size-[260px]`} />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          {signName ? (
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center text-sm font-bold tracking-widest text-white/60 md:text-base"
            >
              {signName.toUpperCase()}
            </motion.span>
          ) : (
            <span className="text-center text-[10px] font-light tracking-[0.3em] text-white/20 md:text-xs">
              ELIGE TU SIGNO
            </span>
          )}
        </div>
      </motion.div>
    </div>
  )
}
