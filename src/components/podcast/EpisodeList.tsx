"use client"

import { motion } from "framer-motion"
import { Play, Clock, Eye, Heart, ChevronRight } from "lucide-react"
import { GlassPanel } from "@/components/shared/GlassPanel"
import { formatDuration, formatDate, formatViews } from "@/lib/utils"
import { usePlayerStore } from "@/hooks/usePlayer"
import type { Episode } from "@/types"

interface EpisodeListProps {
  episodes: Episode[]
}

export function EpisodeList({ episodes }: EpisodeListProps) {
  const { play } = usePlayerStore()

  return (
    <div className="space-y-4">
      {episodes.map((episode, index) => (
        <motion.div
          key={episode.id}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.06 }}
        >
          <GlassPanel className="group flex items-start gap-4 border border-white/[0.06] p-4 transition-all hover:bg-white/[0.08] sm:gap-6 sm:p-5">
            <div
              className="relative size-20 shrink-0 cursor-pointer overflow-hidden rounded-xl sm:size-28"
              onClick={() => play(episode)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-purple-900/40" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex size-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-xl">
                  <Play className="size-5 ml-0.5 text-white" />
                </div>
              </div>
              <div className="absolute top-2 right-2 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] text-white/70 backdrop-blur-sm">
                {formatDuration(episode.duration)}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-white/80 group-hover:text-white transition-colors">
                {episode.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-white/40">
                {episode.description}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-white/25">
                <span className="flex items-center gap-1">
                  <Clock className="size-3" />
                  {formatDuration(episode.duration)}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="size-3" />
                  {formatViews(episode.views)}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="size-3" />
                  {formatViews(episode.likes)}
                </span>
                <span>{formatDate(episode.published_at)}</span>
              </div>

              <div className="mt-2 flex flex-wrap gap-1.5">
                {episode.tags?.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white/[0.04] px-2 py-0.5 text-[10px] text-white/25"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ x: 3 }}
              onClick={() => play(episode)}
              className="hidden shrink-0 self-center rounded-full p-2 text-white/20 transition-colors hover:text-white/60 sm:block"
            >
              <ChevronRight className="size-5" />
            </motion.button>
          </GlassPanel>
        </motion.div>
      ))}
    </div>
  )
}
