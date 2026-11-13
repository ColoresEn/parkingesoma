import { auth } from "@/auth";
import BlogId from "@/components/BlogId";
import { db } from "@/lib/db";
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";

interface EditMuralPageProps {
  params: Promise<{ muralId: string }>;
}

export default function EditMuralPage({ params }: EditMuralPageProps) {
  return (
    <Suspense
      fallback={
        <main className="page-frame section-page" role="status">
          Loading mural...
        </main>
      }
    >
      <EditMuralContent params={params} />
    </Suspense>
  );
}

async function EditMuralContent({ params }: EditMuralPageProps) {
  await connection();
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/login");
  }

  const { muralId } = await params;
  if (!/^[a-f\d]{24}$/i.test(muralId)) {
    notFound();
  }

  const mural = await db.listing.findUnique({
    where: { id: muralId },
    select: { id: true, name: true, description: true, imageSrc: true, visitUrl: true, userId: true },
  });

  if (!mural || (mural.userId !== userId && session.user?.role !== "ADMIN")) {
    notFound();
  }

  return (
    <main className="editor-page">
      <section className="editor-panel">
        <h1>Edit mural</h1>
        <p className="editor-description">Update the photo, artist, or location details.</p>
        <BlogId
          name={mural.name}
          description={mural.description}
          imageSrc={mural.imageSrc}
          visitUrl={mural.visitUrl}
          blogId={mural.id}
        />
      </section>
    </main>
  );
}
