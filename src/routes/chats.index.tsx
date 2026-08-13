import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Contact, MessagesSquare, PenSquare, SearchX } from "lucide-react";
import { AppScreen } from "@/components/tian/app-screen";
import { SearchField } from "@/components/community/search-field";
import { ChatList } from "@/components/chat/chat-list";
import { ChatEmptyState } from "@/components/chat/chat-empty-state";
import { Button } from "@/components/ui/button";
import { participantOf, lastMessage, sortChats, useChats, useUnreadTotal } from "@/lib/chat-store";

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
  component: ChatsInbox,
});

function ChatsInbox() {
  const [query, setQuery] = useState("");
  const chats = useChats();
  const unread = useUnreadTotal();

  const visible = useMemo(() => {
    const sorted = sortChats(chats);
    const q = query.trim().toLowerCase().replace(/^@/, "");
    if (!q) return sorted;
    return sorted.filter((chat) => {
      const p = participantOf(chat);
      const last = lastMessage(chat);
      return (
        !!p &&
        (p.name.toLowerCase().includes(q) ||
          p.username.toLowerCase().includes(q) ||
          (last?.body.toLowerCase().includes(q) ?? false))
      );
    });
  }, [chats, query]);

  return (
    <AppScreen>
      <header className="sticky top-0 z-20 border-b border-border bg-background/95 px-5 pb-3 pt-6 backdrop-blur">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
            Chats
          </h1>
          {unread > 0 ? (
            <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-bold text-accent-foreground">
              {unread} new
            </span>
          ) : null}
          <Button
            asChild
            size="sm"
            variant="ghost"
            className="ml-auto h-11 rounded-full px-3 text-xs"
          >
            <Link to="/contacts" aria-label="My contacts">
              <Contact className="size-4" /> Contacts
            </Link>
          </Button>
          <Button asChild size="sm" variant="soft" className="h-11 rounded-full px-4 text-xs">
            <Link to="/chats/new">
              <PenSquare className="size-4" /> New Chat
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
        {visible.length > 0 ? (
          <ChatList chats={visible} />
        ) : (
          <div className="px-3 pt-6">
            {chats.length === 0 ? (
              <ChatEmptyState
                icon={MessagesSquare}
                title="No conversations yet"
                copy="Start a conversation with another Award member."
                action={
                  <Button asChild size="pillAuto" variant="default">
                    <Link to="/chats/new">Start Chat</Link>
                  </Button>
                }
              />
            ) : (
              <ChatEmptyState
                icon={SearchX}
                title="No chats match"
                copy="Try another name, @username or keyword from a message."
              />
            )}
          </div>
        )}
      </div>
    </AppScreen>
  );
}
