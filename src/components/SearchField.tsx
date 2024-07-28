"use client";
import { SearchCheckIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export function SeacrchField() {
  const router = useRouter();
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const q = (form.q as HTMLInputElement).value.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <form onSubmit={handleSubmit} method="GET" action={`/search`}>
      <div className="relative">
        <input name="q" placeholder="Search" className="px-3 py-2 pe-10" />
        <SearchCheckIcon className="absolute right-3 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground" />
      </div>
    </form>
  );
}
