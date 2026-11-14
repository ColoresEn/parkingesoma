import { Suspense } from "react";
import { connection } from "next/server";
import SingleBlog from "@/components/SingleBlog";
import getBlogs from "@/actions/getBlogs";
import getCurrentUser from "@/actions/getCurrentUser";

export default function HomePage() {
  return (
    <main className="home-page page-frame">
      <section className="home-intro">
        <div>
          <h1 className="home-title">
            Walls tell
            <br />
            <span>stories.</span>
          </h1>
          <p className="home-copy">
            A living collection of street art, the places behind it, and the
            markets shaping what comes next.
          </p>
        </div>
        <aside className="home-side-note">
          <strong>Made outside the feed.</strong>
          <p>Discover local walls. Follow the numbers. Keep your eyes open.</p>
        </aside>
      </section>
      <section aria-labelledby="latest-walls">
        <div className="collection-heading">
          <h2 id="latest-walls">Recent walls</h2>
          <p>Shared by people who were there.</p>
        </div>
        <Suspense
          fallback={
            <p className="empty-state" role="status">
              Loading recent walls...
            </p>
          }
        >
          <RecentWalls />
        </Suspense>
      </section>
    </main>
  );
}

async function RecentWalls() {
  await connection();
  const currentUser = await getCurrentUser();
  const blogs = await getBlogs();

  return (
    <div className="gallery-grid">
      {blogs.length === 0 ? (
        <p className="empty-state">
          No walls have been shared yet. Sign in to add the first one.
        </p>
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
