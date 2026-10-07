import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Contact } from "lucide-react";
import { AppScreen } from "@/components/tian/app-screen";
import { RequireAuth } from "@/components/tian/require-auth";
import { EmptyState } from "@/components/community/empty-state";
import { PeopleFinder } from "@/components/shared/people-finder";
import { ProfileRow } from "@/components/shared/profile-row";
import { StartChatButton } from "@/components/shared/start-chat-button";
import { DbContactButton } from "@/components/shared/db-contact-button";
import { useAuth } from "@/lib/auth";
import { useContacts } from "@/lib/social";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/contacts")({
  head: () => ({
    meta: [
      { title: "My Contacts — TIAN" },
      {
        name: "description",
        content: "Your TIAN contacts. Find Award members by @username, view their profile and start a chat.",
      },
      { property: "og:title", content: "My Contacts — TIAN" },
      { property: "og:description", content: "Connect with Award members by @username." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <RequireAuth>
      <ContactsScreen />
    </RequireAuth>
  ),
});

function ContactsScreen() {
  const { userId } = useAuth();
  const contacts = useContacts(userId);
  const list = contacts.data ?? [];
  const [tab, setTab] = useState<"contacts" | "find">("contacts");
  const [findQuery, setFindQuery] = useState("");

  return (
    <AppScreen width="wide">
      <header className="sticky top-0 z-20 border-b border-border bg-background/95 px-5 pb-3 pt-6 backdrop-blur">
        <div className="flex items-center gap-3">
          <h1 className="truncate font-display text-2xl font-extrabold tracking-tight text-foreground">My Contacts</h1>
          <span className="rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-bold text-primary">{list.length}</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-1 rounded-full bg-surface p-1" role="tablist">
          {(["contacts", "find"] as const).map((value) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={tab === value}
              onClick={() => setTab(value)}
              className={cn(
                "h-10 rounded-full text-[13px] font-bold transition-colors",
                tab === value ? "bg-card text-foreground shadow-sm" : "text-muted-foreground",
              )}
            >
              {value === "contacts" ? "Contacts" : "Find people"}
            </button>
          ))}
        </div>
      </header>

      <div className="px-4 py-4">
        {tab === "find" ? (
          <PeopleFinder
            query={findQuery}
            onQueryChange={setFindQuery}
            renderActions={(p) => (
              <>
                <DbContactButton profile={p} />
                <StartChatButton profile={p} />
              </>
            )}
          />
        ) : contacts.isLoading ? (
          <p className="py-6 text-center text-sm text-muted-foreground">Loading contacts…</p>
        ) : list.length === 0 ? (
          <EmptyState icon={Contact} title="No contacts yet" copy="Use Find people to search members by @username." />
        ) : (
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {list.map((p) => (
              <ProfileRow key={p.id} profile={p} actions={<StartChatButton profile={p} />} />
            ))}
          </ul>
        )}
      </div>
    </AppScreen>
  );
}
