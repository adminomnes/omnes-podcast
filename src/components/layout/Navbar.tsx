"use client"

import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { Menu, X, Search, Bell } from "lucide-react"
import { NAV_LINKS, SITE_NAME } from "@/lib/constants"
import { cn } from "@/lib/utils"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-700",
        isScrolled
          ? "bg-black/80 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.6)]"
          : "bg-black/50 backdrop-blur-md border-b border-white/[0.06]"
      )}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
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
          <button className="relative rounded-full p-2.5 text-white/40 transition-colors hover:bg-white/5 hover:text-white/80">
            <Bell className="size-4" />
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-blue-500" />
          </button>
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
