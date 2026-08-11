import { UserPlus, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { addContact, removeContact, useIsContact } from "@/lib/contacts-store";
import { useIsBlocked } from "@/lib/chat-store";
import type { Person } from "@/lib/people-data";
import { cn } from "@/lib/utils";

/**
 * Add / Added toggle used on profiles, search results and contact rows.
 * Blocked members can never be added.
 */
export function AddContactButton({
  person,
  className,
  full,
}: {
  person: Person;
  className?: string;
  full?: boolean;
}) {
  const added = useIsContact(person.id);
  const blocked = useIsBlocked(person.id);

  if (blocked) {
    return (
      <Button
        variant="soft"
        size="pillAuto"
        disabled
        className={cn("text-xs", full && "w-full", className)}
      >
        Blocked
      </Button>
    );
  }

  return (
    <Button
      variant={added ? "soft" : "default"}
      size="pillAuto"
      aria-pressed={added}
      className={cn("text-xs", full && "w-full", className)}
      onClick={() => {
        if (added) {
          removeContact(person.id);
          toast.success(`Removed @${person.username} from contacts`);
        } else {
          addContact(person.id);
          toast.success(`Added @${person.username} to contacts`);
        }
      }}
    >
      {added ? <UserCheck className="size-4" /> : <UserPlus className="size-4" />}
      {added ? "Added to Contacts" : "Add to Contacts"}
    </Button>
  );
}
