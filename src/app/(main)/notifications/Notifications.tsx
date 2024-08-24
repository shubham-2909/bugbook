"use client";
import { InfiniteScrollContainer } from "@/components/InfiniteScrollContainer";
import { PostsLoadingSkeleton } from "@/components/posts/PostsLoadingSkeleton";
import kyInstance from "@/lib/ky";
import { NotificationsPage } from "@/lib/types";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Notification from "./Notification";
import { useEffect } from "react";

export function Notifications() {
  const {
    data,
    status,
    hasNextPage,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          `/api/notifications`,
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<NotificationsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const notifications = data?.pages.flatMap((page) => page.notifications) || [];
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: () => kyInstance.patch(`/api/notifications/mark-as-read`),
    onSuccess: () => {
      queryClient.setQueryData(["unread-notification-count"], {
        unreadCount: 0,
      });
    },
    onError: (err) => {
      console.error("Error in marking notifications as read", err);
    },
  });

  useEffect(() => {
    mutate();
  }, [mutate]);

  if (status === "pending") {
    return <PostsLoadingSkeleton />;
  }
  if (status === "success" && !notifications.length && !hasNextPage) {
    <p className="text-center text-muted-foreground">
      Uh Oh!! No notifications to show
    </p>;
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occured while loading notifications!
      </p>
    );
  }
  return (
    <InfiniteScrollContainer
      className="space-y-5"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {notifications.map((notification) => (
        // notification
        <Notification key={notification.id} notification={notification} />
      ))}
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
}
