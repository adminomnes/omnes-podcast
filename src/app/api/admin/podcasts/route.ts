import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

export async function GET() {
  const { data, error } = await supabaseAdmin.from("podcasts").select("*").order("created_at", { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const body = await req.json()
  const { data, error } = await supabaseAdmin.from("podcasts").insert({
    title: body.title,
    slug: body.slug,
    description: body.description || "",
    cover_image: body.cover_image || "",
    category: body.category || "",
    vibe: body.vibe || "",
    color_primary: body.color_primary || "#00d4ff",
    color_secondary: body.color_secondary || "#0066ff",
    color_accent: body.color_accent || "#7f00ff",
  }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PUT(req: Request) {
  const body = await req.json()
  const { id, ...updates } = body
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 })
  const { data, error } = await supabaseAdmin.from("podcasts").update(updates).eq("id", id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(req: Request) {
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 })
  const { error } = await supabaseAdmin.from("podcasts").delete().eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
