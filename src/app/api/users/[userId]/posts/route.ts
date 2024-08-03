import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude, PostsPage } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params: { userId } }: { params: { userId: string } },
) {
  try {
    const { user: loggedInUser } = await validateRequest();
    if (!loggedInUser)
      return Response.json({ error: "unauthorized" }, { status: 401 });
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const pageSize = 10;

    const posts = await prisma.post.findMany({
      where: { userId },
      include: getPostDataInclude(loggedInUser.id),
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: "desc" },
    });

    const nextCursor = posts.length > pageSize ? posts[pageSize].id : null;

    const data: PostsPage = {
      posts: posts.slice(0, pageSize),
      nextCursor,
    };
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
