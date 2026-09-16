export type LumenTheme = {
  id: string;
  path: "/lantern" | "/blueprint" | "/kiln";
  name: string;
  world: string;
  blurb: string;
  displayFont: string;
  cellShape: "round" | "square" | "tile";
  bulbStyle: "disc" | "crosshair" | "diamond";
  gap: number;
  radius: number;
  vars: Record<string, string>;
};

export const THEMES: LumenTheme[] = [
  {
    id: "lantern",
    path: "/lantern",
    name: "Lantern",
    world: "A dark hall you light one lamp at a time",
    blurb: "Walnut night, brass plaques, warm amber spill. Quiet and heavy.",
    displayFont: "'Instrument Serif', serif",
    cellShape: "round",
    bulbStyle: "disc",
    gap: 3,
    radius: 7,
    vars: {
      "--lm-ground": "#1b1512",
      "--lm-panel": "#241c18",
      "--lm-panel-2": "#2e2420",
      "--lm-frame": "#40312a",
      "--lm-line": "#3a2d27",
      "--lm-open": "#171210",
      "--lm-lit": "#4a3316",
      "--lm-wall": "#c9a227",
      "--lm-wall-ink": "#241c18",
      "--lm-wall-done": "#6d5b2a",
      "--lm-light": "#ffc65c",
      "--lm-light-ink": "#241c18",
      "--lm-note": "#7a655a",
      "--lm-alert": "#e2593f",
      "--lm-ink": "#f6ece1",
      "--lm-ink-soft": "#b6a496",
      "--lm-accent": "#ffc65c",
      "--lm-chip": "#2e2420",
    },
  },
  {
    id: "blueprint",
    path: "/blueprint",
    name: "Blueprint",
    world: "A drafting table where light is measured, not felt",
    blurb: "Cold paper, ink-navy blocks, hairline beams down every axis.",
    displayFont: "'Space Mono', monospace",
    cellShape: "square",
    bulbStyle: "crosshair",
    gap: 0,
    radius: 0,
    vars: {
      "--lm-ground": "#e7ecf1",
      "--lm-panel": "#f7fafc",
      "--lm-panel-2": "#eef3f8",
      "--lm-frame": "#1d3557",
      "--lm-line": "#b9c8d8",
      "--lm-open": "#f7fafc",
      "--lm-lit": "#d3e9f2",
      "--lm-wall": "#1d3557",
      "--lm-wall-ink": "#f7fafc",
      "--lm-wall-done": "#4a7fa5",
      "--lm-light": "#0b6e7f",
      "--lm-light-ink": "#f7fafc",
      "--lm-note": "#8496a8",
      "--lm-alert": "#b3271e",
      "--lm-ink": "#12253c",
      "--lm-ink-soft": "#5a6f85",
      "--lm-accent": "#0b6e7f",
      "--lm-chip": "#e2eaf2",
    },
  },
  {
    id: "kiln",
    path: "/kiln",
    name: "Kiln",
    world: "Clay tiles in the sun, basalt blocks holding the shade",
    blurb: "Chunky earth tiles, black stone clues, hard white daylight.",
    displayFont: "'Bebas Neue', sans-serif",
    cellShape: "tile",
    bulbStyle: "diamond",
    gap: 5,
    radius: 3,
    vars: {
      "--lm-ground": "#2a211c",
      "--lm-panel": "#8a4b2a",
      "--lm-panel-2": "#7a4024",
      "--lm-frame": "#c86a35",
      "--lm-line": "#5e3018",
      "--lm-open": "#5e3018",
      "--lm-lit": "#e8c39a",
      "--lm-wall": "#1a1512",
      "--lm-wall-ink": "#f3e3d0",
      "--lm-wall-done": "#3d3833",
      "--lm-light": "#fdf6ec",
      "--lm-light-ink": "#2a211c",
      "--lm-note": "#a9765a",
      "--lm-alert": "#c62828",
      "--lm-ink": "#fdf1e3",
      "--lm-ink-soft": "#e0b995",
      "--lm-accent": "#f0a93b",
      "--lm-chip": "#3a2a21",
    },
  },
];

export const themeById = (id: string) => THEMES.find((t) => t.id === id) ?? THEMES[0]!;
