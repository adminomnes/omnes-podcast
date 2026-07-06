import type { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    template: "%s | OMNES PODCAST",
    default: "OMNES PODCAST",
  },
}

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
