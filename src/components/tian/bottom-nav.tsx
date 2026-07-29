import { Link } from "@tanstack/react-router";
import { Home, Users, CircleDashed, MessageCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/community", label: "Community", icon: Users },
  { to: "/status", label: "Status", icon: CircleDashed },
  { to: "/chats", label: "Chats", icon: MessageCircle, badge: 3 },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function BottomNav() {
  return (
    <nav className="sticky bottom-0 z-30 mt-auto border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur shadow-nav">
      <ul className="grid grid-cols-5">
        {items.map(({ to, label, icon: Icon, ...rest }) => (
          <li key={to}>
            <Link
              to={to}
              activeProps={{ "data-active": "true" }}
              className="group flex flex-col items-center gap-1 py-2.5 text-muted-foreground transition-colors data-[active=true]:text-primary"
            >
              <span className="relative grid size-9 place-items-center rounded-xl transition-all duration-200 group-data-[active=true]:bg-primary-soft">
                <Icon className="size-[19px]" />
                {"badge" in rest && rest.badge ? (
                  <span className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-accent text-[9px] font-bold text-accent-foreground">
                    {rest.badge}
                  </span>
                ) : null}
              </span>
              <span
                className={cn(
                  "text-[10px] font-semibold tracking-tight",
                  "group-data-[active=true]:text-primary",
                )}
              >
                {label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
