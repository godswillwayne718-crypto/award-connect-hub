import { BadgeCheck } from "lucide-react";
import { Avatar } from "@/components/community/avatar";
import { cn } from "@/lib/utils";

/**
 * Chat avatar = shared TIAN initials avatar plus an online presence dot.
 */
export function ChatAvatar({
  name,
  online,
  size = "lg",
  className,
}: {
  name: string;
  online?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <span className={cn("relative inline-flex shrink-0", className)}>
      <Avatar name={name} size={size} />
      {online ? (
        <span
          className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-card bg-accent"
          aria-hidden="true"
        />
      ) : null}
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
