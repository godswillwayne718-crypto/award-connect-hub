import type { ReactNode } from "react";
import { MobileShell } from "@/components/tian/mobile-shell";
import { BottomNav } from "@/components/tian/bottom-nav";

/** Standard signed-in screen: scrollable content + persistent bottom navigation. */
export function AppScreen({ children }: { children: ReactNode }) {
  return (
    <MobileShell>
      <div className="flex-1 pb-4">{children}</div>
      <BottomNav />
    </MobileShell>
  );
}

export function ComingSoon({ title, copy }: { title: string; copy: string }) {
  return (
    <AppScreen>
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-8 text-center animate-fade-up">
        <span className="grid size-16 place-items-center rounded-3xl bg-primary-soft font-display text-xl font-extrabold text-primary">
          {title[0]}
        </span>
        <h1 className="mt-4 font-display text-xl font-extrabold text-foreground">{title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy}</p>
      </div>
    </AppScreen>
  );
}
