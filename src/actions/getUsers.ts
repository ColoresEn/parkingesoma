import { db } from "@/lib/db";
import type { Role } from "@prisma/client";
import { format } from "date-fns";

export interface AdminUserSummary {
  id: string;
  name: string;
  email: string | null;
  image: string | null;
  role: Role;
  createdAt: string;
}

export default async function getUsers() {
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
    createdAt: format(user.createdAt, "MMM d, yyyy"),
  }));
}
