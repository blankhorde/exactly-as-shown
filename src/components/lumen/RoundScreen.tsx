import { useState } from "react";
import { HelpCircle, RotateCcw, Undo2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { analyse, cycle, GRIDS, key, type Marks } from "@/lib/lumen/engine";
import { LumenBoard } from "./LumenBoard";

const BOARD_WIDTH = 320;
const MID_ROUND_MARKS: Marks = { "1,0": "bulb", "3,0": "bulb", "2,4": "bulb", "5,5": "note" };
const GROUNDS = ["boards", "tiles", "plaster"] as const;
type Ground = (typeof GROUNDS)[number];
type Sheet = null | "solved" | "stuck";

export function RoundScreen() {
  const [index, setIndex] = useState(0);
  const [marks, setMarks] = useState<Marks>(MID_ROUND_MARKS);
  const [history, setHistory] = useState<Marks[]>([]);
  const [sheet, setSheet] = useState<Sheet>(null);
  const [ground, setGround] = useState<Ground>("boards");
  const [stuckCount, setStuckCount] = useState(0);
  const [solvedCount, setSolvedCount] = useState(0);
  const [results, setResults] = useState<Array<"solved" | "stuck">>([]);

  const grid = GRIDS[index] ?? GRIDS[0];
  if (!grid) return null;
  const state = analyse(grid, marks);

  const placeCell = (r: number, c: number) => {
    const position = key(r, c);
    setHistory((items) => [...items, marks]);
    const next = { ...marks };
    const value = cycle(marks[position]);
    if (value === undefined) delete next[position];
    else next[position] = value;
    setMarks(next);
    if (analyse(grid, next).solved) {
      setSolvedCount((count) => count + 1);
      setResults((items) => [...items, "solved"]);
      setSheet("solved");
    }
  };

  const undo = () => setHistory((items) => {
    const previous = items.at(-1);
    if (!previous) return items;
    setMarks(previous);
    return items.slice(0, -1);
  });

  const reset = () => {
    setHistory((items) => [...items, marks]);
    setMarks({});
  };

  const giveUp = () => {
    setStuckCount((count) => count + 1);
    setResults((items) => [...items, "stuck"]);
    setSheet("stuck");
  };

  const nextGrid = () => {
    setSheet(null);
    setMarks({});
    setHistory([]);
    setIndex((current) => (current + 1) % GRIDS.length);
  };

  const playAgain = () => {
    setSheet(null);
    setMarks({});
    setHistory([]);
    setIndex(0);
    setResults([]);
    setSolvedCount(0);
    setStuckCount(0);
  };

  return (
    <main className={`lm-room lm-ground-${ground} ${state.solved ? "lm-room-solved" : ""}`}>
      <div className="lm-screen">
        <header className="lm-header">
          <span className="lm-header-space" aria-hidden="true" />
          <h1>Lumen</h1>
          <HelpCircle size={19} aria-label="How to play" />
        </header>

        <section className="lm-hud" aria-label="Round progress">
          <div className="lm-progress">
            {GRIDS.map((_, i) => (
              <span key={i} data-state={results[i] ?? (i === index ? "current" : "waiting")} />
            ))}
          </div>
          <div className="lm-hud-row">
            <span>Grid {index + 1} of {GRIDS.length}</span>
            <div><strong>{state.bulbs}</strong> placements <b>★ {grid.best}</b></div>
          </div>
        </section>

        <div className="lm-ground-picker" aria-label="Room ground">
          {GROUNDS.map((item) => (
            <Button key={item} type="button" variant="ghost" size="sm" aria-pressed={ground === item} onClick={() => setGround(item)}>
              {item[0]?.toUpperCase()}{item.slice(1)}
            </Button>
          ))}
        </div>

        <LumenBoard grid={grid} marks={marks} width={BOARD_WIDTH} onCell={placeCell} locked={sheet !== null} />

        <p className={`lm-status ${state.conflicts.size > 0 ? "lm-status-alert" : ""}`}>
          {state.conflicts.size > 0
            ? "Two bulbs are shining on each other."
            : state.darkCells === 0
              ? "Every cell is lit — check the wall numbers."
              : `${state.darkCells} cell${state.darkCells === 1 ? "" : "s"} still dark`}
        </p>

        <div className="lm-controls">
          <Button type="button" variant="ghost" onClick={undo} disabled={history.length === 0}><Undo2 />Undo</Button>
          <Button type="button" variant="ghost" onClick={reset} disabled={Object.keys(marks).length === 0}><RotateCcw />Clear grid</Button>
          <Button type="button" variant="ghost" onClick={giveUp}><X />Stuck</Button>
        </div>
        <p className="lm-help">Tap once for a bulb, twice to mark a cell you know stays empty.</p>
      </div>

      {sheet && (
        <div className="lm-sheet-backdrop">
          <section className="lm-sheet" aria-live="polite">
            <h2>{sheet === "solved" ? "Grid solved" : "Stuck on this grid"}</h2>
            <p>
              {sheet === "solved"
                ? `Not one shadow left. You lit it with ${state.bulbs} placement${state.bulbs === 1 ? "" : "s"} — the best possible is ${grid.best}.`
                : `This one keeps its dark corners. ${state.darkCells === 0 ? "The wall numbers still disagree with your bulbs." : `${state.darkCells} cell${state.darkCells === 1 ? "" : "s"} never came on.`} Every Lumen grid is solvable by pure deduction — the next one may read easier.`}
            </p>
            <small>{solvedCount} solved · {stuckCount} stuck so far this round.</small>
            <div>
              <Button type="button" onClick={index === GRIDS.length - 1 ? playAgain : nextGrid}>
                {index === GRIDS.length - 1 ? "Play again" : "Next grid"}
              </Button>
              {sheet === "stuck" && (
                <Button type="button" variant="outline" onClick={() => {
                  setSheet(null);
                  setResults((items) => items.slice(0, -1));
                  setStuckCount((count) => Math.max(0, count - 1));
                }}>Keep trying</Button>
              )}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}