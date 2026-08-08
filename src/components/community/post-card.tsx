import { MoreHorizontal } from "lucide-react";
import { Avatar } from "@/components/community/avatar";
import { ReactionBar } from "@/components/community/reaction-bar";
import { type CommunityPost } from "@/lib/community-data";
import { setPollVote, usePollVote } from "@/lib/community-store";
import { cn } from "@/lib/utils";

function Poll({
  postId,
  body,
}: {
  postId: string;
  body: Extract<CommunityPost["body"], { type: "poll" }>;
}) {
  const choice = usePollVote(postId);
  const total = body.options.reduce((s, o) => s + o.votes, 0) + (choice ? 1 : 0);

  return (
    <div className="mt-3 rounded-2xl border border-border bg-surface p-3">
      <p className="mb-2.5 text-[13px] font-bold text-foreground" id={`poll-${postId}`}>
        {body.question}
      </p>
      <div className="space-y-2" role="group" aria-labelledby={`poll-${postId}`}>
        {body.options.map((o) => {
          const votes = o.votes + (choice === o.id ? 1 : 0);
          const pct = total ? Math.round((votes / total) * 100) : 0;
          const picked = choice === o.id;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => setPollVote(postId, o.id)}
              aria-pressed={picked}
              className={cn(
                "relative block min-h-11 w-full overflow-hidden rounded-xl border px-3 py-2.5 text-left transition-all duration-200 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20",
                picked ? "border-primary bg-card" : "border-border bg-card hover:border-primary/40",
              )}
            >
              <span
                aria-hidden="true"
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
      <p className="mt-2.5 text-[11.5px] text-muted-foreground" aria-live="polite">
        {total.toLocaleString()} votes {choice ? "· Your vote is counted" : "· Tap to vote"}
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
        <Avatar name={post.author} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-bold text-foreground">{post.author}</p>
          <p className="truncate text-[12px] text-muted-foreground">
            {post.authorMeta} · {post.time}
          </p>
        </div>
        <button
          type="button"
          aria-label={`Options for post by ${post.author}`}
          className="grid size-11 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
        >
          <MoreHorizontal className="size-[18px]" aria-hidden="true" />
        </button>
      </header>

      <p className="mt-3 whitespace-pre-wrap break-words text-[14px] leading-relaxed text-foreground">
        {post.text}
      </p>

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

      {post.body.type === "poll" ? <Poll postId={post.id} body={post.body} /> : null}

      <ReactionBar
        postId={post.id}
        counts={post.reactions}
        comments={post.comments}
        shares={post.shares}
        title={`${post.author}'s post`}
      />
    </article>
  );
}
