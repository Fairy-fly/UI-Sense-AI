import { notFound } from "next/navigation";
import { PageHeading } from "@/components/layout/page-heading";
import { InspirationForm } from "@/components/inspirations/inspiration-form";
import { getInspirationForEdit } from "@/lib/actions/inspirations";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditInspirationPage({ params }: Props) {
  const { id } = await params;
  const inspiration = await getInspirationForEdit(id);

  if (!inspiration) {
    notFound();
  }

  return (
    <>
      <PageHeading
        title="编辑灵感"
        description="更新这条 UI 灵感的基础信息、标签和评价。"
      />

      <InspirationForm mode="edit" initialData={inspiration} />
    </>
  );
}
