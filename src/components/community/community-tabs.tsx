import { Link } from "@tanstack/react-router";

const tabClass =
  "flex-1 rounded-xl py-2 text-center text-[12.5px] font-bold text-muted-foreground transition-all duration-200 data-[status=active]:bg-card data-[status=active]:text-primary data-[status=active]:shadow-soft";

/** Posts | Members | About switcher for a community. */
export function CommunityTabs({ communityId }: { communityId: string }) {
  return (
    <nav className="sticky top-0 z-20 -mx-5 bg-surface/95 px-5 py-2 backdrop-blur">
      <div className="flex gap-1 rounded-2xl bg-muted p-1">
        <Link
          to="/community/$communityId"
          params={{ communityId }}
          activeOptions={{ exact: true }}
          className={tabClass}
        >
          Posts
        </Link>
        <Link
          to="/community/$communityId/members"
          params={{ communityId }}
          className={tabClass}
        >
          Members
        </Link>
        <Link to="/community/$communityId/about" params={{ communityId }} className={tabClass}>
          About
        </Link>
      </div>
    </nav>
  );
}
