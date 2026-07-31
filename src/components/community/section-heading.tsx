import type { ReactNode } from "react";

export function SectionHeading({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="font-display text-[15px] font-extrabold tracking-tight text-foreground">
        {title}
      </h2>
      {action}
    </div>
  );
}
