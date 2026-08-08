import { useId } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function SearchField({
  value,
  onChange,
  placeholder = "Search",
  label,
  tone = "light",
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  /** Visually hidden accessible label; falls back to the placeholder. */
  label?: string;
  tone?: "light" | "onNavy";
  className?: string;
}) {
  const id = useId();
  return (
    <div className={cn("relative", className)}>
      <label htmlFor={id} className="sr-only">
        {label ?? placeholder}
      </label>
      <Search
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2",
          tone === "onNavy" ? "text-primary-foreground/70" : "text-muted-foreground",
        )}
      />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "h-12 w-full rounded-2xl pl-11 pr-4 text-[15px] outline-none transition-all duration-200",
          tone === "onNavy"
            ? "border border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/60 focus:border-primary-foreground/50 focus:ring-4 focus:ring-primary-foreground/15"
            : "border border-input bg-background text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:ring-4 focus:ring-primary/10",
        )}
      />
    </div>
  );
}
