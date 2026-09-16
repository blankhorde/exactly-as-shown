export type LumenTheme = {
  id: string;
  path: "/lantern" | "/blueprint" | "/kiln";
  name: string;
  world: string;
  blurb: string;
  displayFont: string;
  room: "chamber" | "workbench" | "panel";
  vars: Record<string, string>;
};

const roomPalette = {
  "--lm-ground": "oklch(0.13 0.012 70)",
  "--lm-panel": "oklch(0.175 0.014 70)",
  "--lm-panel-2": "oklch(0.205 0.016 70)",
  "--lm-frame": "oklch(0.39 0.045 75)",
  "--lm-line": "oklch(0.28 0.02 70)",
  "--lm-open": "oklch(0.105 0.009 70)",
  "--lm-lit": "oklch(0.66 0.11 78)",
  "--lm-wall": "oklch(0.31 0.048 72)",
  "--lm-wall-top": "oklch(0.43 0.065 76)",
  "--lm-wall-ink": "oklch(0.95 0.04 84)",
  "--lm-wall-done": "oklch(0.41 0.07 88)",
  "--lm-light": "oklch(0.96 0.14 94)",
  "--lm-light-hot": "oklch(0.99 0.035 96)",
  "--lm-light-ink": "oklch(0.16 0.02 70)",
  "--lm-note": "oklch(0.58 0.025 72)",
  "--lm-alert": "oklch(0.64 0.2 30)",
  "--lm-alert-hot": "oklch(0.9 0.11 52)",
  "--lm-ink": "oklch(0.94 0.025 80)",
  "--lm-ink-soft": "oklch(0.72 0.025 75)",
  "--lm-accent": "oklch(0.82 0.13 85)",
  "--lm-chip": "oklch(0.235 0.02 70)",
};

export const THEMES: LumenTheme[] = [
  { id: "chamber", path: "/lantern", name: "Chamber", world: "The room waits in shadow", blurb: "A centered brass board over quiet charcoal floorboards.", displayFont: "'Instrument Serif', serif", room: "chamber", vars: roomPalette },
  { id: "workbench", path: "/blueprint", name: "Workbench", world: "Light tested on a working surface", blurb: "The board rests on broad structural tiles beneath a low lamp.", displayFont: "'Instrument Serif', serif", room: "workbench", vars: roomPalette },
  { id: "panel", path: "/kiln", name: "Panel", world: "A light instrument set into the wall", blurb: "Compact fittings and jointed plaster hold the board in place.", displayFont: "'Instrument Serif', serif", room: "panel", vars: roomPalette },
];

export const themeById = (id: string) => THEMES.find((theme) => theme.id === id) ?? THEMES[0];