import { useState } from "react";
import { Heart, MessageCircle, PartyPopper, Send, HandHeart } from "lucide-react";
import { cn } from "@/lib/utils";

type ReactionKey = "like" | "celebrate" | "support";

const REACTIONS: { key: ReactionKey; label: string; icon: typeof Heart; tone: string }[] = [
  { key: "like", label: "Like", icon: Heart, tone: "text-primary" },
  { key: "celebrate", label: "Celebrate", icon: PartyPopper, tone: "text-gold-foreground" },
  { key: "support", label: "Support", icon: HandHeart, tone: "text-accent" },
];

export function ReactionBar({
  counts,
  comments,
  shares,
}: {
  counts: Record<ReactionKey, number>;
  comments: number;
  shares: number;
}) {
  const [active, setActive] = useState<ReactionKey | null>(null);

  const total =
    counts.like + counts.celebrate + counts.support + (active ? 1 : 0);

  return (
    <div className="mt-3 border-t border-border pt-2">
      <div className="flex items-center justify-between px-1 pb-2 text-[11.5px] font-medium text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="grid size-4 place-items-center rounded-full bg-primary text-primary-foreground">
            <Heart className="size-2.5" />
          </span>
          <span className="grid size-4 place-items-center rounded-full bg-gold text-gold-foreground">
            <PartyPopper className="size-2.5" />
          </span>
          {total.toLocaleString()}
        </span>
        <span>
          {comments} comments · {shares} shares
        </span>
      </div>
      <div className="flex items-center justify-between border-t border-border pt-1">
        {REACTIONS.map(({ key, label, icon: Icon, tone }) => {
          const on = active === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActive(on ? null : key)}
              aria-pressed={on}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-[12px] font-semibold transition-all duration-200 active:scale-95",
                on ? cn(tone, "bg-muted") : "text-muted-foreground hover:bg-muted",
              )}
            >
              <Icon className={cn("size-[17px] transition-transform", on && "scale-110")} />
              {label}
            </button>
          );
        })}
        <button
          type="button"
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-[12px] font-semibold text-muted-foreground transition-all duration-200 hover:bg-muted active:scale-95"
        >
          <MessageCircle className="size-[17px]" />
          Comment
        </button>
        <button
          type="button"
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-[12px] font-semibold text-muted-foreground transition-all duration-200 hover:bg-muted active:scale-95"
        >
          <Send className="size-[17px]" />
          Share
        </button>
      </div>
    </div>
  );
}
