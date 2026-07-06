"use client"

import { useRef, useState } from "react"
import { motion } from "framer-motion"
import { Heart, Share2, Play, Volume2, Sparkles } from "lucide-react"
import { GlassPanel } from "@/components/shared/GlassPanel"
import { AnimatedSection } from "@/components/shared/AnimatedSection"

const CLIPS = Array.from({ length: 10 }).map((_, i) => ({
  id: i,
  title: `Clip alucinante #${i + 1}`,
  views: `${Math.floor(Math.random() * 50) + 5}K`,
  gradient: `from-${["blue", "purple", "pink", "amber", "emerald"][i % 5]}-900/80 to-black`,
  accent: `hsl(${i * 36}, 70%, 50%)`,
}))

export function ClipsPageClient() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  return (
    <div className="min-h-screen pt-24">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/30 via-purple-950/20 to-pink-950/20" />
        <div className="absolute inset-0 opacity-20" style={{
          background: "radial-gradient(circle at 80% 20%, oklch(0.65 0.3 320 / 0.08), transparent 50%), radial-gradient(circle at 20% 80%, oklch(0.7 0.3 250 / 0.06), transparent 50%)"
        }} />

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-12">
          <AnimatedSection>
            <div className="mb-12">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-gradient-to-r from-amber-500/10 to-pink-500/10 px-4 py-1 text-xs font-medium tracking-widest text-amber-300/80 uppercase backdrop-blur-xl">
                <Sparkles className="size-3" />
                Vertical
              </span>
              <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
                Clips<span className="text-gradient">.</span>
              </h1>
              <p className="mt-2 text-sm text-white/35">Los mejores momentos en formato vertical</p>
            </div>

            <div ref={scrollRef} className="no-scrollbar -mx-6 flex gap-6 overflow-x-auto px-6 pb-8 snap-x snap-mandatory">
              {CLIPS.map((clip) => (
                <motion.div
                  key={clip.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: clip.id * 0.05 }}
                  className="snap-start shrink-0"
                  onMouseEnter={() => setHoveredId(clip.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <GlassPanel className="relative w-[260px] overflow-hidden border border-white/[0.08] transition-all hover:bg-white/[0.08] sm:w-[300px]">
                    <div className={`aspect-[9/16] bg-gradient-to-br ${clip.gradient}`}>
                      {hoveredId === clip.id && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
                          <Play className="size-14 text-white/90" style={{ filter: `drop-shadow(0 0 20px ${clip.accent})` }} />
                          <Volume2 className="mt-4 size-6 text-white/50 animate-pulse" />
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-5 pt-16">
                      <p className="text-sm font-semibold text-white/90">{clip.title}</p>
                      <p className="mt-1 text-xs text-white/40">{clip.views} vistas</p>
                      <div className="mt-4 flex items-center gap-3">
                        <button className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs text-white/60 backdrop-blur-xl transition-all hover:bg-white/20 hover:text-pink-400">
                          <Heart className="size-3" />
                          {Math.floor(Math.random() * 500) + 100}
                        </button>
                        <button className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs text-white/60 backdrop-blur-xl transition-all hover:bg-white/20 hover:text-blue-400">
                          <Share2 className="size-3" />
                          Compartir
                        </button>
                      </div>
                    </div>
                  </GlassPanel>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  )
}
