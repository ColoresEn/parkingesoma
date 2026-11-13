"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { IContact } from "@/interfaces";
import SingleContact from "@/components/SingleContact";

interface AdminMessagesTableProps {
  contacts: IContact[];
}

export default function AdminMessagesTable({
  contacts,
}: AdminMessagesTableProps) {
  const [query, setQuery] = useState("");
  const filteredContacts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return contacts;

    return contacts.filter((contact) =>
      [
        contact.postername,
        contact.email,
        contact.topic,
        contact.message,
      ].some((value) => value.toLowerCase().includes(normalizedQuery)),
    );
  }, [contacts, query]);

  return (
    <section aria-label="Contact messages">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative block w-full sm:max-w-sm">
          <span className="sr-only">Search messages</span>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--muted)]"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, email, topic, or message"
            className="min-h-11 w-full rounded-[var(--radius)] border border-[var(--line)] bg-[var(--paper-raised)] py-2 pl-10 pr-3 text-sm text-[var(--ink)] placeholder:text-[var(--muted)]"
          />
        </label>
        <p className="m-0 text-sm text-[var(--muted)]" aria-live="polite">
          Showing {filteredContacts.length} of {contacts.length}
        </p>
      </div>

      {filteredContacts.length === 0 ? (
        <div className="rounded-[var(--radius)] border border-dashed border-[var(--line)] bg-[var(--paper-raised)] px-6 py-12 text-center">
          <h2 className="mb-2 text-lg font-semibold">
            {contacts.length === 0 ? "No messages yet" : "No matching messages"}
          </h2>
          <p className="m-0 text-sm text-[var(--muted)]">
            {contacts.length === 0
              ? "Messages submitted through the contact form will appear here."
              : "Try another name, email address, topic, or keyword."}
          </p>
        </div>
      ) : (
        <div
          className="overflow-x-auto rounded-[var(--radius)] border border-[var(--line)] bg-[var(--paper-raised)]"
          role="region"
          aria-label="Messages table"
          tabIndex={0}
        >
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <caption className="sr-only">Contact messages</caption>
            <thead className="border-b border-[var(--line)] bg-[var(--paper)] text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
              <tr>
                <th scope="col" className="px-4 py-3">From</th>
                <th scope="col" className="px-4 py-3">Topic</th>
                <th scope="col" className="px-4 py-3">Message</th>
                <th scope="col" className="px-4 py-3">Received</th>
                <th scope="col" className="px-4 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {filteredContacts.map((contact) => (
                <SingleContact key={contact.id} data={contact} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
