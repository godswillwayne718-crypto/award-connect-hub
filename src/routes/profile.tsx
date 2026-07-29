import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Pencil, ShieldCheck } from "lucide-react";
import { AppScreen } from "@/components/tian/app-screen";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/lib/tian-store";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — TIAN" },
      { name: "description", content: "Your TIAN profile, Award level and community interests." },
      { property: "og:title", content: "Profile — TIAN" },
      { property: "og:description", content: "Your Award story on TIAN." },
    ],
  }),
  component: ProfileScreen,
});

function ProfileScreen() {
  const profile = useProfile();
  const name = profile.fullName || "Your name";
  const initials =
    profile.fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0]?.toUpperCase())
      .join("") || "T";

  return (
    <AppScreen>
      <header className="rounded-b-3xl bg-navy-gradient px-5 pb-7 pt-10 text-center shadow-lift">
        <span className="mx-auto grid size-20 place-items-center rounded-full bg-primary-foreground/10 font-display text-xl font-extrabold text-primary-foreground ring-2 ring-gold/40">
          {initials}
        </span>
        <h1 className="mt-3 font-display text-xl font-extrabold text-primary-foreground">{name}</h1>
        <p className="mt-1 text-xs text-primary-foreground/65">
          {profile.headline || "Add a headline to introduce yourself"}
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          {profile.level ? (
            <span className="rounded-full bg-gold/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-gold">
              {profile.level} Award
            </span>
          ) : null}
          <span className="flex items-center gap-1 rounded-full bg-primary-foreground/10 px-3 py-1 text-[11px] font-semibold text-primary-foreground/80">
            <MapPin className="size-3" />
            {profile.country || "Add country"}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-accent/20 px-3 py-1 text-[11px] font-semibold text-primary-foreground">
            <ShieldCheck className="size-3" />
            Pending verification
          </span>
        </div>
      </header>

      <div className="space-y-4 px-5 pt-6">
        <section className="rounded-3xl border border-border bg-card p-4 shadow-soft">
          <h2 className="text-sm font-extrabold text-foreground">About</h2>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">
            {profile.bio || "Tell the network about your Award journey."}
          </p>
        </section>

        {profile.interests.length ? (
          <section className="rounded-3xl border border-border bg-card p-4 shadow-soft">
            <h2 className="text-sm font-extrabold text-foreground">Interests</h2>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {profile.interests.map((i) => (
                <span
                  key={i}
                  className="rounded-full bg-primary-soft px-3 py-1.5 text-[11px] font-semibold text-primary"
                >
                  {i}
                </span>
              ))}
            </div>
          </section>
        ) : null}

        <Button asChild variant="soft" size="pill">
          <Link to="/profile-setup">
            <Pencil /> Edit profile
          </Link>
        </Button>
      </div>
    </AppScreen>
  );
}
