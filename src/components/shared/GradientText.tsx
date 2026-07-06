"use client"

import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface GradientTextProps {
  children: ReactNode
  className?: string
  as?: "h1" | "h2" | "h3" | "span" | "p"
}

export function GradientText({ children, className, as: Tag = "span" }: GradientTextProps) {
  return (
    <Tag className={cn("bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent", className)}>
      {children}
    </Tag>
  )
}
