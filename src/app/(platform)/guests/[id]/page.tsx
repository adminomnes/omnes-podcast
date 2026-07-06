import { GuestPageClient } from "./GuestPage.client"
import type { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return {
    title: `Invitado`,
    description: `Perfil del invitado en OMNES PODCAST.`,
    openGraph: {
      title: `Invitado | OMNES PODCAST`,
    },
  }
}

export default function GuestPage() {
  return <GuestPageClient />
}
