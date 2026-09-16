# Lumen: Dark Room Direction

## Goal
Replace Lantern, Blueprint, and Kiln with three screens that share one visual world: a dark physical room revealed by the player's light. Keep the puzzle engine, rules, state transitions, controls, and round behavior unchanged.

## What will change
- Rework the board into a 320px physical object with recessed floor cells and raised, readable brass-dark wall blocks.
- Replace abstract marks with small emitting lamp objects: bright glass body, metal base, and a contained pool of light.
- Make illumination explicit in each lit cell and draw continuous horizontal/vertical travel through open cells until walls stop it.
- Express bulb conflicts in the emitted light, using a hot warning color rather than a separate decorative treatment.
- Keep truly dark cells materially distinct, so the remaining shadow and final fully lit state are immediately legible.
- Preserve Instrument Serif as the sole display face, with the app's existing sans-serif for everything else.

## Three screens
1. **Chamber** — centered board over faint charcoal floorboards.
2. **Workbench** — board seated on a broad dark work surface with large structural tile seams.
3. **Panel** — board inset into subtly jointed plaster with compact physical fittings.

All three use the same charcoal, aged-brass, and warm-electric-light palette and show a deliberately prepared mid-round, half-lit state on first load. The existing routes will become these three treatments rather than separate visual worlds.

## Technical details
- Keep `analyse`, `cycle`, grid data, solved/stuck behavior, and round-length handling untouched.
- Extend the board analysis presentation only: identify lit row/column directions per cell so propagation can be rendered continuously without changing puzzle logic.
- Consolidate theme data around one locked palette and material system, varying only room-ground treatment and screen composition.
- Update route labels and page metadata to the new Chamber, Workbench, and Panel treatments.
- Verify each screen at 390px viewport width, including interaction, half-lit readability, wall contrast, beam stopping, conflict state, and no overlap.
