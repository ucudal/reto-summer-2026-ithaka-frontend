import { ProyectoDetail } from "@/src/components/proyecto-detail";

export default async function ProyectoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProyectoDetail id={id} />;
}
