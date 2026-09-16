import { useMemo } from "react";
import { analyse, cellAt, key, type Grid, type Marks } from "@/lib/lumen/engine";
import type { LumenTheme } from "./themes";

type Props = {
  grid: Grid;
  marks: Marks;
  theme: LumenTheme;
  width: number;
  onCell: (r: number, c: number) => void;
  locked?: boolean;
};

function Bulb({ theme, alert }: { theme: LumenTheme; alert: boolean }) {
  const color = alert ? "var(--lm-alert)" : "var(--lm-light)";
  if (theme.bulbStyle === "crosshair") {
    return (
      <span className="relative block h-full w-full">
        <span
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ width: "62%", height: "62%", border: `2px solid ${color}` }}
        />
        <span
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ width: "22%", height: "22%", background: color }}
        />
      </span>
    );
  }
  if (theme.bulbStyle === "diamond") {
    return (
      <span className="relative block h-full w-full">
        <span
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45"
          style={{ width: "52%", height: "52%", background: color, borderRadius: 2 }}
        />
      </span>
    );
  }
  return (
    <span className="relative block h-full w-full">
      <span
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ width: "58%", height: "58%", background: color }}
      />
      <span
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ width: "84%", height: "84%", border: `1px solid ${color}`, opacity: 0.55 }}
      />
    </span>
  );
}

export function LumenBoard({ grid, marks, theme, width, onCell, locked }: Props) {
  const state = useMemo(() => analyse(grid, marks), [grid, marks]);
  const n = grid.size;
  const pad = theme.cellShape === "square" ? 2 : 8;
  const inner = width - pad * 2;
  const cell = Math.floor((inner - theme.gap * (n - 1)) / n);
  const boardSize = cell * n + theme.gap * (n - 1) + pad * 2;

  return (
    <div
      className="mx-auto select-none"
      style={{
        width: boardSize,
        padding: pad,
        background: "var(--lm-panel)",
        borderRadius: theme.cellShape === "square" ? 4 : 14,
        border: `${theme.cellShape === "square" ? 2 : 1}px solid var(--lm-frame)`,
      }}
    >
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${n}, ${cell}px)`,
          gap: theme.gap,
        }}
      >
        {Array.from({ length: n * n }).map((_, i) => {
          const r = Math.floor(i / n);
          const c = i % n;
          const k = key(r, c);
          const clue = cellAt(grid, r, c);
          const isWall = clue !== null;
          const mark = marks[k];
          const lit = state.lit.has(k);
          const conflict = state.conflicts.has(k);

          if (isWall) {
            const w = state.walls.find((x) => x.r === r && x.c === c);
            const over = w?.status === "over";
            const done = w?.status === "exact";
            return (
              <div
                key={k}
                aria-label={clue >= 0 ? `wall, ${clue} bulbs touch it` : "wall"}
                className="flex items-center justify-center"
                style={{
                  height: cell,
                  borderRadius: theme.cellShape === "round" ? theme.radius : theme.radius,
                  background: over
                    ? "var(--lm-alert)"
                    : done
                      ? "var(--lm-wall-done)"
                      : "var(--lm-wall)",
                  color: "var(--lm-wall-ink)",
                  fontFamily: theme.displayFont,
                  fontSize: Math.max(14, Math.round(cell * 0.55)),
                  lineHeight: 1,
                  boxShadow:
                    theme.cellShape === "tile" ? "inset 0 -3px 0 rgba(0,0,0,0.35)" : undefined,
                }}
              >
                {clue >= 0 ? clue : ""}
              </div>
            );
          }

          const beamAcross = state.beams.has(k);
          return (
            <button
              key={k}
              type="button"
              disabled={locked}
              onClick={() => onCell(r, c)}
              aria-label={`row ${r + 1} column ${c + 1}, ${
                mark === "bulb" ? "bulb" : mark === "note" ? "marked empty" : lit ? "lit" : "dark"
              }`}
              className="relative flex items-center justify-center transition-colors"
              style={{
                height: cell,
                borderRadius: theme.radius,
                background: lit ? "var(--lm-lit)" : "var(--lm-open)",
                border:
                  theme.cellShape === "square"
                    ? `1px solid var(--lm-line)`
                    : `1px solid ${lit ? "transparent" : "var(--lm-line)"}`,
                boxShadow:
                  theme.cellShape === "tile" ? "inset 0 -3px 0 rgba(0,0,0,0.28)" : undefined,
              }}
            >
              {theme.cellShape === "square" && beamAcross && mark !== "bulb" && (
                <span
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to right, transparent 48%, var(--lm-accent) 48%, var(--lm-accent) 52%, transparent 52%)",
                    opacity: 0.35,
                  }}
                />
              )}
              {mark === "bulb" && <Bulb theme={theme} alert={conflict} />}
              {mark === "note" && (
                <span
                  className="block rounded-full"
                  style={{
                    width: Math.max(4, Math.round(cell * 0.16)),
                    height: Math.max(4, Math.round(cell * 0.16)),
                    background: "var(--lm-note)",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
