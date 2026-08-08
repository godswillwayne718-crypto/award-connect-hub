import { createFileRoute, Link } from "@tanstack/react-router";
import { ImagePlus, MessageSquarePlus, PenLine } from "lucide-react";
import { Avatar } from "@/components/community/avatar";
import { EmptyState } from "@/components/community/empty-state";
import { PostCard } from "@/components/community/post-card";
import { PostListSkeleton } from "@/components/community/skeletons";
import { useBriefLoading } from "@/hooks/use-brief-loading";
import { getCommunity, postsFor } from "@/lib/community-data";
import { useDraftPosts } from "@/lib/community-store";
import { useProfile } from "@/lib/tian-store";

export const Route = createFileRoute("/community/$communityId/")({
  head: () => ({
    meta: [
      { title: "Community posts — TIAN" },
      {
        name: "description",
        content: "Updates, photos and polls shared by members of this Award community.",
      },
      { property: "og:title", content: "Community posts — TIAN" },
      { property: "og:description", content: "Read the latest posts from this Award community." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CommunityPosts,
});

function CommunityPosts() {
  const { communityId } = Route.useParams();
  const drafts = useDraftPosts(communityId);
  const posts = [...drafts, ...postsFor(communityId)];
  const profile = useProfile();
  const loading = useBriefLoading();
  const communityName = getCommunity(communityId)?.name ?? "this community";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 rounded-3xl border border-border bg-card p-3 shadow-soft">
        <Avatar name={profile.fullName || "TIAN Member"} size="sm" />
        <Link
          to="/community/create-post"
          search={{ community: communityId }}
          className="flex h-11 flex-1 items-center rounded-full bg-muted px-4 text-[13px] text-muted-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
        >
          Share something with the group…
        </Link>
        <Link
          to="/community/create-post"
          search={{ community: communityId }}
          aria-label="Add a photo post"
          className="grid size-11 shrink-0 place-items-center rounded-full bg-accent-soft text-accent transition-transform duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
        >
          <ImagePlus className="size-[18px]" aria-hidden="true" />
        </Link>
      </div>

      {loading ? (
        <PostListSkeleton />
      ) : posts.length ? (
        posts.map((post, i) => (
          <PostCard key={post.id} post={post} style={{ animationDelay: `${i * 60}ms` }} />
        ))
      ) : (
        <EmptyState
          icon={MessageSquarePlus}
          title="No posts yet"
          copy={`Be the first to share an update with ${communityName}.`}
          action={
            <Link
              to="/community/create-post"
              search={{ community: communityId }}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-[13px] font-bold text-primary-foreground transition-transform duration-200 active:scale-95"
            >
              <PenLine className="size-4" aria-hidden="true" />
              Write the first post
            </Link>
          }
        />
      )}

      {!loading && posts.length ? (
        <Link
          to="/community/create-post"
          search={{ community: communityId }}
          className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-dashed border-primary/30 bg-primary-soft text-[13.5px] font-bold text-primary transition-transform duration-200 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
        >
          <PenLine className="size-4" aria-hidden="true" />
          Write a post
        </Link>
      ) : null}
    </div>
  );
}
