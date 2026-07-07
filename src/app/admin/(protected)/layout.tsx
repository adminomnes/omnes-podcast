import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const session = cookieStore.get("admin_session")

  if (session?.value !== "1") {
    redirect("/admin/login")
  }

  return <>{children}</>
}
