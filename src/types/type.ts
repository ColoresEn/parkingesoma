import type { Listing, Comment, User } from "@prisma/client";

export type SafeComment = Omit<Comment, "createdAt"> & {
  createdAt: string;
  email:string;
};

// export type SafeReservation = Omit<
//   "createdAt" | "startDate" | "endDate" | "listing"
// > & {
//   createdAt: string;
//   startDate: string;
//   endDate: string;
//   listing: SafeComment;
// };

export type SafeUser = Omit<
  User,
  "createdAt" | "updatedAt" | "emailVerified"
> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
  

};
export type safeComment = Omit<
Comment,
  "createdAt" > & {
  createdAt: string;
  email: string | null;
  };
  export type SafeListing = Omit<
Listing,
  "createdAt" > & {
  createdAt: string;
  };