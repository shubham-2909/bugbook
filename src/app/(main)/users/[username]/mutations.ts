import { useToast } from "@/components/ui/use-toast";
import { useUploadThing } from "@/lib/uploadthing";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { UpdateUserProfileValues } from "@/lib/validation";
import { updateUserProfile } from "./actions";
import { PostsPage } from "@/lib/types";
export function useUpdateProfileMutation() {
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { startUpload: startAvatarUpload } = useUploadThing("avatar");
  const mutaion = useMutation({
    mutationFn: async ({
      values,
      avatar,
    }: {
      values: UpdateUserProfileValues;
      avatar?: File;
    }) => {
      return Promise.all([
        updateUserProfile(values),
        avatar && startAvatarUpload([avatar]),
      ]);
    },
    onSuccess: async ([updatedUser, uploadResult]) => {
      const newAvatarUrl = uploadResult?.[0].serverData.avatarUrl;
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
                posts: page.posts.map((post) => {
                  if (post.user.id === updatedUser.id) {
                    return {
                      ...post,
                      user: {
                        ...updatedUser,
                        avatarUrl: newAvatarUrl || updatedUser.avatarUrl,
                      },
                    };
                  }

                  return post;
                }),
              };
            }),
          };
        },
      );

      router.refresh();
      toast({
        description: "Profile Updated!",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        description: "Failed to Update Profile! Please try again later",
      });
    },
  });

  return mutaion;
}
