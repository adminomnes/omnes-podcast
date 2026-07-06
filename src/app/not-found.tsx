import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-white/10">404</h1>
      <p className="mt-4 text-lg text-white/40">Página no encontrada</p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-white/10 px-6 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/15"
      >
        Volver al inicio
      </Link>
    </div>
  )
}
