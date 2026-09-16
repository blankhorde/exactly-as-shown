import { createFileRoute } from "@tanstack/react-router";
import { RoundScreen } from "@/components/lumen/RoundScreen";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lumen — Light-up deduction puzzle" },
      { name: "description", content: "Play Lumen, Kweza's night-time deduction puzzle. Place bulbs to light every cell without letting two bulbs see each other." },
      { property: "og:title", content: "Lumen — Light-up deduction puzzle" },
      { property: "og:description", content: "Place bulbs, read the walls, and leave no cell in shadow." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RoundScreen,
});