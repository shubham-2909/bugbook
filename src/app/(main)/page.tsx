import { PostEditor } from "@/components/posts/editor/PostEditor";
import { TrendsSidebar } from "@/components/TrendsSideBar";
import { ForYouFeed } from "./ForYouFeed";

export default function Home() {
  return (
    <main className="flex h-[200vh] w-full gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        <ForYouFeed />
      </div>
      <TrendsSidebar />
    </main>
  );
}
