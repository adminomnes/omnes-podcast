"use client"

import { motion } from "framer-motion"
import { Globe, Music2 } from "lucide-react"
import { GlassPanel } from "@/components/shared/GlassPanel"
import { AnimatedSection } from "@/components/shared/AnimatedSection"

export function GuestPageClient() {
  return (
    <div className="min-h-screen pt-24">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <AnimatedSection>
          <div className="grid gap-12 lg:grid-cols-[300px_1fr]">
            <div className="text-center lg:text-left">
              <div className="mx-auto size-48 overflow-hidden rounded-full bg-white/[0.05] lg:mx-0">
                <div className="flex h-full items-center justify-center text-white/20 text-4xl font-light">
                  ?
                </div>
              </div>
              <h1 className="mt-6 text-2xl font-bold">Invitado</h1>
              <p className="mt-2 text-sm text-white/40">Cargando información...</p>
            </div>

            <div className="space-y-8">
              <GlassPanel className="p-6">
                <h2 className="mb-4 text-lg font-semibold text-white/70">Biografía</h2>
                <p className="text-sm leading-relaxed text-white/40">
                  Contenido disponible al conectar Supabase.
                </p>
              </GlassPanel>

              <div>
                <h3 className="mb-4 text-sm font-medium text-white/60 uppercase tracking-wider">Episodios destacados</h3>
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 rounded-xl bg-white/[0.03] p-4 transition-all hover:bg-white/[0.06]">
                      <div className="flex size-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600/30 to-pink-600/30">
                        <Music2 className="size-5 text-white/40" />
                      </div>
                      <div>
                        <p className="text-sm text-white/70">Episodio destacado {i + 1}</p>
                        <p className="text-xs text-white/30">Próximamente</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}
