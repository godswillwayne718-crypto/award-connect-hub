import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/tian/app-screen";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community — TIAN" },
      { name: "description", content: "Award community groups and centres, coming soon to TIAN." },
      { property: "og:title", content: "Community — TIAN" },
      { property: "og:description", content: "Groups and centres across the Award network." },
    ],
  }),
  component: () => (
    <ComingSoon title="Community" copy="Groups, centres and country hubs arrive in the next release." />
  ),
});
