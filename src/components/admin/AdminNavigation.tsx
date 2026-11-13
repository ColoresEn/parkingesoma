import { auth } from "../../../auth";
import AdminNavigationLinks from "@/components/admin/AdminNavigationLinks";
import { connection } from "next/server";

export default async function AdminNavigation() {
  await connection();
  const session = await auth();

  return <AdminNavigationLinks isAdmin={session?.user?.role === "ADMIN"} />;
}
