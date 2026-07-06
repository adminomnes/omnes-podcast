"use client"

import { motion } from "framer-motion"
import { Clock, ArrowUpRight, BookOpen } from "lucide-react"
import type { NewsItem } from "@/lib/pulso/types"

interface NewsCardProps {
  item: NewsItem
  index: number
}

export function NewsCard({ item, index }: NewsCardProps) {
  return (
    <motion.a
      href={`/pulso/${item.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] transition-all duration-500 hover:border-white/[0.12] hover:bg-white/[0.04] hover:shadow-[0_0_40px_oklch(0.6_0.25_270/0.08)]"
    >
      <div className="relative overflow-hidden h-40">
        <img
          src={item.image}
          alt={item.title}
          className="size-full object-cover transition-all duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute top-3 left-3">
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-medium text-white/70 backdrop-blur-sm">
            {item.source}
          </span>
        </div>
      </div>

      <div className="space-y-2.5 p-4">
        <h3 className="text-sm font-bold leading-tight text-white/85 transition-colors group-hover:text-white">
          {item.title}
        </h3>
        <p className="text-xs leading-relaxed text-white/40">
          {item.description.substring(0, 100)}
          {item.description.length > 100 ? "..." : ""}
        </p>
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3 text-[11px] text-white/30">
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {new Date(item.date).toLocaleDateString("es-CL", { day: "numeric", month: "short" })}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="size-3" />
              {item.readingTime}
            </span>
          </div>
          <span className="flex items-center gap-1 text-[11px] font-medium text-blue-400 opacity-0 transition-opacity group-hover:opacity-100">
            Leer <ArrowUpRight className="size-3" />
          </span>
        </div>
      </div>
    </motion.a>
  )
}
