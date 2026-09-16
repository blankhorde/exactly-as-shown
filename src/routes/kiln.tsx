import { createFileRoute } from "@tanstack/react-router";
import { RoundScreen } from "@/components/lumen/RoundScreen";
import { themeById } from "@/components/lumen/themes";

export const Route = createFileRoute("/kiln")({
  head: () => ({
    meta: [
      { title: "Lumen — Kiln direction | Kweza" },
      {
        name: "description",
        content:
          "Lumen board direction three: chunky clay tiles in hard daylight, basalt clue blocks holding the shade.",
      },
      { property: "og:title", content: "Lumen — Kiln direction" },
      {
        property: "og:description",
        content: "Baked clay tiles, black stone clues, white daylight: Lumen's grid as a sunlit courtyard floor.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <RoundScreen theme={themeById("kiln")} />,
});
