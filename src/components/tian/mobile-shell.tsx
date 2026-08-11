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
  width = "app",
}: {
  children: ReactNode;
  className?: string;
  tone?: "surface" | "navy" | "white";
  /** "wide" lets list/feed screens use tablet and desktop space. */
  width?: "app" | "wide";
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
          "mx-auto flex min-h-screen w-full flex-col",
          width === "wide" ? "max-w-md md:max-w-3xl xl:max-w-5xl" : "max-w-md",
          tone === "navy" ? "bg-navy-gradient" : tone === "white" ? "bg-background" : "bg-surface",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
