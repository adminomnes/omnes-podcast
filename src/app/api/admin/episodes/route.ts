import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("episodes")
    .select("*, podcasts(title, slug)")
    .order("published_at", { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const body = await req.json()
  const { data, error } = await supabaseAdmin.from("episodes").insert({
    title: body.title,
    podcast_id: body.podcast_id,
    season_id: body.season_id,
    description: body.description || "",
    audio_url: body.audio_url || "",
    video_url: body.video_url || "",
    duration: body.duration || 0,
    thumbnail: body.thumbnail || "",
    tags: body.tags || [],
    category: body.category || "",
    published_at: body.published_at || new Date().toISOString(),
  }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PUT(req: Request) {
  const body = await req.json()
  const { id, ...updates } = body
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 })
  const { data, error } = await supabaseAdmin.from("episodes").update(updates).eq("id", id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(req: Request) {
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 })
  const { error } = await supabaseAdmin.from("episodes").delete().eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
