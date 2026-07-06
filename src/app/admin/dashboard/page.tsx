"use client"

import { GlassPanel } from "@/components/shared/GlassPanel"
import { AnimatedSection } from "@/components/shared/AnimatedSection"
import { Mic2, Eye, TrendingUp, Users, ArrowUp } from "lucide-react"

const STATS = [
  { label: "Podcasts", value: "2", change: "+0", icon: Mic2, color: "text-blue-400" },
  { label: "Episodios", value: "42", change: "+12%", icon: Eye, color: "text-purple-400" },
  { label: "Reproducciones", value: "28.5K", change: "+18%", icon: TrendingUp, color: "text-green-400" },
  { label: "Usuarios", value: "1.2K", change: "+8%", icon: Users, color: "text-pink-400" },
]

export default function AdminDashboard() {
  return (
    <AnimatedSection>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-white/40">Panel de control de OMNES PODCAST</p>
      </div>

      <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map(({ label, value, change, icon: Icon, color }) => (
          <GlassPanel key={label} className="p-5">
            <div className="flex items-center justify-between">
              <Icon className={`size-5 ${color}`} />
              <span className="flex items-center gap-1 text-xs text-green-400">
                <ArrowUp className="size-3" />
                {change}
              </span>
            </div>
            <p className="mt-4 text-2xl font-bold">{value}</p>
            <p className="mt-1 text-xs text-white/40">{label}</p>
          </GlassPanel>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <GlassPanel className="p-6">
          <h2 className="mb-6 font-medium text-white/70">Actividad reciente</h2>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-white/50">
                <div className="size-2 rounded-full bg-blue-400" />
                <span>Nuevo episodio publicado</span>
                <span className="ml-auto text-xs text-white/30">hace {i + 1}h</span>
              </div>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel className="p-6">
          <h2 className="mb-6 font-medium text-white/70">Episodios más populares</h2>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-sm font-medium text-white/20">#{i + 1}</span>
                <div className="flex-1">
                  <p className="text-sm text-white/70">Episodio destacado {i + 1}</p>
                  <p className="text-xs text-white/30">{Math.floor(Math.random() * 5000) + 1000} reproducciones</p>
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>
    </AnimatedSection>
  )
}
