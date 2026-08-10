import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { MobileShell } from "@/components/tian/mobile-shell";
import { ParticipantSearch } from "@/components/chat/participant-search";
import { startChat } from "@/lib/chat-store";

export const Route = createFileRoute("/chats/new")({
  head: () => ({
    meta: [
      { title: "New chat — TIAN" },
      {
        name: "description",
        content: "Find an Award member by @username and start a private TIAN conversation.",
      },
      { property: "og:title", content: "New chat — TIAN" },
      { property: "og:description", content: "Search Award members by @username." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NewChatScreen,
});

function NewChatScreen() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  return (
    <MobileShell tone="white">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/95 px-4 pb-3 pt-6 backdrop-blur">
        <Link
          to="/chats"
          aria-label="Back to chats"
          className="grid size-10 shrink-0 place-items-center rounded-full text-foreground transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        >
          <ChevronLeft className="size-5" />
        </Link>
        <div>
          <h1 className="font-display text-xl font-extrabold tracking-tight text-foreground">
            New chat
          </h1>
          <p className="text-[11.5px] text-muted-foreground">
            Search Award members by @username
          </p>
        </div>
      </header>

      <div className="px-4 py-4">
        <ParticipantSearch
          query={query}
          onQueryChange={setQuery}
          onStartChat={(participant) => {
            const chatId = startChat(participant.id);
            toast.success(`Chat with @${participant.username} opened`);
            void navigate({ to: "/chats/$chatId", params: { chatId } });
          }}
        />
      </div>
    </MobileShell>
  );
}
