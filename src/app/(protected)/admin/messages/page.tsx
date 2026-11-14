import { Suspense } from "react";
import { connection } from "next/server";
import { auth } from "@/auth";
import { getContacts } from "@/actions/contact-action";
import AdminMessagesTable from "@/components/admin/AdminMessagesTable";
import AdminPageSkeleton from "@/components/admin/AdminPageSkeleton";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Messages | Admin",
};

export default function MessagesPage() {
  return (
    <Suspense fallback={<AdminPageSkeleton label="messages" />}>
      <AdminMessagesContent />
    </Suspense>
  );
}

async function AdminMessagesContent() {
  await connection();
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    return (
      <main className="page-frame section-page">
        <h1 className="mb-3 text-3xl font-semibold">Admin access required</h1>
        <p className="text-[var(--muted)]">
          Sign in with an administrator account to view messages.
        </p>
      </main>
    );
  }

  const contacts = await getContacts();

  return (
    <main className="page-frame section-page">
      <header className="section-intro">
        <div>
          <h1>Messages</h1>
          <p>Read and manage messages sent through the contact form.</p>
        </div>
        <p className="m-0 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--paper-raised)] px-3 py-2 text-sm text-[var(--muted)]">
          {contacts.length} {contacts.length === 1 ? "message" : "messages"}
        </p>
      </header>
      <AdminMessagesTable contacts={contacts} />
    </main>
  );
}
