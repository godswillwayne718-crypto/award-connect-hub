import { useEffect, useRef } from "react";
import { Check, CheckCheck, Phone, PhoneMissed, Video } from "lucide-react";
import type { DbMessage } from "@/lib/messaging";
import { formatDaySeparator, formatMessageTime, isSameDay } from "@/lib/chat-format";
import { useSignedUrl } from "@/lib/media";
import { cn } from "@/lib/utils";

function callSummary(message: DbMessage) {
  const mode = message.call_mode === "video" ? "Video call" : "Voice call";
  if (message.call_outcome !== "completed") return `${mode} · no answer`;
  const total = message.duration_sec ?? 0;
  return `${mode} · ${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

function VoiceBubble({ path, seconds }: { path: string; seconds: number }) {
  const { data: url } = useSignedUrl(path);
  return (
    <span className="flex items-center gap-2">
      {url ? (
        <audio src={url} controls className="h-9 max-w-[210px]" />
      ) : (
        <span className="text-[13px] font-semibold opacity-80">Loading voice note…</span>
      )}
      <span className="text-[11px] font-bold opacity-80">
        {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}
      </span>
    </span>
  );
}

function Bubble({ message, mine, tail }: { message: DbMessage; mine: boolean; tail: boolean }) {
  if (message.kind === "call") {
    const missed = message.call_outcome !== "completed";
    const Icon = missed ? PhoneMissed : message.call_mode === "video" ? Video : Phone;
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
          <span className="font-semibold opacity-70">{formatMessageTime(message.created_at)}</span>
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
        {message.kind === "voice" ? (
          <VoiceBubble path={message.body} seconds={message.duration_sec ?? 0} />
        ) : (
          <p className="whitespace-pre-wrap text-[14.5px] leading-relaxed">{message.body}</p>
        )}
        <span
          className={cn(
            "mt-1 flex items-center justify-end gap-1 text-[10.5px] font-semibold",
            mine ? "text-primary-foreground/70" : "text-muted-foreground",
          )}
        >
          {formatMessageTime(message.created_at)}
          {mine ? (
            message.read_at ? (
              <CheckCheck className="size-3.5 text-gold" aria-label="Read" role="img" />
            ) : (
              <Check className="size-3.5" aria-label="Sent" role="img" />
            )
          ) : null}
        </span>
      </div>
    </li>
  );
}

/** Scrollable conversation backed by persistent backend messages. */
export function DbMessageList({ messages, me }: { messages: DbMessage[]; me: string }) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4">
      <ul className="space-y-2" aria-live="polite" aria-relevant="additions">
        {messages.map((message, i) => {
          const prev = messages[i - 1];
          const next = messages[i + 1];
          const showDay = !prev || !isSameDay(prev.created_at, message.created_at);
          const tail = !next || next.sender_id !== message.sender_id;
          return (
            <li key={message.id} className="list-none">
              {showDay ? (
                <div className="my-3 flex justify-center">
                  <span className="rounded-full bg-surface px-3 py-1 text-[11px] font-bold text-muted-foreground">
                    {formatDaySeparator(message.created_at)}
                  </span>
                </div>
              ) : null}
              <ul>
                <Bubble message={message} mine={message.sender_id === me} tail={tail} />
              </ul>
            </li>
          );
        })}
      </ul>
      <div ref={endRef} />
    </div>
  );
}
