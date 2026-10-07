import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Contact, MessagesSquare, PenSquare, SearchX } from "lucide-react";
import { AppScreen } from "@/components/tian/app-screen";
import { SearchField } from "@/components/community/search-field";
import { InboxRow } from "@/components/chat/inbox-row";
import { ChatEmptyState } from "@/components/chat/chat-empty-state";
import { RequireAuth } from "@/components/tian/require-auth";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useInbox } from "@/lib/messaging";

export const Route = createFileRoute("/chats/")({
  head: () => ({
    meta: [
      { title: "Chats — TIAN" },
      {
        name: "description",
        content:
          "Your TIAN conversations with Award participants, leaders, assessors and alumni around the world.",
      },
      { property: "og:title", content: "Chats — TIAN" },
      { property: "og:description", content: "Private messaging for the Award community." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <RequireAuth>
      <ChatsInbox />
    </RequireAuth>
  ),
});

function ChatsInbox() {
  const { userId } = useAuth();
  const me = userId!;
  const [query, setQuery] = useState("");
  const inbox = useInbox(me);
  const entries = inbox.data ?? [];
  const unread = entries.reduce((n, e) => n + e.unread, 0);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/^@/, "");
    if (!q) return entries;
    return entries.filter(
      (e) =>
        e.other.full_name.toLowerCase().includes(q) ||
        e.other.username.toLowerCase().includes(q) ||
        (e.lastMessage?.body.toLowerCase().includes(q) ?? false),
    );
  }, [entries, query]);

  return (
    <AppScreen>
      <header className="sticky top-0 z-20 border-b border-border bg-background/95 px-5 pb-3 pt-6 backdrop-blur">
        <div className="flex items-center gap-2">
          <h1 className="min-w-0 truncate font-display text-2xl font-extrabold tracking-tight text-foreground">
            Chats
          </h1>
          {unread > 0 ? (
            <span className="shrink-0 rounded-full bg-accent px-2 py-0.5 text-[11px] font-bold text-accent-foreground">
              {unread} new
            </span>
          ) : null}
          <Button asChild size="sm" variant="ghost" className="ml-auto size-11 shrink-0 rounded-full p-0">
            <Link to="/contacts" aria-label="My contacts">
              <Contact className="size-4" />
            </Link>
          </Button>
          <Button asChild size="sm" variant="soft" className="size-11 shrink-0 rounded-full p-0">
            <Link to="/chats/new" aria-label="New chat">
              <PenSquare className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-3">
          <SearchField
            value={query}
            onChange={setQuery}
            label="Search conversations"
            placeholder="Search name, @username or message"
          />
        </div>
      </header>

      <div className="px-2 py-3">
        {inbox.isLoading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Loading chats…</p>
        ) : inbox.isError ? (
          <p className="py-8 text-center text-sm text-destructive">Couldn't load chats. Check your connection.</p>
        ) : visible.length > 0 ? (
          <ul className="space-y-1">
            {visible.map((e, i) => (
              <InboxRow key={e.conversation.id} entry={e} me={me} index={i} />
            ))}
          </ul>
        ) : (
          <div className="px-3 pt-6">
            {entries.length === 0 ? (
              <ChatEmptyState
                icon={MessagesSquare}
                title="No conversations yet"
                copy="Search a member by @username to start chatting."
                action={
                  <Button asChild size="pillAuto" variant="default">
                    <Link to="/chats/new">Start Chat</Link>
                  </Button>
                }
              />
            ) : (
              <ChatEmptyState icon={SearchX} title="No chats match" copy="Try another name or @username." />
            )}
          </div>
        )}
      </div>
    </AppScreen>
  );
}
