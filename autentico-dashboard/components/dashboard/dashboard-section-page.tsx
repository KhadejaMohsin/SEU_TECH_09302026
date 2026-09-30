export function DashboardSectionPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <>
      <header className="mb-6 border-b border-brand-surface pb-5">
        <div className="mb-2 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-brand-muted">
          <span>Demo workspace</span>
          <span className="size-1 rounded-full bg-brand-yellow" />
          <span>{title}</span>
        </div>
        <h1 className="font-display text-[26px] font-bold leading-tight text-brand-cream sm:text-[30px]">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-xs leading-5 text-brand-muted">
          {description}
        </p>
      </header>

      <section className="rounded-md border border-brand-surface bg-brand-navy p-5 sm:p-6">
        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-brand-sky">
          Workspace section
        </p>
        <h2 className="mt-2 text-base font-semibold text-brand-cream">
          {title} workspace
        </h2>
        <p className="mt-2 max-w-xl text-xs leading-5 text-brand-muted">
          This section is ready for its dedicated FuenteLuz workflow.
        </p>
      </section>
    </>
  );
}
