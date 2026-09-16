import { createFileRoute } from "@tanstack/react-router";
import { RoundScreen } from "@/components/lumen/RoundScreen";
import { themeById } from "@/components/lumen/themes";

export const Route = createFileRoute("/lantern")({
  head: () => ({
    meta: [
      { title: "Lumen — Chamber | Kweza" },
      {
        name: "description",
        content:
          "Lumen Chamber: a physical brass board in a dark room, revealed one warm lamp at a time.",
      },
      { property: "og:title", content: "Lumen — Chamber" },
      {
        property: "og:description",
          "A centered Lumen board over quiet charcoal floorboards, with every beam made visible.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <RoundScreen theme={themeById("chamber")} />,
});
