import { cn } from "@/lib/utils";

/** TIAN monogram mark — navy shield with gold ring. */
export function TianLogo({ className, tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  return (
    <div
      className={cn(
        "relative grid place-items-center rounded-2xl shadow-lift",
        tone === "light" ? "bg-navy-gradient" : "bg-background",
        className,
      )}
    >
      <span
        className={cn(
          "font-display text-[0.9em] font-extrabold tracking-tight",
          tone === "light" ? "text-gold-gradient" : "text-primary",
        )}
      >
        TIAN
      </span>
      <span className="pointer-events-none absolute inset-[6%] rounded-[inherit] border border-gold/30" />
    </div>
  );
}
