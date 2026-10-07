import { useState } from "react";
import { KeyRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/tian/fields";
import { supabase } from "@/integrations/supabase/client";

/** Enter the 6-digit code emailed to the member to confirm sign-up or sign in. */
export function OtpForm({
  email,
  type,
  onVerified,
  onResend,
}: {
  email: string;
  type: "signup" | "email";
  onVerified: () => void;
  onResend: () => Promise<void>;
}) {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const clean = code.replace(/\D/g, "");

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.verifyOtp({ email, token: clean, type });
    setBusy(false);
    if (error) {
      toast.error("That code is wrong or expired. Check the latest email or resend.");
      return;
    }
    toast.success("Email confirmed");
    onVerified();
  }

  return (
    <form onSubmit={verify} className="flex w-full max-w-xs flex-col gap-3">
      <Field
        label="Verification code"
        placeholder="6-digit code"
        icon={<KeyRound />}
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={10}
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <Button type="submit" variant="hero" size="pill" disabled={busy || clean.length < 6}>
        {busy ? "Checking…" : "Verify code"}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="pill"
        onClick={async () => {
          try {
            await onResend();
            toast.success(`New code sent to ${email}`);
          } catch {
            toast.error("Couldn't resend. Wait a minute and try again.");
          }
        }}
      >
        Resend code
      </Button>
      <p className="text-center text-[11px] text-muted-foreground">
        Can't find it? Check Spam or Promotions in Gmail. You can also tap the link in the email.
      </p>
    </form>
  );
}
