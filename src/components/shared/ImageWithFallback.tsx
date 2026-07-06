"use client"

import Image from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface ImageWithFallbackProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  priority?: boolean
}

export function ImageWithFallback({
  src,
  alt,
  width,
  height,
  fill,
  className,
  priority,
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false)

  return (
    <div className={cn("relative overflow-hidden", fill && "size-full", className)}>
      <Image
        src={error ? "/images/placeholder.svg" : src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        preload={priority}
        className={cn("object-cover transition-all duration-700", className)}
        onError={() => setError(true)}
      />
    </div>
  )
}
