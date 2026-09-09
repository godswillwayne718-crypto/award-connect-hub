import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Lock, Mail, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { MobileShell } from "@/components/tian/mobile-shell";
import { Field } from "@/components/tian/fields";
import { StepHeader } from "@/components/tian/step-header";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/create-account")({
  head: () => ({
    meta: [
      { title: "Create your TIAN account" },
      { name: "description", content: "Join the International Award Network in under a minute." },
      { property: "og:title", content: "Create your TIAN account" },
      { property: "og:description", content: "Join the International Award Network." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CreateAccount,
});

function CreateAccount() {
  const navigate = useNavigate();
  const { userId, loading } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  const valid = fullName.trim().length > 1 && email.includes("@") && password.length >= 8;

  useEffect(() => {
    if (!loading && userId) void navigate({ to: "/account-setup", replace: true });
  }, [loading, userId, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
        data: { full_name: fullName.trim() },
      },
    });
    setBusy(false);

    if (error) {
      toast.error(error.message || "We couldn't create your account. Please try again.");
      return;
    }
    if (!data.session) {
      setCheckEmail(true);
      return;
    }
    toast.success("Account created");
    void navigate({ to: "/account-setup", replace: true });
  }

  if (checkEmail) {
    return (
      <MobileShell tone="white">
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
          <h1 className="font-display text-xl font-extrabold tracking-tight text-foreground">
            Confirm your email
          </h1>
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            We sent a confirmation link to {email}. Open it, then come back and sign in.
          </p>
          <Button asChild variant="hero" size="pill" className="mt-2 max-w-xs">
            <Link to="/sign-in">Go to sign in</Link>
          </Button>
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell tone="white">
      <header className="px-5 pt-6">
        <Button asChild variant="ghost" size="icon" className="rounded-xl">
          <Link to="/">
            <ArrowLeft />
          </Link>
        </Button>
      </header>

      <form className="flex flex-1 flex-col px-6 pb-8 pt-4" onSubmit={submit}>
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
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <Field
            label="Email address"
            type="email"
            placeholder="you@example.com"
            icon={<Mail />}
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          <Button type="submit" variant="hero" size="pill" disabled={!valid || busy}>
            {busy ? "Creating your account…" : "Continue"}
          </Button>
          <p className="text-center text-[12px] text-muted-foreground">
            Already have an account?{" "}
            <Link to="/sign-in" className="font-bold text-primary">
              Sign in
            </Link>
          </p>
          <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
            By continuing you agree to the TIAN Community Guidelines and Privacy Policy.
          </p>
        </div>
      </form>
    </MobileShell>
  );
}
