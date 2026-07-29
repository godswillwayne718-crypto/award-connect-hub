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
  { icon: Users, label: "Find peers", tone: "primary" },
  { icon: Compass, label: "Centres", tone: "accent" },
  { icon: CalendarDays, label: "Journeys", tone: "gold" },
  { icon: Sparkles, label: "Opportunities", tone: "primary" },
] as const;

const feed = [
  {
    name: "Nairobi Award Centre",
    meta: "Award Centre · Kenya",
    time: "2h",
    body: "18 participants completed their Silver Adventurous Journey across the Ngong Hills this weekend. Proud of every one of them.",
    tag: "Milestone",
    likes: 214,
    comments: 32,
  },
  {
    name: "Priya Raghavan",
    meta: "Gold Award alumni · India",
    time: "5h",
    body: "Sharing the residential project template that helped me plan mine end to end. Happy to answer questions from anyone starting Gold.",
    tag: "Resource",
    likes: 96,
    comments: 41,
  },
  {
    name: "University of Edinburgh",
    meta: "University partner · UK",
    time: "1d",
    body: "Our 2026 Award recognition scholarship applications open next month for Gold Award holders worldwide.",
    tag: "Opportunity",
    likes: 431,
    comments: 87,
  },
];

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
          <button className="press relative grid size-10 shrink-0 place-items-center rounded-xl bg-primary-foreground/10 text-primary-foreground">
            <Bell className="size-[18px]" />
            <span className="absolute right-2 top-2 size-2 rounded-full bg-gold" />
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
          <Link to="/profile-setup" className="shrink-0 text-gold">
            <ChevronRight className="size-4" />
          </Link>
        </div>
      </header>

      <section className="px-5 pt-6">
        <div className="grid grid-cols-4 gap-2.5">
          {quickActions.map(({ icon: Icon, label, tone }) => (
            <button key={label} className="press flex flex-col items-center gap-2">
              <span
                className={`grid size-14 place-items-center rounded-2xl ${toneClass[tone]} shadow-soft`}
              >
                <Icon className="size-5" />
              </span>
              <span className="text-[10px] font-semibold leading-tight text-muted-foreground">
                {label}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="px-5 pt-7">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-base font-extrabold text-foreground">
            Community highlights
          </h2>
          <span className="text-xs font-semibold text-accent">Live</span>
        </div>

        <div className="mt-3 space-y-3">
          {feed.map((post) => (
            <article
              key={post.name}
              className="press rounded-3xl border border-border bg-card p-4 shadow-soft animate-fade-up"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary-soft font-display text-sm font-extrabold text-primary">
                  {post.name
                    .split(" ")
                    .slice(0, 2)
                    .map((w) => w[0])
                    .join("")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-foreground">{post.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{post.meta}</p>
                </div>
                <span className="shrink-0 text-[11px] text-muted-foreground">{post.time}</span>
              </div>

              <p className="mt-3 text-[13.5px] leading-relaxed text-foreground/85">{post.body}</p>

              <div className="mt-3.5 flex items-center gap-2">
                <span className="rounded-full bg-gold-soft px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-gold-foreground">
                  {post.tag}
                </span>
                <span className="ml-auto text-xs font-medium text-muted-foreground">
                  {post.likes} · {post.comments} replies
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </AppScreen>
  );
}
