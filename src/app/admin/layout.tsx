import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: {
    template: "%s | Admin | OMNES PODCAST",
    default: "Admin | OMNES PODCAST",
  },
}

const NAV = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Podcasts", href: "/admin/podcasts" },
  { label: "Episodios", href: "/admin/episodes" },
  { label: "Invitados", href: "/admin/guests" },
  { label: "Salas", href: "/admin/rooms" },
  { label: "Estadísticas", href: "/admin/stats" },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black">
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center gap-6 overflow-x-auto px-6 py-3 text-sm">
          <Link href="/admin/dashboard" className="shrink-0 font-bold text-white/80">
            Admin
          </Link>
          {NAV.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="shrink-0 text-white/40 transition hover:text-white/80"
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  )
}
