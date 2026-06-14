import { notFound } from "next/navigation";
import { PageHeading } from "@/components/layout/page-heading";
import { CollectionForm } from "@/components/collections/collection-form";
import { getCollectionById } from "@/lib/actions/collections";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditCollectionPage({ params }: Props) {
  const { id } = await params;
  const collection = await getCollectionById(id);

  if (!collection) {
    notFound();
  }

  return (
    <>
      <PageHeading title="编辑收藏集" description="修改收藏集的名称、描述和颜色。" />
      <CollectionForm
        mode="edit"
        initialData={{ id: collection.id, name: collection.name, description: collection.description, coverColor: collection.coverColor }}
      />
    </>
  );
}
