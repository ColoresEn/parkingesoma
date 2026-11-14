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
    <section aria-label="Mensajes de contacto">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative block w-full sm:max-w-sm">
          <span className="sr-only">Buscar mensajes</span>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nombre, correo, tema o mensaje"
            className="min-h-11 w-full rounded-xl border border-input bg-background px-3 py-2 pl-10 text-sm text-foreground placeholder:text-muted-foreground"
          />
        </label>
        <p className="m-0 text-sm text-muted-foreground" aria-live="polite">
          {filteredContacts.length} de {contacts.length} mensajes
        </p>
      </div>

      {filteredContacts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/70 px-6 py-12 text-center">
          <h2 className="mb-2 text-lg font-semibold">
            {contacts.length === 0 ? "Aún no hay mensajes" : "No hay resultados"}
          </h2>
          <p className="m-0 text-sm text-muted-foreground">
            {contacts.length === 0
              ? "Los mensajes enviados desde el formulario aparecerán aquí."
              : "Prueba con otro nombre, correo, tema o palabra clave."}
          </p>
        </div>
      ) : (
        <>
          <p className="mb-2 text-xs text-muted-foreground sm:hidden">
            Desliza la tabla para consultar todos los campos.
          </p>
          <div
            className="overflow-x-auto rounded-2xl border border-border bg-card/90"
            role="region"
            aria-label="Tabla de mensajes"
            tabIndex={0}
          >
            <table className="w-full min-w-180 border-collapse text-left text-sm">
              <caption className="sr-only">Mensajes del formulario de contacto</caption>
              <thead className="border-b border-border bg-secondary/60 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-3">Remitente</th>
                  <th scope="col" className="px-4 py-3">Tema</th>
                  <th scope="col" className="px-4 py-3">Mensaje</th>
                  <th scope="col" className="px-4 py-3">Recibido</th>
                  <th scope="col" className="px-4 py-3">
                    <span className="sr-only">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredContacts.map((contact) => (
                  <SingleContact key={contact.id} data={contact} />
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
