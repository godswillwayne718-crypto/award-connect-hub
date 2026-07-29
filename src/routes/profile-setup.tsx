import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileShell } from "@/components/tian/mobile-shell";
import { Chip, Field, TextField } from "@/components/tian/fields";
import { StepHeader } from "@/components/tian/step-header";
import { INTERESTS, updateProfile, useProfile } from "@/lib/tian-store";

export const Route = createFileRoute("/profile-setup")({
  head: () => ({
    meta: [
      { title: "Profile setup — TIAN" },
      { name: "description", content: "Add a photo, headline and interests to your TIAN profile." },
      { property: "og:title", content: "Profile setup — TIAN" },
      { property: "og:description", content: "Make your Award story discoverable." },
    ],
  }),
  component: ProfileSetup,
});

function ProfileSetup() {
  const profile = useProfile();
  const navigate = useNavigate();
  const initials =
    profile.fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0]?.toUpperCase())
      .join("") || "T";

  const toggle = (interest: string) =>
    updateProfile({
      interests: profile.interests.includes(interest)
        ? profile.interests.filter((i) => i !== interest)
        : [...profile.interests, interest],
    });

  return (
    <MobileShell tone="white">
      <header className="px-5 pt-6">
        <Button asChild variant="ghost" size="icon" className="rounded-xl">
          <Link to="/account-setup">
            <ArrowLeft />
          </Link>
        </Button>
      </header>

      <div className="flex flex-1 flex-col px-6 pb-8 pt-4">
        <StepHeader
          step={3}
          total={3}
          title="Build your profile"
          subtitle="A complete profile gets 4× more connections across the network."
        />

        <div className="mt-7 flex flex-col items-center animate-pop">
          <button
            type="button"
            className="press relative grid size-24 place-items-center rounded-full bg-navy-gradient font-display text-2xl font-extrabold text-primary-foreground shadow-lift"
          >
            {initials}
            <span className="absolute -bottom-0.5 -right-0.5 grid size-8 place-items-center rounded-full border-2 border-background bg-gold-gradient text-gold-foreground">
              <Camera className="size-4" />
            </span>
          </button>
          <p className="mt-2.5 text-xs font-medium text-muted-foreground">Add a profile photo</p>
        </div>

        <div className="mt-7 space-y-4">
          <Field
            label="Headline"
            placeholder="Gold Award participant · Youth climate volunteer"
            value={profile.headline}
            onChange={(e) => updateProfile({ headline: e.target.value })}
          />
          <TextField
            label="About you"
            placeholder="Share your Award journey, what you're working on, and what you'd love help with."
            hint="Keep it short — 2 to 3 sentences works best."
            value={profile.bio}
            onChange={(e) => updateProfile({ bio: e.target.value })}
          />
        </div>

        <div className="mt-6">
          <p className="mb-2.5 text-sm font-semibold text-foreground">Interests</p>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map((interest) => (
              <Chip
                key={interest}
                label={interest}
                selected={profile.interests.includes(interest)}
                onToggle={() => toggle(interest)}
              />
            ))}
          </div>
        </div>

        <div className="mt-auto space-y-2 pt-8">
          <Button variant="success" size="pill" onClick={() => navigate({ to: "/home" })}>
            Enter TIAN
          </Button>
          <Button variant="ghost" size="pill" onClick={() => navigate({ to: "/home" })}>
            Skip for now
          </Button>
        </div>
      </div>
    </MobileShell>
  );
}
