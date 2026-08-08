import { useState } from "react";
import { Heart, MessageCircle, PartyPopper, Send, HandHeart } from "lucide-react";
import { toast } from "sonner";
import { setReaction, useReaction, type ReactionKey } from "@/lib/community-store";
import { cn } from "@/lib/utils";

const REACTIONS: { key: ReactionKey; label: string; icon: typeof Heart; tone: string }[] = [
  { key: "like", label: "Like", icon: Heart, tone: "text-primary" },
  { key: "celebrate", label: "Celebrate", icon: PartyPopper, tone: "text-gold-foreground" },
  { key: "support", label: "Support", icon: HandHeart, tone: "text-accent" },
];

const actionClass =
  "flex min-h-11 flex-1 items-center justify-center gap-1 rounded-xl px-1 py-2 text-[10.5px] font-semibold transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20";

export function ReactionBar({
  postId,
  counts,
  comments,
  shares,
  title,
}: {
  postId: string;
  counts: Record<ReactionKey, number>;
  comments: number;
  shares: number;
  title: string;
}) {
  const active = useReaction(postId);
  const [commenting, setCommenting] = useState(false);

  const total = counts.like + counts.celebrate + counts.support + (active ? 1 : 0);

  async function share() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to your clipboard.");
    } catch {
      toast.info("Sharing was cancelled.");
    }
  }

  return (
    <div className="mt-3 border-t border-border pt-2">
      <div className="flex items-center justify-between gap-2 px-1 pb-2 text-[11.5px] font-medium text-muted-foreground">
        <span className="flex items-center gap-1" aria-live="polite">
          <span
            aria-hidden="true"
            className="grid size-4 place-items-center rounded-full bg-primary text-primary-foreground"
          >
            <Heart className="size-2.5" />
          </span>
          <span
            aria-hidden="true"
            className="grid size-4 place-items-center rounded-full bg-gold text-gold-foreground"
          >
            <PartyPopper className="size-2.5" />
          </span>
          {total.toLocaleString()} reactions
        </span>
        <span className="shrink-0">
          {comments} comments · {shares} shares
        </span>
      </div>
      <div className="flex items-center justify-between gap-0.5 border-t border-border pt-1">
        {REACTIONS.map(({ key, label, icon: Icon, tone }) => {
          const on = active === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setReaction(postId, key)}
              aria-pressed={on}
              aria-label={`${label} ${title}`}
              className={cn(actionClass, on ? cn(tone, "bg-muted") : "text-muted-foreground hover:bg-muted")}
            >
              <Icon className={cn("size-4 transition-transform", on && "scale-110")} aria-hidden="true" />
              {label}
            </button>
          );
        })}
        <button
          type="button"
          aria-pressed={commenting}
          aria-label={`Comment on ${title}`}
          onClick={() => {
            setCommenting((c) => !c);
            toast.info("Comments are coming soon.");
          }}
          className={cn(
            actionClass,
            commenting ? "bg-muted text-primary" : "text-muted-foreground hover:bg-muted",
          )}
        >
          <MessageCircle className="size-4" aria-hidden="true" />
          Comment
        </button>
        <button
          type="button"
          onClick={share}
          aria-label={`Share ${title}`}
          className={cn(actionClass, "text-muted-foreground hover:bg-muted")}
        >
          <Send className="size-4" aria-hidden="true" />
          Share
        </button>
      </div>
    </div>
  );
}
