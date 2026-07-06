"use client"

import { motion } from "framer-motion"
import { Trophy, TrendingUp, Flame, Headphones, MessageCircle, Activity, Sparkles } from "lucide-react"
import { GlassPanel } from "@/components/shared/GlassPanel"
import { AnimatedSection } from "@/components/shared/AnimatedSection"

const RANKINGS = [
  { label: "Más escuchados", icon: Headphones, value: "28.5K", gradient: "from-blue-600 to-cyan-500", shadow: "shadow-blue-500/20" },
  { label: "Más vistos", icon: TrendingUp, value: "15.2K", gradient: "from-purple-600 to-pink-500", shadow: "shadow-purple-500/20" },
  { label: "Más compartidos", icon: Flame, value: "8.7K", gradient: "from-pink-600 to-rose-500", shadow: "shadow-pink-500/20" },
  { label: "Top semanal", icon: Trophy, value: "El espejo roto", gradient: "from-amber-500 to-orange-500", shadow: "shadow-amber-500/20" },
]

const ACTIVITY = [
  { user: "María G.", action: "escuchó", target: "El espejo roto", time: "2 min", color: "from-blue-500 to-cyan-500" },
  { user: "Carlos L.", action: "compartió", target: "Invitado sorpresa", time: "15 min", color: "from-purple-500 to-pink-500" },
  { user: "Ana P.", action: "comentó en", target: "La habitación sellada", time: "1 h", color: "from-pink-500 to-rose-500" },
  { user: "Luis M.", action: "agregó a favoritos", target: "El caos del primer episodio", time: "3 h", color: "from-amber-500 to-orange-500" },
  { user: "Sofía R.", action: "escuchó", target: "El susurro en la oscuridad", time: "5 h", color: "from-emerald-500 to-teal-500" },
]

export function CommunityPageClient() {
  return (
    <div className="min-h-screen pt-24">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/30 via-purple-950/30 to-pink-950/20" />
        <div className="absolute inset-0 opacity-30" style={{
          background: "radial-gradient(circle at 30% 20%, oklch(0.7 0.3 250 / 0.08), transparent 50%), radial-gradient(circle at 70% 80%, oklch(0.65 0.3 320 / 0.06), transparent 50%)"
        }} />

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-12">
          <AnimatedSection>
            <div className="mb-12 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-pink-500/20 bg-gradient-to-r from-pink-500/10 to-purple-500/10 px-4 py-1 text-xs font-medium tracking-widest text-pink-300/80 uppercase backdrop-blur-xl">
                <Sparkles className="size-3" />
                Social
              </span>
              <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
                Comunidad<span className="text-gradient">.</span>
              </h1>
              <p className="mt-2 text-sm text-white/35">Rankings, actividad y discusiones en vivo</p>
            </div>

            <div className="mb-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {RANKINGS.map(({ label, icon: Icon, value, gradient, shadow }) => (
                <motion.div
                  key={label}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className={`relative overflow-hidden rounded-2xl border border-white/[0.08] p-6 backdrop-blur-xl shadow-lg ${shadow} transition-all hover:shadow-2xl`}
                  style={{ background: `linear-gradient(135deg, oklch(0.1 0.04 260 / 0.5), oklch(0.05 0.02 260 / 0.8))` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10`} />
                  <Icon className={`relative size-8 bg-gradient-to-br ${gradient} bg-clip-text text-transparent`} />
                  <p className={`relative mt-4 text-2xl font-black bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>{value}</p>
                  <p className="relative mt-1 text-xs text-white/35">{label}</p>
                </motion.div>
              ))}
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <GlassPanel className="overflow-hidden border border-white/[0.08] p-6">
                <div className="mb-6 flex items-center gap-2">
                  <MessageCircle className="size-4 text-purple-400" />
                  <h2 className="text-sm font-medium text-white/60">Actividad reciente</h2>
                </div>
                <div className="space-y-3">
                  {ACTIVITY.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 rounded-xl bg-white/[0.03] px-4 py-3 transition-all hover:bg-white/[0.06]"
                    >
                      <div className={`size-8 shrink-0 rounded-full bg-gradient-to-br ${item.color}`} />
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm text-white/70">
                          <span className="font-medium text-white/80">{item.user}</span>{" "}
                          {item.action}{" "}
                          <span className="text-white/50">"{item.target}"</span>
                        </p>
                      </div>
                      <span className="shrink-0 text-xs text-white/25">{item.time}</span>
                    </motion.div>
                  ))}
                </div>
              </GlassPanel>

              <GlassPanel className="overflow-hidden border border-white/[0.08] p-6">
                <div className="mb-6 flex items-center gap-2">
                  <Activity className="size-4 text-pink-400" />
                  <h2 className="text-sm font-medium text-white/60">Comentarios recientes</h2>
                </div>
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const colors = ["from-blue-500 to-cyan-500", "from-purple-500 to-pink-500", "from-pink-500 to-rose-500", "from-amber-500 to-orange-500", "from-emerald-500 to-teal-500"]
                    return (
                      <div key={i} className="flex gap-3 rounded-xl bg-white/[0.03] px-4 py-3">
                        <div className={`size-8 shrink-0 rounded-full bg-gradient-to-br ${colors[i]}`} />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-white/70">Usuario {i + 1}</span>
                            <span className="text-[10px] text-white/25">hace {i + 1}h</span>
                          </div>
                          <p className="mt-1 text-sm leading-relaxed text-white/40">
                            Increíble episodio, la parte sobre...
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </GlassPanel>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  )
}
