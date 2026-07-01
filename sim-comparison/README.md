# Sim Comparison

<p align="center">
  <img src="docs/images/sim-comparison.png" alt="Sim Comparison" width="600"><br>
  <sub><em>Variety of comparison metrics for 2 simulations with up to 10 stored</em></sub>
</p>

Compares board-foot output between two Comact trimmer simulation runs, grade by
grade and length by length. Use it to value a pricing or trim-rule change before
committing it to the optimizer.

## What it answers

- How does each sim's board-foot output per grade compare to the original (OG) run?
- How much does each sim cut odd-length output, where a trim-to-even policy shows up?
- Which sim wins on odd-length reduction without giving up grade?

## How to use

1. Run the same board sample through the Comact under the original setup and two
   candidate pricing or trim-rule setups. Paste each run's grade totals and its
   length mix into the two matrices.
2. Pick two sims from the dropdowns.
3. The compare blocks show each sim against OG: grade totals, per-length
   differences, and the odd-length reduction for each.

## Blocks

- Grade totals: each grade's board feet per run.
- Value block: the board-foot difference between two chosen runs per grade, times a
  grade transfer price (GTP), summed to a dollar swing.
- Length mix and compare: percent of output at each length per run, the difference
  vs OG, and the percent change.
- Odd-length reduction: the 7, 9, 11 ft drop per run vs OG, as points, as a percent,
  and as board feet.
- Top reduction: each run's single biggest odd-length cut.

## Note

This tool reads simulation output. It does not price boards itself. Pair it with
scalable-model (the pricing policy) and value-table (the lookup).
