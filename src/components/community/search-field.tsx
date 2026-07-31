import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function SearchField({
  value,
  onChange,
  placeholder = "Search",
  tone = "light",
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  tone?: "light" | "onNavy";
  className?: string;
}) {
  return (
    <label className={cn("relative block", className)}>
      <Search
        className={cn(
          "pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2",
          tone === "onNavy" ? "text-primary-foreground/70" : "text-muted-foreground",
        )}
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "h-12 w-full rounded-2xl pl-11 pr-4 text-[15px] outline-none transition-all duration-200",
          tone === "onNavy"
            ? "border border-primary-foreground/15 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/60 focus:border-primary-foreground/40"
            : "border border-input bg-background text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:ring-4 focus:ring-primary/10",
        )}
      />
    </label>
  );
}
