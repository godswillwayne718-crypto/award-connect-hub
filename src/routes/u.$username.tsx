import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, MapPin, UserRoundX } from "lucide-react";
import { toast } from "sonner";
import { AppScreen } from "@/components/tian/app-screen";
import { RequireAuth } from "@/components/tian/require-auth";
import { PersonAvatar } from "@/components/shared/person-avatar";
import { UsernameBadge } from "@/components/shared/username-badge";
import { StartChatButton } from "@/components/shared/start-chat-button";
import { DbContactButton } from "@/components/shared/db-contact-button";
import { EmptyState } from "@/components/community/empty-state";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useProfileByUsername } from "@/lib/directory";
import { levelLabel, nameOf, presenceLabel, roleLabel } from "@/lib/identity";
import { useBlockMutations, useBlocked } from "@/lib/social";

export const Route = createFileRoute("/u/$username")({
  head: ({ params }) => ({
    meta: [
      { title: `@${params.username} — TIAN` },
      { name: "description", content: `View @${params.username}'s TIAN profile.` },
      { property: "og:title", content: `@${params.username} — TIAN` },
      { property: "og:description", content: "A member of The International Award Network." },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <RequireAuth>
      <MemberProfile />
    </RequireAuth>
  ),
});

function MemberProfile() {
  const { username } = Route.useParams();
  const { userId } = useAuth();
  const q = useProfileByUsername(username);
  const blocked = useBlocked(userId).data ?? [];
  const { block, unblock } = useBlockMutations(userId);
  const p = q.data;

  return (
    <AppScreen>
      <header className="flex items-center gap-2 px-4 pt-6">
        <Link to="/contacts" aria-label="Back" className="grid size-10 place-items-center rounded-full hover:bg-surface">
          <ChevronLeft className="size-5" />
        </Link>
      </header>
      {q.isLoading ? (
        <p className="py-16 text-center text-sm text-muted-foreground">Loading profile…</p>
      ) : !p ? (
        <div className="px-6 pt-10">
          <EmptyState icon={UserRoundX} title="Member not found" copy={`No TIAN member uses @${username}.`} />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 px-6 pb-10 pt-4 text-center">
          <PersonAvatar name={nameOf(p)} online={p.online} size="lg" />
          <div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground">{nameOf(p)}</h1>
            <UsernameBadge username={p.username} verified={p.verified} className="justify-center" />
            <p className="mt-1 text-[12px] text-muted-foreground">{presenceLabel(p)}</p>
          </div>
          <p className="text-[13px] text-muted-foreground">
            {[roleLabel(p.role), levelLabel(p.level)].filter(Boolean).join(" · ")}
          </p>
          {p.country ? (
            <p className="flex items-center gap-1 text-[12.5px] text-muted-foreground">
              <MapPin className="size-3.5" /> {p.country}
            </p>
          ) : null}
          {p.bio ? <p className="max-w-sm text-[13.5px] leading-relaxed text-foreground">{p.bio}</p> : null}
          {p.interests?.length ? (
            <div className="flex flex-wrap justify-center gap-1.5">
              {p.interests.map((t) => (
                <span key={t} className="rounded-full bg-primary-soft px-3 py-1 text-[11.5px] font-semibold text-primary">
                  {t}
                </span>
              ))}
            </div>
          ) : null}
          {userId !== p.id ? (
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              <StartChatButton profile={p} />
              <DbContactButton profile={p} />
              <Button
                size="sm"
                variant="ghost"
                className="h-11 rounded-full px-4 text-xs"
                onClick={async () => {
                  const isBlocked = blocked.includes(p.id);
                  try {
                    if (isBlocked) await unblock.mutateAsync(p.id);
                    else await block.mutateAsync(p.id);
                    toast.success(isBlocked ? "Unblocked" : "Blocked");
                  } catch {
                    toast.error("Couldn't update. Try again.");
                  }
                }}
              >
                {blocked.includes(p.id) ? "Unblock" : "Block"}
              </Button>
            </div>
          ) : null}
        </div>
      )}
    </AppScreen>
  );
}
