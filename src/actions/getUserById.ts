import { db } from "@/lib/db";
import { auth } from "../../auth";

interface IParams {
  userId: string;
}

export default async function getUserById(params: IParams) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: {
      id: params.userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  });

  return user;
}
