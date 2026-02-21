import { AppShell } from "@/src/components/app-shell"
import { ProyectoDetail } from "@/src/components/proyecto-detail"

export default async function ProyectoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <AppShell>
      <ProyectoDetail id={id} />
    </AppShell>
  )
}
