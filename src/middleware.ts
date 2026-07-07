import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (!pathname.startsWith("/admin")) return NextResponse.next()
  if (pathname === "/admin/login") return NextResponse.next()

  const session = req.cookies.get("admin_session")
  if (session?.value === "1") return NextResponse.next()

  return NextResponse.redirect(new URL("/admin/login", req.url))
}

export const config = {
  matcher: ["/admin/:path*"],
}
