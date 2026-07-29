import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Mobile-first app frame. Centres the experience on larger screens
 * while keeping a native, full-bleed feel on phones.
 */
export function MobileShell({
  children,
  className,
  tone = "surface",
}: {
  children: ReactNode;
  className?: string;
  tone?: "surface" | "navy" | "white";
}) {
  return (
    <div
      className={cn(
        "min-h-screen w-full",
        tone === "navy" ? "bg-navy-gradient" : tone === "white" ? "bg-background" : "bg-surface",
      )}
    >
      <div
        className={cn(
          "mx-auto flex min-h-screen w-full max-w-md flex-col",
          tone === "navy" ? "bg-navy-gradient" : tone === "white" ? "bg-background" : "bg-surface",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
