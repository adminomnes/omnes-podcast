"use client"

import { useEffect, useRef, useState } from "react"

export function AnimatedCounter({ from = 0, to, duration = 600 }: { from?: number; to: number; duration?: number }) {
  const [value, setValue] = useState(from)
  const startTime = useRef<number | null>(null)
  const frameRef = useRef<number>(0)

  useEffect(() => {
    if (from === to) {
      setValue(to)
      return
    }

    startTime.current = null

    const animate = (timestamp: number) => {
      if (startTime.current === null) startTime.current = timestamp
      const elapsed = timestamp - startTime.current
      const progress = Math.min(elapsed / duration, 1)

      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(from + (to - from) * eased))

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      }
    }

    frameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameRef.current)
  }, [from, to, duration])

  return <>{value}</>
}
