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
    <section aria-label="Registered users">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative block w-full sm:max-w-sm">
          <span className="sr-only">Search users</span>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--muted)]"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, email, or role"
            className="min-h-11 w-full rounded-[var(--radius)] border border-[var(--line)] bg-[var(--paper-raised)] py-2 pl-10 pr-3 text-sm text-[var(--ink)] placeholder:text-[var(--muted)]"
          />
        </label>
        <p className="m-0 text-sm text-[var(--muted)]" aria-live="polite">
          Showing {filteredUsers.length} of {users.length}
        </p>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="rounded-[var(--radius)] border border-dashed border-[var(--line)] bg-[var(--paper-raised)] px-6 py-12 text-center">
          <h2 className="mb-2 text-lg font-semibold">
            {users.length === 0 ? "No registered users yet" : "No matching users"}
          </h2>
          <p className="m-0 text-sm text-[var(--muted)]">
            {users.length === 0
              ? "New accounts will appear here."
              : "Try another name, email address, or role."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredUsers.map((user) => (
            <SingleUser key={user.id} data={user} />
          ))}
        </div>
      )}
    </section>
  );
}
