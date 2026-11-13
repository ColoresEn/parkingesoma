
import { db } from "@/lib/db";
import type { SafeListing } from "@/types/type";

export default async function getBlogs(): Promise<SafeListing[]> {
  const listings = await db.listing.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return listings.map((listing) => ({
    ...listing,
    createdAt: listing.createdAt.toISOString(),
  }));
}
