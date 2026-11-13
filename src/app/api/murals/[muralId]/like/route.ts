import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

const likeSchema = z.object({
  liked: z.boolean(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ muralId: string }> },
) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Sign in to like murals." }, { status: 401 });
  }

  const { muralId } = await params;
  if (!/^[a-f\d]{24}$/i.test(muralId)) {
    return NextResponse.json({ error: "Mural not found." }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "The request is invalid." }, { status: 400 });
  }

  const parsedBody = likeSchema.safeParse(body);
  if (!parsedBody.success) {
    return NextResponse.json({ error: "The requested action is invalid." }, { status: 400 });
  }

  const mural = await db.listing.findUnique({
    where: { id: muralId },
    select: { likedIds: true },
  });

  if (!mural) {
    return NextResponse.json({ error: "Mural not found." }, { status: 404 });
  }

  const alreadyLiked = mural.likedIds.includes(userId);
  if (parsedBody.data.liked !== alreadyLiked) {
    const updatedMural = await db.listing.update({
      where: { id: muralId },
      data: {
        likedIds: parsedBody.data.liked
          ? { push: userId }
          : { set: mural.likedIds.filter((likedId) => likedId !== userId) },
      },
      select: { likedIds: true },
    });

    return NextResponse.json({
      liked: updatedMural.likedIds.includes(userId),
      likeCount: updatedMural.likedIds.length,
    });
  }

  return NextResponse.json({
    liked: alreadyLiked,
    likeCount: mural.likedIds.length,
  });
}
