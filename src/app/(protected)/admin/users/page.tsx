import { Suspense } from "react";
import { connection } from "next/server";
import { auth } from "@/auth";
import getUsers from "@/actions/getUsers";
import AdminPageSkeleton from "@/components/admin/AdminPageSkeleton";
import AdminUsersDirectory from "@/components/admin/AdminUsersDirectory";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users | Admin",
};

export default function UsersPage() {
  return (
    <Suspense fallback={<AdminPageSkeleton label="users" />}>
      <AdminUsersContent />
    </Suspense>
  );
}

async function AdminUsersContent() {
  await connection();
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    return (
      <main className="page-frame section-page">
        <h1 className="mb-3 text-3xl font-semibold">Admin access required</h1>
        <p className="text-[var(--muted)]">
          Sign in with an administrator account to manage users.
        </p>
      </main>
    );
  }

  const users = await getUsers();

  return (
    <main className="page-frame section-page">
      <header className="section-intro">
        <div>
          <h1>Users</h1>
          <p>Browse registered accounts and update their details.</p>
        </div>
        <p className="m-0 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--paper-raised)] px-3 py-2 text-sm text-[var(--muted)]">
          {users.length} {users.length === 1 ? "account" : "accounts"}
        </p>
      </header>
      <AdminUsersDirectory users={users} />
    </main>
  );
}
