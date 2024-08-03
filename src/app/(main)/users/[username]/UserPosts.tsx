"use client";
import { InfiniteScrollContainer } from "@/components/InfiniteScrollContainer";
import { Post } from "@/components/posts/Post";
import { PostsLoadingSkeleton } from "@/components/posts/PostsLoadingSkeleton";
import kyInstance from "@/lib/ky";
import { PostsPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

type Props = {
  userId: string;
};

export default function UserPosts({ userId }: Props) {
  const {
    data,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "for-you", userId],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          `/api/users/${userId}/posts`,
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<PostsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  if (status === "pending") {
    <PostsLoadingSkeleton />;
  }
  if (status === "success" && !posts.length && !hasNextPage) {
    <p className="text-center text-muted-foreground">
      Uh Oh!! This user has&aposnt posted anything
    </p>;
  }
  if (status === "error") {
    return <p className="text-center text-destructive">Failed to load posts</p>;
  }
  return (
    <InfiniteScrollContainer
      className="space-y-5"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
}
