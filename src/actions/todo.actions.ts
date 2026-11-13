"use server";

import { auth } from "../../auth";
import { db } from "@/lib/db";
import { ITodo } from "@/interfaces";
import { revalidatePath } from "next/cache";

async function requireUserId() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return userId;
}

export const getUserTodoListAction = async ({
  userId,
}: {
  userId: string | null;
}): Promise<Array<ITodo>> => {
  const currentUserId = await requireUserId();
  if (userId !== currentUserId) {
    throw new Error("Unauthorized");
  }

  return db.todo.findMany({
    where: { user_id: currentUserId },
    orderBy: { createdAt: "desc" },
  });
};

export const createTodoAction = async ({
  title,
  body,
  completed,
  userId,
}: {
  title: string;
  body?: string;
  completed: boolean;
  userId: string | null;
}): Promise<void> => {
  const currentUserId = await requireUserId();
  if (userId !== currentUserId) {
    throw new Error("Unauthorized");
  }

  await db.todo.create({
    data: {
      title,
      body,
      completed,
      user_id: currentUserId,
    },
  });

  revalidatePath("/admin/todos");
  revalidatePath("/admin/dashboard");
};

export const deleteTodoAction = async ({
  id,
}: {
  id: string;
}): Promise<void> => {
  const userId = await requireUserId();
  const result = await db.todo.deleteMany({
    where: { id, user_id: userId },
  });

  if (result.count === 0) {
    throw new Error("Todo not found");
  }

  revalidatePath("/admin/todos");
  revalidatePath("/admin/dashboard");
};

export const updateTodoAction = async ({
  id,
  title,
  body,
  completed,
}: ITodo): Promise<void> => {
  const userId = await requireUserId();
  const result = await db.todo.updateMany({
    where: { id, user_id: userId },
    data: { title, body, completed },
  });

  if (result.count === 0) {
    throw new Error("Todo not found");
  }

  revalidatePath("/admin/todos");
  revalidatePath("/admin/dashboard");
};
