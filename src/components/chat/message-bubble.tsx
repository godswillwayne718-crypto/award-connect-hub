import { Check, CheckCheck } from "lucide-react";
import type { Message } from "@/lib/chat-data";
import { ME } from "@/lib/chat-data";
import { formatMessageTime } from "@/lib/chat-format";
import { cn } from "@/lib/utils";

/** Rounded conversation bubble with timestamp and delivery state. */
export function MessageBubble({
  message,
  tail = true,
}: {
  message: Message;
  /** Last message of a run gets the tail corner. */
  tail?: boolean;
}) {
  const mine = message.authorId === ME;
  return (
    <li className={cn("animate-fade-up flex", mine ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[82%] break-words rounded-3xl px-4 py-2.5 shadow-soft sm:max-w-[70%]",
          mine
            ? "bg-primary text-primary-foreground"
            : "border border-border bg-card text-foreground",
          tail && (mine ? "rounded-br-lg" : "rounded-bl-lg"),
        )}
      >
        <p className="whitespace-pre-wrap text-[14.5px] leading-relaxed">{message.body}</p>
        <span
          className={cn(
            "mt-1 flex items-center justify-end gap-1 text-[10.5px] font-semibold",
            mine ? "text-primary-foreground/70" : "text-muted-foreground",
          )}
        >
          {formatMessageTime(message.sentAt)}
          {mine ? (
            message.status === "read" ? (
              <CheckCheck className="size-3.5 text-gold" aria-label="Read" role="img" />
            ) : message.status === "delivered" ? (
              <CheckCheck className="size-3.5" aria-label="Delivered" role="img" />
            ) : (
              <Check className="size-3.5" aria-label="Sent" role="img" />
            )
          ) : null}
        </span>
      </div>
    </li>
  );
}
