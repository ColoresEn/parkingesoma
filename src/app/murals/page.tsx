
import { Suspense } from "react";
import { connection } from "next/server";
import SingleBlog from "@/components/SingleBlog";
import getBlogs from "@/actions/getBlogs";
import getCurrentUser from "@/actions/getCurrentUser";

export default function MuralsPage() {
  return (
    <main className="section-page page-frame">
      <header className="section-intro">
        <div>
          <h1>Murals</h1>
          <p>Find the work, the walls it lives on, and the people who make it.</p>
        </div>
      </header>
      <Suspense
        fallback={
          <p className="empty-state" role="status">
            Loading murals...
          </p>
        }
      >
        <MuralsGallery />
      </Suspense>
    </main>
  );
}

async function MuralsGallery() {
  await connection();
  const currentUser = await getCurrentUser();
  const blogs = await getBlogs();

  return (
    <div className="gallery-grid">
      {blogs.length === 0 ? (
        <p className="empty-state">No murals here yet. Add the first wall.</p>
      ) : (
        blogs.map((item, index) => (
          <SingleBlog
            key={item.id}
            data={item}
            currentUser={currentUser}
            preload={index === 0}
          />
        ))
      )}
    </div>
  );
}
