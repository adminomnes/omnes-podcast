"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Users, MessageSquare, Headphones, Flame, TrendingUp, Sparkles, Plus, Search, Heart, User, Loader2 } from "lucide-react"
import { GlassPanel } from "@/components/shared/GlassPanel"
import { AnimatedSection } from "@/components/shared/AnimatedSection"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

const GLOBAL_STATS = [
  { label: "Usuarios Online", icon: Users, value: "1,204", gradient: "from-emerald-400 to-green-500", glow: "shadow-emerald-500/20" },
  { label: "Conversaciones Activas", icon: MessageSquare, value: "342", gradient: "from-blue-400 to-cyan-500", glow: "shadow-blue-500/20" },
  { label: "Podcast más Comentado", icon: Headphones, value: "Detrás del Espejo", gradient: "from-purple-400 to-pink-500", glow: "shadow-purple-500/20", isText: true },
  { label: "Tema más Debatido", icon: TrendingUp, value: "Inteligencia Artificial", gradient: "from-orange-400 to-amber-500", glow: "shadow-orange-500/20", isText: true },
]

const ROOMS_CONFIG: Record<string, { gradient: string; border: string }> = {
  "🎙 General": { gradient: "from-blue-600/20 to-purple-600/20", border: "hover:border-blue-500/50" },
  "😂 Me gusta que te guste": { gradient: "from-pink-600/20 to-orange-600/20", border: "hover:border-pink-500/50" },
  "🪞 Detrás del Espejo": { gradient: "from-cyan-600/20 to-blue-600/20", border: "hover:border-cyan-500/50" },
  "🎵 Música": { gradient: "from-purple-600/20 to-pink-600/20", border: "hover:border-purple-500/50" },
  "🤖 Inteligencia Artificial": { gradient: "from-emerald-600/20 to-teal-600/20", border: "hover:border-emerald-500/50" },
  "👻 Misterios": { gradient: "from-slate-600/20 to-zinc-600/20", border: "hover:border-slate-500/50" },
  "☕ Random": { gradient: "from-slate-600/20 to-zinc-600/20", border: "hover:border-slate-500/50" },
}

export function CommunityPageClient() {
  const [rooms, setRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [supabase] = useState(() => createClient())

  useEffect(() => {
    async function loadRooms() {
      const { data, error } = await supabase.from("rooms").select("*")
      if (!error && data) {
        setRooms(data)
      }
      setLoading(false)
    }
    loadRooms()
  }, [supabase])

  return (
    <div className="min-h-screen pt-24 pb-12">
      {/* Fondo Inmersivo */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[#0a0a0a]" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-[#0a0a0a] to-purple-950/20" />
        <div className="absolute inset-0 opacity-40 mix-blend-screen" style={{
          background: "radial-gradient(circle at 15% 30%, rgba(99, 102, 241, 0.15), transparent 40%), radial-gradient(circle at 85% 70%, rgba(236, 72, 153, 0.1), transparent 40%)"
        }} />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <AnimatedSection>
          {/* Header */}
          <div className="mb-12 flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-bold tracking-widest text-purple-300 uppercase shadow-[0_0_15px_rgba(168,85,247,0.2)] backdrop-blur-md">
                <Flame className="size-3.5 text-purple-400" />
                Sala del Caos
              </span>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-lg">
                Comunidad<span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">.</span>
              </h1>
              <p className="mt-3 max-w-xl text-sm font-medium text-white/50 sm:text-base leading-relaxed">
                Conéctate, debate y descubre. La experiencia OMNES continúa más allá del audio.
              </p>
            </div>

            <div className="flex w-full flex-wrap gap-3 sm:w-auto sm:flex-row">
              <Link href="/community/personas" className="flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-pink-500/20 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-pink-500/10 hover:border-pink-500/40 backdrop-blur-md">
                <Heart className="size-4 text-pink-400" />
                Encuentra Personas
              </Link>
              <Link href="/community/profile" className="flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-white/10 hover:border-white/20 backdrop-blur-md">
                <User className="size-4" />
                Mi Perfil
              </Link>
              <button className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] hover:scale-105">
                <Plus className="size-4" />
                Crear Sala
              </button>
            </div>
          </div>

          {/* Global Stats Dashboard */}
          <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {GLOBAL_STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/[0.04]"
              >
                <div className={`absolute -right-6 -top-6 size-24 rounded-full bg-gradient-to-br ${stat.gradient} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-500`} />
                <div className="flex items-center gap-3">
                  <div className={`flex size-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient}`}>
                    <stat.icon className="size-5 text-white" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold tracking-wider text-white/40 uppercase">{stat.label}</p>
                    <p className={`mt-0.5 font-black text-white drop-shadow-md ${stat.isText ? "text-sm" : "text-2xl"}`}>
                      {stat.value}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Salas Grid */}
          <div className="mb-8 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-bold text-white">
              <Sparkles className="size-5 text-blue-400" />
              Salas Temáticas
            </h2>
            <span className="text-xs font-semibold uppercase tracking-wider text-white/40">
              Mostrando {rooms.length} salas
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="size-8 animate-spin text-white/20" />
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room, i) => {
                const config = ROOMS_CONFIG[room.name] || { gradient: "from-slate-600/20 to-zinc-600/20", border: "hover:border-slate-500/50" }
                return (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                >
                  <a href={`/community/room/${room.id}`} className="block h-full">
                    <GlassPanel className={`group relative h-full cursor-pointer overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.04] ${config.border} hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)]`}>
                      <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />

                      <div className="relative z-10 flex h-full flex-col p-5">
                        {/* Room header */}
                        <div className="mb-3 flex items-start justify-between">
                          <h3 className="text-lg font-bold text-white">
                            {room.name}
                          </h3>
                          <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2 py-1">
                            <span className="relative flex size-2">
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                            </span>
                            <span className="text-[10px] font-bold text-white/70">Activa</span>
                          </div>
                        </div>

                        <p className="mb-6 flex-grow text-sm font-medium text-white/40">
                          {room.description}
                        </p>

                        {/* Last message preview */}
                        <div className="rounded-xl border border-white/5 bg-black/40 p-3 backdrop-blur-md">
                          <div className="mb-1 flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-white/30">Último Mensaje</span>
                          </div>
                          <p className="line-clamp-1 text-xs font-medium italic text-white/60">
                            "Únete para ver los mensajes..."
                          </p>
                        </div>
                      </div>
                    </GlassPanel>
                  </a>
                </motion.div>
                )
              })}
            </div>
          )}

        </AnimatedSection>
      </div>
    </div>
  )
}
