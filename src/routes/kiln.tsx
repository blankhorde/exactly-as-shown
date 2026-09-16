import { createFileRoute } from "@tanstack/react-router";
import { RoundScreen } from "@/components/lumen/RoundScreen";
import { themeById } from "@/components/lumen/themes";

export const Route = createFileRoute("/kiln")({
  head: () => ({
    meta: [
      { title: "Lumen — Panel | Kweza" },
      {
        name: "description",
        content:
          "Lumen Panel: a compact light instrument set into a dark, subtly jointed plaster room.",
      },
      { property: "og:title", content: "Lumen — Panel" },
      {
        property: "og:description",
        content: "A compact Lumen board set into dark plaster, with physical lamps and visible light paths.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <RoundScreen theme={themeById("panel")} />,
});
