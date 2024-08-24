"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getCommentDataInclude, PostData } from "@/lib/types";
import { createCommentSchema } from "@/lib/validation";

export async function submitComment({
  post,
  content,
}: {
  post: PostData;
  content: string;
}) {
  const { user } = await validateRequest();
  if (!user) {
    throw new Error("unauthorized");
  }
  const { content: contentValidated } = createCommentSchema.parse({ content });
  const [comment] = await prisma.$transaction([
    prisma.comment.create({
      data: {
        content: contentValidated,
        userId: user.id,
        postId: post.id,
      },
      include: getCommentDataInclude(user.id),
    }),
    prisma.notification.create({
      data: {
        issuerId: user.id,
        recipientId: post.userId,
        type: "COMMENT",
        postId: post.id,
      },
    }),
  ]);
  return comment;
}

export async function deleteComment(id: string) {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized");

  const comment = await prisma.comment.findUnique({
    where: { id },
  });

  if (!comment) throw new Error("Comment not found");

  if (comment.userId !== user.id) throw new Error("unauthorized");

  const deletedComment = await prisma.comment.delete({
    where: { id },
    include: getCommentDataInclude(user.id),
  });

  return deletedComment;
}
