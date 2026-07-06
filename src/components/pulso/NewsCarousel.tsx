"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { NewsCard } from "./NewsCard"
import type { NewsItem } from "@/lib/pulso/types"

interface NewsCarouselProps {
  label: string
  icon: string
  items: NewsItem[]
}

export function NewsCarousel({ label, icon, items }: NewsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return
    const amount = scrollRef.current.clientWidth * 0.6
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" })
  }

  if (items.length === 0) return null

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <h2 className="text-lg font-bold text-white/90">{label}</h2>
          <span className="rounded-full bg-white/[0.04] px-2 py-0.5 text-[11px] text-white/30">{items.length}</span>
        </div>
        <div className="flex gap-1">
          <button onClick={() => scroll("left")} className="rounded-full p-1.5 text-white/30 transition-colors hover:bg-white/5 hover:text-white/70">
            <ChevronLeft className="size-4" />
          </button>
          <button onClick={() => scroll("right")} className="rounded-full p-1.5 text-white/30 transition-colors hover:bg-white/5 hover:text-white/70">
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="no-scrollbar flex gap-4 overflow-x-auto pb-2" style={{ scrollSnapType: "x mandatory" }}>
        {items.map((item, i) => (
          <div key={item.id} className="min-w-[280px] max-w-[320px] shrink-0" style={{ scrollSnapAlign: "start" }}>
            <NewsCard item={item} index={i} />
          </div>
        ))}
      </div>
    </section>
  )
}
