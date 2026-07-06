import { PulsoDetailClient } from "./PulsoDetail.client"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Noticia | Pulso OMNES",
  description: "Detalle de la noticia en Pulso OMNES.",
}

export default async function PulsoDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  return <PulsoDetailClient id={id} />
}
