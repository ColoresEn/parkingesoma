"use client";

import Image from "next/image";
import { SafeListing, SafeUser } from "@/types/type";
import axios from "axios";
import { useRouter } from "next/navigation";
import { RiDeleteBin5Line } from "react-icons/ri";
import { BsFillPencilFill } from "react-icons/bs";
import Link from "next/link";

interface BlogProps {
  data: SafeListing;
  currentUser?: SafeUser | null;
  preload?: boolean;
}

export default function SingleBlog({ data, currentUser, preload = false }: BlogProps) {
  const router = useRouter();

  const onDelete = () => {
    axios
      .delete(`/api/blogs/${data.id}`)
      .then(() => {
        router.refresh();
      })
      .catch((error) => {
        console.error("Could not delete mural:", error);
      });
  };

  return (
    <article className="gallery-card">
      <Link
        href={`/murals/${data.id}`}
        className="gallery-image-button"
        aria-label={`View ${data.name}`}
      >
        <Image
          width={800}
          height={600}
          src={data.imageSrc}
          alt={`Mural shared by ${data.name}`}
          preload={preload}
        />
      </Link>
      <div className="gallery-card-content">
        <div>
          <h3>{data.name}</h3>
          <p className="gallery-card-location">{data.description}</p>
        </div>

        {data.userId === currentUser?.id && (
          <div className="gallery-actions">
            <button type="button" onClick={onDelete} aria-label="Delete mural">
              <RiDeleteBin5Line aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => router.push(`/murals/${data.id}/edit`)}
              aria-label="Edit mural"
            >
              <BsFillPencilFill aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
