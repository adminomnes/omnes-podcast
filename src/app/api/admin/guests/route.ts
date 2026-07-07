import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

export async function GET() {
  const { data, error } = await supabaseAdmin.from("guests").select("*").order("name")
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const body = await req.json()
  const { data, error } = await supabaseAdmin.from("guests").insert({
    name: body.name,
    bio: body.bio || "",
    photo: body.photo || "",
    social_links: body.social_links || {},
  }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PUT(req: Request) {
  const body = await req.json()
  const { id, ...updates } = body
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 })
  const { data, error } = await supabaseAdmin.from("guests").update(updates).eq("id", id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(req: Request) {
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 })
  const { error } = await supabaseAdmin.from("guests").delete().eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
