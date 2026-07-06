"use client"

import { GlassPanel } from "@/components/shared/GlassPanel"
import { AnimatedSection } from "@/components/shared/AnimatedSection"
import { Plus, Edit3, Trash2 } from "lucide-react"

export default function AdminGuests() {
  return (
    <AnimatedSection>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Invitados</h1>
          <p className="mt-1 text-sm text-white/40">Gestiona los invitados de los episodios</p>
        </div>
        <button className="flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-medium text-white/80 transition-all hover:bg-white/15">
          <Plus className="size-4" />
          Nuevo Invitado
        </button>
      </div>

      <GlassPanel className="p-8 text-center">
        <p className="text-sm text-white/30">
          Gestión de invitados con fotos, biografías y redes sociales.
          Los datos se cargarán desde Supabase.
        </p>
      </GlassPanel>
    </AnimatedSection>
  )
}
