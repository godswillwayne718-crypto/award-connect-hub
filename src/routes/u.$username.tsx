import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, MapPin, MessageCircle, ShieldCheck, Users } from "lucide-react";
import { AppScreen } from "@/components/tian/app-screen";
import { ProfileCard, Tag } from "@/components/tian/profile-card";
import { PersonAvatar } from "@/components/shared/person-avatar";
import { UsernameBadge } from "@/components/shared/username-badge";
import { AddContactButton } from "@/components/shared/add-contact-button";
import { EmptyState } from "@/components/community/empty-state";
import { Button } from "@/components/ui/button";
import { findPersonByUsername } from "@/lib/people-data";
import { startChat, useIsBlocked } from "@/lib/chat-store";
import { COMMUNITIES, MEMBERS } from "@/lib/community-data";

export const Route = createFileRoute("/u/$username")({
  head: ({ params }) => {
    const handle = `@${params.username}`;
    return {
      meta: [
        { title: `${handle} — TIAN profile` },
        {
          name: "description",
          content: `${handle} on TIAN: Award role, level, country, communities and contact actions.`,
        },
        { property: "og:title", content: `${handle} — TIAN profile` },
        { property: "og:description", content: `View ${handle}'s Award profile on TIAN.` },
        { property: "og:type", content: "profile" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: PersonProfileScreen,
});

const BIOS: Record<string, string> = {
  Participant: "Working through the Award — building skills, staying active and volunteering locally.",
  "Award Leader": "Supporting participants through every section of the Award and sharing what works.",
  Assessor: "Assessing Adventurous Journeys and helping participants tell their story well.",
  Alumni: "Award graduate giving back through mentoring and the alumni network.",
  "Award Centre": "Licensed Award Centre coordinating programmes and volunteers.",
  "University partner": "Recognising the Award in admissions and scholarship pathways.",
  "Volunteer coordinator": "Connecting participants with meaningful volunteering placements.",
};

function PersonProfileScreen() {
  const { username } = Route.useParams();
  const person = findPersonByUsername(username);
  const navigate = useNavigate();
  const blocked = useIsBlocked(person?.id ?? "");

  if (!person) {
    return (
      <AppScreen>
        <div className="px-5 pt-10">
          <EmptyState
            icon={Users}
            title="Profile not found"
            copy={`No TIAN member matches @${username}.`}
            action={
              <Button asChild size="pillAuto" variant="default">
                <Link to="/contacts">Find People</Link>
              </Button>
            }
          />
        </div>
      </AppScreen>
    );
  }

  const communities = COMMUNITIES.filter((c) =>
    MEMBERS.some(
      (m) =>
        m.username.toLowerCase() === person.username.toLowerCase() &&
        m.id.startsWith(`${c.id}-mem-`),
    ),
  );

  function message() {
    if (!person || blocked) return;
    const chatId = startChat(person.id);
    void navigate({ to: "/chats/$chatId", params: { chatId } });
  }

  return (
    <AppScreen>
      <header className="relative">
        <div className="h-28 bg-navy-gradient sm:h-36" />
        <Link
          to="/contacts"
          aria-label="Back to contacts"
          className="absolute left-4 top-4 grid size-11 place-items-center rounded-full bg-background/20 text-primary-foreground backdrop-blur focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        >
          <ChevronLeft className="size-5" />
        </Link>

        <div className="-mt-10 px-5">
          <div className="animate-pop w-fit rounded-full ring-4 ring-background">
            <PersonAvatar
              name={person.name}
              online={person.online}
              size="lg"
              tone="navy"
              className="[&>span:first-child]:size-20 [&>span:first-child]:text-xl"
            />
          </div>
          <div className="animate-fade-up mt-3">
            <h1 className="font-display text-[22px] font-extrabold leading-tight tracking-tight text-foreground">
              {person.name}
            </h1>
            <UsernameBadge username={person.username} verified={person.verified} />
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-primary-foreground">
                {person.role}
              </span>
              {person.level ? (
                <span className="rounded-full bg-gold-soft px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-gold-foreground">
                  {person.level}
                </span>
              ) : null}
              <span className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-[11px] font-semibold text-muted-foreground">
                <MapPin className="size-3" />
                {person.country}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="space-y-4 px-5 pt-5">
        <div className="animate-fade-up grid grid-cols-1 gap-2 sm:grid-cols-2">
          <AddContactButton person={person} full />
          <Button
            variant="soft"
            size="pillAuto"
            className="w-full text-xs"
            onClick={message}
            disabled={blocked}
          >
            <MessageCircle className="size-4" />
            {blocked ? "Blocked" : "Message"}
          </Button>
        </div>

        <ProfileCard title="About" style={{ animationDelay: "60ms" }}>
          <p className="text-[13.5px] leading-relaxed text-muted-foreground">
            {BIOS[person.role] ?? BIOS.Participant}
          </p>
          <p className="mt-2 text-[11.5px] text-muted-foreground">{person.lastSeen}</p>
        </ProfileCard>

        <ProfileCard title="Award focus" style={{ animationDelay: "100ms" }}>
          <div className="flex flex-wrap gap-2">
            <Tag>{person.role}</Tag>
            {person.level ? <Tag>{person.level} Award</Tag> : null}
            <Tag>{person.country}</Tag>
          </div>
        </ProfileCard>

        {communities.length > 0 ? (
          <ProfileCard title="Communities" style={{ animationDelay: "140ms" }}>
            <ul className="space-y-2.5">
              {communities.map((c) => (
                <li key={c.id}>
                  <Link
                    to="/community/$communityId"
                    params={{ communityId: c.id }}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3"
                  >
                    <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary-soft font-display text-xs font-extrabold text-primary">
                      {c.logoInitials}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[13px] font-bold text-foreground">
                      {c.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </ProfileCard>
        ) : null}

        <p className="flex items-start gap-2 px-1 pb-2 text-[11.5px] text-muted-foreground">
          <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-accent" aria-hidden="true" />
          TIAN never shows phone numbers or email addresses. Members connect through @usernames only.
        </p>
      </div>
    </AppScreen>
  );
}
