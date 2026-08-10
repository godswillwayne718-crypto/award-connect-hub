import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { EmptyState } from "@/components/community/empty-state";

/** Thin wrapper so chat screens share the community empty-state styling. */
export function ChatEmptyState({
  icon,
  title,
  copy,
  action,
}: {
  icon: LucideIcon;
  title: string;
  copy: string;
  action?: ReactNode;
}) {
  return <EmptyState icon={icon} title={title} copy={copy} action={action} />;
}
