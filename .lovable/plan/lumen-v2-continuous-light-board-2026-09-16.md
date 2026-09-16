# Lumen v2: Continuous Light Board

## Goal
Replace the current themed presentation with one modern dark-room board while preserving `src/lib/lumen` exactly. The new board will make illumination a continuous physical field rather than a tile color change.

## What will change
- Remove the Chamber, Workbench, and Panel routes, theme module, and all existing theme/board CSS.
- Make `/` the single playable review screen, initialized to a deliberately half-lit state with two or three lamps, visible merged illumination, one conflict, and remaining darkness.
- Rebuild the 320px board as a flat charcoal plate with subtle floor divisions and raised, single-material wall blocks.
- Replace per-cell fills and beam strips with one board-wide SVG light layer. Each lamp contributes clipped row and column runs plus a soft local pool; overlaps merge through one shared field, while masks keep wall and board boundaries crisp.
- Render lamps as simple luminous orbs with hot cores. Render conflicts by turning the connecting light region hot.
- Use numeral color alone for wall states: dim for under, warm for exact, hot red for over.
- Keep only two motion moments: a roughly 200ms outward light reveal after placement and a one-step room lift when solved, both disabled for reduced motion.
- Present three quiet ground treatments on the same screen through a compact selector: floorboards, broad tile joints, and plaster seams. The board itself remains identical.
- Replace Instrument Serif with one modern geometric display face and keep the surrounding controls restrained.

## Preserved behavior
- Puzzle analysis, cycling, grid data, solution rules, undo/reset, solved/stuck flow, round vocabulary, variable round length, and placement counts remain unchanged.
- No files under `src/lib/lumen` will be edited.

## Verification
- Confirm the removed routes no longer exist and `/` has complete page metadata.
- Test at 390px width: 320px board fit, no overflow, readable clues in lit and unlit regions, merged light, crisp wall stops, visible conflict, and working place/undo/reset/stuck interactions.
- Confirm no old beam strips, tile-fill lighting, bevel gradients, perspective, serif numerals, brass/wood styling, or ornamental glow remains.
