import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Rounded, elevated content card used across the profile screen. */
export function ProfileCard({
  title,
  action,
  children,
  className,
  style,
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <section
      style={style}
      className={cn(
        "animate-fade-up rounded-3xl border border-border bg-card p-4 shadow-soft",
        className,
      )}
    >
      {title ? (
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="font-display text-sm font-extrabold tracking-tight text-foreground">
            {title}
          </h2>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-border bg-primary-soft px-3 py-1.5 text-[11.5px] font-semibold text-primary transition-transform duration-200 hover:-translate-y-0.5">
      {children}
    </span>
  );
}
