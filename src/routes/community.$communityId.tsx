import { createFileRoute, Link, Outlet, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check, Plus, Share2, Users } from "lucide-react";
import { AppScreen } from "@/components/tian/app-screen";
import { CommunityTabs } from "@/components/community/community-tabs";
import { formatMembers, getCommunity } from "@/lib/community-data";
import { toggleJoin, useJoined } from "@/lib/community-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/community/$communityId")({
  loader: ({ params }) => {
    const community = getCommunity(params.communityId);
    if (!community) throw notFound();
    return { community };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.community.name ?? "Community";
    const description = loaderData?.community.description ?? "An Award community on TIAN.";
    return {
      meta: [
        { title: `${name} — TIAN Communities` },
        { name: "description", content: description },
        { property: "og:title", content: `${name} — TIAN Communities` },
        { property: "og:description", content: description },
      ],
    };
  },
  component: CommunityDetail,
});

function CommunityDetail() {
  const { community } = Route.useLoaderData();
  const joined = useJoined().includes(community.id);

  return (
    <AppScreen>
      <header className="relative">
        <div className="relative h-40 overflow-hidden rounded-b-[2rem] bg-navy-gradient">
          <img
            src={community.cover}
            alt=""
            loading="lazy"
            width={1200}
            height={512}
            className="size-full object-cover"
          />
          <Link
            to="/community"
            aria-label="Back to communities"
            className="absolute left-4 top-4 grid size-9 place-items-center rounded-full bg-background/25 text-primary-foreground backdrop-blur transition-transform duration-200 active:scale-95"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <button
            type="button"
            aria-label="Share community"
            className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-background/25 text-primary-foreground backdrop-blur transition-transform duration-200 active:scale-95"
          >
            <Share2 className="size-4" />
          </button>
        </div>

        <div className="-mt-10 px-5">
          <span className="animate-pop grid size-20 place-items-center rounded-3xl bg-navy-deep font-display text-xl font-extrabold text-primary-foreground ring-4 ring-surface">
            {community.logoInitials}
          </span>

          <div className="animate-fade-up mt-3">
            <h1 className="font-display text-[21px] font-extrabold leading-tight tracking-tight text-foreground">
              {community.name}
            </h1>
            <p className="text-[13px] font-medium text-muted-foreground">{community.handle}</p>

            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-primary-foreground">
                {community.category}
              </span>
              <span className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-[11px] font-bold text-muted-foreground">
                <Users className="size-3.5" />
                {formatMembers(community.members)}
              </span>
            </div>

            <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">
              {community.description}
            </p>

            <button
              type="button"
              onClick={() => toggleJoin(community.id)}
              aria-pressed={joined}
              className={cn(
                "mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-[15px] font-bold transition-all duration-200 active:scale-[0.98]",
                joined
                  ? "bg-accent-soft text-accent"
                  : "bg-navy-gradient text-primary-foreground shadow-lift hover:brightness-110",
              )}
            >
              {joined ? <Check className="size-4" /> : <Plus className="size-4" />}
              {joined ? "Joined" : "Join community"}
            </button>
          </div>
        </div>
      </header>

      <div className="px-5 pt-4">
        <CommunityTabs communityId={community.id} />
        <div className="pt-4">
          <Outlet />
        </div>
      </div>
    </AppScreen>
  );
}
