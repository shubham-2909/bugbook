import { CommentData } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteCommentMutation } from "./mutations";
import { LoadingButton } from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";

type Props = {
  comment: CommentData;
  open: boolean;
  onClose: () => void;
};

export function DeleteCommentDialog({ comment, open, onClose }: Props) {
  const { mutate, isPending } = useDeleteCommentMutation();

  function handleOpenChange() {
    if (isPending || !open) {
      onClose();
    }
  }
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete comment?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this comment? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <LoadingButton
            variant={`destructive`}
            onClick={() => mutate(comment.id, { onSuccess: onClose })}
            loading={isPending}
          >
            Delete
          </LoadingButton>
          <Button variant={`outline`} disabled={isPending} onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
