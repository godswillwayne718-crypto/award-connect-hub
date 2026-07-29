import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const base =
  "w-full rounded-2xl border border-input bg-background px-4 text-[15px] text-foreground placeholder:text-muted-foreground/70 outline-none transition-all duration-200 focus:border-primary focus:ring-4 focus:ring-primary/10";

export function Field({
  label,
  hint,
  icon,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string; icon?: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-foreground">{label}</span>
      <span className="relative block">
        {icon ? (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground [&_svg]:size-[18px]">
            {icon}
          </span>
        ) : null}
        <input className={cn(base, "h-13 py-3.5", icon && "pl-11", className)} {...props} />
      </span>
      {hint ? <span className="mt-1.5 block text-xs text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

export function TextField({
  label,
  hint,
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-foreground">{label}</span>
      <textarea className={cn(base, "min-h-28 py-3.5 leading-relaxed", className)} {...props} />
      {hint ? <span className="mt-1.5 block text-xs text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

export function SelectCard({
  title,
  description,
  selected,
  onSelect,
  icon,
}: {
  title: string;
  description?: string;
  selected: boolean;
  onSelect: () => void;
  icon?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "press flex w-full items-center gap-3 rounded-2xl border bg-card p-3.5 text-left",
        selected
          ? "border-accent bg-accent-soft shadow-soft"
          : "border-border hover:border-primary/30 hover:shadow-soft",
      )}
    >
      {icon ? (
        <span
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-xl transition-colors [&_svg]:size-[18px]",
            selected ? "bg-accent text-accent-foreground" : "bg-primary-soft text-primary",
          )}
        >
          {icon}
        </span>
      ) : null}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-bold text-foreground">{title}</span>
        {description ? (
          <span className="block truncate text-xs text-muted-foreground">{description}</span>
        ) : null}
      </span>
      <span
        className={cn(
          "size-5 shrink-0 rounded-full border-2 transition-colors",
          selected ? "border-accent bg-accent" : "border-border",
        )}
      />
    </button>
  );
}

export function Chip({
  label,
  selected,
  onToggle,
}: {
  label: string;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "press rounded-full border px-3.5 py-2 text-xs font-semibold",
        selected
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground",
      )}
    >
      {label}
    </button>
  );
}
