import { auth } from "../../auth";
import { db } from "@/lib/db";

export interface AdminUserSummary {
  id: string;
  name: string;
  email: string | null;
  image: string | null;
  role: string;
  createdAt: string;
}

export default async function getUsers() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const users = await db.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return users.map((user) => ({
    ...user,
    createdAt: user.createdAt.toISOString(),
  }));
}
