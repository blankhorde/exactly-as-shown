import { createFileRoute } from "@tanstack/react-router";
import { RoundScreen } from "@/components/lumen/RoundScreen";
import { themeById } from "@/components/lumen/themes";

export const Route = createFileRoute("/blueprint")({
  head: () => ({
    meta: [
      { title: "Lumen — Blueprint direction | Kweza" },
      {
        name: "description",
        content:
          "Lumen board direction two: a cold drafting table where ink-navy blocks number the light and hairline beams run every axis.",
      },
      { property: "og:title", content: "Lumen — Blueprint direction" },
      {
        property: "og:description",
        content: "Cold paper, ink-navy blocks, measured beams: Lumen's grid as a drafting exercise in light.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <RoundScreen theme={themeById("blueprint")} />,
});
