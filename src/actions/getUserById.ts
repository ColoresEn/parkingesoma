import { db } from "@/lib/db";

interface IParams {
  userId: string;
}

export default async function getUserById(params: IParams) {
  const user = await db.user.findUnique({
    where: {
      id: params.userId,
    },
  });

  if (!user) {
    return null;
  }

  return {
    ...user,
    createdAt: user.createdAt.toString(),
  };
}
