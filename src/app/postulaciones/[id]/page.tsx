import { AppShell } from "@/src/components/app-shell"
import { PostulacionDetail } from "@/src/components/postulacion-detail"

export default async function PostulacionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <AppShell>
      <PostulacionDetail id={id} />
    </AppShell>
  )
}
