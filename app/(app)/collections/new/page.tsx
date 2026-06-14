import { PageHeading } from "@/components/layout/page-heading";
import { CollectionForm } from "@/components/collections/collection-form";

export default function NewCollectionPage() {
  return (
    <>
      <PageHeading title="新建收藏集" description="创建一个新的灵感分组，把相关 UI 灵感归类到一起。" />
      <CollectionForm mode="create" />
    </>
  );
}
