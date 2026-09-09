import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileShell } from "@/components/tian/mobile-shell";
import { useAuth } from "@/lib/auth";

/**
 * Everything social in TIAN needs a real account: the signed-in auth user id
 * is the only identity the app recognises.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { loading, userId } = useAuth();

  if (loading) {
    return (
      <MobileShell tone="white">
        <div className="flex flex-1 items-center justify-center px-6">
          <p className="text-sm font-semibold text-muted-foreground">Loading your account…</p>
        </div>
      </MobileShell>
    );
  }

  if (!userId) {
    return (
      <MobileShell tone="white">
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary">
            <LogIn className="size-6" aria-hidden="true" />
          </span>
          <div>
            <h1 className="font-display text-xl font-extrabold tracking-tight text-foreground">
              Sign in to continue
            </h1>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
              TIAN members find each other by @username. Sign in to your account to use messaging,
              contacts and Status.
            </p>
          </div>
          <div className="w-full max-w-xs space-y-2">
            <Button asChild variant="hero" size="pill">
              <Link to="/sign-in">Sign in</Link>
            </Button>
            <Button asChild variant="ghost" size="pill">
              <Link to="/create-account">Create an account</Link>
            </Button>
          </div>
        </div>
      </MobileShell>
    );
  }

  return <>{children}</>;
}
