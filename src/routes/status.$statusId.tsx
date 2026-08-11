import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UsernameBadge } from "@/components/shared/username-badge";
import { PersonAvatar } from "@/components/shared/person-avatar";
import { formatChatStamp } from "@/lib/chat-format";
import { backgroundClass } from "@/lib/status-data";
import { authorOf, findStatus, markStatusViewed, useMyStatuses } from "@/lib/status-store";
import { startChat } from "@/lib/chat-store";

export const Route = createFileRoute("/status/$statusId")({
  head: () => ({
    meta: [
      { title: "Status update — TIAN" },
      {
        name: "description",
        content: "View a 24-hour Award status update from a TIAN member.",
      },
      { property: "og:title", content: "Status update — TIAN" },
      { property: "og:description", content: "A 24-hour Award update on TIAN." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: StatusViewer,
});

function StatusViewer() {
  const { statusId } = Route.useParams();
  const navigate = useNavigate();
  const mine = useMyStatuses();
  const status = findStatus(statusId, mine);
  const author = status ? authorOf(status) : undefined;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (status) markStatusViewed(status.id);
  }, [status?.id]);

  if (!status) {
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center gap-4 bg-background px-6 text-center">
        <p className="font-display text-lg font-extrabold text-foreground">Status unavailable</p>
        <p className="text-sm text-muted-foreground">This update has expired or was removed.</p>
        <Button asChild size="pillAuto" variant="default">
          <Link to="/status">Back to Status</Link>
        </Button>
      </div>
    );
  }

  const item = status.items[Math.min(index, status.items.length - 1)]!;
  const last = index >= status.items.length - 1;

  return (
    <div className="w-full bg-foreground/95">
      <div className="mx-auto flex h-dvh w-full max-w-md flex-col md:max-w-lg">
        <div className="flex items-center gap-1 px-3 pt-3">
          {status.items.map((_, i) => (
            <span
              key={i}
              className={`h-1 flex-1 rounded-full ${i <= index ? "bg-background" : "bg-background/30"}`}
            />
          ))}
        </div>

        <header className="flex items-center gap-3 px-4 py-3">
          <PersonAvatar name={author?.name ?? "TIAN member"} tone="navy" />
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-sm font-extrabold text-background">
              {author?.name ?? "My Status"}
            </p>
            {author ? (
              <UsernameBadge username={author.username} verified={author.verified} />
            ) : null}
            <p className="text-[11px] text-background/70">{formatChatStamp(status.createdAt)}</p>
          </div>
          <Link
            to="/status"
            aria-label="Close status"
            className="grid size-11 shrink-0 place-items-center rounded-full text-background hover:bg-background/10"
          >
            <X className="size-5" />
          </Link>
        </header>

        <div className="relative min-h-0 flex-1">
          {item.kind === "text" ? (
            <div
              className={`flex h-full items-center justify-center px-8 text-center text-xl font-extrabold ${backgroundClass(item.background)}`}
            >
              {item.caption}
            </div>
          ) : item.kind === "video" ? (
            <video src={item.src} controls playsInline className="h-full w-full object-contain" />
          ) : (
            <img src={item.src} alt={item.caption ?? ""} className="h-full w-full object-contain" />
          )}

          <button
            type="button"
            aria-label="Previous update"
            disabled={index === 0}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            className="absolute inset-y-0 left-0 grid w-1/4 place-items-start pl-2 text-background/0 focus-visible:text-background"
          >
            <ChevronLeft className="mt-auto mb-4 size-6" />
          </button>
          <button
            type="button"
            aria-label={last ? "Close status" : "Next update"}
            onClick={() => (last ? void navigate({ to: "/status" }) : setIndex((i) => i + 1))}
            className="absolute inset-y-0 right-0 grid w-1/4 place-items-end pr-2 text-background/0 focus-visible:text-background"
          >
            <ChevronRight className="mt-auto mb-4 size-6" />
          </button>
        </div>

        {item.kind !== "text" && item.caption ? (
          <p className="px-5 py-3 text-center text-sm font-semibold text-background">
            {item.caption}
          </p>
        ) : null}

        {author ? (
          <div className="px-4 pb-5 pt-2">
            <Button
              variant="default"
              size="pill"
              className="w-full"
              onClick={() => {
                const chatId = startChat(author.id);
                void navigate({ to: "/chats/$chatId", params: { chatId } });
              }}
            >
              <MessageCircle className="size-4" /> Reply to @{author.username}
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
