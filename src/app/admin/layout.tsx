import type { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    template: "%s | Admin | OMNES PODCAST",
    default: "Admin | OMNES PODCAST",
  },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
