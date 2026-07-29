import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Globe,
  LifeBuoy,
  Lock,
  LogOut,
  ShieldCheck,
  UserCog,
} from "lucide-react";
import { MobileShell } from "@/components/tian/mobile-shell";
import { ProfileCard } from "@/components/tian/profile-card";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — TIAN" },
      {
        name: "description",
        content: "Manage your TIAN account, privacy, notifications and Award verification.",
      },
      { property: "og:title", content: "Settings — TIAN" },
      { property: "og:description", content: "Account, privacy and notification settings." },
    ],
  }),
  component: SettingsScreen,
});

const GROUPS: { title: string; items: { icon: typeof Bell; label: string; hint: string }[] }[] = [
  {
    title: "Account",
    items: [
      { icon: UserCog, label: "Account details", hint: "Name, email, country" },
      { icon: ShieldCheck, label: "Award verification", hint: "Pending review" },
      { icon: Globe, label: "Language & region", hint: "English (UK)" },
    ],
  },
  {
    title: "Preferences",
    items: [
      { icon: Bell, label: "Notifications", hint: "All activity" },
      { icon: Lock, label: "Privacy", hint: "Public profile" },
      { icon: LifeBuoy, label: "Help & support", hint: "Contact TIAN" },
    ],
  },
];

function SettingsScreen() {
  return (
    <MobileShell>
      <header className="flex items-center gap-3 px-5 pb-2 pt-6">
        <Link
          to="/profile"
          aria-label="Back to profile"
          className="grid size-9 place-items-center rounded-full border border-border bg-card text-foreground"
        >
          <ChevronLeft className="size-4" />
        </Link>
        <h1 className="font-display text-xl font-extrabold tracking-tight text-foreground">
          Settings
        </h1>
      </header>

      <div className="space-y-4 px-5 py-4">
        {GROUPS.map((group, gi) => (
          <ProfileCard
            key={group.title}
            title={group.title}
            style={{ animationDelay: `${gi * 70}ms` }}
          >
            <ul className="space-y-1">
              {group.items.map((item) => (
                <li key={item.label}>
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 rounded-2xl p-2.5 text-left transition-colors hover:bg-surface"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                      <item.icon className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-bold text-foreground">
                        {item.label}
                      </span>
                      <span className="block truncate text-[11.5px] text-muted-foreground">
                        {item.hint}
                      </span>
                    </span>
                    <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                  </button>
                </li>
              ))}
            </ul>
          </ProfileCard>
        ))}

        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card py-3 text-sm font-bold text-destructive shadow-soft"
        >
          <LogOut className="size-4" /> Log out
        </button>
      </div>
    </MobileShell>
  );
}
