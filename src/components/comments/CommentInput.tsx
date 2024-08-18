import { PostData } from "@/lib/types";
import { useState } from "react";
import { useSubmitCommentMutation } from "./mutations";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { Loader2, SendHorizontal } from "lucide-react";

type Props = {
  post: PostData;
};

export function CommentInput({ post }: Props) {
  const [input, setinput] = useState<string>("");
  const mutation = useSubmitCommentMutation(post.id);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input) return;
    mutation.mutate(
      {
        post,
        content: input,
      },
      {
        onSuccess: () => setinput(""),
      },
    );
  }
  return (
    <form className="flex w-full items-center gap-2" onSubmit={handleSubmit}>
      <Input
        placeholder="write a comment..."
        onChange={(e) => setinput(e.target.value)}
        autoFocus
      />
      <Button
        type="submit"
        variant={`ghost`}
        disabled={mutation.isPending || !input.trim()}
        size={`icon`}
      >
        {!mutation.isPending ? (
          <SendHorizontal />
        ) : (
          <Loader2 className="animate-spin" />
        )}
      </Button>
    </form>
  );
}
