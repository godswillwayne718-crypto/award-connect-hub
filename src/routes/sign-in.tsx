import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { MobileShell } from "@/components/tian/mobile-shell";
import { Field } from "@/components/tian/fields";
import { StepHeader } from "@/components/tian/step-header";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { OtpForm } from "@/components/tian/otp-form";

export const Route = createFileRoute("/sign-in")({
  head: () => ({
    meta: [
      { title: "Sign in — TIAN" },
      { name: "description", content: "Sign in to your TIAN account to message Award members." },
      { property: "og:title", content: "Sign in — TIAN" },
      { property: "og:description", content: "Sign in to The International Award Network." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SignIn,
});

function SignIn() {
  const navigate = useNavigate();
  const { userId, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  useEffect(() => {
    if (!loading && userId) void navigate({ to: "/home", replace: true });
  }, [loading, userId, navigate]);

  async function sendCode() {
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: false },
    });
    if (error) throw error;
  }

  async function requestCode() {
    if (!email.includes("@")) {
      toast.error("Enter your email address first.");
      return;
    }
    setBusy(true);
    try {
      await sendCode();
      setCodeSent(true);
    } catch (err) {
      toast.error(
        (err as Error).message || "Couldn't send a code. Check the email or create an account.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) {
      toast.error(error.message || "We couldn't sign you in. Check your details and try again.");
      return;
    }
    toast.success("Welcome back to TIAN");
    void navigate({ to: "/home", replace: true });
  }

  if (codeSent) {
    return (
      <MobileShell tone="white">
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
          <h1 className="font-display text-xl font-extrabold tracking-tight text-foreground">
            Enter your sign-in code
          </h1>
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            We sent a code to {email}. If the email only has a link, tap it to sign in.
          </p>
          <OtpForm
            email={email.trim()}
            type="email"
            onVerified={() => void navigate({ to: "/home", replace: true })}
            onResend={sendCode}
          />
          <Button variant="ghost" size="pill" className="max-w-xs" onClick={() => setCodeSent(false)}>
            Use password instead
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
          total={1}
          title="Welcome back"
          subtitle="Sign in with the email and password you used to create your TIAN account."
        />

        <div className="mt-7 space-y-4">
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
            placeholder="Your password"
            icon={<Lock />}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="mt-auto space-y-3 pt-8">
          <Button
            type="submit"
            variant="hero"
            size="pill"
            disabled={busy || !email.includes("@") || password.length < 6}
          >
            {busy ? "Signing in…" : "Sign in"}
          </Button>
          <Button type="button" variant="ghost" size="pill" disabled={busy} onClick={requestCode}>
            Email me a sign-in code instead
          </Button>
          <p className="text-center text-[12px] text-muted-foreground">
            New to TIAN?{" "}
            <Link to="/create-account" className="font-bold text-primary">
              Create an account
            </Link>
          </p>
        </div>
      </form>
    </MobileShell>
  );
}
