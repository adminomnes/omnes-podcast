"use client"

import { GlassPanel } from "@/components/shared/GlassPanel"
import { AnimatedSection } from "@/components/shared/AnimatedSection"
import { TrendingUp, Users, Play, Clock } from "lucide-react"

export default function AdminStats() {
  return (
    <AnimatedSection>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Estadísticas</h1>
        <p className="mt-1 text-sm text-white/40">Analíticas de la plataforma</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Reproducciones totales", value: "28,542", icon: Play, change: "+18%" },
          { label: "Oyentes únicos", value: "3,241", icon: Users, change: "+12%" },
          { label: "Tiempo total escuchado", value: "1,847h", icon: Clock, change: "+22%" },
          { label: "Crecimiento mensual", value: "15.3%", icon: TrendingUp, change: "+2.1%" },
        ].map((stat) => (
          <GlassPanel key={stat.label} className="p-5">
            <stat.icon className="size-5 text-blue-400" />
            <p className="mt-4 text-2xl font-bold">{stat.value}</p>
            <p className="mt-1 text-xs text-white/40">{stat.label}</p>
          </GlassPanel>
        ))}
      </div>

      <div className="mt-8">
        <GlassPanel className="p-8 text-center">
          <p className="text-sm text-white/30">
            Gráficos detallados con reproducciones por día, episodios más populares,
            demografía de audiencia y tendencias. Integración con Supabase analytics.
          </p>
        </GlassPanel>
      </div>
    </AnimatedSection>
  )
}
