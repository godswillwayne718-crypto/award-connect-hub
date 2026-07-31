import { cn } from "@/lib/utils";

export function CategoryChips({
  categories,
  value,
  onChange,
}: {
  categories: readonly string[];
  value: string | null;
  onChange: (v: string | null) => void;
}) {
  return (
    <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {["All", ...categories].map((c) => {
        const active = c === "All" ? value === null : value === c;
        return (
          <button
            key={c}
            type="button"
            onClick={() => onChange(c === "All" ? null : c)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-[12.5px] font-semibold transition-all duration-200 active:scale-95",
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
