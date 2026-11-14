"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { AdminUserSummary } from "@/actions/getUsers";
import SingleUser from "@/components/SingleUser";

interface AdminUsersDirectoryProps {
  users: AdminUserSummary[];
}

export default function AdminUsersDirectory({
  users,
}: AdminUsersDirectoryProps) {
  const [query, setQuery] = useState("");
  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return users;

    return users.filter((user) =>
      [user.name, user.email ?? "", user.role]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [query, users]);

  return (
    <section aria-label="Directorio de usuarios">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative block w-full sm:max-w-sm">
          <span className="sr-only">Buscar usuarios</span>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nombre, correo o rol"
            className="min-h-11 w-full rounded-xl border border-input bg-background px-3 py-2 pl-10 text-sm text-foreground placeholder:text-muted-foreground"
          />
        </label>
        <p className="m-0 text-sm text-muted-foreground" aria-live="polite">
          {filteredUsers.length} de {users.length} usuarios
        </p>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/70 px-6 py-12 text-center">
          <h2 className="mb-2 text-lg font-semibold">
            {users.length === 0 ? "Aún no hay usuarios" : "No hay resultados"}
          </h2>
          <p className="m-0 text-sm text-muted-foreground">
            {users.length === 0
              ? "Las cuentas nuevas aparecerán aquí."
              : "Prueba con otro nombre, correo o rol."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
          {filteredUsers.map((user) => (
            <SingleUser key={user.id} data={user} />
          ))}
        </div>
      )}
    </section>
  );
}
