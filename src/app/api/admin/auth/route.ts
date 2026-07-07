import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { password } = await req.json()
  const secret = process.env.ADMIN_SECRET

  if (!secret || password !== secret) {
    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 })
  }

  const res = NextResponse.json({ success: true })
  res.cookies.set("admin_session", "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: 60 * 60 * 24, // 24h
  })
  return res
}
