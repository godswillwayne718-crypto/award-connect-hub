import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { Avatar } from "@/components/community/avatar";
import { ProfileCard } from "@/components/tian/profile-card";
import { getCommunity } from "@/lib/community-data";

export const Route = createFileRoute("/community/$communityId/about")({
  head: () => ({
    meta: [
      { title: "About this community — TIAN" },
      {
        name: "description",
        content: "Community rules and the moderators who keep this Award community safe.",
      },
      { property: "og:title", content: "About this community — TIAN" },
      { property: "og:description", content: "Rules and moderators for this Award community." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CommunityAbout,
});

function CommunityAbout() {
  const { communityId } = Route.useParams();
  const community = getCommunity(communityId);
  if (!community) return null;

  return (
    <div className="space-y-4">
      <ProfileCard title="Community rules">
        <ol className="space-y-2.5">
          {community.rules.map((rule, i) => (
            <li key={rule} className="flex gap-3">
              <span className="grid size-6 shrink-0 place-items-center rounded-lg bg-primary-soft text-[11px] font-extrabold text-primary">
                {i + 1}
              </span>
              <span className="text-[13px] leading-relaxed text-muted-foreground">{rule}</span>
            </li>
          ))}
        </ol>
      </ProfileCard>

      <ProfileCard
        title="Moderators"
        action={
          <span className="flex items-center gap-1 text-[11.5px] font-semibold text-accent">
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            Verified
          </span>
        }
      >
        <ul className="space-y-3">
          {community.moderators.map((m) => (
            <li key={m.id} className="flex items-center gap-3">
              <Avatar name={m.name} size="sm" tone="navy" />
              <div className="min-w-0">
                <p className="truncate text-[13.5px] font-bold text-foreground">{m.name}</p>
                <p className="truncate text-[12px] text-muted-foreground">
                  {m.role} · {m.country}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </ProfileCard>
    </div>
  );
}
