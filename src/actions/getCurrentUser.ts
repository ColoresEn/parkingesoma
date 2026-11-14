import { auth } from "../../auth";
import { db } from "@/lib/db";
import { connection } from "next/server";

export default async function getCurrentUser() {
  await connection();

  try {
    const session = await auth();

    if (!session?.user?.email) {
      return null;
    }

    const currentUser = await db.user.findUnique({
      where: {
        email: session.user.email as string
      }
    });

    if (!currentUser) {
      return null;
    }

    return {
      ...currentUser,
      createdAt: currentUser.createdAt.toISOString(),
      updatedAt: currentUser.updatedAt.toISOString(),
      emailVerified: currentUser.emailVerified?.toISOString() || null
    };
  } catch (error) {
    console.error("Could not load current user:", error);
    return null;
  }
}
