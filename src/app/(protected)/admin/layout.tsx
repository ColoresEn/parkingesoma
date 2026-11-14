import { Suspense } from "react";
import AdminNavigation from "@/components/admin/AdminNavigation";

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="mx-auto w-full max-w-[88rem] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="grid items-start gap-6 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10">
        <aside className="min-w-0 lg:sticky lg:top-6">
          <Suspense
            fallback={
              <div
                className="h-14 animate-pulse rounded-2xl border border-border bg-card/80 lg:h-64"
                aria-label="Cargando navegación"
              />
            }
          >
            <AdminNavigation />
          </Suspense>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
