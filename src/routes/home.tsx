import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bell,
  CalendarDays,
  ChevronRight,
  Compass,
  Flame,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import { AppScreen } from "@/components/tian/app-screen";
import { TianLogo } from "@/components/tian/tian-logo";
import { EmptyState } from "@/components/community/empty-state";
import { useProfile } from "@/lib/tian-store";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Home — TIAN" },
      {
        name: "description",
        content: "Your daily feed of Award community updates, milestones and opportunities.",
      },
      { property: "og:title", content: "Home — TIAN" },
      { property: "og:description", content: "Your International Award community feed." },
    ],
  }),
  component: HomeScreen,
});

const quickActions = [
  { icon: Users, label: "Find peers", tone: "primary", to: "/contacts" },
  { icon: Sparkles, label: "Opportunities", tone: "primary", to: "/opportunities" },
  { icon: Compass, label: "Centres", tone: "accent", to: null },
  { icon: CalendarDays, label: "Journeys", tone: "gold", to: null },
] as const;

const toneClass = {
  primary: "bg-primary-soft text-primary",
  accent: "bg-accent-soft text-accent",
  gold: "bg-gold-soft text-gold-foreground",
} as const;

function HomeScreen() {
  const profile = useProfile();
  const firstName = profile.fullName.split(" ")[0] || "there";

  return (
    <AppScreen>
      <header className="rounded-b-3xl bg-navy-gradient px-5 pb-6 pt-8 shadow-lift">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <TianLogo className="size-10 shrink-0 text-[11px]" />
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-primary-foreground/60">
                Welcome back
              </p>
              <p className="truncate font-display text-lg font-extrabold text-primary-foreground">
                {firstName}
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Notifications"
            className="press relative grid size-11 shrink-0 place-items-center rounded-xl bg-primary-foreground/10 text-primary-foreground"
          >
            <Bell className="size-[18px]" aria-hidden="true" />
            <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-gold" />
          </button>
        </div>

        <div className="mt-5 flex items-center gap-2 rounded-2xl bg-primary-foreground/10 px-4 py-3 backdrop-blur">
          <Search className="size-[18px] shrink-0 text-primary-foreground/60" />
          <span className="truncate text-sm text-primary-foreground/60">
            Search people, centres, countries
          </span>
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-gold/25 bg-gold/10 p-3">
          <Flame className="size-5 shrink-0 text-gold" />
          <p className="min-w-0 flex-1 text-xs leading-relaxed text-primary-foreground/80">
            Your profile is <span className="font-bold text-gold">70% complete</span> — add your
            Award Centre to unlock verified status.
          </p>
          <Link
            to="/profile-setup"
            aria-label="Complete your profile"
            className="grid size-11 shrink-0 place-items-center rounded-full text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </header>

      <section className="px-5 pt-6">
        <div className="grid grid-cols-4 gap-2.5">
          {quickActions.map(({ icon: Icon, label, tone, to }) =>
            to ? (
              <Link
                key={label}
                to={to}
                className="press flex flex-col items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 rounded-2xl"
              >
                <span
                  className={`grid size-14 place-items-center rounded-2xl ${toneClass[tone]} shadow-soft`}
                >
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="text-[10px] font-semibold leading-tight text-muted-foreground">
                  {label}
                </span>
              </Link>
            ) : (
              <div key={label} className="flex flex-col items-center gap-2 opacity-55">
                <span
                  className={`grid size-14 place-items-center rounded-2xl ${toneClass[tone]} shadow-soft`}
                >
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="text-[10px] font-semibold leading-tight text-muted-foreground">
                  {label}
                </span>
                <span className="sr-only">Coming soon</span>
              </div>
            ),
          )}
        </div>
      </section>

      <section className="px-5 pb-2 pt-7">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-base font-extrabold text-foreground">
            Community highlights
          </h2>
          <span className="rounded-full bg-gold-soft px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-gold-foreground">
            Coming soon
          </span>
        </div>

        <div className="mt-3">
          <EmptyState
            icon={Compass}
            title="Nothing to show yet"
            copy="Highlights from communities, centres and verified opportunities will appear here as TIAN grows. In the meantime, share a Status or start a conversation."
            action={
              <Link
                to="/status"
                className="inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-[13px] font-bold text-primary-foreground transition-transform duration-200 active:scale-95"
              >
                Share a Status
              </Link>
            }
          />
        </div>
      </section>
    </AppScreen>
  );
}
