import { cn } from "@/lib/utils";

export function StepHeader({
  step,
  total,
  title,
  subtitle,
  className,
}: {
  step: number;
  total: number;
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={cn("animate-fade-up", className)}>
      <div className="flex items-center gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors duration-300",
              i < step ? "bg-accent" : "bg-border",
            )}
          />
        ))}
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Step {step} of {total}
      </p>
      <h1 className="mt-1.5 font-display text-2xl font-extrabold text-foreground">{title}</h1>
      {subtitle ? <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{subtitle}</p> : null}
    </div>
  );
}
