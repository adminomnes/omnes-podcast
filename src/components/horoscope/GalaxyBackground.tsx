"use client"

import { useEffect, useRef } from "react"

interface Star {
  x: number
  y: number
  r: number
  alpha: number
  speed: number
  twinkleSpeed: number
  twinklePhase: number
}

interface Nebula {
  x: number
  y: number
  r: number
  color: string
  alpha: number
  driftX: number
  driftY: number
}

export function GalaxyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let stars: Star[] = []
    let nebulas: Nebula[] = []
    let animId: number
    let time = 0

    function resize() {
      if (!canvas) return
      canvas.width = window.innerWidth * 2
      canvas.height = window.innerHeight * 2
      init()
    }

    function init() {
      if (!canvas) return
      stars = []
      for (let i = 0; i < 200; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.5 + 0.3,
          alpha: Math.random() * 0.6 + 0.2,
          speed: Math.random() * 0.15 + 0.02,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
          twinklePhase: Math.random() * Math.PI * 2,
        })
      }

      nebulas = [
        { x: canvas.width * 0.2, y: canvas.height * 0.3, r: 300, color: "80, 60, 200", alpha: 0.04, driftX: 0.1, driftY: 0.05 },
        { x: canvas.width * 0.7, y: canvas.height * 0.6, r: 400, color: "60, 40, 180", alpha: 0.03, driftX: -0.08, driftY: 0.06 },
        { x: canvas.width * 0.5, y: canvas.height * 0.2, r: 250, color: "100, 50, 220", alpha: 0.035, driftX: 0.05, driftY: -0.04 },
        { x: canvas.width * 0.8, y: canvas.height * 0.8, r: 350, color: "40, 60, 200", alpha: 0.025, driftX: -0.06, driftY: -0.03 },
        { x: canvas.width * 0.3, y: canvas.height * 0.7, r: 280, color: "120, 40, 200", alpha: 0.03, driftX: 0.07, driftY: -0.05 },
      ]
    }

    resize()

    function draw() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time += 0.01

      for (const n of nebulas) {
        n.x += n.driftX
        n.y += n.driftY
        if (n.x > canvas.width + n.r) n.x = -n.r
        if (n.x < -n.r) n.x = canvas.width + n.r
        if (n.y > canvas.height + n.r) n.y = -n.r
        if (n.y < -n.r) n.y = canvas.height + n.r

        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r)
        grad.addColorStop(0, `rgba(${n.color}, ${n.alpha})`)
        grad.addColorStop(0.4, `rgba(${n.color}, ${n.alpha * 0.5})`)
        grad.addColorStop(1, `rgba(${n.color}, 0)`)
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()
      }

      for (const star of stars) {
        const twinkle = Math.sin(time * star.twinkleSpeed * 60 + star.twinklePhase)
        const currentAlpha = star.alpha * (0.5 + twinkle * 0.5)

        ctx.beginPath()
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(220, 220, 255, ${currentAlpha})`

        if (star.r > 1) {
          ctx.shadowBlur = star.r * 4
          ctx.shadowColor = `rgba(180, 180, 255, ${currentAlpha * 0.5})`
        }
        ctx.fill()
        ctx.shadowBlur = 0
      }

      animId = requestAnimationFrame(draw)
    }

    draw()

    window.addEventListener("resize", resize)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0" />
}
