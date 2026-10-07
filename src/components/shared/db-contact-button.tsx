import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useContactMutations, useContacts } from "@/lib/social";
import type { Profile } from "@/lib/directory";

/** Saves or removes a real member from my backend contacts. */
export function DbContactButton({ profile }: { profile: Profile }) {
  const { userId } = useAuth();
  const contacts = useContacts(userId).data ?? [];
  const { add, remove } = useContactMutations(userId);
  if (!userId || userId === profile.id) return null;
  const saved = contacts.some((c) => c.id === profile.id);
  const busy = add.isPending || remove.isPending;

  return (
    <Button
      size="sm"
      variant={saved ? "ghost" : "soft"}
      className="h-11 rounded-full px-4 text-xs"
      disabled={busy}
      onClick={async () => {
        try {
          if (saved) {
            await remove.mutateAsync(profile.id);
            toast.success(`Removed @${profile.username}`);
          } else {
            await add.mutateAsync(profile.id);
            toast.success(`Added @${profile.username} to contacts`);
          }
        } catch {
          toast.error("Couldn't update contacts. Try again.");
        }
      }}
    >
      {saved ? "Saved" : "Add"}
    </Button>
  );
}
