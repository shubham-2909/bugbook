"use server";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { createPostSchema } from "@/lib/validation";
export async function submitPost(input: string) {
  const { user } = await validateRequest();
  if (!user) throw Error("unauthorized");
  const { content } = createPostSchema.parse({ content: input });
  await prisma.post.create({
    data: {
      content,
      userId: user.id,
    },
  });

  //revalidatePath("/") only used for refreshing server components in case of client components u need to use tanstack
}
