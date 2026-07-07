"use client"

import { useEffect, useState } from "react"
import { GlassPanel } from "@/components/shared/GlassPanel"
import { AnimatedSection } from "@/components/shared/AnimatedSection"
import { Plus, Pencil, Trash2, X, Check, ExternalLink } from "lucide-react"

interface Guest {
  id: string
  name: string
  bio: string
  photo: string
  social_links: Record<string, string>
  created_at: string
}

type FormData = {
  name: string
  bio: string
  photo: string
  instagram: string
  twitter: string
  website: string
}

const emptyForm: FormData = { name: "", bio: "", photo: "", instagram: "", twitter: "", website: "" }

export default function AdminGuests() {
  const [items, setItems] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Guest | null>(null)
  const [form, setForm] = useState<FormData>(emptyForm)

  const fetchItems = async () => {
    const res = await fetch("/api/admin/guests")
    setItems(await res.json())
    setLoading(false)
  }

  useEffect(() => { fetchItems() }, [])

  const save = async () => {
    const social_links: Record<string, string> = {}
    if (form.instagram) social_links.instagram = form.instagram
    if (form.twitter) social_links.twitter = form.twitter
    if (form.website) social_links.website = form.website

    const body = { name: form.name, bio: form.bio, photo: form.photo, social_links }

    if (editing) {
      await fetch("/api/admin/guests", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editing.id, ...body }),
      })
    } else {
      await fetch("/api/admin/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
    }
    setShowForm(false); setEditing(null); setForm(emptyForm)
    fetchItems()
  }

  const remove = async (id: string) => {
    if (!confirm("¿Eliminar este invitado?")) return
    await fetch("/api/admin/guests", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    fetchItems()
  }

  const edit = (item: Guest) => {
    setForm({
      name: item.name,
      bio: item.bio,
      photo: item.photo,
      instagram: item.social_links?.instagram || "",
      twitter: item.social_links?.twitter || "",
      website: item.social_links?.website || "",
    })
    setEditing(item); setShowForm(true)
  }

  return (
    <AnimatedSection>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Invitados</h1>
          <p className="mt-1 text-sm text-white/40">Gestiona los invitados de los episodios</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm(emptyForm) }}
          className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600">
          <Plus className="size-4" /> Nuevo Invitado
        </button>
      </div>

      {showForm && (
        <GlassPanel className="mb-8 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-medium text-white/70">{editing ? "Editar invitado" : "Nuevo invitado"}</h2>
            <button onClick={() => { setShowForm(false); setEditing(null) }} className="text-white/40 hover:text-white/70">
              <X className="size-5" />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-white/40">Nombre</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-white/40">Foto URL</label>
              <input value={form.photo} onChange={(e) => setForm({ ...form, photo: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-blue-400" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-white/40">Bio</label>
              <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={2}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-white/40">Instagram</label>
              <input value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} placeholder="https://instagram.com/..."
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-white/40">Twitter / X</label>
              <input value={form.twitter} onChange={(e) => setForm({ ...form, twitter: e.target.value })} placeholder="https://x.com/..."
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-white/40">Sitio web</label>
              <input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://..."
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-blue-400" />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <button onClick={() => { setShowForm(false); setEditing(null) }}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/60 transition hover:bg-white/5">Cancelar</button>
            <button onClick={save} disabled={!form.name.trim()}
              className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600 disabled:opacity-50">
              <Check className="size-4" /> {editing ? "Guardar" : "Crear"}
            </button>
          </div>
        </GlassPanel>
      )}

      {loading ? (
        <p className="text-sm text-white/40">Cargando...</p>
      ) : items.length === 0 ? (
        <GlassPanel className="p-8 text-center">
          <p className="text-sm text-white/30">No hay invitados aún. Crea tu primer invitado.</p>
        </GlassPanel>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <GlassPanel key={item.id} className="flex items-center gap-4 p-5">
              <div className="size-12 shrink-0 overflow-hidden rounded-full bg-white/10">
                {item.photo ? (
                  <img src={item.photo} alt={item.name} className="size-full object-cover" />
                ) : (
                  <div className="flex size-full items-center justify-center text-lg font-bold text-white/30">
                    {item.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-white/90">{item.name}</h3>
                {item.bio && <p className="truncate text-xs text-white/40">{item.bio}</p>}
                {item.social_links && Object.keys(item.social_links).length > 0 && (
                  <div className="mt-1 flex gap-2">
                    {Object.entries(item.social_links).map(([key, url]) => (
                      <a key={key} href={url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-400 hover:underline">
                        {key} <ExternalLink className="size-3" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
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
