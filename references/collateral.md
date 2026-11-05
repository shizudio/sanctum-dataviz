# Sanctum institutional collateral (A4 briefs and one-pagers)

Use this when the person asks for a sales brief, one-pager, report page or any A4 document in the Sanctum file, with or without charts. Colour direction is "lilac accents" (`references/rules.md`, "Colour direction"), approved 5 Nov 2026. The approved reference is the delivered section `2026-11-05_Shina` on the main Figma page: the 7-page brief (node `2063:7184`) and the 2-page version (node `2005:7040`). When in doubt, copy those. Older versions (blue, gold, colour tests) are on the Archive page.

## Page
- Frame 1240 × 1754 px (A4). Side margins 64, content width 1112. Top of content y 128, bottom limit y 1652.
- Header: institutional wordmark top left, running head right (Medium 18, black), light hairline at y 102.
- Footer: light hairline at y 1686; `sanctum.so` left, disclaimer centred, `01 / 02` right (Regular 18, black) at y 1706.
- No sky and lilac signature bar on A4 pieces. The user asked for it to be left out (Nov 2026). The header hairline and the title block carry the page.
- Logo: institutional wordmark (deep blue). Never the official cloud lockup on institutional pieces unless asked.

## Colour roles (black type, blue shapes, lilac accents)
| Element | Colour |
| --- | --- |
| Title, section labels, table text, body, lead sentences, stats | Black (`color/text/strong`) |
| Kicker above the title | Grey `color/text/secondary`, uppercase |
| Captions, notes, intro lines | Black. Grey is too faint at A4 sizes |
| Rank numerals, step numbers, section numbers (the "01" in a label), timeline dates | Deep lilac `color/text/accent-lilac` (#5A66E0) |
| Highlighted table column | Pale lilac `color/accent/lilac/1` (#EDEFFF) fill, black text, full height of the table |
| Table header band | Ice `color/brand/ice` fill, about 36px high, behind the header row |
| Charts, bars, cloud diagram, leader lines | Stay blue: sky, azure, powder rings with the blue core, and its figure in `color/text/highlight` |
| Hairlines | `color/neutral/line`, 1px, everywhere. No ink rules, no blue rules |

Never: blue headings, blue section labels, gold for numerals or highlights (gold is the reserved third colour), solid blue closing bands, tinted rounded cards, serif display type. A closing band, if wanted, is a hairline plus black text on white. Section labels are black Medium with only the number in deep lilac.

## Type (Instrument Sans only)
| Role | Size / weight / line height |
| --- | --- |
| Title | 56 / Medium / 100%, −3% tracking, black |
| Kicker | 16 / SemiBold / 150%, +8% tracking, uppercase, grey |
| Subtitle | 20 / Regular / 140% |
| Section label | 20 / Medium / 150%, black |
| Lead sentence | 22 / Medium / 125 to 130% |
| Table header and rank numeral | 18 / SemiBold |
| Table and paragraph text | 15 / Regular / 150% |
| Timeline date | 15 / SemiBold, deep lilac |
| Notes and sources | 13 to 16 / Regular / 150% |

Body line height is 150% everywhere. Smallest text on the page is 13px; do not go below it.

## Layout and spacing
- Build the page in bands (title block, diagram, table, comparison, section), then spread the spare height between bands instead of leaving a gap at the end: measure used height, subtract from the limit, and add the difference between bands in proportion to a weight per band (about 1 for ordinary gaps, a little more before a major section).
- Two- and three-column grids use 32px gutters: columns at `64 + i × (width + 32) / n`.
- Tables: row pitch about 34px, 1px light hairline under each row, ice band behind the header, no vertical rules, no stripes. Rank numerals in deep lilac, left of the name. A highlighted column gets the pale lilac fill the full height of the table.
- A dense 2-page version packs the bands with about 8px between a hairline and the content on each side, 13px text in three columns for the last section, and ends content at y 1648 at the latest. Merge the conclusion and closing blocks (no hairline between them) before shrinking type below 13px. If a new section does not fit, condense text only when the person has asked for a condensed version; otherwise tell them it needs a third page.
- Partner and token logos are 20 to 22px rounded chips filled with the logo image; no outlines. Use real logos only where the person supplied or approved them; low-resolution marks (Gate, MarginFi so far) should be replaced when a better file exists.
- Keep every sentence the person wrote word for word when condensing is not asked for. After any edit, export the text and compare it against the source.

## Process
1. Clone the reference pages (7-page brief or 2-page version in the delivered section), or build from them.
2. When the person asks for a colour or layout change, build the variants side by side in a section of the file labelled A, B, C, so they can compare, and say which differences are intentional. Recolour variants by cloning the section and rebinding variables (`setBoundVariableForPaint`), and check for unbound raw colours (swatches, leader lines) that a variable pass misses.
3. Verify by screenshot and, for text, by exporting the nodes' characters and comparing old against new. Look for overlaps, clipped text and any element sitting past y 1652.
4. Send the preview with `SendUserFile` and give the Figma link.
5. Housekeeping once a version is confirmed: move everything else to a page named "Archive" (keep a copy of any version that is edited in place), and wrap the deliverables in one section named `YYYY-MM-DD_Name` (for example `2026-11-05_Shina`) on the main page. Sections can be nested, so each deliverable keeps its own labelled sub-section.
