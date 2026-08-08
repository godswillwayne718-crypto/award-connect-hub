import { Link } from "@tanstack/react-router";

const tabClass =
  "flex min-h-11 flex-1 items-center justify-center rounded-xl px-2 text-[12.5px] font-bold text-muted-foreground transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 data-[status=active]:bg-card data-[status=active]:text-primary data-[status=active]:shadow-soft";

/** Posts | Members | About switcher for a community. */
export function CommunityTabs({ communityId }: { communityId: string }) {
  return (
    <nav
      aria-label="Community sections"
      className="sticky top-0 z-20 -mx-5 bg-surface/95 px-5 py-2 backdrop-blur"
    >
      <div className="flex gap-1 rounded-2xl bg-muted p-1">
        <Link
          to="/community/$communityId"
          params={{ communityId }}
          activeOptions={{ exact: true }}
          activeProps={{ "aria-current": "page" }}
          className={tabClass}
        >
          Posts
        </Link>
        <Link
          to="/community/$communityId/members"
          params={{ communityId }}
          activeProps={{ "aria-current": "page" }}
          className={tabClass}
        >
          Members
        </Link>
        <Link
          to="/community/$communityId/about"
          params={{ communityId }}
          activeProps={{ "aria-current": "page" }}
          className={tabClass}
        >
          About
        </Link>
      </div>
    </nav>
  );
}
