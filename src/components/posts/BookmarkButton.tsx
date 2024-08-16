import { BookmarkInfo } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";
import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  postId: string;
  initialState: BookmarkInfo;
}

export function BookmarkButton({ postId, initialState }: Props) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const queryKey = ["bookmarks-info", postId];
  const { data } = useQuery({
    queryKey,
    queryFn: () =>
      kyInstance.get(`/api/posts/${postId}/bookmarks`).json<BookmarkInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });

  const mutation = useMutation({
    mutationFn: () =>
      data.isBookmarkedByUser
        ? kyInstance.delete(`/api/posts/${postId}/bookmarks`)
        : kyInstance.post(`/api/posts/${postId}/bookmarks`),
    onMutate: async () => {
      toast({
        variant: "default",
        description: `Post ${data.isBookmarkedByUser ? "un" : ""}bookmarked`,
      });
      await queryClient.cancelQueries({ queryKey });
      const previousState = queryClient.getQueryData<BookmarkInfo>(queryKey);

      queryClient.setQueryData<BookmarkInfo>(queryKey, () => ({
        isBookmarkedByUser: !previousState?.isBookmarkedByUser,
      }));

      return { previousState };
    },
    onError(error, variables, context) {
      queryClient.setQueryData<BookmarkInfo>(queryKey, context?.previousState);
      console.error(error);
      toast({
        variant: "destructive",
        description: "Something went wrong please try again",
      });
    },
  });

  return (
    <button
      onClick={() => mutation.mutate()}
      className="flex items-center gap-2"
    >
      <Bookmark
        className={cn(
          "size-5",
          data.isBookmarkedByUser && "fill-primary text-primary",
        )}
      />
    </button>
  );
}
