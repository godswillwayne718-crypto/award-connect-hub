import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BadgeCheck, GraduationCap, Sparkles } from "lucide-react";
import { AppScreen } from "@/components/tian/app-screen";
import { EmptyState } from "@/components/community/empty-state";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/opportunities")({
  head: () => ({
    meta: [
      { title: "Opportunities — TIAN" },
      {
        name: "description",
        content:
          "Verified opportunities from universities, scholarships, awards and organisations will appear here as TIAN grows.",
      },
      { property: "og:title", content: "Opportunities — TIAN" },
      {
        property: "og:description",
        content: "Verified university, scholarship and Award opportunities on TIAN.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: OpportunitiesScreen,
});

/**
 * Opportunity listings are intentionally separate from Communities. A verified
 * university or organisation gets an official listing here; it never becomes a
 * community automatically. No records exist yet, so this screen is honest
 * about that rather than showing placeholder partners.
 */
export interface Opportunity {
  id: string;
  organisation: string;
  kind: "University" | "Scholarship" | "Award" | "Organisation";
  country: string;
  website: string;
  admissionsUrl?: string;
  admissionsContact?: string;
  scholarship?: string;
  eligibility?: string;
  deadline?: string;
  /** Only listings confirmed with the organisation may be shown as official. */
  verified: boolean;
}

export const OPPORTUNITIES: Opportunity[] = [];

function OpportunitiesScreen() {
  return (
    <AppScreen width="wide">
      <header className="sticky top-0 z-20 border-b border-border bg-background/95 px-4 pb-3 pt-6 backdrop-blur sm:px-5">
        <div className="flex items-center gap-3">
          <Link
            to="/home"
            aria-label="Back to home"
            className="grid size-11 shrink-0 place-items-center rounded-full text-foreground transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
          >
            <ArrowLeft className="size-5" aria-hidden="true" />
          </Link>
          <h1 className="min-w-0 truncate font-display text-xl font-extrabold tracking-tight text-foreground">
            Opportunities
          </h1>
          <span className="ml-auto shrink-0 rounded-full bg-gold-soft px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-gold-foreground">
            Coming soon
          </span>
        </div>
      </header>

      <div className="space-y-4 px-4 py-5 sm:px-5">
        <EmptyState
          icon={GraduationCap}
          title="No opportunities yet"
          copy="Verified opportunities from universities, scholarships, awards and organizations will appear here as TIAN grows."
          action={
            <Button asChild size="pillAuto" variant="soft">
              <Link to="/home">Back to home</Link>
            </Button>
          }
        />

        <div className="rounded-3xl border border-border bg-card p-4 shadow-soft">
          <p className="flex items-center gap-2 font-display text-[14px] font-extrabold text-foreground">
            <BadgeCheck className="size-4 shrink-0 text-primary" aria-hidden="true" />
            Only verified listings
          </p>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
            A listing appears here only once the university, scholarship board or organisation has
            confirmed it. TIAN does not publish unofficial contacts or claim partnerships that do
            not exist.
          </p>
          <p className="mt-3 flex items-start gap-2 text-[12px] leading-relaxed text-muted-foreground">
            <Sparkles className="mt-0.5 size-3.5 shrink-0 text-gold" aria-hidden="true" />
            Universities stay separate from communities: an official profile can list admissions
            information, scholarships, eligibility and deadlines without creating a group.
          </p>
        </div>
      </div>
    </AppScreen>
  );
}
