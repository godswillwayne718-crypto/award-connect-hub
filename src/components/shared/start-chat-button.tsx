import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { openConversation } from "@/lib/messaging";
import type { Profile } from "@/lib/directory";

/** Opens (or creates) the one conversation with a real member. */
export function StartChatButton({ profile, label = "Message" }: { profile: Profile; label?: string }) {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  if (!userId || userId === profile.id) return null;

  return (
    <Button
      size="sm"
      className="h-11 rounded-full px-4 text-xs"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        try {
          const chatId = await openConversation(userId, profile.id);
          void navigate({ to: "/chats/$chatId", params: { chatId } });
        } catch {
          toast.error("We couldn't open this chat. Please try again.");
        } finally {
          setBusy(false);
        }
      }}
    >
      {busy ? "Opening…" : label}
    </Button>
  );
}
