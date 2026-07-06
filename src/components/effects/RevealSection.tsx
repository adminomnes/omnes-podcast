"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

interface Props {
  children: React.ReactNode
  className?: string
  direction?: "up" | "down" | "left" | "right"
  delay?: number
  duration?: number
}

const variants = {
  up: { hidden: { y: 80, opacity: 0 }, visible: { y: 0, opacity: 1 } },
  down: { hidden: { y: -80, opacity: 0 }, visible: { y: 0, opacity: 1 } },
  left: { hidden: { x: -80, opacity: 0 }, visible: { x: 0, opacity: 1 } },
  right: { hidden: { x: 80, opacity: 0 }, visible: { x: 0, opacity: 1 } },
}

export function RevealSection({ children, className = "", direction = "up", delay = 0, duration = 0.7 }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <div ref={ref} className={className}>
      <motion.div
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={variants[direction]}
        transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {children}
      </motion.div>
    </div>
  )
}
