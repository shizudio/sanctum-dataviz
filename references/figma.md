# Figma setup

## File
- File: Sanctum Brand Update (Team). This is the shared team file where every asset lands. The older personal file eFE9ChOSTFjPjwkRXBytrF is retired; do not build there.
- File key: `GgkXzTiYzGrFM6Xp8C2IFS`
- Charts are built on the page **Data viz** (created on first run), each as a 1920 × 1080 frame placed to the right of the last one.
- Link to a chart: `https://www.figma.com/design/GgkXzTiYzGrFM6Xp8C2IFS/Sanctum-Brand-Update--Team-?node-id=<nodeId with ":" replaced by "-">`
- The connected Figma account needs a Full or Dev seat with edit access to this file. A View seat can read but every build fails.

## Reference frames
- **Delivered section** `2026-11-05_Shina` (node `2065:7185`) on the page "Sanctum Asset ( Claude)": `https://www.figma.com/design/GgkXzTiYzGrFM6Xp8C2IFS/Sanctum-Brand-Update--Team-?node-id=2065-7185`. It holds the 7-page brief (section `2063:7184`, pages 01 to 07) and the 2-page version (section `2005:7040`), both in the approved "lilac accents" direction: black type, blue charts and shapes, pale lilac table highlight, deep lilac numerals, no signature bar, with section 06 Compliance controls included.
- **Archive** page: the Donovan draft, the original all-blue 7 pages, Partner logos frame, the gold version (v2), the colour tests (A all-blue, B editorial, C lilac, D sky and gold) and a copy of the old blue 2-page version. Use it for comparison only.
- Anything built before 5 Nov 2026 still uses the earlier styling. When touching it, apply `references/collateral.md`.

## What the builders use
The builders read the brand from the file itself, so a colour change in Figma flows into every new chart.

| Asset | Where | ID |
| --- | --- | --- |
| Colour variables | Local collection "Sanctum" | looked up by name |
| Sanctum logo lockup (Full colour on Light or Dark; Mono black; Mono white). The corner logo on every slide | Style Guide page | `257:7060` |
| Sanctum wordmark (Colour = Sky, Blue, Black, White). Blue variant is the institutional logo | Style Guide page | `243:7925` |
| Slide footer (Section label, Source note, Page number, Show source) | Style Guide page | `243:7958` |
| Panel header (Title, Number, Comparison, nested Delta) | Style Guide page | `243:8110` |
| Stat block (Number, Label) | Style Guide page | `243:8159` |
| Progress metric (Label, Number, Track, Fill) | Style Guide page | `243:8163` |
| Hero metric (Number, Caption) | Style Guide page | `243:8139` |
| Method note (Note) | Style Guide page | `243:8150` |
| Table cell (Type × Align, Text) | Style Guide page | `243:8118` |
| Block rule (Colour = Grey, Blue) | Style Guide page | `243:8170` |
| Sanctum app mark (Squircle, Blue) for token badges | Style Guide page | `257:7075` |

Font: Instrument Sans (Regular, Medium, SemiBold), loaded by the builder.

## If a build fails with "Component missing"
Someone deleted or replaced a component. Find the new IDs with this read-only `use_figma` script, then update `IDS` at the top of `scripts/core.js`:

```js
const page = figma.root.children.find(p => p.name === 'Style Guide');
await figma.setCurrentPageAsync(page);
const names = ['Sanctum wordmark','Slide footer','Panel header','Stat block','Progress metric','Hero metric','Method note','Table cell','Block rule'];
return page.findAllWithCriteria({types:['COMPONENT_SET','COMPONENT']})
  .filter(c => names.includes(c.name) && c.parent.type !== 'COMPONENT_SET')
  .map(c => c.name + ' ' + c.id);
```

## If a build fails with "Variable missing"
A colour variable was renamed. The builder needs these names in the "Sanctum" collection:
`color/brand/blue, sky, azure, powder, ice` · `color/neutral/white, grey, cool-grey, line` · `color/sol/1` to `4` · `color/accent/lilac/1, lilac/4, green/4, yellow/1, yellow/4, coral/2, coral/3` · `color/text/strong, title, secondary, highlight, accent-lilac, accent-green, accent-yellow`.

## Previews
Figma's screenshot links cannot be downloaded from Claude's workspace, and `use_figma` caps return values at 48 KB, so the builder calls `frame.screenshot({scale: 0.5})` at the end. The image arrives with the tool result and is saved as a file (path shown as `[Image: source: ...]`), which is what gets sent in the chat. Set `previewScale` in the spec to change the size, or `noPreview: true` to skip it.
