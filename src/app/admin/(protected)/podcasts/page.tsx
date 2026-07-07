"use client"

import { useEffect, useState } from "react"
import { GlassPanel } from "@/components/shared/GlassPanel"
import { AnimatedSection } from "@/components/shared/AnimatedSection"
import { Plus, Pencil, Trash2, X, Check } from "lucide-react"

interface Podcast {
  id: string
  title: string
  slug: string
  description: string
  cover_image: string
  category: string
  vibe: string
  color_primary: string
  color_secondary: string
  color_accent: string
  created_at: string
}

type FormData = {
  title: string
  slug: string
  description: string
  cover_image: string
  category: string
  vibe: string
  color_primary: string
  color_secondary: string
  color_accent: string
}

const emptyForm: FormData = {
  title: "",
  slug: "",
  description: "",
  cover_image: "",
  category: "",
  vibe: "",
  color_primary: "#00d4ff",
  color_secondary: "#0066ff",
  color_accent: "#7f00ff",
}

export default function AdminPodcasts() {
  const [items, setItems] = useState<Podcast[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Podcast | null>(null)
  const [form, setForm] = useState<FormData>(emptyForm)

  const fetchItems = async () => {
    const res = await fetch("/api/admin/podcasts")
    setItems(await res.json())
    setLoading(false)
  }

  useEffect(() => { fetchItems() }, [])

  const save = async () => {
    if (editing) {
      await fetch("/api/admin/podcasts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editing.id, ...form }),
      })
    } else {
      await fetch("/api/admin/podcasts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
    }
    setShowForm(false); setEditing(null); setForm(emptyForm)
    fetchItems()
  }

  const remove = async (id: string) => {
    if (!confirm("¿Eliminar este podcast?")) return
    await fetch("/api/admin/podcasts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    fetchItems()
  }

  const edit = (item: Podcast) => {
    setForm({
      title: item.title,
      slug: item.slug,
      description: item.description,
      cover_image: item.cover_image,
      category: item.category,
      vibe: item.vibe,
      color_primary: item.color_primary,
      color_secondary: item.color_secondary,
      color_accent: item.color_accent,
    })
    setEditing(item); setShowForm(true)
  }

  return (
    <AnimatedSection>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Podcasts</h1>
          <p className="mt-1 text-sm text-white/40">Gestiona tus programas</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm(emptyForm) }}
          className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600">
          <Plus className="size-4" /> Nuevo Podcast
        </button>
      </div>

      {showForm && (
        <GlassPanel className="mb-8 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-medium text-white/70">{editing ? "Editar podcast" : "Nuevo podcast"}</h2>
            <button onClick={() => { setShowForm(false); setEditing(null) }} className="text-white/40 hover:text-white/70">
              <X className="size-5" />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-white/40">Título</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-white/40">Slug</label>
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-blue-400" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-white/40">Descripción</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-white/40">Portada URL</label>
              <input value={form.cover_image} onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-white/40">Categoría</label>
              <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-white/40">Vibe</label>
              <input value={form.vibe} onChange={(e) => setForm({ ...form, vibe: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-blue-400" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="mb-1 block text-xs text-white/40">Color primario</label>
                <input type="color" value={form.color_primary} onChange={(e) => setForm({ ...form, color_primary: e.target.value })}
                  className="h-9 w-full cursor-pointer rounded border border-white/10 bg-white/5" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-white/40">Secundario</label>
                <input type="color" value={form.color_secondary} onChange={(e) => setForm({ ...form, color_secondary: e.target.value })}
                  className="h-9 w-full cursor-pointer rounded border border-white/10 bg-white/5" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-white/40">Acento</label>
                <input type="color" value={form.color_accent} onChange={(e) => setForm({ ...form, color_accent: e.target.value })}
                  className="h-9 w-full cursor-pointer rounded border border-white/10 bg-white/5" />
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <button onClick={() => { setShowForm(false); setEditing(null) }}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/60 transition hover:bg-white/5">Cancelar</button>
            <button onClick={save} disabled={!form.title.trim() || !form.slug.trim()}
              className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600 disabled:opacity-50">
              <Check className="size-4" /> {editing ? "Guardar" : "Crear"}
            </button>
          </div>
        </GlassPanel>
      )}

      {loading ? (
        <p className="text-sm text-white/40">Cargando...</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-white/40">No hay podcasts aún.</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <GlassPanel key={item.id} className="flex items-center gap-4 p-5">
              <div className="size-12 shrink-0 rounded-xl" style={{ background: item.color_primary }} />
              <div className="flex-1 min-w-0">
                <h3 className="truncate font-medium text-white/90">{item.title}</h3>
                <p className="text-xs text-white/40">/{item.slug}</p>
              </div>
              <span className="shrink-0 rounded bg-white/5 px-2 py-0.5 text-xs text-white/40">{item.category || "—"}</span>
              <button onClick={() => edit(item)} className="rounded-lg p-2 text-white/40 transition hover:bg-white/5 hover:text-white/70">
                <Pencil className="size-4" />
              </button>
              <button onClick={() => remove(item.id)} className="rounded-lg p-2 text-white/40 transition hover:bg-red-400/10 hover:text-red-400">
                <Trash2 className="size-4" />
              </button>
            </GlassPanel>
          ))}
        </div>
      )}
    </AnimatedSection>
  )
}
