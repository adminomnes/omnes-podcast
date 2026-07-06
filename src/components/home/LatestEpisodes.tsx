"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { Play, Clock, Sparkles } from "lucide-react"
import { GlassPanel } from "@/components/shared/GlassPanel"
import { formatDuration, formatDate } from "@/lib/utils"
import { usePlayerStore } from "@/hooks/usePlayer"
import type { Episode } from "@/types"

const MOCK: Episode[] = [
  { id: "e1", season_id: "s1", podcast_id: "1", title: "El espejo roto", description: "Exploramos los secretos detrás de los reflejos que cambiaron la historia.", audio_url: "", video_url: null, duration: 3600, thumbnail: "", tags: [], category: "Misterio", published_at: "2025-03-15", views: 12500, likes: 890, hosts: [], guests: [] },
  { id: "e2", season_id: "s1", podcast_id: "1", title: "La habitación sellada", description: "Un caso real que desafía toda explicación lógica.", audio_url: "", video_url: null, duration: 4200, thumbnail: "", tags: [], category: "Misterio", published_at: "2025-03-22", views: 9800, likes: 720, hosts: [], guests: [] },
  { id: "e3", season_id: "s2", podcast_id: "2", title: "El caos del primer episodio", description: "Todo lo que podía salir mal, salió mal.", audio_url: "", video_url: null, duration: 2800, thumbnail: "", tags: [], category: "Comedia", published_at: "2025-04-01", views: 15200, likes: 1200, hosts: [], guests: [] },
  { id: "e4", season_id: "s1", podcast_id: "1", title: "El susurro en la oscuridad", description: "Historias que no deberías escuchar solo.", audio_url: "", video_url: null, duration: 3300, thumbnail: "", tags: [], category: "Misterio", published_at: "2025-04-05", views: 7200, likes: 540, hosts: [], guests: [] },
  { id: "e5", season_id: "s2", podcast_id: "2", title: "Invitado sorpresa", description: "Nunca sabes quién va a aparecer.", audio_url: "", video_url: null, duration: 3100, thumbnail: "", tags: [], category: "Comedia", published_at: "2025-04-10", views: 11000, likes: 890, hosts: [], guests: [] },
]

const COLORS = [
  "from-blue-600 to-cyan-500",
  "from-purple-600 to-pink-500",
  "from-pink-600 to-rose-500",
  "from-amber-600 to-orange-500",
  "from-emerald-600 to-teal-500",
]

export function LatestEpisodes() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { play } = usePlayerStore()

  return (
    <section id="latest" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/30 to-pink-950/20" />
      <div className="absolute inset-0 opacity-15" style={{
        background: "radial-gradient(circle at 80% 20%, oklch(0.65 0.3 320 / 0.08), transparent 50%), radial-gradient(circle at 20% 80%, oklch(0.7 0.3 250 / 0.06), transparent 50%)"
      }} />

      <div className="max-w-content relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 flex items-center justify-between"
        >
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-pink-500/10 px-4 py-1 text-xs font-medium tracking-widest text-purple-300/80 uppercase backdrop-blur-xl">
              <Sparkles className="size-3" />
          Reproduce
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Últimos <span className="text-gradient">episodios</span>
            </h2>
            <p className="mt-1 text-sm text-white/35">Los más recientes de todos los programas</p>
          </div>
          <div className="hidden gap-2 sm:flex">
            <button onClick={() => scrollRef.current?.scrollBy({ left: -400, behavior: "smooth" })} className="rounded-full border border-white/[0.1] bg-white/[0.03] px-4 py-2 text-xs text-white/40 transition-all hover:border-white/[0.2] hover:bg-white/[0.08] hover:text-white/70">←</button>
            <button onClick={() => scrollRef.current?.scrollBy({ left: 400, behavior: "smooth" })} className="rounded-full border border-white/[0.1] bg-white/[0.03] px-4 py-2 text-xs text-white/40 transition-all hover:border-white/[0.2] hover:bg-white/[0.08] hover:text-white/70">→</button>
          </div>
        </motion.div>

        <div ref={scrollRef} className="no-scrollbar -mx-6 flex gap-5 overflow-x-auto px-6 pb-4 snap-x snap-mandatory">
          {MOCK.map((ep, i) => {
            const color = COLORS[i % COLORS.length]
            return (
              <motion.div
                key={ep.id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="snap-start shrink-0"
              >
                <GlassPanel className="group w-[280px] cursor-pointer overflow-hidden border border-white/[0.08] transition-all hover:bg-white/[0.08] hover:shadow-[0_0_40px_oklch(0.7_0.3_250/0.1)] sm:w-[320px]">
                  <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-gray-900 to-gray-950" onClick={() => play(ep)}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-20 group-hover:opacity-30 transition-opacity`} />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100 backdrop-blur-sm">
                      <div className="flex size-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-2xl shadow-[0_0_40px_oklch(0_0_0/0.5)]">
                        <Play className="size-7 ml-1 text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-0.5 text-[10px] text-white/90 backdrop-blur-sm border border-white/[0.08]">
                      {formatDuration(ep.duration)}
                    </div>
                  </div>
                  <div className="space-y-2.5 p-4">
                    <div className="flex items-center gap-2 text-[10px] text-white/25">
                      <Clock className="size-3" />
                      {formatDate(ep.published_at)}
                    </div>
                    <h3 className="truncate text-sm font-semibold text-white/80 group-hover:text-white transition-colors">
                      {ep.title}
                    </h3>
                    <p className="line-clamp-2 text-xs leading-relaxed text-white/35">
                      {ep.description}
                    </p>
                  </div>
                </GlassPanel>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
