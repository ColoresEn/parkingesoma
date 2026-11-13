import { Suspense } from "react";
import { connection } from "next/server";
import { auth } from "../../../../../auth";
import { getContacts } from "@/actions/contact-action";
import AdminMessagesTable from "@/components/admin/AdminMessagesTable";
import AdminPageSkeleton from "@/components/admin/AdminPageSkeleton";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mensajes",
};

export default function MessagesPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="m-0 text-3xl font-semibold tracking-tight sm:text-4xl">
          Mensajes
        </h1>
        <p className="m-0 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
          Lee y gestiona las consultas enviadas desde el formulario de contacto.
        </p>
      </header>
      <Suspense fallback={<AdminPageSkeleton label="mensajes" />}>
        <AdminMessagesContent />
      </Suspense>
    </div>
  );
}

async function AdminMessagesContent() {
  await connection();
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    return (
      <p role="alert" className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm">
        Necesitas una cuenta de administrador para ver los mensajes.
      </p>
    );
  }

  const contacts = await getContacts();

  return (
    <>
      <p className="m-0 text-sm text-muted-foreground" aria-live="polite">
        {contacts.length} {contacts.length === 1 ? "mensaje" : "mensajes"}
      </p>
      <AdminMessagesTable contacts={contacts} />
    </>
  );
}
