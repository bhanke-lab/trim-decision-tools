## Value Table

<table width="100%">
  <tr>
    <td align="center" width="33%">
      <img src="docs/images/value-table.png" alt="Value Table" width="90%"><br>
      <sub><em>Plain value table visualization</em></sub>
    </td>
    <td align="center" width="33%">
      <img src="docs/images/lengths-value-table.png" alt="Lengths Value Table" width="100%"><br>
      <sub><em>Add length zones and even/odd levers</em></sub>
    </td>
    <td align="center" width="33%">
      <img src="docs/images/manual-lengths-value-table.png" alt="Manual Lengths Value Table" width="100%"><br>
      <sub><em>Add input for custom even/odd figures</em></sub>
    </td>
  </tr>
</table>

Lookup and decision tool over a Comact TrimExpert export.

### Sheets

| Sheet | Purpose | Visibility |
| -- | --- | --- |
| Value Table | Original lookup; grade list auto-sorts by $/MBF, rest are plain formulas | Visible |
| Lengths Value Table | Dynamic, spill-based; length zones and even/odd levers; hosts the trim helpers | Visible |
| Lengths Value Table (Manual) | Same engine, even/odd block is hand-typeable | Visible |
| RawData | Power Query dump, one row per Board record | Visible |
| Helpers | Thickness decimals, species names, width and length tokens | Visible |
| _Formulas_Backup / _LengthsBackup /_ManualBackup | Golden formula copies for RESET | Hidden |

### Rebuild steps

1. Export AllProducts.xml from TrimExpert, or use fixtures/allproducts_sample.xml.
2. Load it via Power Query (see powerquery.m). Confirm the thick column is text.
3. Build the Helpers sheet (thickness to decimal map, species list).
4. Paste the anchor formulas from formulas.md into each tab.
5. Create the three hidden backup sheets from clean copies of each live tab.
6. Add a button and assign the Office Script in reset.ts.
7. Add conditional formatting and the yellow input cells (B1/B2/B3).

#### *Note

- Thickness must be text in RawData.
- Spill formulas need empty room below and right of the anchor, or you get #SPILL!. RESET clears the spill zones before restoring.
- If you change a tab's formulas on purpose, update its backup or the next RESET reverts your change.
- RESET runs as an Office Script in desktop Excel only, not Excel on the web.
