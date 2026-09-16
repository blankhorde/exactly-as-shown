import { createFileRoute } from "@tanstack/react-router";
import { RoundScreen } from "@/components/lumen/RoundScreen";
import { themeById } from "@/components/lumen/themes";

export const Route = createFileRoute("/lantern")({
  head: () => ({
    meta: [
      { title: "Lumen — Lantern direction | Kweza" },
      {
        name: "description",
        content:
          "Lumen board direction one: a walnut-dark hall with brass clue plaques and warm amber light, played on a mid-round grid.",
      },
      { property: "og:title", content: "Lumen — Lantern direction" },
      {
        property: "og:description",
        content: "Walnut night, brass plaques, warm amber spill: Lumen's grid as a dark hall you light one lamp at a time.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <RoundScreen theme={themeById("lantern")} />,
});
