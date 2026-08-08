import { createFileRoute, Link, Outlet, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check, Compass, Plus, Share2, Users } from "lucide-react";
import { toast } from "sonner";
import { AppScreen } from "@/components/tian/app-screen";
import { CommunityTabs } from "@/components/community/community-tabs";
import { EmptyState } from "@/components/community/empty-state";
import { formatMembers, getCommunity } from "@/lib/community-data";
import { toggleJoin, useIsJoined } from "@/lib/community-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/community/$communityId")({
  loader: ({ params }) => {
    const community = getCommunity(params.communityId);
    if (!community) throw notFound();
    return { community };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Community unavailable — TIAN" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { name, description } = loaderData.community;
    return {
      meta: [
        { title: `${name} — TIAN Communities` },
        { name: "description", content: description },
        { property: "og:title", content: `${name} — TIAN Communities` },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: CommunityDetail,
  errorComponent: CommunityMissing,
  notFoundComponent: CommunityMissing,
});

function CommunityMissing() {
  return (
    <AppScreen>
      <div className="px-5 pt-16">
        <EmptyState
          icon={Compass}
          title="Community not found"
          copy="This community may have been renamed or is no longer available."
          action={
            <Link
              to="/community"
              className="inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-[13px] font-bold text-primary-foreground transition-transform duration-200 active:scale-95"
            >
              Back to communities
            </Link>
          }
        />
      </div>
    </AppScreen>
  );
}

function CommunityDetail() {
  const { community } = Route.useLoaderData();
  const joined = useIsJoined(community.id);

  async function share() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: community.name, text: community.description, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast.success("Community link copied.");
    } catch {
      toast.info("Sharing was cancelled.");
    }
  }

  return (
    <AppScreen>
      <div className="mx-auto w-full max-w-2xl">
        <header className="relative">
          <div className="relative aspect-[16/7] max-h-56 overflow-hidden rounded-b-[2rem] bg-navy-gradient">
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
              className="absolute left-4 top-4 grid size-11 place-items-center rounded-full bg-background/25 text-primary-foreground backdrop-blur transition-transform duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-foreground/30"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
            </Link>
            <button
              type="button"
              onClick={share}
              aria-label={`Share ${community.name}`}
              className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-background/25 text-primary-foreground backdrop-blur transition-transform duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-foreground/30"
            >
              <Share2 className="size-4" aria-hidden="true" />
            </button>
          </div>

          <div className="-mt-10 px-5">
            <span
              aria-hidden="true"
              className="animate-pop grid size-20 place-items-center rounded-3xl bg-navy-deep font-display text-xl font-extrabold text-primary-foreground ring-4 ring-surface"
            >
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
                  <Users className="size-3.5" aria-hidden="true" />
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
                aria-label={joined ? `Leave ${community.name}` : `Join ${community.name}`}
                className={cn(
                  "mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-[15px] font-bold transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20",
                  joined
                    ? "bg-accent-soft text-accent"
                    : "bg-navy-gradient text-primary-foreground shadow-lift hover:brightness-110",
                )}
              >
                {joined ? (
                  <Check className="size-4" aria-hidden="true" />
                ) : (
                  <Plus className="size-4" aria-hidden="true" />
                )}
                {joined ? "Joined" : "Join community"}
              </button>
            </div>
          </div>
        </header>

        <main className="px-5 pt-4">
          <CommunityTabs communityId={community.id} />
          <div className="pt-4">
            <Outlet />
          </div>
        </main>
      </div>
    </AppScreen>
  );
}
