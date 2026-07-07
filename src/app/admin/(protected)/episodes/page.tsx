"use client"

import { GlassPanel } from "@/components/shared/GlassPanel"
import { AnimatedSection } from "@/components/shared/AnimatedSection"
import { Plus, Edit3, Trash2, Eye } from "lucide-react"
import { formatDuration, formatViews } from "@/lib/utils"

export default function AdminEpisodes() {
  return (
    <AnimatedSection>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Episodios</h1>
          <p className="mt-1 text-sm text-white/40">Gestiona los episodios de todos los podcasts</p>
        </div>
        <button className="flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-medium text-white/80 transition-all hover:bg-white/15">
          <Plus className="size-4" />
          Nuevo Episodio
        </button>
      </div>

      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <GlassPanel key={i} className="flex items-center gap-4 p-4">
            <div className="size-14 shrink-0 rounded-lg bg-white/[0.05]" />
            <div className="flex-1 min-w-0">
              <h3 className="truncate text-sm font-medium text-white/80">Episodio {i + 1}</h3>
              <p className="text-xs text-white/40">Detrás del Espejo · {formatDuration(1800 + i * 300)}</p>
            </div>
            <span className="flex items-center gap-1 text-xs text-white/30">
              <Eye className="size-3" />
              {formatViews(Math.floor(Math.random() * 10000) + 500)}
            </span>
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
