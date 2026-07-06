import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { error } = await supabase.from("subscribers").insert({ email })
    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ message: "Ya estás suscrito" })
      }
      throw error
    }

    return NextResponse.json({ message: "¡Suscrito!" })
  } catch {
    return NextResponse.json({ error: "Error al suscribir" }, { status: 500 })
  }
}
