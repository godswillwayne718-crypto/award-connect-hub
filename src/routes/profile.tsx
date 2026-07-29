import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, ChevronRight, Pencil, Settings, Share2, Users } from "lucide-react";
import { toast } from "sonner";
import { AppScreen } from "@/components/tian/app-screen";
import { ProfileCard, Tag } from "@/components/tian/profile-card";
import { ProfileHeader } from "@/components/tian/profile-header";
import { Button } from "@/components/ui/button";
import {
  ACHIEVEMENTS,
  COMMUNITIES,
  DEFAULT_INTERESTS,
  usernameOf,
} from "@/lib/tian-profile-data";
import { useProfile } from "@/lib/tian-store";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — TIAN" },
      {
        name: "description",
        content:
          "Your TIAN profile: Award role and level, bio, interests, achievements and communities.",
      },
      { property: "og:title", content: "Profile — TIAN" },
      { property: "og:description", content: "Your Award story on TIAN." },
    ],
  }),
  component: ProfileScreen,
});

const LEVEL_TONE: Record<string, string> = {
  gold: "bg-gold-soft text-gold-foreground",
  silver: "bg-muted text-foreground",
  bronze: "bg-accent-soft text-accent-foreground",
};

function ProfileScreen() {
  const profile = useProfile();
  const interests = profile.interests.length ? profile.interests : DEFAULT_INTERESTS;

  async function shareProfile() {
    const url = `${typeof window !== "undefined" ? window.location.origin : ""}/profile`;
    const text = `${profile.fullName || "A TIAN member"} (@${usernameOf(profile)}) on TIAN`;
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: "TIAN profile", text, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast.success("Profile link copied");
    } catch {
      /* share dismissed */
    }
  }

  return (
    <AppScreen>
      <ProfileHeader profile={profile} />

      <div className="space-y-4 px-5 pt-5">
        <div className="animate-fade-up grid grid-cols-3 gap-2">
          <Button asChild variant="default" size="pill" className="text-xs">
            <Link to="/profile-setup">
              <Pencil className="size-4" /> Edit
            </Link>
          </Button>
          <Button variant="soft" size="pill" className="text-xs" onClick={shareProfile}>
            <Share2 className="size-4" /> Share
          </Button>
          <Button asChild variant="soft" size="pill" className="text-xs">
            <Link to="/settings">
              <Settings className="size-4" /> Settings
            </Link>
          </Button>
        </div>

        <ProfileCard title="About" style={{ animationDelay: "60ms" }}>
          <p className="text-[13.5px] leading-relaxed text-muted-foreground">
            {profile.bio ||
              "Award participant passionate about hiking, design and community service — building skills, leading teams and giving back through the International Award."}
          </p>
        </ProfileCard>

        <ProfileCard title="Interests" style={{ animationDelay: "100ms" }}>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest) => (
              <Tag key={interest}>{interest}</Tag>
            ))}
          </div>
        </ProfileCard>

        <ProfileCard
          title="Achievements"
          style={{ animationDelay: "140ms" }}
          action={
            <span className="text-[11px] font-bold uppercase tracking-wide text-primary">
              {ACHIEVEMENTS.length} records
            </span>
          }
        >
          <ul className="space-y-2.5">
            {ACHIEVEMENTS.map((a) => (
              <li
                key={a.id}
                className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3 transition-transform duration-200 active:scale-[0.99]"
              >
                <span
                  className={`grid size-11 shrink-0 place-items-center rounded-2xl ${LEVEL_TONE[a.level]}`}
                >
                  <Award className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-bold text-foreground">{a.title}</p>
                  <p className="truncate text-[11.5px] text-muted-foreground">{a.issuer}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[11px] font-semibold text-muted-foreground">{a.date}</p>
                  <p
                    className={`text-[10.5px] font-bold uppercase tracking-wide ${a.verified ? "text-accent" : "text-muted-foreground"}`}
                  >
                    {a.verified ? "Verified" : "Pending"}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </ProfileCard>

        <ProfileCard
          title="Communities"
          style={{ animationDelay: "180ms" }}
          action={
            <Link to="/community" className="text-[11px] font-bold uppercase tracking-wide text-primary">
              See all
            </Link>
          }
        >
          <ul className="space-y-2.5">
            {COMMUNITIES.map((c) => (
              <li key={c.id}>
                <Link
                  to="/community"
                  className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3 transition-transform duration-200 active:scale-[0.99]"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary">
                    <Users className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-bold text-foreground">{c.name}</p>
                    <p className="truncate text-[11.5px] text-muted-foreground">
                      {c.category} · {c.members}
                    </p>
                  </div>
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        </ProfileCard>
      </div>
    </AppScreen>
  );
}
