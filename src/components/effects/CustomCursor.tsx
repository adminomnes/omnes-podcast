"use client"

import { useEffect, useRef } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorDotRef = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 })
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 })

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate(${e.clientX - 2}px, ${e.clientY - 2}px)`
      }
    }

    const handleMouseEnter = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = "1"
      if (cursorDotRef.current) cursorDotRef.current.style.opacity = "1"
    }

    const handleMouseLeave = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = "0"
      if (cursorDotRef.current) cursorDotRef.current.style.opacity = "0"
    }

    window.addEventListener("mousemove", moveCursor)
    document.body.addEventListener("mouseenter", handleMouseEnter)
    document.body.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", moveCursor)
      document.body.removeEventListener("mouseenter", handleMouseEnter)
      document.body.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [mouseX, mouseY])

  return (
    <>
      <motion.div
        ref={cursorRef}
        className="pointer-events-none fixed top-0 left-0 z-[99999] size-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20"
        style={{
          x: springX,
          y: springY,
          background: "radial-gradient(circle, oklch(0.65 0.25 250 / 0.08), transparent 70%)",
          boxShadow: "0 0 20px oklch(0.65 0.25 250 / 0.1)",
        }}
      />
      <div
        ref={cursorDotRef}
        className="pointer-events-none fixed top-0 left-0 z-[99999] size-1 rounded-full bg-white/70"
      />
    </>
  )
}
