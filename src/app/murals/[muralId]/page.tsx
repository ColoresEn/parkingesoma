import { Suspense } from "react";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import MuralDetail from "@/components/MuralDetail";

interface MuralDetailPageProps {
  params: Promise<{ muralId: string }>;
}

export default function MuralDetailPage({ params }: MuralDetailPageProps) {
  return (
    <Suspense
      fallback={
        <main className="page-frame section-page" role="status">
          Loading mural...
        </main>
      }
    >
      <MuralDetailContent params={params} />
    </Suspense>
  );
}

async function MuralDetailContent({ params }: MuralDetailPageProps) {
  const { muralId } = await params;
  if (!/^[a-f\d]{24}$/i.test(muralId)) notFound();

  await connection();
  const [mural, session] = await Promise.all([
    db.listing.findUnique({
      where: { id: muralId },
      include: {
        comments: {
          orderBy: { createdAt: "desc" },
          include: {
            user: { select: { id: true, name: true, image: true } },
          },
        },
      },
    }),
    auth(),
  ]);

  if (!mural) notFound();

  const author = await db.user.findUnique({
    where: { id: mural.userId },
    select: { id: true, name: true, image: true },
  });

  return (
    <main className="page-frame mural-detail-page">
      <MuralDetail
        mural={{
          id: mural.id,
          name: mural.name,
          description: mural.description,
          imageSrc: mural.imageSrc,
          visitUrl: mural.visitUrl,
          likedIds: mural.likedIds,
          author,
          comments: mural.comments.map((comment) => ({
            id: comment.id,
            content: comment.content,
            createdAt: comment.createdAt.toISOString(),
            user: comment.user,
          })),
        }}
        currentUserId={session?.user?.id ?? null}
      />
    </main>
  );
}
