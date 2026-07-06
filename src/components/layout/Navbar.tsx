"use client"

import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import { Menu, X, Search, Bell, CheckCircle2 } from "lucide-react"
import { NAV_LINKS, SITE_NAME } from "@/lib/constants"
import { cn } from "@/lib/utils"

const MOCK_NOTIFICATIONS = [
  { id: 1, title: "¡Nuevo Top 10 Musical!", description: "Descubre las canciones más pedidas de esta semana.", time: "Hace 2 horas", isNew: true },
  { id: 2, title: "Nuevo Episodio de OMNES", description: "Ya está disponible la última entrevista en nuestro canal.", time: "Hace 1 día", isNew: true },
  { id: 3, title: "Bienvenido a OMNES Podcast", description: "Explora todas las nuevas secciones de nuestra web.", time: "Hace 3 días", isNew: false },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const notificationsRef = useRef<HTMLDivElement>(null)

  // Manejo del scroll
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Cerrar notificaciones si se hace clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-700",
        isScrolled
          ? "bg-black/80 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.6)]"
          : "bg-gradient-to-b from-black/60 to-transparent pt-2"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative size-8">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 opacity-80 blur-sm group-hover:opacity-100 transition-opacity" />
            <div className="relative flex h-full w-full items-center justify-center rounded-lg bg-black/50 backdrop-blur-xl">
              <span className="text-[10px] font-black tracking-tight text-white">O</span>
            </div>
          </div>
          <span className="text-base font-bold tracking-tight text-white/90">{SITE_NAME}</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative rounded-full px-4 py-2 text-base font-bold text-white transition-colors hover:text-white/80"
              style={{ textShadow: "0 1px 8px rgba(0,0,0,0.9), 0 0px 2px rgba(0,0,0,1)" }}
            >
              {link.label}
              <span className="absolute inset-x-2 -bottom-px h-px scale-x-0 bg-gradient-to-r from-blue-400 to-purple-400 transition-transform group-hover:scale-x-100" />
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button className="relative rounded-full p-2.5 text-white/40 transition-colors hover:bg-white/5 hover:text-white/80">
            <Search className="size-4" />
          </button>
          <div className="relative" ref={notificationsRef}>
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative rounded-full p-2.5 text-white/40 transition-colors hover:bg-white/5 hover:text-white/80"
            >
              <Bell className="size-4" />
              <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-blue-500" />
            </button>

            {/* Dropdown de Novedades */}
            <AnimatePresence>
              {isNotificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-2xl border border-white/10 bg-black/80 shadow-2xl backdrop-blur-xl"
                >
                  <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-3">
                    <h3 className="font-semibold text-white">Novedades</h3>
                    <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-xs font-medium text-blue-400">
                      2 nuevas
                    </span>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto p-2">
                    {MOCK_NOTIFICATIONS.map((notif) => (
                      <div 
                        key={notif.id}
                        className={`mb-1 cursor-pointer rounded-xl p-3 transition-colors hover:bg-white/5 ${notif.isNew ? 'bg-blue-500/5' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 rounded-full p-1.5 ${notif.isNew ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-white/40'}`}>
                            {notif.isNew ? <Bell className="size-3.5" /> : <CheckCircle2 className="size-3.5" />}
                          </div>
                          <div>
                            <p className={`text-sm font-medium ${notif.isNew ? 'text-white' : 'text-white/70'}`}>
                              {notif.title}
                            </p>
                            <p className="mt-0.5 text-xs text-white/50 line-clamp-2">
                              {notif.description}
                            </p>
                            <span className="mt-1.5 block text-[10px] text-white/30">
                              {notif.time}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-white/10 p-2 text-center">
                    <button className="w-full rounded-lg px-3 py-2 text-xs font-medium text-white/40 transition-colors hover:bg-white/5 hover:text-white/80">
                      Marcar todas como leídas
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-full p-2.5 text-white/40 transition-colors hover:bg-white/5 hover:text-white/80 md:hidden"
          >
            {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="glass-strong mx-4 mb-4 rounded-2xl border border-white/[0.08] p-3 shadow-2xl md:hidden"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm text-white/50 transition-all hover:bg-white/5 hover:text-white/90"
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
