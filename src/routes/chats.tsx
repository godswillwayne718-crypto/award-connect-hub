import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/tian/app-screen";

export const Route = createFileRoute("/chats")({
  head: () => ({
    meta: [
      { title: "Chats — TIAN" },
      { name: "description", content: "Private and group messaging for the Award community." },
      { property: "og:title", content: "Chats — TIAN" },
      { property: "og:description", content: "Messaging for the Award community." },
    ],
  }),
  component: () => (
    <ComingSoon title="Chats" copy="Direct and group messaging is next on the TIAN roadmap." />
  ),
});
