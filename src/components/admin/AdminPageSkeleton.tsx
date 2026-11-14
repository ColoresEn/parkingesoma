interface AdminPageSkeletonProps {
  label: string;
}

export default function AdminPageSkeleton({
  label,
}: AdminPageSkeletonProps) {
  return (
    <section
      role="status"
      aria-label={`Cargando ${label}`}
      aria-busy="true"
      className="space-y-4"
    >
      <div aria-hidden="true" className="animate-pulse">
        <div className="mb-4 h-5 w-40 rounded bg-muted" />
        <div className="h-14 rounded-2xl border border-border bg-card" />
        <div className="mt-4 h-14 rounded-2xl border border-border bg-card" />
      </div>
    </section>
  );
}
