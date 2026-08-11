import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The single way TIAN renders an identity handle. Always prefixed with "@",
 * always truncates safely inside narrow rows.
 */
export function UsernameBadge({
  username,
  verified,
  className,
  tone = "primary",
}: {
  username: string;
  verified?: boolean;
  className?: string;
  tone?: "primary" | "muted" | "onDark";
}) {
  return (
    <span className={cn("flex min-w-0 items-center gap-1", className)}>
      <span
        className={cn(
          "truncate text-[11.5px] font-semibold",
          tone === "primary" && "text-primary/70",
          tone === "muted" && "text-muted-foreground",
          tone === "onDark" && "text-primary-foreground/80",
        )}
      >
        @{username.replace(/^@/, "")}
      </span>
      {verified ? <VerifiedMark /> : null}
    </span>
  );
}

/** Small gold verification tick used next to verified Award members. */
export function VerifiedMark({ className }: { className?: string }) {
  return (
    <BadgeCheck
      className={cn("size-[15px] shrink-0 text-gold", className)}
      aria-label="Verified Award member"
      role="img"
    />
  );
}
