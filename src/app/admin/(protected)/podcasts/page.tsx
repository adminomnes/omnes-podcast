"use client"

import { GlassPanel } from "@/components/shared/GlassPanel"
import { AnimatedSection } from "@/components/shared/AnimatedSection"
import { Plus, Edit3, Trash2 } from "lucide-react"

const MOCK_PODCASTS = [
  { title: "Detrás del Espejo", episodes: 24, status: "Publicado", color: "#00d4ff" },
  { title: "Me gusta que te guste", episodes: 18, status: "Publicado", color: "#ff6b6b" },
]

export default function AdminPodcasts() {
  return (
    <AnimatedSection>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Podcasts</h1>
          <p className="mt-1 text-sm text-white/40">Gestiona tus programas</p>
        </div>
        <button className="flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-medium text-white/80 transition-all hover:bg-white/15">
          <Plus className="size-4" />
          Nuevo Podcast
        </button>
      </div>

      <div className="space-y-4">
        {MOCK_PODCASTS.map((podcast) => (
          <GlassPanel key={podcast.title} className="flex items-center gap-4 p-5">
            <div className="size-12 rounded-xl" style={{ background: podcast.color }} />
            <div className="flex-1">
              <h3 className="font-medium text-white/90">{podcast.title}</h3>
              <p className="text-xs text-white/40">{podcast.episodes} episodios</p>
            </div>
            <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-400">{podcast.status}</span>
            <button className="rounded-full p-2 text-white/40 transition-colors hover:bg-white/[0.08] hover:text-white/80">
              <Edit3 className="size-4" />
            </button>
            <button className="rounded-full p-2 text-white/40 transition-colors hover:bg-red-500/10 hover:text-red-400">
              <Trash2 className="size-4" />
            </button>
          </GlassPanel>
        ))}
      </div>
    </AnimatedSection>
  )
}
