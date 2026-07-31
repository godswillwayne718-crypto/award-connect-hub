import { createFileRoute, notFound } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { ProfileCard } from "@/components/tian/profile-card";
import { getCommunity, initials } from "@/lib/community-data";

export const Route = createFileRoute("/community/$communityId/about")({
  loader: ({ params }) => {
    const community = getCommunity(params.communityId);
    if (!community) throw notFound();
    return { community };
  },
  component: CommunityAbout,
});

function CommunityAbout() {
  const { community } = Route.useLoaderData();

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
            <ShieldCheck className="size-3.5" />
            Verified
          </span>
        }
      >
        <div className="space-y-3">
          {community.moderators.map((m) => (
            <div key={m.id} className="flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-navy-deep text-[12px] font-extrabold text-primary-foreground">
                {initials(m.name)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[13.5px] font-bold text-foreground">{m.name}</p>
                <p className="truncate text-[12px] text-muted-foreground">
                  {m.role} · {m.country}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ProfileCard>
    </div>
  );
}
