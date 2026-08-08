import { initials } from "@/lib/community-data";
import { cn } from "@/lib/utils";

const sizes = {
  sm: "size-10 text-[12px]",
  md: "size-11 text-[13px]",
  lg: "size-12 text-sm",
} as const;

const tones = {
  primary: "bg-primary-soft text-primary",
  navy: "bg-navy-deep text-primary-foreground",
} as const;

/** Shared initials avatar used across posts, members, moderators and the composer. */
export function Avatar({
  name,
  size = "md",
  tone = "primary",
  className,
}: {
  name: string;
  size?: keyof typeof sizes;
  tone?: keyof typeof tones;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid shrink-0 place-items-center rounded-full font-display font-extrabold",
        sizes[size],
        tones[tone],
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}
