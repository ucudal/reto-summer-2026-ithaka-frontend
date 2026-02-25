import { PostulacionDetail } from "@/src/components/postulacion-detail";

export default async function PostulacionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PostulacionDetail id={id} />;
}
