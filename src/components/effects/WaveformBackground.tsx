"use client"

import { useEffect, useRef } from "react"

export function WaveformBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    let bars: { height: number; speed: number; phase: number }[] = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      const count = Math.floor(canvas.width / 6)
      bars = Array.from({ length: count }, () => ({
        height: Math.random() * 80 + 10,
        speed: 0.02 + Math.random() * 0.03,
        phase: Math.random() * Math.PI * 2,
      }))
    }

    resize()
    window.addEventListener("resize", resize)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const time = Date.now() * 0.001

      bars.forEach((bar, i) => {
        const x = i * 6
        const h = bar.height + Math.sin(time * bar.speed + bar.phase) * 20
        const gradient = ctx.createLinearGradient(x, canvas.height / 2 - h, x, canvas.height / 2 + h)
        gradient.addColorStop(0, `oklch(0.65 0.25 250 / ${0.03 + Math.sin(time * 0.5 + i * 0.1) * 0.02})`)
        gradient.addColorStop(0.5, `oklch(0.6 0.3 290 / ${0.05 + Math.sin(time * 0.5 + i * 0.1) * 0.02})`)
        gradient.addColorStop(1, `oklch(0.65 0.25 250 / ${0.03 + Math.sin(time * 0.5 + i * 0.1) * 0.02})`)

        ctx.fillStyle = gradient
        ctx.fillRect(x, canvas.height / 2 - h / 2, 2, h)
      })

      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 opacity-40"
    />
  )
}
