import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/tian/app-screen";

export const Route = createFileRoute("/status")({
  head: () => ({
    meta: [
      { title: "Status — TIAN" },
      { name: "description", content: "Share 24-hour Award journey updates with your network." },
      { property: "og:title", content: "Status — TIAN" },
      { property: "og:description", content: "Daily Award journey updates." },
    ],
  }),
  component: () => (
    <ComingSoon title="Status" copy="Share 24-hour updates from your Award journey. Coming soon." />
  ),
});
