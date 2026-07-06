"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, SlidersHorizontal, Sparkles, Clock, Headphones } from "lucide-react"
import { GlassPanel } from "@/components/shared/GlassPanel"
import { AnimatedSection } from "@/components/shared/AnimatedSection"

const TRENDING = [
  "misterio", "comedia", "entrevistas", "inteligencia artificial",
  "música", "ciencia", "historia", "tecnología", "cultura", "true crime",
]

const FILTERS = ["todos", "episodios", "podcasts", "invitados", "clips", "temporadas"]

const MOCK_CONTENT = [
  { id: 1, type: "episodios", title: "El futuro de la Inteligencia Artificial", desc: "Discutimos cómo la IA cambiará el mundo del trabajo.", time: "45 min", views: "2.5K", tags: ["inteligencia artificial", "tecnología"] },
  { id: 2, type: "podcasts", title: "Misterios Sin Resolver", desc: "Casos criminales que nunca encontraron respuesta.", time: "60 min", views: "10K", tags: ["misterio", "true crime"] },
  { id: 3, type: "invitados", title: "Entrevista a Elon Musk", desc: "El CEO de SpaceX nos habla sobre sus planes para Marte.", time: "120 min", views: "50K", tags: ["ciencia", "entrevistas"] },
  { id: 4, type: "clips", title: "El mejor chiste del año", desc: "Un fragmento súper gracioso de nuestro último episodio de comedia.", time: "3 min", views: "15K", tags: ["comedia", "clips"] },
  { id: 5, type: "episodios", title: "Historia de Roma", desc: "Cómo un pequeño pueblo se convirtió en un imperio gigante.", time: "50 min", views: "4.2K", tags: ["historia", "cultura"] },
  { id: 6, type: "podcasts", title: "Top 10 Musical Semanal", desc: "Repasamos los hits más escuchados del momento.", time: "30 min", views: "8K", tags: ["música", "cultura"] },
]

export function ExplorePageClient() {
  const [query, setQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("todos")

  return (
    <div className="min-h-screen pt-24">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/40 via-black to-purple-950/40" />
        <div className="absolute inset-0 opacity-30" style={{
          background: "radial-gradient(circle at 30% 20%, oklch(0.7 0.3 250 / 0.1), transparent 50%), radial-gradient(circle at 70% 80%, oklch(0.65 0.3 320 / 0.08), transparent 50%)"
        }} />

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-12">
          <AnimatedSection>
            <div className="mb-12 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-4 py-1 text-xs font-medium tracking-widest text-blue-300/80 uppercase backdrop-blur-xl">
                <Sparkles className="size-3" />
                Descubre
              </span>
              <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Explorar<span className="text-gradient">.</span>
              </h1>
              <p className="mt-2 text-sm text-white/35">Encuentra tu próximo contenido favorito</p>
            </div>

            <div className="mx-auto mb-10 max-w-2xl">
              <GlassPanel className="flex items-center gap-3 rounded-2xl border border-white/[0.1] px-5 py-3.5 transition-all focus-within:border-blue-500/40 focus-within:shadow-[0_0_30px_oklch(0.7_0.3_250/0.1)]">
                <Search className="size-5 shrink-0 text-white/25" />
                <input
                  type="text"
                  placeholder="Buscar por tema, invitado, conductor..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-white/70 placeholder-white/20 outline-none"
                />
                <SlidersHorizontal className="size-4 shrink-0 text-white/20" />
              </GlassPanel>
            </div>

            <div className="mb-10 flex flex-wrap justify-center gap-2">
              {FILTERS.map((f) => (
                <button key={f} onClick={() => setActiveFilter(f)}
                  className={`rounded-full border px-5 py-2 text-xs font-medium tracking-wide uppercase transition-all backdrop-blur-xl ${
                    activeFilter === f
                      ? "border-blue-500/40 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 shadow-[0_0_20px_oklch(0.7_0.3_250/0.1)]"
                      : "border-white/[0.06] bg-white/[0.02] text-white/30 hover:border-white/[0.15] hover:text-white/60"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="mb-16 flex flex-wrap justify-center gap-2">
              {TRENDING.map((tag) => (
                <motion.button
                  key={tag}
                  whileHover={{ scale: 1.05 }}
                  className="group relative inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] px-4 py-1.5 text-xs text-white/30 backdrop-blur-xl transition-all hover:border-white/[0.15] hover:text-white/60"
                >
                  <Sparkles className="size-3 opacity-0 transition-opacity group-hover:opacity-100 text-blue-400" />
                  #{tag}
                </motion.button>
              ))}
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {MOCK_CONTENT.filter(item => {
                const matchesFilter = activeFilter === "todos" || item.type === activeFilter;
                const matchesSearch = item.title.toLowerCase().includes(query.toLowerCase()) || 
                                      item.desc.toLowerCase().includes(query.toLowerCase()) ||
                                      item.tags.some(t => t.toLowerCase().includes(query.toLowerCase()));
                return matchesFilter && matchesSearch;
              }).map((item, i) => {
                const hues = ["from-blue-600/30 to-purple-600/30", "from-purple-600/30 to-pink-600/30", "from-pink-600/30 to-amber-600/30"]
                return (
                  <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                    <GlassPanel className="group cursor-pointer overflow-hidden border border-white/[0.06] transition-all hover:bg-white/[0.08] hover:shadow-[0_0_30px_oklch(0.7_0.3_250/0.08)]">
                      <div className={`aspect-video bg-gradient-to-br ${hues[item.id % 3]}`} />
                      <div className="space-y-2.5 p-5">
                        <div className="flex items-center gap-2 text-[10px] text-white/25">
                          <Clock className="size-3" />{item.time}
                          <Headphones className="size-3 ml-2" />{item.views}
                        </div>
                        <h3 className="font-medium text-white/70 group-hover:text-white transition-colors">
                          {item.title}
                        </h3>
                        <p className="line-clamp-2 text-xs leading-relaxed text-white/35">
                          {item.desc}
                        </p>
                        <div className="flex gap-1.5 pt-1 flex-wrap">
                          {item.tags.map((t) => (
                            <span key={t} className="rounded-full bg-white/[0.05] px-2 py-0.5 text-[10px] text-white/25">#{t}</span>
                          ))}
                        </div>
                      </div>
                    </GlassPanel>
                  </motion.div>
                )
              })}
              
              {MOCK_CONTENT.filter(item => {
                const matchesFilter = activeFilter === "todos" || item.type === activeFilter;
                const matchesSearch = item.title.toLowerCase().includes(query.toLowerCase()) || 
                                      item.desc.toLowerCase().includes(query.toLowerCase()) ||
                                      item.tags.some(t => t.toLowerCase().includes(query.toLowerCase()));
                return matchesFilter && matchesSearch;
              }).length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <p className="text-white/40">No se encontraron resultados para "{query}"</p>
                </div>
              )}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  )
}
