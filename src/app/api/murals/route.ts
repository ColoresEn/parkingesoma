import { auth } from "@/auth";
import { db } from "@/lib/db";
import { muralSchema } from "@/lib/mural-schema";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Sign in to share a mural." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "The request is invalid." }, { status: 400 });
  }

  const parsedBody = muralSchema.safeParse(body);
  if (!parsedBody.success) {
    return NextResponse.json(
      { error: parsedBody.error.issues[0]?.message ?? "The mural details are invalid." },
      { status: 400 },
    );
  }

  const mural = await db.listing.create({
    data: {
      ...parsedBody.data,
      visitUrl: parsedBody.data.visitUrl || null,
      userId,
      likedIds: [],
    },
    select: { id: true },
  });

  return NextResponse.json({ id: mural.id }, { status: 201 });
}
