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
import { setMessagePrivacy, useMessagePrivacy, type MessagePrivacy } from "@/lib/chat-store";
import {
  setStatusPrivacy,
  useStatusPrivacy,
  PRIVACY_LABEL,
  type StatusPrivacy,
} from "@/lib/status-store";

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

        <MessagePrivacyCard />

        <StatusPrivacyCard />



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

const PRIVACY_OPTIONS: { value: MessagePrivacy; label: string; hint: string }[] = [
  { value: "everyone", label: "Everyone", hint: "Any TIAN member can message you" },
  { value: "connections", label: "My connections", hint: "Only people you've connected with" },
  { value: "verified", label: "Verified Award members", hint: "Only verified accounts" },
  { value: "nobody", label: "Nobody", hint: "Turn off new message requests" },
];

/** Chat privacy control — local state today, backend-backed later. */
function MessagePrivacyCard() {
  const privacy = useMessagePrivacy();
  return (
    <ProfileCard title="Who can message me?">
      <ul className="space-y-1" role="radiogroup" aria-label="Who can message me?">
        {PRIVACY_OPTIONS.map((option) => {
          const active = option.value === privacy;
          return (
            <li key={option.value}>
              <button
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setMessagePrivacy(option.value)}
                className="flex min-h-11 w-full items-center gap-3 rounded-2xl p-2.5 text-left transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
              >
                <span
                  className={
                    active
                      ? "grid size-5 shrink-0 place-items-center rounded-full border-2 border-primary"
                      : "grid size-5 shrink-0 place-items-center rounded-full border-2 border-border"
                  }
                >
                  {active ? <span className="size-2.5 rounded-full bg-primary" /> : null}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-bold text-foreground">
                    {option.label}
                  </span>
                  <span className="block truncate text-[11.5px] text-muted-foreground">
                    {option.hint}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </ProfileCard>
  );
}


const STATUS_PRIVACY_OPTIONS: { value: StatusPrivacy; hint: string }[] = [
  { value: "everyone", hint: "Any TIAN member can see your updates" },
  { value: "contacts", hint: "Only people in your contacts" },
  { value: "verified", hint: "Only verified Award accounts" },
  { value: "nobody", hint: "Turn off Status sharing" },
];

/** Status audience control — enforced by the Status feed and viewer. */
function StatusPrivacyCard() {
  const privacy = useStatusPrivacy();
  return (
    <ProfileCard title="Who can view my Status?">
      <ul className="space-y-1" role="radiogroup" aria-label="Who can view my Status?">
        {STATUS_PRIVACY_OPTIONS.map((option) => {
          const active = option.value === privacy;
          return (
            <li key={option.value}>
              <button
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setStatusPrivacy(option.value)}
                className="flex min-h-11 w-full items-center gap-3 rounded-2xl p-2.5 text-left transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
              >
                <span
                  className={
                    active
                      ? "grid size-5 shrink-0 place-items-center rounded-full border-2 border-primary"
                      : "grid size-5 shrink-0 place-items-center rounded-full border-2 border-border"
                  }
                >
                  {active ? <span className="size-2.5 rounded-full bg-primary" /> : null}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-bold text-foreground">
                    {PRIVACY_LABEL[option.value]}
                  </span>
                  <span className="block truncate text-[11.5px] text-muted-foreground">
                    {option.hint}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </ProfileCard>
  );
}
