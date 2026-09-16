import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, HelpCircle, RotateCcw, Undo2, X } from "lucide-react";
import { analyse, cycle, GRIDS, key, type Marks } from "@/lib/lumen/engine";
import { LumenBoard } from "./LumenBoard";
import type { LumenTheme } from "./themes";

const BOARD_WIDTH = 320;
const MID_ROUND_MARKS: Marks = { "1,0": "bulb", "3,0": "bulb", "2,4": "bulb", "4,2": "bulb", "5,5": "note" };

type Sheet = null | "solved" | "stuck";

export function RoundScreen({ theme }: { theme: LumenTheme }) {
  const [index, setIndex] = useState(0);
  const [marks, setMarks] = useState<Marks>(MID_ROUND_MARKS);
  const [history, setHistory] = useState<Marks[]>([]);
  const [sheet, setSheet] = useState<Sheet>(null);
  const [stuckCount, setStuckCount] = useState(0);
  const [solvedCount, setSolvedCount] = useState(0);
  const [results, setResults] = useState<Array<"solved" | "stuck">>([]);

  const grid = GRIDS[index]!;
  const state = useMemo(() => analyse(grid, marks), [grid, marks]);

  const placeCell = (r: number, c: number) => {
    const k = key(r, c);
    setHistory((h) => [...h, marks]);
    const next: Marks = { ...marks };
    const value = cycle(marks[k]);
    if (value === undefined) delete next[k];
    else next[k] = value;
    setMarks(next);
    if (analyse(grid, next).solved) {
      setSolvedCount((s) => s + 1);
      setResults((x) => [...x, "solved"]);
      setSheet("solved");
    }
  };

  const undo = () => {
    setHistory((h) => {
      if (h.length === 0) return h;
      setMarks(h[h.length - 1]!);
      return h.slice(0, -1);
    });
  };

  const reset = () => {
    setHistory((h) => [...h, marks]);
    setMarks({});
  };

  const giveUp = () => {
    setStuckCount((s) => s + 1);
    setResults((x) => [...x, "stuck"]);
    setSheet("stuck");
  };

  const nextGrid = () => {
    setSheet(null);
    setMarks({});
    setHistory([]);
    setIndex((i) => (i + 1) % GRIDS.length);
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

  const isLast = index === GRIDS.length - 1;

  return (
    <div
      className={`lm-room lm-room-${theme.room} min-h-screen w-full`}
      style={{ ...(theme.vars as React.CSSProperties), background: "var(--lm-ground)" }}
    >
      <div className={`lm-screen lm-screen-${theme.room} mx-auto w-full max-w-[390px] px-4 pb-16 pt-3`}>
        {/* Platform header — shown greyed as context, not part of this design */}
        <div
          className="mb-3 flex items-center justify-between px-2 py-2"
          style={{ color: "var(--lm-ink-soft)" }}
        >
          <Link to="/" aria-label="Back">
            <ArrowLeft size={20} />
          </Link>
          <span
            className="text-[18px]"
            style={{ color: "var(--lm-ink)", fontFamily: theme.displayFont }}
          >
            Lumen
          </span>
          <HelpCircle size={20} />
        </div>

        {/* HUD card — structure is the platform's, palette is this board's */}
        <div
          className="lm-hud mb-4 p-3"
          style={{ background: "var(--lm-panel-2)", border: "1px solid var(--lm-frame)" }}
        >
          <div className="flex gap-1">
            {GRIDS.map((_, i) => {
              const res = results[i];
              return (
                <span
                  key={i}
                  className="h-1.5 flex-1 rounded-full"
                  style={{
                    background:
                      res === "solved"
                        ? "var(--lm-accent)"
                        : res === "stuck"
                          ? "var(--lm-note)"
                          : i === index
                            ? "var(--lm-ink-soft)"
                            : "var(--lm-line)",
                  }}
                />
              );
            })}
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-[0.14em]" style={{ color: "var(--lm-ink-soft)" }}>
              Grid {index + 1} of {GRIDS.length}
            </span>
            <div className="flex gap-2">
              <span
                className="rounded-lg px-2.5 py-1 text-[13px] tabular-nums"
                style={{ background: "var(--lm-chip)", color: "var(--lm-ink)" }}
              >
                {state.bulbs} placements
              </span>
              <span
                className="rounded-lg px-2.5 py-1 text-[13px] tabular-nums"
                style={{ background: "var(--lm-chip)", color: "var(--lm-accent)" }}
              >
                ★ {grid.best}
              </span>
            </div>
          </div>
        </div>

        <LumenBoard
          grid={grid}
          marks={marks}
          theme={theme}
          width={BOARD_WIDTH}
          onCell={placeCell}
          locked={sheet !== null}
        />

        {/* Board status line — the darkness readout */}
        <p
          className="mt-4 text-center text-[13px]"
          style={{ color: state.conflicts.size > 0 ? "var(--lm-alert)" : "var(--lm-ink-soft)" }}
        >
          {state.conflicts.size > 0
            ? "Two bulbs are shining on each other."
            : state.darkCells === 0
              ? "Every cell is lit — check the wall numbers."
              : `${state.darkCells} cell${state.darkCells === 1 ? "" : "s"} still dark`}
        </p>

        {/* In-board controls */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <ControlButton onClick={undo} disabled={history.length === 0}>
            <Undo2 size={16} /> Undo
          </ControlButton>
          <ControlButton onClick={reset} disabled={Object.keys(marks).length === 0}>
            <RotateCcw size={16} /> Clear grid
          </ControlButton>
          <ControlButton onClick={giveUp}>
            <X size={16} /> Stuck
          </ControlButton>
        </div>

        <p className="mt-4 text-center text-[12px]" style={{ color: "var(--lm-ink-soft)" }}>
          Tap once for a bulb, twice to mark a cell you know stays empty.
        </p>
      </div>

      {sheet && (
        <div className="fixed inset-0 z-20 flex items-end justify-center bg-black/55 px-3 pb-3">
          <div
            className="w-full max-w-[382px] rounded-lg p-5"
            style={{ background: "var(--lm-panel)", border: "1px solid var(--lm-frame)" }}
          >
            <h2
              className="text-[26px] leading-tight"
              style={{ color: "var(--lm-ink)", fontFamily: theme.displayFont }}
            >
              {sheet === "solved" ? "Grid solved" : "Stuck on this grid"}
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed" style={{ color: "var(--lm-ink-soft)" }}>
              {sheet === "solved"
                ? `Not one shadow left. You lit it with ${state.bulbs} placement${
                    state.bulbs === 1 ? "" : "s"
                  } — the best possible is ${grid.best}.`
                : `This one keeps its dark corners. ${
                    state.darkCells === 0
                      ? "The wall numbers still disagree with your bulbs."
                      : `${state.darkCells} cell${state.darkCells === 1 ? "" : "s"} never came on.`
                  } Every Lumen grid is solvable by pure deduction — the next one may read easier.`}
            </p>
            <p className="mt-3 text-[13px]" style={{ color: "var(--lm-ink-soft)" }}>
              {solvedCount} solved · {stuckCount} stuck so far this round.
            </p>
            <div className="mt-5 flex gap-2">
              {isLast ? (
                <SheetButton primary theme={theme} onClick={playAgain}>
                  Play again
                </SheetButton>
              ) : (
                <SheetButton primary theme={theme} onClick={nextGrid}>
                  Next grid
                </SheetButton>
              )}
              {sheet === "stuck" && (
                <SheetButton
                  theme={theme}
                  onClick={() => {
                    setSheet(null);
                    setResults((x) => x.slice(0, -1));
                    setStuckCount((s) => Math.max(0, s - 1));
                  }}
                >
                  Keep trying
                </SheetButton>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ControlButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-2.5 text-[13px] transition-opacity disabled:opacity-40"
      style={{
        background: "var(--lm-chip)",
        color: "var(--lm-ink)",
        border: "1px solid var(--lm-frame)",
        borderRadius: 5,
      }}
    >
      {children}
    </button>
  );
}

function SheetButton({
  children,
  onClick,
  primary,
  theme,
}: {
  children: React.ReactNode;
  onClick: () => void;
  primary?: boolean;
  theme: LumenTheme;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 px-4 py-3 text-[14px] font-semibold"
      style={{
        background: primary ? "var(--lm-accent)" : "transparent",
        color: primary ? "var(--lm-light-ink)" : "var(--lm-ink)",
        border: primary ? "none" : "1px solid var(--lm-frame)",
        borderRadius: 5,
      }}
    >
      {children}
    </button>
  );
}
