"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Play, Heart, Share2, Clock, Eye, Tag } from "lucide-react"
import { GlassPanel } from "@/components/shared/GlassPanel"
import { AnimatedSection } from "@/components/shared/AnimatedSection"
import { formatDuration, formatViews, formatDate } from "@/lib/utils"
import { usePlayerStore } from "@/hooks/usePlayer"
import { Button } from "@/components/ui/button"
import { EpisodeChatPanel } from "@/components/community/EpisodeChatPanel"

// ─────────────────────────────────────────────────────────
// Mock episode — replace with real Supabase/CMS fetch
// ─────────────────────────────────────────────────────────
const MOCK_EPISODE = {
  id: "e1",
  podcastTitle: "Detrás del Espejo",
  title: "El espejo roto",
  description:
    "Exploramos los secretos detrás de los reflejos que cambiaron la historia. Un episodio que te hará cuestionar todo lo que ves.",
  duration: 3600,
  views: 12500,
  likes: 890,
  publishedAt: "2025-03-15",
  tags: ["misterio", "reflejos", "historia"],
  hosts: ["Alex Miranda"],
  guests: [],
  // The Supabase room_id for this episode's chat.
  // Set to null if no room has been seeded yet; in production
  // this would be fetched alongside the episode.
  roomId: null as string | null,
}

export function EpisodePageClient() {
  const [isLiked, setIsLiked] = useState(false)
  // Track current playback position for timestamp sync
  const [currentTime, setCurrentTime] = useState(0)
  const { play } = usePlayerStore()

  // Called by EpisodeChatPanel when user clicks a timestamp badge
  const handleSeek = (seconds: number) => {
    // TODO: wire to the global player seek when it exposes that API.
    // For now just log so you can see it working in the console.
    console.log("[EpisodeChat] Seek to", seconds, "seconds")
    setCurrentTime(seconds)
  }

  return (
    <div className="min-h-screen pt-24">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-12 lg:grid-cols-[1fr_420px]">
          <AnimatedSection>
            {/* ── Player area ── */}
            <div className="aspect-video overflow-hidden rounded-2xl bg-white/[0.03]">
              <div className="flex h-full items-center justify-center">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => play(MOCK_EPISODE as any)}
                  className="flex size-20 items-center justify-center rounded-full bg-white/10 text-white/90 backdrop-blur-xl transition-colors hover:bg-white/20"
                >
                  <Play className="ml-1 size-8" />
                </motion.button>
              </div>
            </div>

            <div className="mt-8 space-y-6">
              {/* Title & meta */}
              <div>
                <p className="text-sm text-blue-400">{MOCK_EPISODE.podcastTitle}</p>
                <h1 className="mt-1 text-3xl font-bold tracking-tight">{MOCK_EPISODE.title}</h1>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-white/40">
                <span className="flex items-center gap-1.5">
                  <Clock className="size-4" />
                  {formatDuration(MOCK_EPISODE.duration)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="size-4" />
                  {formatViews(MOCK_EPISODE.views)}
                </span>
                <span>{formatDate(MOCK_EPISODE.publishedAt)}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => play(MOCK_EPISODE as any)}
                  className="gap-2 rounded-full bg-white/10 text-white/90 hover:bg-white/20"
                >
                  <Play className="size-4" /> Reproducir
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsLiked(!isLiked)}
                  className="rounded-full text-white/40 hover:text-red-400"
                >
                  <Heart className={`size-5 ${isLiked ? "fill-red-400 text-red-400" : ""}`} />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full text-white/40 hover:text-white/80">
                  <Share2 className="size-5" />
                </Button>
              </div>

              {/* Description */}
              <p className="text-sm leading-relaxed text-white/50">{MOCK_EPISODE.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {MOCK_EPISODE.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 rounded-full bg-white/[0.06] px-3 py-1 text-xs text-white/50"
                  >
                    <Tag className="size-3" />
                    {tag}
                  </span>
                ))}
              </div>

              {/* Guests */}
              <div className="border-t border-white/[0.06] pt-6">
                <h3 className="mb-4 font-medium text-white/70">Invitados</h3>
                <p className="text-sm text-white/30">
                  Próximamente: lista de invitados con fotos, biografías y momentos destacados.
                </p>
              </div>

              {/* ── Episode Chat with Timestamp Sync ── */}
              <div className="border-t border-white/[0.06] pt-6">
                <h3 className="mb-2 flex items-center gap-2 font-medium text-white/70">
                  Chat del episodio
                  <span className="rounded-full bg-purple-500/15 border border-purple-500/20 px-2 py-0.5 text-[10px] font-bold text-purple-400 uppercase tracking-wide">
                    con timestamp sync
                  </span>
                </h3>
                <p className="mb-4 text-[11px] text-white/30">
                  Haz clic en un tag <span className="inline-flex items-center gap-0.5 rounded bg-blue-500/20 border border-blue-500/25 px-1.5 text-[10px] font-bold text-blue-300">⏱ 1:23</span> para saltar a ese momento del episodio.
                </p>

                <EpisodeChatPanel
                  roomId={MOCK_EPISODE.roomId}
                  currentTime={currentTime}
                  onSeek={handleSeek}
                  episodeTitle={MOCK_EPISODE.title}
                />
              </div>
            </div>
          </AnimatedSection>

          {/* Sidebar */}
          <aside className="space-y-6">
            <GlassPanel className="p-5">
              <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-white/60">
                Episodios relacionados
              </h3>
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="group flex cursor-pointer gap-3">
                    <div className="size-16 shrink-0 rounded-lg bg-white/[0.05]" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-white/70 group-hover:text-white/90">
                        Episodio relacionado {i + 1}
                      </p>
                      <p className="mt-0.5 text-xs text-white/30">{formatDuration(1800 + i * 600)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </aside>
        </div>
      </div>
    </div>
  )
}
