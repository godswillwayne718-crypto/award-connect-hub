import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, BarChart3, FileUp, ImagePlus, X } from "lucide-react";
import { toast } from "sonner";
import { Avatar } from "@/components/community/avatar";
import { MobileShell } from "@/components/tian/mobile-shell";
import { COMMUNITIES, type CommunityPost } from "@/lib/community-data";
import { addDraftPost, useJoined } from "@/lib/community-store";
import { useProfile } from "@/lib/tian-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/community/create-post")({
  validateSearch: (search: Record<string, unknown>) => ({
    community: typeof search.community === "string" ? search.community : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Create a post — TIAN" },
      {
        name: "description",
        content: "Share an update, photo or poll with your Award communities on TIAN.",
      },
      { property: "og:title", content: "Create a post — TIAN" },
      { property: "og:description", content: "Post to your Award communities." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CreatePost,
});

function CreatePost() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const profile = useProfile();
  const joinedIds = useJoined();
  const joinedOptions = COMMUNITIES.filter((c) => joinedIds.includes(c.id));
  const options = joinedOptions.length ? joinedOptions : COMMUNITIES;
  const fallback = options[0]!.id;

  const [community, setCommunity] = useState(search.community ?? fallback);
  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [poll, setPoll] = useState<string[] | null>(null);

  const trimmed = text.trim();
  const canPublish = trimmed.length > 0 && Boolean(community);

  function addAttachment(label: string) {
    setAttachments((a) => [...a, label]);
    toast.info(`${label} attachment is a preview only for now.`);
  }

  function publish() {
    if (!canPublish) {
      toast.error("Write something before publishing.");
      return;
    }
    const pollOptions = (poll ?? []).map((v) => v.trim()).filter(Boolean);
    const post: CommunityPost = {
      id: `local-${Date.now()}`,
      communityId: community,
      author: profile.fullName || "TIAN Member",
      authorMeta: `${profile.role || "Participant"}${profile.country ? ` · ${profile.country}` : ""}`,
      time: "Just now",
      text: trimmed,
      body:
        pollOptions.length >= 2
          ? {
              type: "poll",
              question: "Community poll",
              options: pollOptions.map((label, i) => ({ id: `lo-${i}`, label, votes: 0 })),
            }
          : { type: "text" },
      reactions: { like: 0, celebrate: 0, support: 0 },
      comments: 0,
      shares: 0,
    };
    addDraftPost(post);
    toast.success("Post published to your community.");
    navigate({ to: "/community/$communityId", params: { communityId: community } });
  }

  return (
    <MobileShell tone="white">
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
          <button
            type="button"
            onClick={() => navigate({ to: "/community" })}
            aria-label="Cancel and return to communities"
            className="grid size-11 place-items-center rounded-full text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
          >
            <ArrowLeft className="size-[18px]" aria-hidden="true" />
          </button>
          <h1 className="flex-1 font-display text-[16px] font-extrabold tracking-tight text-foreground">
            Create post
          </h1>
          <button
            type="button"
            disabled={!canPublish}
            onClick={publish}
            className="min-h-11 rounded-full bg-primary px-4 text-[13px] font-bold text-primary-foreground transition-all duration-200 active:scale-95 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
          >
            Publish
          </button>
        </header>

        <div className="flex-1 px-5 py-4">
          <div className="flex items-center gap-3">
            <Avatar name={profile.fullName || "TIAN Member"} />
            <label className="min-w-0 flex-1">
              <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                Posting to
              </span>
              <select
                value={community}
                onChange={(e) => setCommunity(e.target.value)}
                className="h-11 w-full rounded-xl border border-input bg-background px-3 text-[13.5px] font-semibold text-foreground outline-none transition-colors focus:border-primary focus:ring-4 focus:ring-primary/10"
              >
                {options.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label htmlFor="post-text" className="sr-only">
            Post text
          </label>
          <textarea
            id="post-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={7}
            placeholder="Share an update, a milestone or a question with the community…"
            className="mt-4 w-full resize-none rounded-2xl border border-input bg-background p-4 text-[15px] leading-relaxed text-foreground outline-none transition-all duration-200 placeholder:text-muted-foreground/70 focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
          <p className="mt-1.5 px-1 text-[11.5px] text-muted-foreground" aria-live="polite">
            {canPublish ? `${trimmed.length} characters` : "Add some text to enable publishing."}
          </p>

          {attachments.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {attachments.map((a, i) => (
                <span
                  key={`${a}-${i}`}
                  className="animate-pop flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-[12px] font-semibold text-foreground"
                >
                  {a}
                  <button
                    type="button"
                    aria-label={`Remove ${a} attachment`}
                    onClick={() => setAttachments((list) => list.filter((_, idx) => idx !== i))}
                  >
                    <X className="size-3.5 text-muted-foreground" aria-hidden="true" />
                  </button>
                </span>
              ))}
            </div>
          ) : null}

          {poll ? (
            <div className="animate-fade-up mt-4 rounded-2xl border border-border bg-surface p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[12.5px] font-extrabold text-foreground">Poll</span>
                <button
                  type="button"
                  onClick={() => setPoll(null)}
                  className="min-h-11 text-[12px] font-semibold text-muted-foreground"
                >
                  Remove
                </button>
              </div>
              <div className="space-y-2">
                {poll.map((opt, i) => (
                  <input
                    key={i}
                    value={opt}
                    aria-label={`Poll option ${i + 1}`}
                    placeholder={`Option ${i + 1}`}
                    onChange={(e) =>
                      setPoll((p) => p!.map((v, idx) => (idx === i ? e.target.value : v)))
                    }
                    className="h-11 w-full rounded-xl border border-input bg-card px-3 text-[13.5px] outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => setPoll((p) => [...p!, ""])}
                className="mt-2 min-h-11 text-[12.5px] font-bold text-primary"
              >
                + Add option
              </button>
            </div>
          ) : null}

          <div className="mt-5 grid grid-cols-3 gap-2">
            <AttachButton
              icon={ImagePlus}
              label="Photo"
              tone="accent"
              onClick={() => addAttachment("Photo")}
            />
            <AttachButton
              icon={FileUp}
              label="File"
              tone="primary"
              onClick={() => addAttachment("File")}
            />
            <AttachButton
              icon={BarChart3}
              label="Poll"
              tone="gold"
              onClick={() => setPoll(poll ? poll : ["", ""])}
            />
          </div>
        </div>

        <div className="sticky bottom-0 border-t border-border bg-background/95 px-5 py-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] backdrop-blur">
          <button
            type="button"
            disabled={!canPublish}
            onClick={publish}
            className="h-13 w-full rounded-2xl bg-navy-gradient text-[15px] font-bold text-primary-foreground shadow-lift transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:shadow-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
          >
            Publish post
          </button>
        </div>
      </div>
    </MobileShell>
  );
}

const tones = {
  primary: "bg-primary-soft text-primary",
  accent: "bg-accent-soft text-accent",
  gold: "bg-gold-soft text-gold-foreground",
} as const;

function AttachButton({
  icon: Icon,
  label,
  tone,
  onClick,
}: {
  icon: typeof ImagePlus;
  label: string;
  tone: keyof typeof tones;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-h-11 flex-col items-center gap-1.5 rounded-2xl border border-border bg-card py-3 text-[12px] font-bold text-foreground transition-all duration-200 hover:shadow-soft active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20",
      )}
    >
      <span className={cn("grid size-9 place-items-center rounded-xl", tones[tone])}>
        <Icon className="size-[18px]" aria-hidden="true" />
      </span>
      {label}
    </button>
  );
}
