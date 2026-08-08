import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/** Shared empty state for feeds, member lists and search results. */
export function EmptyState({
  icon: Icon,
  title,
  copy,
  action,
}: {
  icon: LucideIcon;
  title: string;
  copy: string;
  action?: ReactNode;
}) {
  return (
    <div className="animate-fade-up flex flex-col items-center rounded-3xl border border-dashed border-border bg-card px-6 py-10 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary">
        <Icon className="size-6" aria-hidden="true" />
      </span>
      <h3 className="mt-3 font-display text-[15px] font-extrabold tracking-tight text-foreground">
        {title}
      </h3>
      <p className="mt-1.5 max-w-[15rem] text-[13px] leading-relaxed text-muted-foreground">
        {copy}
      </p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
