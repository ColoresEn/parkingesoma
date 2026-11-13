import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

const commentSchema = z.object({
  content: z.string().trim().min(1, "Write a comment.").max(1000, "Comments cannot exceed 1,000 characters."),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ muralId: string }> },
) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Sign in to comment." }, { status: 401 });
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

  const parsedBody = commentSchema.safeParse(body);
  if (!parsedBody.success) {
    return NextResponse.json(
      { error: parsedBody.error.issues[0]?.message ?? "The comment is invalid." },
      { status: 400 },
    );
  }

  const mural = await db.listing.findUnique({
    where: { id: muralId },
    select: { id: true },
  });

  if (!mural) {
    return NextResponse.json({ error: "Mural not found." }, { status: 404 });
  }

  const comment = await db.muralComment.create({
    data: {
      content: parsedBody.data.content,
      muralId,
      userId,
    },
    include: {
      user: {
        select: { id: true, name: true, image: true },
      },
    },
  });

  return NextResponse.json({
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt.toISOString(),
    user: comment.user,
  }, { status: 201 });
}
