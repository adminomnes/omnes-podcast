import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/client"
import { readFromR2, uploadToR2 } from "@/lib/cloudflare"

export async function POST(request: NextRequest) {
  try {
    const { roomId, userId, content, guestName } = await request.json()
    if (!roomId || !content) {
      return NextResponse.json({ error: "roomId and content required" }, { status: 400 })
    }

    const isGuest = userId?.startsWith("guest_")

    if (!isGuest) {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("messages")
        .insert({ room_id: roomId, user_id: userId, content })
        .select()
        .single()
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json(data)
    }

    const key = `chat/${roomId}/guest-messages.json`
    const raw = await readFromR2(key)
    let messages: any[] = raw ? JSON.parse(raw) : []
    const msg = {
      id: crypto.randomUUID(),
      room_id: roomId,
      user_id: userId,
      guest_name: guestName || "Invitado",
      content,
      created_at: new Date().toISOString(),
      is_guest: true,
    }
    messages.push(msg)
    const blob = new Blob([JSON.stringify(messages)], { type: "application/json" })
    await uploadToR2(key, blob, "application/json")

    return NextResponse.json(msg)
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
