import { auth } from "@/auth";
import { Suspense } from "react";
import getBlogsById from "@/actions/getBlogsById";
import BlogId from "@/components/BlogId";
import { notFound, redirect } from "next/navigation";

interface IParams {
  blogId: string;
}

interface AdminMuralPageProps {
  params: Promise<IParams>;
}

export default function Page({ params }: AdminMuralPageProps) {
  return (
    <Suspense
      fallback={
        <main className="page-frame section-page" role="status">
          Loading mural...
        </main>
      }
    >
      <BlogPage params={params} />
    </Suspense>
  );
}

async function BlogPage({ params }: AdminMuralPageProps) {
  const [session, { blogId }] = await Promise.all([auth(), params]);

  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== "ADMIN") notFound();
  if (!/^[a-f\d]{24}$/i.test(blogId)) notFound();

  const blog = await getBlogsById({ blogId });
  if (!blog) notFound();

  return (
    <main className="editor-page">
      <section className="editor-panel">
        <h1>Edit mural</h1>
        <p className="editor-description">Update the photo, artist, or location details.</p>
        <BlogId
          name={blog.name}
          description={blog.description}
          blogId={blog.id}
          imageSrc={blog.imageSrc}
          visitUrl={blog.visitUrl}
        />
      </section>
    </main>
  );
}
