"use client"

import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface GlassPanelProps {
  children: ReactNode
  className?: string
  glow?: boolean
  strong?: boolean
}

export function GlassPanel({ children, className, glow, strong }: GlassPanelProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border backdrop-blur-xl transition-all duration-500",
        strong
          ? "bg-white/[0.06] border-white/[0.12]"
          : "bg-white/[0.03] border-white/[0.06]",
        glow && "shadow-[0_0_30px_rgba(59,130,246,0.15)]",
        className
      )}
    >
      {children}
    </div>
  )
}
