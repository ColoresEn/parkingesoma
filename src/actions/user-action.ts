"use server";

import { auth } from "../../auth";
import { db } from "@/lib/db";
import { UpdateProfileValues, updateProfileSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";
import getSession from "@/lib/getSession";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

export const updateUser = async (values: UpdateProfileValues) => {
  await requireAdmin();
  const { name, email, image, userId } = updateProfileSchema.parse(values);

  await db.user.update({
    where: { id: userId },
    data: { name, email, image },
  });

  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${userId}`);
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
  revalidatePath("/admin/settings");
}

export const deleteUser = async ({
  id,
}: {
  id: string;
}): Promise<void> => {
  await requireAdmin();
  await db.user.delete({
    where: {
      id,
    },
  });

  revalidatePath("/admin/users");
};