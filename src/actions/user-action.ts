"use server";

import { db } from "@/lib/db";
import { UpdateProfileValues, updateProfileSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";
import getSession from "@/lib/getSession";
import { auth } from "@/auth";

export const updateUser = async (values: UpdateProfileValues)=> {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const { name, email, image, userId } = updateProfileSchema.parse(values);
  await db.user.update({
    where: {
      id: userId,
    },
    data: {
      name,
      email,
      image,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/users");
};

export async function updateProfile(values: UpdateProfileValues) {
  const session = await getSession();

  const userId = session?.user?.id;

  if (!userId) {
    throw Error("Unauthorized");
  }

  const { name, email, image } = updateProfileSchema.parse(values);

  await db.user.update({
    where: {
      id: userId,
    },
    data: {
      name,
      email,
      image,
    },
  });

  revalidatePath("/");
}
export const deleteUser = async ({
  id,
}: {
  id: string;
}): Promise<void> => {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await db.user.delete({
    where: {
      id,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/users");
};