"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Bot, Sparkles, MessageSquareQuote, Search, Clock, ChevronRight, Zap } from "lucide-react"
import { GlassPanel } from "@/components/shared/GlassPanel"
import { AnimatedSection } from "@/components/shared/AnimatedSection"

type Message = { role: "user" | "assistant"; content: string }

const SUGGESTIONS = [
  "¿Dónde hablaron sobre inteligencia artificial?",
  "¿Qué dijeron del metaverso?",
  "Menciones sobre música independiente",
  "¿En qué episodio hablaron de fantasmas?",
]

export function AIPageClient() {
  const [query, setQuery] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    setMessages((prev) => [...prev, { role: "user", content: query }])
    setIsLoading(true)
    setQuery("")

    setTimeout(() => {
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: `Encontré esto en los episodios:\n\n"${query}" aparece en:\n\n🎙 Detrás del Espejo — "El espejo roto" (12:34)\n🎙 Me gusta que te guste — "Invitado sorpresa" (45:12)\n\nPreparado para integración con OpenAI.`,
      }])
      setIsLoading(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen pt-24">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/50 via-purple-950/30 to-pink-950/20" />
        <div className="absolute inset-0 opacity-40" style={{
          background: "radial-gradient(circle at 20% 30%, oklch(0.7 0.3 250 / 0.12), transparent 50%), radial-gradient(circle at 80% 70%, oklch(0.65 0.3 320 / 0.1), transparent 50%), radial-gradient(circle at 50% 50%, oklch(0.6 0.3 340 / 0.08), transparent 40%)"
        }} />

        <div className="relative z-10 mx-auto max-w-4xl px-6 py-20">
          <AnimatedSection>
            <div className="text-center">
              <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 backdrop-blur-2xl shadow-[0_0_40px_oklch(0.7_0.3_250/0.15)]">
                <Zap className="size-10 text-blue-400" />
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-pink-500/10 px-4 py-1 text-xs font-medium tracking-widest text-purple-300/80 uppercase backdrop-blur-xl">
                <Sparkles className="size-3" />
                Beta · IA
              </span>
              <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Pregúntale al
                <br />
                <span className="text-gradient">Podcast</span>
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/40">
                IA que busca en cada episodio. Encuentra el momento exacto donde se habla de cualquier tema.
              </p>
            </div>

            <div className="mx-auto mt-12 max-w-2xl">
              <GlassPanel className="overflow-hidden border border-white/[0.1] shadow-[0_0_60px_oklch(0.7_0.3_250/0.05)]">
                <div className="flex min-h-[400px] flex-col">
                  <div className="flex-1 space-y-4 overflow-y-auto p-6">
                    {messages.length === 0 && (
                      <div className="flex h-full min-h-[300px] items-center justify-center">
                        <div className="max-w-sm text-center">
                          <Search className="mx-auto size-12 text-white/15" />
                          <h3 className="mt-4 text-lg font-medium text-white/30">¿Qué quieres saber?</h3>
                          <div className="mt-6 space-y-2">
                            {SUGGESTIONS.map((s) => (
                              <button
                                key={s}
                                onClick={() => setQuery(s)}
                                className="flex w-full items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-2.5 text-left text-sm text-white/30 transition-all hover:border-blue-500/20 hover:bg-blue-500/5 hover:text-white/60"
                              >
                                <MessageSquareQuote className="size-3 shrink-0 text-blue-400/50" />
                                <span className="truncate">{s}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    <AnimatePresence>
                      {messages.map((msg, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed ${
                            msg.role === "user"
                              ? "bg-gradient-to-r from-blue-600/30 to-purple-600/30 text-white/80"
                              : "bg-white/[0.04] text-white/60"
                          }`}>
                            {msg.content}
                          </div>
                        </motion.div>
                      ))}
                      {isLoading && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-3">
                          <div className="rounded-full bg-white/[0.05] p-2">
                            <Bot className="size-4 text-white/40" />
                          </div>
                          <div className="flex items-center gap-1.5 rounded-2xl bg-white/[0.04] px-5 py-3.5">
                            <span className="size-2 animate-bounce rounded-full bg-blue-400/60" style={{ animationDelay: "0ms" }} />
                            <span className="size-2 animate-bounce rounded-full bg-purple-400/60" style={{ animationDelay: "150ms" }} />
                            <span className="size-2 animate-bounce rounded-full bg-pink-400/60" style={{ animationDelay: "300ms" }} />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="border-t border-white/[0.08] p-4">
                    <form onSubmit={handleSubmit} className="flex items-center gap-3">
                      <div className="flex flex-1 items-center gap-3 rounded-xl bg-white/[0.04] px-4 py-3 ring-1 ring-white/[0.08] transition-all focus-within:ring-blue-500/40 focus-within:shadow-[0_0_20px_oklch(0.7_0.3_250/0.08)]">
                        <Search className="size-4 shrink-0 text-white/20" />
                        <input
                          type="text"
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder="¿En qué episodio hablaron sobre fantasmas?"
                          className="flex-1 bg-transparent text-sm text-white/70 placeholder-white/20 outline-none"
                        />
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={!query.trim() || isLoading}
                        className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-[0_0_20px_oklch(0.7_0.3_250/0.3)] transition-all hover:shadow-[0_0_40px_oklch(0.7_0.3_250/0.5)] disabled:opacity-30"
                      >
                        <Send className="size-4" />
                      </motion.button>
                    </form>
                  </div>
                </div>
              </GlassPanel>
            </div>

            <div className="mx-auto mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { icon: Bot, label: "Búsqueda semántica", color: "from-blue-500/20 to-blue-600/10" },
                { icon: Clock, label: "Timestamp exacto", color: "from-purple-500/20 to-purple-600/10" },
                { icon: MessageSquareQuote, label: "Resumen IA", color: "from-pink-500/20 to-pink-600/10" },
                { icon: ChevronRight, label: "Reproducir desde ahí", color: "from-amber-500/20 to-amber-600/10" },
              ].map(({ icon: Icon, label, color }) => (
                <div key={label} className={`flex items-center gap-2 rounded-xl bg-gradient-to-br ${color} border border-white/[0.06] px-4 py-3 backdrop-blur-xl`}>
                  <Icon className="size-4 shrink-0 text-white/30" />
                  <span className="text-xs text-white/35">{label}</span>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  )
}
