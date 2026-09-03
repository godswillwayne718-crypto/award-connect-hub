import { Check, CheckCheck, Phone, PhoneMissed, Video } from "lucide-react";
import type { Message } from "@/lib/chat-data";
import { ME } from "@/lib/chat-data";
import { formatMessageTime } from "@/lib/chat-format";
import { VoiceMessage } from "@/components/chat/voice-message";
import { cn } from "@/lib/utils";

function callSummary(message: Message) {
  const mode = message.call?.mode === "video" ? "Video call" : "Voice call";
  if (message.call?.outcome !== "completed") return `${mode} · no answer`;
  const total = message.durationSec ?? 0;
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${mode} · ${m}:${String(s).padStart(2, "0")}`;
}

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
  const kind = message.kind ?? "text";

  if (kind === "call") {
    const missed = message.call?.outcome !== "completed";
    const Icon = missed ? PhoneMissed : message.call?.mode === "video" ? Video : Phone;
    return (
      <li className="animate-fade-up flex justify-center">
        <span
          className={cn(
            "flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 text-[11.5px] font-bold",
            missed ? "text-destructive" : "text-muted-foreground",
          )}
        >
          <Icon className="size-3.5" aria-hidden="true" />
          {callSummary(message)}
          <span className="font-semibold opacity-70">{formatMessageTime(message.sentAt)}</span>
        </span>
      </li>
    );
  }

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
        {kind === "voice" ? (
          <VoiceMessage message={message} mine={mine} />
        ) : (
          <p className="whitespace-pre-wrap text-[14.5px] leading-relaxed">{message.body}</p>
        )}
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
