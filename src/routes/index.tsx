import { createFileRoute, Link } from "@tanstack/react-router";
import { Globe2, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileShell } from "@/components/tian/mobile-shell";
import { TianLogo } from "@/components/tian/tian-logo";
import globe from "@/assets/welcome-globe.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TIAN — The International Award Network" },
      {
        name: "description",
        content:
          "TIAN connects participants, Award Leaders, centres, assessors, alumni and universities across the International Award community.",
      },
      { property: "og:title", content: "TIAN — The International Award Network" },
      {
        property: "og:description",
        content: "The global community platform for the International Award community.",
      },
    ],
  }),
  component: Welcome,
});

const highlights = [
  { icon: Globe2, title: "One global network", copy: "130+ countries, one community." },
  { icon: ShieldCheck, title: "Verified members", copy: "Centres, leaders and assessors." },
  { icon: Sparkles, title: "Built for your Award", copy: "Guidance, peers and opportunity." },
];

function Welcome() {
  return (
    <MobileShell tone="navy" className="relative overflow-hidden">
      <div className="relative flex flex-1 flex-col px-6 pb-8 pt-14">
        <div className="flex items-center gap-3 animate-fade-up">
          <TianLogo className="size-12 text-lg" />
          <div>
            <p className="font-display text-base font-extrabold text-primary-foreground">TIAN</p>
            <p className="text-[11px] font-medium tracking-wide text-primary-foreground/60">
              The International Award Network
            </p>
          </div>
        </div>

        <div className="relative mt-8 animate-pop">
          <img
            src={globe}
            alt="Illustration of a connected global network of Award community members"
            width={1024}
            height={1024}
            className="mx-auto w-[86%] rounded-3xl opacity-95 mix-blend-screen"
          />
        </div>

        <div className="mt-6 animate-fade-up">
          <h1 className="font-display text-[32px] font-extrabold leading-[1.1] text-primary-foreground">
            Your Award journey,
            <br />
            <span className="text-gold-gradient">shared with the world.</span>
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-primary-foreground/70">
            An independent community for participants, Award Leaders, centres, assessors, alumni and
            universities.
          </p>
        </div>

        <ul className="mt-6 space-y-2.5">
          {highlights.map(({ icon: Icon, title, copy }) => (
            <li
              key={title}
              className="flex items-center gap-3 rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-3 backdrop-blur-sm"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-gold/15 text-gold">
                <Icon className="size-[18px]" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold text-primary-foreground">{title}</span>
                <span className="block truncate text-xs text-primary-foreground/60">{copy}</span>
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-8 space-y-3">
          <Button asChild variant="gold" size="pill">
            <Link to="/create-account">Create your account</Link>
          </Button>
          <Button asChild variant="ghostLight" size="pill">
            <Link to="/home">I already have an account</Link>
          </Button>
          <p className="pt-1 text-center text-[11px] leading-relaxed text-primary-foreground/45">
            TIAN is an independent community platform and is not operated by the Duke of Edinburgh's
            International Award Foundation.
          </p>
        </div>
      </div>
    </MobileShell>
  );
}
