import { createFileRoute, Link } from "@tanstack/react-router";
import { CircleDashed, Eye, Plus, ShieldCheck } from "lucide-react";
import { AppScreen } from "@/components/tian/app-screen";
import { EmptyState } from "@/components/community/empty-state";
import { SectionHeading } from "@/components/community/section-heading";
import { StatusRing } from "@/components/status/status-ring";
import { StatusCard } from "@/components/status/status-card";
import { Button } from "@/components/ui/button";
import { formatChatStamp } from "@/lib/chat-format";
import { useProfile } from "@/lib/tian-store";
import { usernameOf } from "@/lib/tian-profile-data";
import { findPerson } from "@/lib/people-data";
import { useContactIds } from "@/lib/contacts-store";
import { useBlockedIds } from "@/lib/chat-store";
import {
  PRIVACY_LABEL,
  canViewStatus,
  recentStatuses,
  useMyStatuses,
  useStatusPrivacy,
  useViewedIds,
} from "@/lib/status-store";

export const Route = createFileRoute("/status/")({
  head: () => ({
    meta: [
      { title: "Status — TIAN" },
      {
        name: "description",
        content:
          "Share 24-hour Award journey updates with photos, video and text — and see what the Award community is up to today.",
      },
      { property: "og:title", content: "Status — TIAN" },
      { property: "og:description", content: "Daily Award journey updates on TIAN." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: StatusFeed,
});

function StatusFeed() {
  const profile = useProfile();
  const mine = useMyStatuses();
  const viewed = useViewedIds();
  const privacy = useStatusPrivacy();
  const contactIds = useContactIds();
  const blockedIds = useBlockedIds();

  const latestMine = mine[0];
  const updates = recentStatuses().filter((status) =>
    canViewStatus(findPerson(status.authorId), {
      privacy,
      isContact: contactIds.includes(status.authorId),
      blocked: blockedIds.includes(status.authorId),
    }),
  );

  return (
    <AppScreen width="wide">
      <header className="sticky top-0 z-20 border-b border-border bg-background/95 px-5 pb-3 pt-6 backdrop-blur">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <h1 className="truncate font-display text-2xl font-extrabold tracking-tight text-foreground">
            Status
          </h1>
          <Button asChild size="sm" variant="soft" className="h-11 shrink-0 rounded-full px-4 text-xs">
            <Link to="/status/new">
              <Plus className="size-4" /> Add Status
            </Link>
          </Button>
        </div>
      </header>

      <div className="space-y-5 px-4 py-4 sm:px-5">
        <section>
          <SectionHeading title="My Status" />
          <Link
            to={latestMine ? "/status/$statusId" : "/status/new"}
            params={latestMine ? { statusId: latestMine.id } : undefined}
            className="mt-2 flex min-h-[72px] items-center gap-3 rounded-3xl border border-border bg-card p-3 shadow-soft transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
          >
            <StatusRing name={profile.fullName || "TIAN member"} viewed={!latestMine} size="lg">
              {!latestMine ? (
                <span className="absolute -bottom-0.5 -right-0.5 grid size-5 place-items-center rounded-full bg-accent text-accent-foreground ring-2 ring-background">
                  <Plus className="size-3" aria-hidden="true" />
                </span>
              ) : null}
            </StatusRing>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-display text-[15px] font-extrabold tracking-tight text-foreground">
                My Status
              </span>
              <span className="block truncate text-[11.5px] font-semibold text-primary/70">
                @{usernameOf(profile)}
              </span>
              <span className="mt-0.5 block truncate text-[11.5px] text-muted-foreground">
                {latestMine
                  ? `${formatChatStamp(latestMine.createdAt)} · ${latestMine.items.length} ${latestMine.items.length === 1 ? "update" : "updates"}`
                  : "Tap to add a status update"}
              </span>
            </span>
          </Link>

          <p className="mt-2 flex items-center gap-1.5 px-1 text-[11.5px] text-muted-foreground">
            <Eye className="size-3.5 shrink-0" aria-hidden="true" />
            Visible to {PRIVACY_LABEL[privacy]} ·{" "}
            <Link to="/settings" className="font-semibold text-primary">
              Change
            </Link>
          </p>
        </section>

        <section>
          <SectionHeading title="Recent Updates" />
          {updates.length === 0 ? (
            <div className="mt-2">
              <EmptyState
                icon={CircleDashed}
                title="No updates to show"
                copy={
                  privacy === "nobody"
                    ? "Status sharing is off. Change your Status privacy to see and share updates."
                    : "Add Award members to your contacts to see their updates here."
                }
                action={
                  <Button asChild size="pillAuto" variant="default">
                    <Link to="/contacts">Find People</Link>
                  </Button>
                }
              />
            </div>
          ) : (
            <ul className="mt-2 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
              {updates.map((status, i) => {
                const author = findPerson(status.authorId);
                if (!author) return null;
                return (
                  <StatusCard
                    key={status.id}
                    status={status}
                    author={author}
                    viewed={viewed.includes(status.id)}
                    index={i}
                  />
                );
              })}
            </ul>
          )}
        </section>

        <p className="flex items-start gap-2 px-1 text-[11.5px] text-muted-foreground">
          <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-accent" aria-hidden="true" />
          Status updates disappear after 24 hours and never reveal contact details.
        </p>
      </div>
    </AppScreen>
  );
}
