import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth((request) => {
  if (!request.auth) {
    const signInUrl = new URL("/login", request.nextUrl.origin);
    const callbackUrl = new URL(
      `${request.nextUrl.pathname}${request.nextUrl.search}`,
      request.nextUrl.origin,
    );
    signInUrl.searchParams.set("callbackUrl", callbackUrl.toString());
    return NextResponse.redirect(signInUrl);
  }

  const pathname = request.nextUrl.pathname;
  const adminOnly =
    pathname === "/admin" ||
    ["/admin/dashboard", "/admin/messages", "/admin/users"].some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    );

  if (adminOnly && request.auth.user?.role !== "ADMIN") {
    return NextResponse.redirect(
      new URL("/admin/settings", request.nextUrl.origin),
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
