"use client"

import { useRef, useEffect } from "react"

export function AmbientLighting() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const lights = container.querySelectorAll<HTMLDivElement>(".ambient-light")

    const handleMouse = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100
      const y = (e.clientY / window.innerHeight) * 100

      lights.forEach((light, i) => {
        const speed = 0.02 * (i + 1)
        const offsetX = (x - 50) * speed
        const offsetY = (y - 50) * speed
        light.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${1 + speed * 0.5})`
      })
    }

    window.addEventListener("mousemove", handleMouse)
    return () => window.removeEventListener("mousemove", handleMouse)
  }, [])

  return (
    <div ref={containerRef} className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        className="ambient-light absolute -top-1/4 -left-1/4 size-1/2 rounded-full opacity-[0.04] blur-[200px] transition-all duration-1000"
        style={{ background: "oklch(0.65 0.25 250)" }}
      />
      <div
        className="ambient-light absolute -bottom-1/4 -right-1/4 size-1/2 rounded-full opacity-[0.03] blur-[200px] transition-all duration-1000"
        style={{ background: "oklch(0.6 0.3 290)" }}
      />
      <div
        className="ambient-light absolute top-1/3 right-1/4 size-1/3 rounded-full opacity-[0.02] blur-[150px] transition-all duration-1000"
        style={{ background: "oklch(0.6 0.3 330)" }}
      />
      <div
        className="ambient-light absolute bottom-1/3 left-1/3 size-1/4 rounded-full opacity-[0.02] blur-[120px] transition-all duration-1000"
        style={{ background: "oklch(0.5 0.2 200)" }}
      />
    </div>
  )
}
