import { LikeInfo } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  postId: string;
  initialState: LikeInfo;
}

export function LikesButton({ postId, initialState }: Props) {
  const { toast } = useToast();
  const queryKey = ["like-info", postId];
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey,
    queryFn: () =>
      kyInstance.get(`/api/posts/${postId}/likes`).json<LikeInfo>(),
    staleTime: Infinity,
    initialData: initialState,
  });

  const mutation = useMutation({
    mutationFn: () =>
      data.isLikedByUser
        ? kyInstance.delete(`/api/posts/${postId}/likes`)
        : kyInstance.post(`/api/posts/${postId}/likes`),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previousState = queryClient.getQueryData<LikeInfo>(queryKey);

      queryClient.setQueryData<LikeInfo>(queryKey, () => ({
        likes:
          (previousState?.likes || 0) + (previousState?.isLikedByUser ? -1 : 1),
        isLikedByUser: !previousState?.isLikedByUser,
      }));

      return { previousState };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(queryKey, context?.previousState);
      console.error(error);
      toast({
        variant: `destructive`,
        description: "Something went wrong please try again",
      });
    },
  });

  return (
    <button
      onClick={() => mutation.mutate()}
      className="flex items-center gap-2"
    >
      <Heart
        className={cn(
          "size-5",
          data.isLikedByUser && "fill-rose-500 text-rose-500",
        )}
      />
      <span className="text-sm font-medium tabular-nums">
        {data.likes} <span className="hidden sm:inline">likes</span>
      </span>
    </button>
  );
}
