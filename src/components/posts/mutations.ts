import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useToast } from "../ui/use-toast";
import { DeletePost } from "./actions";
import { PostsPage } from "@/lib/types";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

export function useDeletePostMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const pathName = usePathname();
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: DeletePost,
    onSuccess: async function (deletedPost) {
      const queryFilter: QueryFilters = {
        queryKey: ["post-feed"],
      };
      await queryClient.cancelQueries(queryFilter);
      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) return;
          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => {
              return {
                nextCursor: page.nextCursor,
                posts: page.posts.filter((post) => post.id !== deletedPost.id),
              };
            }),
          };
        },
      );
      toast({
        description: "Post deleted Successfully",
      });

      if (pathName === `/posts/${deletedPost.id}`)
        router.push(`/users/${deletedPost.user.username}`);
    },
    onError() {
      toast({
        variant: "destructive",
        description: "Failed to delete post please try again later",
      });
    },
  });

  return mutation;
}
