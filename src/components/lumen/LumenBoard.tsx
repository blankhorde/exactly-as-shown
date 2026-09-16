import { useId, useMemo } from "react";
import { analyse, cellAt, isWall, key, type Grid, type Marks } from "@/lib/lumen/engine";

type Props = {
  grid: Grid;
  marks: Marks;
  width: number;
  onCell: (r: number, c: number) => void;
  locked?: boolean;
};

type LampRun = {
  r: number;
  c: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
  conflict: boolean;
};

type ConflictRun = { x: number; y: number; width: number; height: number; radius: number };

function bounds(grid: Grid, r: number, c: number) {
  let left = c;
  let right = c;
  let top = r;
  let bottom = r;
  while (left > 0 && !isWall(grid, r, left - 1)) left--;
  while (right < grid.size - 1 && !isWall(grid, r, right + 1)) right++;
  while (top > 0 && !isWall(grid, top - 1, c)) top--;
  while (bottom < grid.size - 1 && !isWall(grid, bottom + 1, c)) bottom++;
  return { left, right, top, bottom };
}

export function LumenBoard({ grid, marks, width, onCell, locked }: Props) {
  const state = useMemo(() => analyse(grid, marks), [grid, marks]);
  const maskId = `floor-${useId().replaceAll(":", "")}`;
  const blurId = `light-${useId().replaceAll(":", "")}`;
  const cell = width / grid.size;
  const lamps = useMemo<LampRun[]>(
    () =>
      Object.entries(marks).flatMap(([position, mark]) => {
        if (mark !== "bulb") return [];
        const [rValue, cValue] = position.split(",").map(Number);
        if (rValue === undefined || cValue === undefined || isWall(grid, rValue, cValue)) return [];
        return [{ r: rValue, c: cValue, ...bounds(grid, rValue, cValue), conflict: state.conflicts.has(position) }];
      }),
    [grid, marks, state.conflicts],
  );
  const conflictRuns = useMemo<ConflictRun[]>(() => {
    const runs: ConflictRun[] = [];
    for (let i = 0; i < lamps.length; i++) {
      const first = lamps[i];
      if (!first) continue;
      for (let j = i + 1; j < lamps.length; j++) {
        const second = lamps[j];
        if (!second) continue;
        if (first.r === second.r && first.left <= second.c && first.right >= second.c) {
          runs.push({
            x: Math.min(first.c, second.c) * cell + cell / 2,
            y: first.r * cell + cell * 0.32,
            width: Math.abs(first.c - second.c) * cell,
            height: cell * 0.36,
            radius: cell * 0.18,
          });
        }
        if (first.c === second.c && first.top <= second.r && first.bottom >= second.r) {
          runs.push({
            x: first.c * cell + cell * 0.32,
            y: Math.min(first.r, second.r) * cell + cell / 2,
            width: cell * 0.36,
            height: Math.abs(first.r - second.r) * cell,
            radius: cell * 0.18,
          });
        }
      }
    }
    return runs;
  }, [cell, lamps]);
  const lightKey = lamps.map(({ r, c }) => `${r}-${c}`).join("_");

  return (
    <div className={`lm-board ${state.solved ? "lm-board-solved" : ""}`} style={{ width, height: width }}>
      <svg
        key={lightKey}
        className="lm-light-field"
        viewBox={`0 0 ${width} ${width}`}
        aria-hidden="true"
      >
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse">
            <rect width={width} height={width} fill="black" />
            {grid.cells.flatMap((row, r) =>
              row.map((value, c) =>
                value === null ? (
                  <rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell + 0.25} height={cell + 0.25} fill="white" />
                ) : null,
              ),
            )}
          </mask>
          <filter id={blurId} x="-15%" y="-15%" width="130%" height="130%">
            <feGaussianBlur stdDeviation={cell * 0.18} />
          </filter>
        </defs>
        <g mask={`url(#${maskId})`} className="lm-light-arrival">
          <g filter={`url(#${blurId})`} className="lm-light-warm">
            {lamps.map((lamp) => {
              const x = lamp.c * cell + cell / 2;
              const y = lamp.r * cell + cell / 2;
              return (
                <g key={`${lamp.r}-${lamp.c}`}>
                  <rect
                    className="lm-light-run lm-light-run-x"
                    x={lamp.left * cell}
                    y={y - cell * 0.42}
                    width={(lamp.right - lamp.left + 1) * cell}
                    height={cell * 0.84}
                    rx={cell * 0.42}
                  />
                  <rect
                    className="lm-light-run lm-light-run-y"
                    x={x - cell * 0.42}
                    y={lamp.top * cell}
                    width={cell * 0.84}
                    height={(lamp.bottom - lamp.top + 1) * cell}
                    rx={cell * 0.42}
                  />
                  <circle className="lm-light-pool" cx={x} cy={y} r={cell * 0.8} />
                </g>
              );
            })}
          </g>
          <g className="lm-conflict-light">
            {conflictRuns.map((run, i) => <rect key={i} x={run.x} y={run.y} width={run.width} height={run.height} rx={run.radius} />)}
          </g>
        </g>
      </svg>

      <div className="lm-grid" style={{ gridTemplateColumns: `repeat(${grid.size}, 1fr)` }}>
        {Array.from({ length: grid.size * grid.size }).map((_, i) => {
          const r = Math.floor(i / grid.size);
          const c = i % grid.size;
          const position = key(r, c);
          const clue = cellAt(grid, r, c);
          const mark = marks[position];
          const conflict = state.conflicts.has(position);
          if (clue !== null) {
            const wall = state.walls.find((item) => item.r === r && item.c === c);
            return (
              <div
                key={position}
                className={`lm-wall lm-wall-${wall?.status ?? "under"}`}
                aria-label={clue >= 0 ? `wall, ${clue} bulbs touch it` : "wall"}
              >
                {clue >= 0 ? clue : ""}
              </div>
            );
          }
          return (
            <button
              key={position}
              type="button"
              disabled={locked}
              onClick={() => onCell(r, c)}
              className="lm-floor-cell"
              aria-label={`row ${r + 1} column ${c + 1}, ${mark === "bulb" ? "bulb" : mark === "note" ? "marked empty" : state.lit.has(position) ? "lit" : "dark"}`}
            >
              {mark === "bulb" && (
                <span className={`lm-orb ${conflict ? "lm-orb-conflict" : ""}`} aria-hidden="true">
                  <span />
                </span>
              )}
              {mark === "note" && <span className="lm-note" aria-hidden="true" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}