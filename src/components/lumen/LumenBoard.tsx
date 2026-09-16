import { useMemo } from "react";
import { analyse, cellAt, isWall, key, type Grid, type Marks } from "@/lib/lumen/engine";
import type { LumenTheme } from "./themes";

type Props = { grid: Grid; marks: Marks; theme: LumenTheme; width: number; onCell: (r: number, c: number) => void; locked?: boolean };

function seesBulb(grid: Grid, marks: Marks, r: number, c: number, dr: number, dc: number) {
  let rr = r + dr;
  let cc = c + dc;
  while (rr >= 0 && rr < grid.size && cc >= 0 && cc < grid.size && !isWall(grid, rr, cc)) {
    if (marks[key(rr, cc)] === "bulb") return true;
    rr += dr;
    cc += dc;
  }
  return false;
}

function Lamp({ alert }: { alert: boolean }) {
  return <span className={`lm-lamp ${alert ? "lm-lamp-conflict" : ""}`} aria-hidden="true"><span className="lm-lamp-glass" /><span className="lm-lamp-neck" /><span className="lm-lamp-base" /></span>;
}

export function LumenBoard({ grid, marks, theme, width, onCell, locked }: Props) {
  const state = useMemo(() => analyse(grid, marks), [grid, marks]);
  const gap = 3;
  const pad = 9;
  const cell = Math.floor((width - pad * 2 - gap * (grid.size - 1)) / grid.size);
  const boardSize = cell * grid.size + gap * (grid.size - 1) + pad * 2;

  return <div className="lm-board mx-auto select-none" style={{ width: boardSize, padding: pad }} data-room={theme.room}>
    <div className="grid" style={{ gridTemplateColumns: `repeat(${grid.size}, ${cell}px)`, gap }}>
      {Array.from({ length: grid.size * grid.size }).map((_, i) => {
        const r = Math.floor(i / grid.size);
        const c = i % grid.size;
        const k = key(r, c);
        const clue = cellAt(grid, r, c);
        const mark = marks[k];
        const lit = state.lit.has(k);
        const conflict = state.conflicts.has(k);
        if (clue !== null) {
          const wall = state.walls.find((item) => item.r === r && item.c === c);
          return <div key={k} aria-label={clue >= 0 ? `wall, ${clue} bulbs touch it` : "wall"} className={`lm-wall lm-wall-${wall?.status ?? "under"}`} style={{ height: cell }}>{clue >= 0 ? clue : ""}</div>;
        }
        const horizontal = mark === "bulb" || seesBulb(grid, marks, r, c, 0, -1) || seesBulb(grid, marks, r, c, 0, 1);
        const vertical = mark === "bulb" || seesBulb(grid, marks, r, c, -1, 0) || seesBulb(grid, marks, r, c, 1, 0);
        return <button key={k} type="button" disabled={locked} onClick={() => onCell(r, c)} aria-label={`row ${r + 1} column ${c + 1}, ${mark === "bulb" ? "bulb" : mark === "note" ? "marked empty" : lit ? "lit" : "dark"}`} className={`lm-cell ${lit ? "lm-cell-lit" : "lm-cell-dark"} ${conflict ? "lm-cell-conflict" : ""}`} style={{ height: cell }}>
          {lit && horizontal && <span className="lm-beam lm-beam-horizontal" aria-hidden="true" />}
          {lit && vertical && <span className="lm-beam lm-beam-vertical" aria-hidden="true" />}
          {mark === "bulb" && <Lamp alert={conflict} />}
          {mark === "note" && <span className="lm-note" aria-hidden="true" />}
        </button>;
      })}
    </div>
  </div>;
}