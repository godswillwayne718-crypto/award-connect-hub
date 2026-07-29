import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Award,
  Building2,
  GraduationCap,
  MapPin,
  ShieldCheck,
  Sprout,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileShell } from "@/components/tian/mobile-shell";
import { Field, SelectCard } from "@/components/tian/fields";
import { StepHeader } from "@/components/tian/step-header";
import { LEVELS, ROLES, updateProfile, useProfile, type TianRole } from "@/lib/tian-store";

export const Route = createFileRoute("/account-setup")({
  head: () => ({
    meta: [
      { title: "Account setup — TIAN" },
      { name: "description", content: "Tell TIAN your role in the International Award community." },
      { property: "og:title", content: "Account setup — TIAN" },
      { property: "og:description", content: "Choose your role, level and Award Centre." },
    ],
  }),
  component: AccountSetup,
});

const roleIcons: Record<TianRole, typeof Award> = {
  participant: Sprout,
  "award-leader": UserCheck,
  assessor: ShieldCheck,
  alumni: Award,
  centre: Building2,
  university: GraduationCap,
};

function AccountSetup() {
  const profile = useProfile();
  const navigate = useNavigate();
  const valid = Boolean(profile.role && profile.level && profile.country.trim());

  return (
    <MobileShell tone="white">
      <header className="px-5 pt-6">
        <Button asChild variant="ghost" size="icon" className="rounded-xl">
          <Link to="/create-account">
            <ArrowLeft />
          </Link>
        </Button>
      </header>

      <div className="flex flex-1 flex-col px-6 pb-8 pt-4">
        <StepHeader
          step={2}
          total={3}
          title="How are you connected?"
          subtitle="This shapes the people, centres and opportunities we surface for you."
        />

        <div className="mt-6 space-y-2.5">
          {ROLES.map((role) => {
            const Icon = roleIcons[role.value];
            return (
              <SelectCard
                key={role.value}
                title={role.label}
                description={role.description}
                icon={<Icon />}
                selected={profile.role === role.value}
                onSelect={() => updateProfile({ role: role.value })}
              />
            );
          })}
        </div>

        <div className="mt-7">
          <p className="mb-2 text-sm font-semibold text-foreground">Award level</p>
          <div className="grid grid-cols-4 gap-2">
            {LEVELS.map((level) => (
              <button
                key={level.value}
                type="button"
                onClick={() => updateProfile({ level: level.value })}
                className={
                  profile.level === level.value
                    ? "press rounded-2xl border border-gold bg-gold-soft px-2 py-3 text-xs font-bold text-gold-foreground"
                    : "press rounded-2xl border border-border bg-card px-2 py-3 text-xs font-semibold text-muted-foreground"
                }
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <Field
            label="Country"
            placeholder="Kenya"
            icon={<MapPin />}
            value={profile.country}
            onChange={(e) => updateProfile({ country: e.target.value })}
          />
          <Field
            label="Award Centre (optional)"
            placeholder="Nairobi International Award Centre"
            icon={<Building2 />}
            value={profile.centre}
            onChange={(e) => updateProfile({ centre: e.target.value })}
          />
        </div>

        <div className="mt-auto pt-8">
          <Button
            variant="hero"
            size="pill"
            disabled={!valid}
            onClick={() => navigate({ to: "/profile-setup" })}
          >
            Continue
          </Button>
        </div>
      </div>
    </MobileShell>
  );
}
