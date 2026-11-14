interface AdminPageSkeletonProps {
  label: string;
}

export default function AdminPageSkeleton({
  label,
}: AdminPageSkeletonProps) {
  return (
    <main
      className="page-frame section-page"
      role="status"
      aria-label={`Loading ${label}`}
    >
      <div aria-hidden="true" className="animate-pulse">
        <div className="mb-3 h-12 w-56 rounded bg-[var(--line)]" />
        <div className="mb-10 h-5 max-w-md rounded bg-[var(--line)]" />
        <div className="mb-4 h-11 w-full rounded bg-[var(--paper-raised)]" />
        <div className="space-y-3">
          <div className="h-20 rounded border border-[var(--line)] bg-[var(--paper-raised)]" />
          <div className="h-20 rounded border border-[var(--line)] bg-[var(--paper-raised)]" />
          <div className="h-20 rounded border border-[var(--line)] bg-[var(--paper-raised)]" />
        </div>
      </div>
    </main>
  );
}
