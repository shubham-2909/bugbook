"use server";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude } from "@/lib/types";
import { createPostSchema } from "@/lib/validation";
export async function submitPost(input: string) {
  const { user } = await validateRequest();
  if (!user) throw Error("unauthorized");
  const { content } = createPostSchema.parse({ content: input });
  const newPost = await prisma.post.create({
    data: {
      content,
      userId: user.id,
    },
    include: getPostDataInclude(user.id),
  });

  return newPost;

  //revalidatePath("/") only used for refreshing server components in case of client components u need to use tanstack
}
