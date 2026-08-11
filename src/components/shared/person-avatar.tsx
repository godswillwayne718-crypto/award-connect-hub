import { Avatar } from "@/components/community/avatar";
import { cn } from "@/lib/utils";

/**
 * Shared initials avatar plus an online presence dot. Used by chat rows,
 * contacts, participant search and status.
 */
export function PersonAvatar({
  name,
  online,
  size = "lg",
  tone = "primary",
  className,
}: {
  name: string;
  online?: boolean;
  size?: "sm" | "md" | "lg";
  tone?: "primary" | "navy";
  className?: string;
}) {
  return (
    <span className={cn("relative inline-flex shrink-0", className)}>
      <Avatar name={name} size={size} tone={tone} />
      {online ? (
        <span
          className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-card bg-accent"
          aria-hidden="true"
        />
      ) : null}
    </span>
  );
}
