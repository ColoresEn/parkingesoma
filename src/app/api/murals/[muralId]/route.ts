import { auth } from "@/auth";
import { db } from "@/lib/db";
import { muralSchema } from "@/lib/mural-schema";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ muralId: string }> },
) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Sign in to edit this mural." }, { status: 401 });
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

  const parsedBody = muralSchema.safeParse(body);
  if (!parsedBody.success) {
    return NextResponse.json(
      { error: parsedBody.error.issues[0]?.message ?? "The mural details are invalid." },
      { status: 400 },
    );
  }

  const mural = await db.listing.findUnique({
    where: { id: muralId },
    select: { userId: true },
  });

  if (!mural || (mural.userId !== userId && session.user?.role !== "ADMIN")) {
    return NextResponse.json({ error: "Mural not found." }, { status: 404 });
  }

  await db.listing.update({
    where: { id: muralId },
    data: {
      ...parsedBody.data,
      visitUrl: parsedBody.data.visitUrl || null,
    },
  });

  return NextResponse.json({ id: muralId });
}
