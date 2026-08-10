import { useEffect, useRef, useState } from "react";
import { Paperclip, Send, Smile } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/**
 * Auto-growing composer. Enter sends on desktop, Shift+Enter adds a newline.
 * Attachments and emoji are placeholders for the MVP.
 */
export function MessageComposer({
  onSend,
  disabled = false,
  disabledCopy,
}: {
  onSend: (body: string) => void;
  disabled?: boolean;
  disabledCopy?: string;
}) {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 132)}px`;
  }, [value]);

  const send = () => {
    const body = value.trim();
    if (!body || disabled) return;
    onSend(body);
    setValue("");
  };

  if (disabled) {
    return (
      <div className="border-t border-border bg-card px-5 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] text-center text-[13px] font-semibold text-muted-foreground">
        {disabledCopy ?? "You can't send messages in this conversation."}
      </div>
    );
  }

  return (
    <div className="border-t border-border bg-card px-3 py-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))]">
      <div className="flex items-end gap-1.5">
        <button
          type="button"
          aria-label="Add attachment"
          onClick={() => toast("Attachments coming soon")}
          className="grid size-11 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-surface hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        >
          <Paperclip className="size-[19px]" />
        </button>
        <div className="flex min-w-0 flex-1 items-end rounded-3xl border border-input bg-background transition-colors focus-within:border-primary">
          <label htmlFor="chat-composer" className="sr-only">
            Write a message
          </label>
          <textarea
            id="chat-composer"
            ref={ref}
            rows={1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="Write a message"
            className="max-h-[132px] min-h-11 w-full resize-none bg-transparent px-4 py-3 text-[15px] leading-snug text-foreground outline-none placeholder:text-muted-foreground/70"
          />
          <button
            type="button"
            aria-label="Add emoji"
            onClick={() => toast("Emoji picker coming soon")}
            className="grid size-11 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
          >
            <Smile className="size-[19px]" />
          </button>
        </div>
        <button
          type="button"
          aria-label="Send message"
          onClick={send}
          disabled={!value.trim()}
          className={cn(
            "grid size-11 shrink-0 place-items-center rounded-full transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
            value.trim()
              ? "bg-primary text-primary-foreground shadow-lift"
              : "cursor-not-allowed bg-surface text-muted-foreground",
          )}
        >
          <Send className="size-[18px]" />
        </button>
      </div>
    </div>
  );
}
