import { Link, useNavigate } from "@tanstack/react-router";
import { MapPin, MessageCircle, UserMinus } from "lucide-react";
import { toast } from "sonner";
import { PersonAvatar } from "@/components/shared/person-avatar";
import { UsernameBadge } from "@/components/shared/username-badge";
import { Button } from "@/components/ui/button";
import { removeContact } from "@/lib/contacts-store";
import { startChat, useIsBlocked } from "@/lib/chat-store";
import type { Person } from "@/lib/people-data";

/** One saved contact: identity, Award context and the three core actions. */
export function ContactRow({ person, index = 0 }: { person: Person; index?: number }) {
  const navigate = useNavigate();
  const blocked = useIsBlocked(person.id);

  return (
    <li
      className="animate-fade-up rounded-3xl border border-border bg-card p-3.5 shadow-soft"
      style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
    >
      <div className="flex items-center gap-3">
        <PersonAvatar name={person.name} online={person.online} tone="navy" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-[15px] font-extrabold tracking-tight text-foreground">
            {person.name}
          </p>
          <UsernameBadge username={person.username} verified={person.verified} />
          <p className="mt-0.5 flex items-center gap-1.5 truncate text-[11.5px] text-muted-foreground">
            <MapPin className="size-3 shrink-0" aria-hidden="true" />
            {person.country}
            {person.level ? <span className="text-gold-foreground">· {person.level}</span> : null}
          </p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-1.5">
        <Button asChild variant="soft" size="pillAuto" className="w-full px-2 text-[11px]">
          <Link to="/u/$username" params={{ username: person.username }}>
            View Profile
          </Link>
        </Button>
        <Button
          variant="default"
          size="pillAuto"
          className="w-full px-2 text-[11px]"
          disabled={blocked}
          onClick={() => {
            const chatId = startChat(person.id);
            void navigate({ to: "/chats/$chatId", params: { chatId } });
          }}
        >
          <MessageCircle className="size-4" /> Message
        </Button>
        <Button
          variant="soft"
          size="pillAuto"
          className="w-full px-2 text-[11px] text-destructive"
          onClick={() => {
            removeContact(person.id);
            toast.success(`Removed @${person.username} from contacts`);
          }}
        >
          <UserMinus className="size-4" /> Remove
        </Button>
      </div>
    </li>
  );
}
