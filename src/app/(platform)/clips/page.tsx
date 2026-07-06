import { ClipsPageClient } from "./ClipsPage.client"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Clips",
  description: "Los mejores momentos en formato vertical. Clips cortos de tus podcasts favoritos en OMNES PODCAST.",
  openGraph: {
    title: "Clips | OMNES PODCAST",
    description: "Los mejores momentos en formato vertical.",
  },
}

export default function ClipsPage() {
  return <ClipsPageClient />
}
