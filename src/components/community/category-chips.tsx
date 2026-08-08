import { cn } from "@/lib/utils";

export function CategoryChips({
  categories,
  value,
  onChange,
  label = "Filter communities by category",
}: {
  categories: readonly string[];
  value: string | null;
  onChange: (v: string | null) => void;
  label?: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {["All", ...categories].map((c) => {
        const active = c === "All" ? value === null : value === c;
        return (
          <button
            key={c}
            type="button"
            onClick={() => onChange(c === "All" ? null : c)}
            aria-pressed={active}
            className={cn(
              "min-h-11 shrink-0 rounded-full border px-4 text-[12.5px] font-semibold transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20",
              active
                ? "border-primary bg-primary text-primary-foreground shadow-soft"
                : "border-border bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {c}
          </button>
        );
      })}
    </div>
  );
}
