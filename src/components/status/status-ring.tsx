import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/community/avatar";

/**
 * Avatar wrapped in a status ring. Unviewed updates use the gradient ring,
 * viewed ones fall back to a muted ring.
 */
export function StatusRing({
  name,
  viewed,
  size = "md",
  children,
  className,
}: {
  name: string;
  viewed?: boolean;
  size?: "md" | "lg";
  children?: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative inline-grid shrink-0 place-items-center rounded-full p-[3px]",
        viewed ? "bg-muted" : "bg-gradient-to-br from-primary via-accent to-gold",
        className,
      )}
    >
      <span className="grid rounded-full bg-background p-[2px]">
        <Avatar name={name} size={size === "lg" ? "lg" : "md"} tone="navy" />
      </span>
      {children}
    </span>
  );
}
