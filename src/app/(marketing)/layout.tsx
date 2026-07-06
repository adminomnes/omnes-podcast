import type { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    template: "%s | OMNES PODCAST",
    default: "OMNES PODCAST",
  },
}

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return children
}
