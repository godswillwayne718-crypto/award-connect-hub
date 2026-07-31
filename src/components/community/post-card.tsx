import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { ReactionBar } from "@/components/community/reaction-bar";
import { initials, type CommunityPost } from "@/lib/community-data";
import { cn } from "@/lib/utils";

function Poll({ body }: { body: Extract<CommunityPost["body"], { type: "poll" }> }) {
  const [choice, setChoice] = useState<string | null>(null);
  const total = body.options.reduce((s, o) => s + o.votes, 0) + (choice ? 1 : 0);

  return (
    <div className="mt-3 rounded-2xl border border-border bg-surface p-3">
      <p className="mb-2.5 text-[13px] font-bold text-foreground">{body.question}</p>
      <div className="space-y-2">
        {body.options.map((o) => {
          const votes = o.votes + (choice === o.id ? 1 : 0);
          const pct = total ? Math.round((votes / total) * 100) : 0;
          const picked = choice === o.id;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => setChoice(picked ? null : o.id)}
              className={cn(
                "relative block w-full overflow-hidden rounded-xl border px-3 py-2.5 text-left transition-all duration-200 active:scale-[0.99]",
                picked ? "border-primary bg-card" : "border-border bg-card hover:border-primary/40",
              )}
            >
              <span
                className={cn(
                  "absolute inset-y-0 left-0 transition-all duration-500 ease-out",
                  picked ? "bg-primary-soft" : "bg-muted",
                )}
                style={{ width: choice ? `${pct}%` : "0%" }}
              />
              <span className="relative flex items-center justify-between gap-3">
                <span
                  className={cn(
                    "text-[13px] font-semibold",
                    picked ? "text-primary" : "text-foreground",
                  )}
                >
                  {o.label}
                </span>
                {choice ? (
                  <span className="text-[12px] font-bold text-muted-foreground">{pct}%</span>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
      <p className="mt-2.5 text-[11.5px] text-muted-foreground">
        {total.toLocaleString()} votes · Poll preview
      </p>
    </div>
  );
}

export function PostCard({ post, style }: { post: CommunityPost; style?: React.CSSProperties }) {
  return (
    <article
      style={style}
      className="animate-fade-up rounded-3xl border border-border bg-card p-4 shadow-soft"
    >
      <header className="flex items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary-soft font-display text-sm font-extrabold text-primary">
          {initials(post.author)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-bold text-foreground">{post.author}</p>
          <p className="truncate text-[12px] text-muted-foreground">
            {post.authorMeta} · {post.time}
          </p>
        </div>
        <button
          type="button"
          aria-label="Post options"
          className="grid size-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
        >
          <MoreHorizontal className="size-[18px]" />
        </button>
      </header>

      <p className="mt-3 text-[14px] leading-relaxed text-foreground">{post.text}</p>

      {post.body.type === "image" ? (
        <img
          src={post.body.image}
          alt={post.body.alt}
          loading="lazy"
          width={1200}
          height={800}
          className="mt-3 aspect-[3/2] w-full rounded-2xl object-cover"
        />
      ) : null}

      {post.body.type === "poll" ? <Poll body={post.body} /> : null}

      <ReactionBar counts={post.reactions} comments={post.comments} shares={post.shares} />
    </article>
  );
}
