import { Suspense } from "react";
import { connection } from "next/server";
import { auth } from "../../../../../auth";
import { db } from "@/lib/db";
import AdminPageSkeleton from "@/components/admin/AdminPageSkeleton";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowUpRight,
  ListTodo,
  MessageCircle,
  Users,
} from "lucide-react";

export const metadata = {
  title: "Panel de control",
};

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="m-0 text-3xl font-semibold tracking-tight sm:text-4xl">
          Panel de control
        </h1>
        <p className="m-0 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
          Accede a las herramientas y al estado actual de tu espacio de
          administración.
        </p>
      </header>
      <Suspense fallback={<AdminPageSkeleton label="resumen" />}>
        <DashboardOverview />
      </Suspense>
    </div>
  );
}

async function DashboardOverview() {
  await connection();
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  if (session.user.role !== "ADMIN") {
    return (
      <p role="alert" className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm">
        Necesitas una cuenta de administrador para ver este resumen.
      </p>
    );
  }

  const [userCount, messageCount, todoCount] = await Promise.all([
    db.user.count(),
    db.contact.count(),
    db.todo.count(),
  ]);
  const userName = session?.user?.name;

  const sections = [
    { href: "/admin/users", label: "Usuarios registrados", count: userCount, icon: Users },
    { href: "/admin/messages", label: "Mensajes recibidos", count: messageCount, icon: MessageCircle },
    { href: "/admin/todos", label: "Tareas", count: todoCount, icon: ListTodo },
  ];

  return (
    <div className="space-y-8">
      {userName && (
        <p className="m-0 text-sm text-muted-foreground">
          Hola, <span className="font-medium text-foreground">{userName}</span>
        </p>
      )}
      <section aria-labelledby="admin-overview-title">
        <h2
          id="admin-overview-title"
          className="mb-3 text-lg font-semibold tracking-tight"
        >
          Resumen
        </h2>
        <dl className="surface-panel m-0 grid grid-cols-1 divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {sections.map(({ href, label, count, icon: Icon }) => (
            <div key={href} className="flex items-center gap-4 px-5 py-4">
              <Icon aria-hidden="true" className="size-5 shrink-0 text-primary" />
              <div className="min-w-0">
                <dt className="text-sm text-muted-foreground">{label}</dt>
                <dd className="m-0 mt-1 text-2xl font-semibold tabular-nums">
                  {count}
                </dd>
              </div>
            </div>
          ))}
        </dl>
      </section>
      <section aria-labelledby="admin-links-title">
        <h2 id="admin-links-title" className="mb-3 text-lg font-semibold tracking-tight">
          Accesos directos
        </h2>
        <ul className="surface-panel m-0 list-none divide-y divide-border p-0">
          {sections.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className="flex min-h-14 items-center justify-between gap-4 px-5 py-3 transition-colors hover:bg-accent/70 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring"
              >
                <span className="flex items-center gap-3">
                  <Icon aria-hidden="true" className="size-4 text-primary" />
                  <span className="font-medium">{label}</span>
                </span>
                <ArrowUpRight aria-hidden="true" className="size-4 text-muted-foreground" />
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/admin/settings"
              className="flex min-h-14 items-center justify-between gap-4 px-5 py-3 transition-colors hover:bg-accent/70 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring"
            >
              <span className="font-medium">Configurar mi perfil</span>
              <ArrowUpRight aria-hidden="true" className="size-4 text-muted-foreground" />
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
