import { createFileRoute, Link } from "@tanstack/react-router";
import { ImagePlus, PenLine } from "lucide-react";
import { PostCard } from "@/components/community/post-card";
import { postsFor } from "@/lib/community-data";
import { useProfile } from "@/lib/tian-store";
import { initials } from "@/lib/community-data";

export const Route = createFileRoute("/community/$communityId/")({
  component: CommunityPosts,
});

function CommunityPosts() {
  const { communityId } = Route.useParams();
  const posts = postsFor(communityId);
  const profile = useProfile();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 rounded-3xl border border-border bg-card p-3 shadow-soft">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-soft font-display text-[13px] font-extrabold text-primary">
          {initials(profile.fullName || "TIAN Member")}
        </span>
        <Link
          to="/community/create-post"
          search={{ community: communityId }}
          className="flex h-10 flex-1 items-center rounded-full bg-muted px-4 text-[13px] text-muted-foreground transition-colors hover:bg-secondary"
        >
          Share something with the group…
        </Link>
        <Link
          to="/community/create-post"
          search={{ community: communityId }}
          aria-label="Add a photo"
          className="grid size-10 shrink-0 place-items-center rounded-full bg-accent-soft text-accent transition-transform duration-200 active:scale-95"
        >
          <ImagePlus className="size-[18px]" />
        </Link>
      </div>

      {posts.map((post, i) => (
        <PostCard key={post.id} post={post} style={{ animationDelay: `${i * 60}ms` }} />
      ))}

      <Link
        to="/community/create-post"
        search={{ community: communityId }}
        className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-primary/30 bg-primary-soft py-3.5 text-[13.5px] font-bold text-primary transition-transform duration-200 active:scale-[0.99]"
      >
        <PenLine className="size-4" />
        Write a post
      </Link>
    </div>
  );
}
