"use client";
import { Post } from "@/components/posts/Post";
import kyInstance from "@/lib/ky";
import { PostData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export function ForYouFeed() {
  const { status, data } = useQuery<PostData[]>({
    queryKey: ["post-feed", "for-you"],
    queryFn: kyInstance.get("/api/posts/for-you").json<PostData[]>,
  });
  if (status === "pending") {
    return <Loader2 className="mx-auto animate-spin" />;
  }
  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occured while loading posts
      </p>
    );
  }

  return (
    <div className="space-y-5">
      {data.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
}
