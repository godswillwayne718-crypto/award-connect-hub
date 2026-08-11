import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Contact, UserRoundSearch } from "lucide-react";
import { AppScreen } from "@/components/tian/app-screen";
import { SearchField } from "@/components/community/search-field";
import { EmptyState } from "@/components/community/empty-state";
import { ContactRow } from "@/components/shared/contact-row";
import { ParticipantSearch } from "@/components/shared/participant-search";
import { AddContactButton } from "@/components/shared/add-contact-button";
import { Button } from "@/components/ui/button";
import { useContacts } from "@/lib/contacts-store";
import { searchPeople } from "@/lib/people-data";

export const Route = createFileRoute("/contacts")({
  head: () => ({
    meta: [
      { title: "My Contacts — TIAN" },
      {
        name: "description",
        content:
          "Your TIAN contacts. Find Award members by @username, view their profile and start a chat — no phone numbers needed.",
      },
      { property: "og:title", content: "My Contacts — TIAN" },
      { property: "og:description", content: "Connect with Award members by @username." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ContactsScreen,
});

function ContactsScreen() {
  const contacts = useContacts();
  const [tab, setTab] = useState<"contacts" | "find">("contacts");
  const [query, setQuery] = useState("");
  const [findQuery, setFindQuery] = useState("");

  const visible = searchPeople(query, contacts);

  return (
    <AppScreen width="wide">
      <header className="sticky top-0 z-20 border-b border-border bg-background/95 px-5 pb-3 pt-6 backdrop-blur">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <h1 className="truncate font-display text-2xl font-extrabold tracking-tight text-foreground">
            My Contacts
          </h1>
          <span className="shrink-0 rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-bold text-primary">
            {contacts.length}
          </span>
        </div>

        <div
          className="mt-3 grid grid-cols-2 gap-1 rounded-full bg-surface p-1"
          role="tablist"
          aria-label="Contacts sections"
        >
          {(["contacts", "find"] as const).map((value) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={tab === value}
              onClick={() => setTab(value)}
              className={`min-h-11 rounded-full text-[13px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 ${
                tab === value ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {value === "contacts" ? "My Contacts" : "Find People"}
            </button>
          ))}
        </div>
      </header>

      <div className="px-4 py-4 sm:px-5">
        {tab === "contacts" ? (
          contacts.length === 0 ? (
            <EmptyState
              icon={Contact}
              title="No contacts yet"
              copy="Search for a TIAN participant using their @username to add them."
              action={
                <Button size="pillAuto" variant="default" onClick={() => setTab("find")}>
                  Find People
                </Button>
              }
            />
          ) : (
            <div className="space-y-4">
              <SearchField
                value={query}
                onChange={setQuery}
                label="Search your contacts"
                placeholder="Search name or @username"
              />
              {visible.length === 0 ? (
                <EmptyState
                  icon={UserRoundSearch}
                  title="No contacts match"
                  copy="Try searching for another @username."
                />
              ) : (
                <ul className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
                  {visible.map((person, i) => (
                    <ContactRow key={person.id} person={person} index={i} />
                  ))}
                </ul>
              )}
            </div>
          )
        ) : (
          <ParticipantSearch
            query={findQuery}
            onQueryChange={setFindQuery}
            renderActions={(person) => <AddContactButton person={person} />}
          />
        )}

        <p className="mt-5 px-1 text-center text-[11.5px] text-muted-foreground">
          Share your handle instead of a phone number —{" "}
          <Link to="/profile" className="font-semibold text-primary">
            get your @username
          </Link>
        </p>
      </div>
    </AppScreen>
  );
}
