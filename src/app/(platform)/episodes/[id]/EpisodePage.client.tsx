"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Play, Heart, Share2, Clock, Eye, Tag } from "lucide-react"
import { GlassPanel } from "@/components/shared/GlassPanel"
import { AnimatedSection } from "@/components/shared/AnimatedSection"
import { formatDuration, formatViews, formatDate } from "@/lib/utils"
import { usePlayerStore } from "@/hooks/usePlayer"
import { Button } from "@/components/ui/button"

export function EpisodePageClient() {
  const [isLiked, setIsLiked] = useState(false)
  const { play } = usePlayerStore()

  const mockEpisode = {
    id: "e1",
    podcastTitle: "Detrás del Espejo",
    title: "El espejo roto",
    description: "Exploramos los secretos detrás de los reflejos que cambiaron la historia. Un episodio que te hará cuestionar todo lo que ves.",
    duration: 3600, views: 12500, likes: 890,
    publishedAt: "2025-03-15",
    tags: ["misterio", "reflejos", "historia"],
    hosts: ["Alex Miranda"], guests: [],
  }

  return (
    <div className="min-h-screen pt-24">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
          <AnimatedSection>
            <div className="aspect-video overflow-hidden rounded-2xl bg-white/[0.03]">
              <div className="flex h-full items-center justify-center">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => play(mockEpisode as any)}
                  className="flex size-20 items-center justify-center rounded-full bg-white/10 text-white/90 backdrop-blur-xl transition-colors hover:bg-white/20"
                >
                  <Play className="size-8 ml-1" />
                </motion.button>
              </div>
            </div>

            <div className="mt-8 space-y-6">
              <div>
                <p className="text-sm text-blue-400">{mockEpisode.podcastTitle}</p>
                <h1 className="mt-1 text-3xl font-bold tracking-tight">{mockEpisode.title}</h1>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-white/40">
                <span className="flex items-center gap-1.5"><Clock className="size-4" />{formatDuration(mockEpisode.duration)}</span>
                <span className="flex items-center gap-1.5"><Eye className="size-4" />{formatViews(mockEpisode.views)}</span>
                <span>{formatDate(mockEpisode.publishedAt)}</span>
              </div>

              <div className="flex items-center gap-3">
                <Button onClick={() => play(mockEpisode as any)} className="gap-2 rounded-full bg-white/10 text-white/90 hover:bg-white/20">
                  <Play className="size-4" />Reproducir
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setIsLiked(!isLiked)} className="rounded-full text-white/40 hover:text-red-400">
                  <Heart className={`size-5 ${isLiked ? "fill-red-400 text-red-400" : ""}`} />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full text-white/40 hover:text-white/80">
                  <Share2 className="size-5" />
                </Button>
              </div>

              <div>
                <p className="text-sm leading-relaxed text-white/50">{mockEpisode.description}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {mockEpisode.tags.map((tag) => (
                  <span key={tag} className="flex items-center gap-1 rounded-full bg-white/[0.06] px-3 py-1 text-xs text-white/50">
                    <Tag className="size-3" />{tag}
                  </span>
                ))}
              </div>

              <div className="border-t border-white/[0.06] pt-6">
                <h3 className="mb-4 font-medium text-white/70">Invitados</h3>
                <p className="text-sm text-white/30">Próximamente: lista de invitados con fotos, biografías y momentos destacados.</p>
              </div>

              <div className="border-t border-white/[0.06] pt-6">
                <h3 className="mb-6 font-medium text-white/70">Comentarios</h3>
                <GlassPanel className="p-6 text-center">
                  <p className="text-sm text-white/30">Los comentarios estarán disponibles al conectar Supabase.</p>
                </GlassPanel>
              </div>
            </div>
          </AnimatedSection>

          <aside className="space-y-6">
            <GlassPanel className="p-5">
              <h3 className="mb-4 text-sm font-medium text-white/60 uppercase tracking-wider">Episodios relacionados</h3>
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="group flex cursor-pointer gap-3">
                    <div className="size-16 shrink-0 rounded-lg bg-white/[0.05]" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-white/70 group-hover:text-white/90">Episodio relacionado {i + 1}</p>
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
