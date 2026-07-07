"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import { Menu, X, Search, Bell, CheckCircle2 } from "lucide-react"
import { NAV_LINKS, SITE_NAME } from "@/lib/constants"
import { cn } from "@/lib/utils"

const INITIAL_NOTIFICATIONS = [
  { 
    id: 1, 
    title: "Bienvenido a OMNES Podcast", 
    description: "Explora todas las nuevas secciones de nuestra web.", 
    time: "Hace un momento", 
    isNew: false,
    href: "/",
    gradient: "from-emerald-500 to-teal-400",
    bgMuted: "bg-emerald-500/10",
    textDark: "text-emerald-400"
  }
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const notificationsRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Cargar notificaciones guardadas en localStorage al iniciar
  useEffect(() => {
    const saved = localStorage.getItem("omnes_notifications")
    if (saved) {
      try {
        setNotifications(JSON.parse(saved))
      } catch {
        setNotifications(INITIAL_NOTIFICATIONS)
      }
    } else {
      setNotifications(INITIAL_NOTIFICATIONS)
    }
  }, [])

  // Guardar notificaciones en localStorage cada vez que cambien
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem("omnes_notifications", JSON.stringify(notifications))
    }
  }, [notifications])

  // Lógica Automática: Chequear si hay un nuevo Top 10
  useEffect(() => {
    async function checkUpdates() {
      try {
        const res = await fetch("/api/music?chart=pedidos")
        if (!res.ok) return
        const data = await res.json()
        
        if (data.updatedAt) {
          const lastUpdateStr = localStorage.getItem("omnes_last_music_update")
          const serverUpdate = new Date(data.updatedAt).getTime()
          const lastUpdate = lastUpdateStr ? parseInt(lastUpdateStr) : 0

          // Si el servidor tiene datos más nuevos (por al menos 1 minuto de diferencia)
          if (serverUpdate > lastUpdate + 60000) {
            localStorage.setItem("omnes_last_music_update", serverUpdate.toString())
            
            // Agregar la nueva notificación automáticamente si no es la primera vez que entra
            if (lastUpdate !== 0) {
              setNotifications(prev => {
                const newNotif = {
                  id: Date.now(),
                  title: "¡El Top 10 se ha actualizado!",
                  description: "Nuevas canciones y movimientos en el chart Más Pedidos.",
                  time: "Hace un momento",
                  isNew: true,
                  href: "/top-musical",
                  gradient: "from-fuchsia-600 to-pink-500",
                  bgMuted: "bg-pink-500/10",
                  textDark: "text-pink-400"
                }
                // Evitar duplicados exactos en el mismo día
                const isDuplicate = prev.some(n => n.title === newNotif.title && n.time === newNotif.time)
                if (isDuplicate) return prev
                return [newNotif, ...prev].slice(0, 10) // Mantener maximo 10
              })
            }
          }
        }
      } catch (err) {
        console.error("Error checking for updates:", err)
      }
    }
    
    // Chequear al cargar y luego cada 5 minutos
    checkUpdates()
    const interval = setInterval(checkUpdates, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const unreadCount = notifications.filter(n => n.isNew).length

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isNew: false } : n))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isNew: false })))
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchOpen(false)
      setSearchQuery("")
    } else {
      router.push("/explore")
      setIsSearchOpen(false)
    }
  }

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
          <Link
            href="/admin/dashboard"
            className="hidden rounded-full px-3 py-1.5 text-xs font-medium text-white/30 transition-colors hover:bg-white/5 hover:text-white/60 md:block"
          >
            Admin
          </Link>
          <div className="relative flex items-center h-10">
            <AnimatePresence initial={false}>
              {isSearchOpen ? (
                <motion.form 
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 220, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleSearchSubmit}
                  className="flex items-center overflow-hidden"
                >
                  <input
                    type="text"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar episodios, podcasts..."
                    className="w-full rounded-full border border-white/20 bg-white/10 py-2 pl-4 pr-10 text-sm text-white placeholder-white/40 outline-none backdrop-blur-md transition-all focus:border-blue-500/50 focus:bg-white/15"
                  />
                  <button type="button" onClick={() => setIsSearchOpen(false)} className="absolute right-2 p-1 text-white/40 hover:text-white/80 transition-colors">
                    <X className="size-4" />
                  </button>
                </motion.form>
              ) : (
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="relative rounded-full p-2.5 text-white/40 transition-colors hover:bg-white/5 hover:text-white/80"
                >
                  <Search className="size-4" />
                </button>
              )}
            </AnimatePresence>
          </div>

          <div className="relative" ref={notificationsRef}>
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative rounded-full p-2.5 text-white/40 transition-colors hover:bg-white/5 hover:text-white/80"
            >
              <Bell className="size-4" />
              <span className={`absolute top-1 right-1 size-2.5 rounded-full bg-gradient-to-tr from-pink-500 to-orange-400 shadow-[0_0_8px_rgba(236,72,153,0.8)] ${unreadCount > 0 ? 'animate-pulse' : 'hidden'}`} />
            </button>

            {/* Dropdown de Novedades */}
            <AnimatePresence>
              {isNotificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a]/90 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl"
                >
                  <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 px-4 py-3">
                    <h3 className="font-bold text-white drop-shadow-md">Novedades</h3>
                    {unreadCount > 0 && (
                      <span className="rounded-full bg-gradient-to-r from-pink-500 to-orange-400 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
                        {unreadCount} nuevas
                      </span>
                    )}
                  </div>
                  <div className="max-h-[400px] overflow-y-auto p-2">
                    {notifications.map((notif) => (
                      <Link 
                        key={notif.id}
                        href={notif.href}
                        onClick={() => {
                          markAsRead(notif.id)
                          setIsNotificationsOpen(false)
                        }}
                        className={`group relative mb-1 block cursor-pointer overflow-hidden rounded-xl p-3 transition-all hover:bg-white/5 ${notif.isNew ? notif.bgMuted : ''}`}
                      >
                        {/* Borde izquierdo dinámico al hacer hover */}
                        <div className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${notif.gradient} opacity-0 transition-opacity group-hover:opacity-100`} />
                        
                        <div className="flex items-start gap-3 relative z-10">
                          <div className={`mt-0.5 rounded-full p-2 ${notif.isNew ? `bg-gradient-to-br ${notif.gradient} text-white shadow-lg` : 'bg-white/5 text-white/40'}`}>
                            {notif.isNew ? <Bell className="size-3.5" /> : <CheckCircle2 className="size-3.5" />}
                          </div>
                          <div>
                            <p className={`text-sm font-bold ${notif.isNew ? 'text-white' : 'text-white/60'}`}>
                              {notif.title}
                            </p>
                            <p className="mt-0.5 text-xs text-white/60 line-clamp-2">
                              {notif.description}
                            </p>
                            <span className={`mt-1.5 block text-[10px] font-medium ${notif.isNew ? notif.textDark : 'text-white/30'}`}>
                              {notif.time}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-white/10 p-2 text-center bg-white/[0.02]">
                    <button 
                      onClick={markAllAsRead}
                      className="w-full rounded-lg px-3 py-2 text-xs font-semibold text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                    >
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
            <Link
              href="/admin/dashboard"
              onClick={() => setIsOpen(false)}
              className="block rounded-xl px-4 py-3 text-sm text-white/30 transition-all hover:bg-white/5 hover:text-white/50"
            >
              Admin
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
