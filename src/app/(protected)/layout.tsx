import { Suspense } from "react";

export default function ProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Suspense
      fallback={
        <div
          role="status"
          className="container min-h-48 py-8 text-center text-muted-foreground"
        >
          Cargando...
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
