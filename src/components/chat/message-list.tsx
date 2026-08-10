import { useEffect, useRef } from "react";
import type { Message } from "@/lib/chat-data";
import { isSameDay, formatDaySeparator } from "@/lib/chat-format";
import { MessageBubble } from "@/components/chat/message-bubble";

/** Scrollable message area with date separators and auto-scroll to newest. */
export function MessageList({ messages }: { messages: Message[] }) {
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
          const showDay = !prev || !isSameDay(prev.sentAt, message.sentAt);
          const tail = !next || next.authorId !== message.authorId;
          return (
            <li key={message.id} className="list-none">
              {showDay ? (
                <div className="my-3 flex justify-center">
                  <span className="rounded-full bg-surface px-3 py-1 text-[11px] font-bold text-muted-foreground">
                    {formatDaySeparator(message.sentAt)}
                  </span>
                </div>
              ) : null}
              <ul>
                <MessageBubble message={message} tail={tail} />
              </ul>
            </li>
          );
        })}
      </ul>
      <div ref={endRef} />
    </div>
  );
}
