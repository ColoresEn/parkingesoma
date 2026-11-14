import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";

interface ArtistPageProps {
  params: Promise<{ artistId: string }>;
}

export default function ArtistPage({ params }: ArtistPageProps) {
  return (
    <main className="page-frame artist-page">
      <Link className="artist-back-link" href="/murals">
        <ArrowLeft aria-hidden="true" /> Back to murals
      </Link>
      <Suspense fallback={<ArtistLoading />}>
        {params.then(({ artistId }) => (
          <ArtistContent artistId={artistId} />
        ))}
      </Suspense>
    </main>
  );
}

async function ArtistContent({ artistId }: { artistId: string }) {
  if (!/^[a-f\d]{24}$/i.test(artistId)) notFound();

  const artist = await db.user.findUnique({
    where: { id: artistId },
    select: {
      id: true,
      name: true,
      image: true,
      listings: {
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, imageSrc: true, description: true },
      },
    },
  });

  if (!artist) notFound();

  return (
    <>
      <header className="artist-heading">
        {artist.image ? (
          <Image
            src={artist.image}
            alt=""
            width={88}
            height={88}
            className="artist-avatar"
          />
        ) : (
          <span className="artist-avatar artist-avatar--fallback" aria-hidden="true">
            {artist.name.slice(0, 1).toUpperCase()}
          </span>
        )}
        <div>
          <h1>{artist.name}</h1>
          <p>Artist in the community</p>
        </div>
      </header>
      <section aria-labelledby="artist-murals-heading">
        <div className="collection-heading artist-collection-heading">
          <h2 id="artist-murals-heading">Shared murals</h2>
          <p>{artist.listings.length} {artist.listings.length === 1 ? "mural" : "murals"}</p>
        </div>
        {artist.listings.length ? (
          <div className="gallery-grid">
            {artist.listings.map((mural) => (
              <article className="gallery-card" key={mural.id}>
                <Link
                  href={`/murals/${mural.id}`}
                  className="gallery-image-button"
                  aria-label={`View ${mural.name}`}
                >
                  <Image
                    src={mural.imageSrc}
                    alt={`Mural: ${mural.name}`}
                    width={800}
                    height={600}
                  />
                </Link>
                <div className="gallery-card-content">
                  <div>
                    <h3>{mural.name}</h3>
                    <p className="gallery-card-location">{mural.description}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="empty-state">No murals have been shared yet.</p>
        )}
      </section>
    </>
  );
}

function ArtistLoading() {
  return (
    <p className="empty-state" role="status">
      Loading artist...
    </p>
  );
}
