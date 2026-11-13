"use server";

import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

export const getContacts = async () => {
  await requireAdmin();

  return prisma.contact.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};
export const createContactAction = async ({
  postername,
  email,
  topic,
  message,
}: {
  postername: string,
 
  email: string,
  topic: string,
  message: string,

}): Promise<void> => {
  await prisma.contact.create({
    data: {
      postername,
      email,
      topic,
      message,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/messages");
};

export const deleteContact = async ({
  id,
}: {
  id: string;
}): Promise<void> => {
  await requireAdmin();

  await prisma.contact.delete({
    where: {
      id,
    },
  });

  revalidatePath("/admin/messages");
};