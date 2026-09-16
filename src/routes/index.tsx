import { createFileRoute, Link } from "@tanstack/react-router";
import { THEMES } from "@/components/lumen/themes";
import { GRIDS } from "@/lib/lumen/engine";
import { LumenBoard } from "@/components/lumen/LumenBoard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lumen board directions | Kweza" },
      {
        name: "description",
        content:
          "Three design directions for Lumen, Kweza's light-up deduction game: Lantern, Blueprint and Kiln, each a playable mid-round grid at phone width.",
      },
      { property: "og:title", content: "Lumen board directions" },
      {
        property: "og:description",
        content: "Three different worlds for the same deduction grid — pick the one that becomes Lumen's design of record.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const preview = GRIDS[1]!;
const previewMarks = { "0,0": "bulb", "2,4": "note" } as const;

function Index() {
  return (
    <main className="min-h-screen" style={{ background: "#fff7ee" }}>
      <div className="mx-auto w-full max-w-[390px] px-4 py-8">
        <h1 className="text-[28px] font-extrabold leading-tight" style={{ color: "#2a1a10" }}>
          Lumen — three boards
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed" style={{ color: "#7a5c48" }}>
          Same deduction: bulbs light every cell, no bulb shines on another, numbered walls count
          the bulbs touching them. Three worlds to play it in. Open one and solve a grid.
        </p>

        <div className="mt-7 space-y-5">
          {THEMES.map((theme) => (
            <Link
              key={theme.id}
              to={`/${theme.id}`}
              className="block overflow-hidden rounded-2xl"
              style={{ border: "1px solid #ecd9c6", background: "#ffffff" }}
            >
              <div
                className="px-4 pb-4 pt-4"
                style={{ ...(theme.vars as React.CSSProperties), background: "var(--lm-ground)" }}
              >
                <p
                  className="mb-3 text-[20px]"
                  style={{ color: "var(--lm-ink)", fontFamily: theme.displayFont }}
                >
                  {theme.name}
                </p>
                <LumenBoard
                  grid={preview}
                  marks={previewMarks as Record<string, "bulb" | "note">}
                  theme={theme}
                  width={310}
                  onCell={() => {}}
                  locked
                />
              </div>
              <div className="px-4 py-4">
                <p className="text-[14px] font-semibold" style={{ color: "#2a1a10" }}>
                  {theme.world}
                </p>
                <p className="mt-1 text-[13px]" style={{ color: "#7a5c48" }}>
                  {theme.blurb}
                </p>
                <span className="mt-3 inline-block text-[13px] font-semibold" style={{ color: "#e8590c" }}>
                  Play this board →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
