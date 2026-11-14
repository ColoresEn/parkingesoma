"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ListTodo,
  MessageCircle,
  Settings2,
  Users,
} from "lucide-react";

const links = [
 
  { href: "/admin/todos", label: "Tareas", icon: ListTodo },
  { href: "/admin/settings", label: "Mi perfil", icon: Settings2 },
] as const;

const adminLinks = [
   { href: "/admin/dashboard", label: "Panel de control", icon: LayoutDashboard },
  { href: "/admin/users", label: "Usuarios", icon: Users },
  { href: "/admin/messages", label: "Mensajes", icon: MessageCircle },
] as const;

export default function AdminNavigationLinks({
  isAdmin,
}: {
  isAdmin: boolean;
}) {
  const pathname = usePathname();
  const visibleLinks = isAdmin ? [...links, ...adminLinks] : links;

  return (
    <nav
      aria-label="Administración"
      className="surface-panel min-w-0 p-2 lg:p-4"
    >
      <div className="hidden border-b border-border px-3 pb-4 lg:block">
        <p className="m-0 text-sm font-semibold">kikalequa.es</p>
        <p className="m-0 mt-1 text-xs text-muted-foreground">
          Administración
        </p>
      </div>
      <ul className="m-0 grid list-none grid-cols-2 gap-1 p-0 lg:flex lg:flex-col lg:pt-3">
        {visibleLinks.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname === href ||
            (href !== "/admin/dashboard" && pathname.startsWith(`${href}/`));

          return (
            <li key={href} className="min-w-0">
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`flex min-h-11 min-w-0 items-center gap-2 rounded-xl px-2 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:gap-3 sm:px-3 ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <Icon aria-hidden="true" className="size-4 shrink-0" />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
