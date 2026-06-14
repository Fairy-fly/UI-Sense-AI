"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteCollection } from "@/lib/actions/collections";

interface DeleteCollectionButtonProps {
  collectionId: string;
}

export function DeleteCollectionButton({ collectionId }: DeleteCollectionButtonProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      const result = await deleteCollection(collectionId);
      if (!result.success) {
        toast.error(result.error ?? "删除失败");
        setDeleting(false);
        return;
      }
      toast.success("收藏集已删除（灵感未删除）");
      setOpen(false);
      router.push("/collections");
      router.refresh();
    } catch {
      toast.error("删除失败，请重试");
      setDeleting(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "gap-1 rounded-[10px] border-destructive/20 text-destructive hover:bg-destructive/5",
        )}
      >
        <Trash2 className="h-3.5 w-3.5 shrink-0" />
        <span className="inline-flex items-center leading-none">删除</span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确定要删除此收藏集吗？</AlertDialogTitle>
          <AlertDialogDescription>仅删除收藏集和关联关系，不会删除其中的灵感。</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>取消</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleting ? "删除中..." : "确认删除"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
