import { createFileRoute } from "@tanstack/react-router";
import { RoundScreen } from "@/components/lumen/RoundScreen";
import { themeById } from "@/components/lumen/themes";

export const Route = createFileRoute("/blueprint")({
  head: () => ({
    meta: [
      { title: "Lumen — Workbench | Kweza" },
      {
        name: "description",
        content:
          "Lumen Workbench: a physical brass board on a dark tiled surface, lit by the player's lamps.",
      },
      { property: "og:title", content: "Lumen — Workbench" },
      {
        property: "og:description",
        content: "A Lumen board on a broad work surface, where warm beams expose every solved path.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <RoundScreen theme={themeById("workbench")} />,
});
