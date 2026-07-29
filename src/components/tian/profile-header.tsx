import { Link } from "@tanstack/react-router";
import { BadgeCheck, Camera, MapPin } from "lucide-react";
import cover from "@/assets/profile-cover.jpg";
import { initialsOf, levelLabel, roleLabel, usernameOf } from "@/lib/tian-profile-data";
import type { TianProfile } from "@/lib/tian-store";

/** Cover banner + avatar + identity block. */
export function ProfileHeader({ profile }: { profile: TianProfile }) {
  const name = profile.fullName || "Your name";
  const level = levelLabel(profile.level);

  return (
    <header className="relative">
      <div className="relative h-40 overflow-hidden rounded-b-[2rem] bg-navy-gradient">
        <img
          src={cover}
          alt=""
          width={1536}
          height={640}
          className="size-full object-cover opacity-90"
        />
        <button
          type="button"
          className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-background/20 text-primary-foreground backdrop-blur transition-transform duration-200 active:scale-95"
          aria-label="Change cover photo"
        >
          <Camera className="size-4" />
        </button>
      </div>

      <div className="-mt-12 px-5">
        <div className="animate-pop relative w-fit">
          <span className="grid size-24 place-items-center rounded-full bg-navy-deep font-display text-2xl font-extrabold text-primary-foreground ring-4 ring-background">
            {initialsOf(profile.fullName)}
          </span>
          <button
            type="button"
            className="absolute bottom-1 right-1 grid size-7 place-items-center rounded-full bg-accent text-accent-foreground ring-2 ring-background transition-transform duration-200 active:scale-95"
            aria-label="Change profile photo"
          >
            <Camera className="size-3.5" />
          </button>
        </div>

        <div className="animate-fade-up mt-3">
          <div className="flex items-center gap-1.5">
            <h1 className="font-display text-[22px] font-extrabold leading-tight tracking-tight text-foreground">
              {name}
            </h1>
            <BadgeCheck className="size-[18px] shrink-0 text-accent" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">@{usernameOf(profile)}</p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-primary-foreground">
              {roleLabel(profile.role)}
            </span>
            {level ? (
              <span className="rounded-full bg-gold-soft px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-gold-foreground">
                {level === "Completed" ? "Award Completed" : `${level} Award`}
              </span>
            ) : null}
            <span className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-[11px] font-semibold text-muted-foreground">
              <MapPin className="size-3" />
              {profile.country || "Add country"}
            </span>
          </div>

          {profile.centre ? (
            <p className="mt-2.5 text-xs font-medium text-muted-foreground">
              Award Centre ·{" "}
              <Link to="/community" className="font-semibold text-primary">
                {profile.centre}
              </Link>
            </p>
          ) : null}
        </div>
      </div>
    </header>
  );
}
