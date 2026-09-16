import rawGrids from "./grids.json";

export type Cell = number | null; // null = open cell, >=0 = wall with clue, -1 = blank wall
export type Grid = { size: number; cells: Cell[][]; best: number };
export type Mark = "bulb" | "note";

export const GRIDS: Grid[] = rawGrids as Grid[];

export const key = (r: number, c: number) => `${r},${c}`;

export type Marks = Record<string, Mark>;

export type WallState = { r: number; c: number; clue: number; placed: number; status: "under" | "exact" | "over" };

export type Analysis = {
  lit: Set<string>;
  conflicts: Set<string>;
  beams: Set<string>;
  walls: WallState[];
  bulbs: number;
  darkCells: number;
  solved: boolean;
};

const DIRS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

export function isWall(grid: Grid, r: number, c: number) {
  return grid.cells[r][c] !== null;
}

function raysFrom(grid: Grid, r: number, c: number) {
  const out: Array<[number, number]> = [];
  for (const [dr, dc] of DIRS) {
    let rr = r + dr;
    let cc = c + dc;
    while (rr >= 0 && rr < grid.size && cc >= 0 && cc < grid.size && !isWall(grid, rr, cc)) {
      out.push([rr, cc]);
      rr += dr;
      cc += dc;
    }
  }
  return out;
}

export function analyse(grid: Grid, marks: Marks): Analysis {
  const n = grid.size;
  const bulbKeys: Array<[number, number]> = [];
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (marks[key(r, c)] === "bulb" && !isWall(grid, r, c)) bulbKeys.push([r, c]);
    }
  }

  const lit = new Set<string>();
  const beams = new Set<string>();
  const conflicts = new Set<string>();
  const bulbSet = new Set(bulbKeys.map(([r, c]) => key(r, c)));

  for (const [r, c] of bulbKeys) {
    lit.add(key(r, c));
    for (const [rr, cc] of raysFrom(grid, r, c)) {
      const k = key(rr, cc);
      lit.add(k);
      beams.add(k);
      if (bulbSet.has(k)) {
        conflicts.add(k);
        conflicts.add(key(r, c));
      }
    }
  }

  const walls: WallState[] = [];
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const clue = grid.cells[r][c];
      if (clue === null || clue < 0) continue;
      let placed = 0;
      for (const [dr, dc] of DIRS) {
        const rr = r + dr;
        const cc = c + dc;
        if (rr < 0 || rr >= n || cc < 0 || cc >= n) continue;
        if (bulbSet.has(key(rr, cc))) placed++;
      }
      walls.push({ r, c, clue, placed, status: placed === clue ? "exact" : placed > clue ? "over" : "under" });
    }
  }

  let darkCells = 0;
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (!isWall(grid, r, c) && !lit.has(key(r, c))) darkCells++;
    }
  }

  const solved = darkCells === 0 && conflicts.size === 0 && walls.every((w) => w.status === "exact");

  return { lit, conflicts, beams, walls, bulbs: bulbKeys.length, darkCells, solved };
}

export function cycle(current: Mark | undefined): Mark | undefined {
  if (current === undefined) return "bulb";
  if (current === "bulb") return "note";
  return undefined;
}
