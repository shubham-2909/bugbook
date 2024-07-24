"use server";
import { signUpSchema, SignUpValues } from "@/lib/validation";
import { isRedirectError } from "next/dist/client/components/redirect";
import { hash } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
import prisma from "@/lib/prisma";
import { lucia } from "@/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export async function signUp(
  credentials: SignUpValues,
): Promise<{ error: string }> {
  try {
    const { username, password, email } = signUpSchema.parse(credentials);
    const passwordHash = await hash(password, {
      memoryCost: 19456,
      outputLen: 32,
      parallelism: 1,
      timeCost: 2,
    });

    const userId = generateIdFromEntropySize(10);
    const existingUsername = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    });

    if (existingUsername) {
      return {
        error: "Username already taken",
      };
    }
    const existingEmail = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });

    if (existingEmail) {
      return {
        error: "Email already taken",
      };
    }

    await prisma.user.create({
      data: {
        id: userId,
        username,
        displayName: username,
        email,
        passwordHash,
      },
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return redirect("/");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Something went wrong please try again" };
  }
}
