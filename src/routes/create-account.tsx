import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Lock, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileShell } from "@/components/tian/mobile-shell";
import { Field } from "@/components/tian/fields";
import { StepHeader } from "@/components/tian/step-header";
import { updateProfile, useProfile } from "@/lib/tian-store";

export const Route = createFileRoute("/create-account")({
  head: () => ({
    meta: [
      { title: "Create your TIAN account" },
      { name: "description", content: "Join the International Award Network in under a minute." },
      { property: "og:title", content: "Create your TIAN account" },
      { property: "og:description", content: "Join the International Award Network." },
    ],
  }),
  component: CreateAccount,
});

function CreateAccount() {
  const profile = useProfile();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const valid = profile.fullName.trim().length > 1 && profile.email.includes("@") && password.length >= 8;

  return (
    <MobileShell tone="white">
      <header className="px-5 pt-6">
        <Button asChild variant="ghost" size="icon" className="rounded-xl">
          <Link to="/">
            <ArrowLeft />
          </Link>
        </Button>
      </header>

      <form
        className="flex flex-1 flex-col px-6 pb-8 pt-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (valid) navigate({ to: "/account-setup" });
        }}
      >
        <StepHeader
          step={1}
          total={3}
          title="Create your account"
          subtitle="Use the email linked to your Award Centre where possible — it speeds up verification."
        />

        <div className="mt-7 space-y-4 animate-fade-up">
          <Field
            label="Full name"
            placeholder="Amara Okonkwo"
            icon={<User />}
            autoComplete="name"
            value={profile.fullName}
            onChange={(e) => updateProfile({ fullName: e.target.value })}
          />
          <Field
            label="Email address"
            type="email"
            placeholder="you@example.com"
            icon={<Mail />}
            autoComplete="email"
            value={profile.email}
            onChange={(e) => updateProfile({ email: e.target.value })}
          />
          <Field
            label="Password"
            type="password"
            placeholder="At least 8 characters"
            icon={<Lock />}
            autoComplete="new-password"
            hint="Use 8+ characters with a mix of letters and numbers."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="mt-auto space-y-3 pt-8">
          <Button type="submit" variant="hero" size="pill" disabled={!valid}>
            Continue
          </Button>
          <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
            By continuing you agree to the TIAN Community Guidelines and Privacy Policy.
          </p>
        </div>
      </form>
    </MobileShell>
  );
}
