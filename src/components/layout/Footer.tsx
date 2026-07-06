"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useState } from "react"
import { Camera, Video, Music2, Globe, Apple, Send, Heart, ArrowUpRight } from "lucide-react"
import { SITE_NAME, NAV_LINKS } from "@/lib/constants"
import { GlassPanel } from "@/components/shared/GlassPanel"

const SOCIALS = [
  { icon: Camera, href: "#", label: "Instagram", color: "hover:text-pink-400" },
  { icon: Video, href: "#", label: "YouTube", color: "hover:text-red-400" },
  { icon: Music2, href: "#", label: "Spotify", color: "hover:text-green-400" },
  { icon: Globe, href: "#", label: "TikTok", color: "hover:text-white/80" },
  { icon: Apple, href: "#", label: "Apple Podcasts", color: "hover:text-purple-400" },
]

export function Footer() {
  const [email, setEmail] = useState("")

  return (
    <footer className="relative overflow-hidden border-t border-white/[0.06]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/[0.02] to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="grid gap-16 py-20 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="relative size-10">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 opacity-60 blur-sm" />
                <div className="relative flex h-full w-full items-center justify-center rounded-xl bg-black/50 backdrop-blur-xl">
                  <span className="text-sm font-black text-white">O</span>
                </div>
              </div>
              <span className="text-lg font-bold tracking-tight">{SITE_NAME}</span>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-white/35">
              Plataforma premium de podcasts, videopodcasts y contenido audiovisual.
              Historias que se escuchan. Conversaciones que se viven.
            </p>
            <div className="flex gap-3">
              {SOCIALS.map(({ icon: Icon, href, label, color }) => (
                <motion.a
                  key={label}
                  href={href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`rounded-full border border-white/[0.08] bg-white/[0.03] p-2.5 text-white/30 transition-all ${color}`}
                  title={label}
                >
                  <Icon className="size-4" />
                </motion.a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-xs font-semibold tracking-widest text-white/30 uppercase">
                Navegación
              </h4>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center gap-1 text-sm text-white/35 transition-colors hover:text-white/70"
                >
                  {link.label}
                  <ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              ))}
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-semibold tracking-widest text-white/30 uppercase">
                Legal
              </h4>
              {["Privacidad", "Términos", "Contacto", "Digital Omnes"].map((item) => (
                <Link
                  key={item}
                  href="#"
                  className="group flex items-center gap-1 text-sm text-white/35 transition-colors hover:text-white/70"
                >
                  {item}
                  <ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/[0.06] py-12">
          <GlassPanel className="mx-auto max-w-lg overflow-hidden rounded-2xl p-1">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex items-center gap-2"
            >
              <div className="flex flex-1 items-center gap-2 px-4">
                <Heart className="size-4 shrink-0 text-white/20" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Recibe novedades semanales..."
                  className="flex-1 bg-transparent py-3 text-sm text-white/70 placeholder-white/20 outline-none"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:from-blue-500 hover:to-purple-500"
              >
                <Send className="size-3.5" />
                Suscribirse
              </motion.button>
            </form>
          </GlassPanel>
        </div>

        <div className="border-t border-white/[0.06] py-8 text-center">
          <p className="text-xs text-white/20">
            &copy; {new Date().getFullYear()} {SITE_NAME}. Hecho con el alma por{" "}
            <span className="text-white/40">Digital Omnes</span>.
          </p>
        </div>
      </div>
    </footer>
  )
}
