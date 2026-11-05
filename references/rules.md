# Sanctum data graphics rules

The builders already apply these. Read this file when writing headlines and notes, when the user asks for a variation the builders do not cover, or when reviewing a preview.

## Principles
1. One graphic, one point. The headline states the finding with its number.
2. Neutral first, blue once. Black type and light lines carry the page; saturated Sanctum blue #006BFF appears once, on the one thing the headline is about. Pale sky fills and lilac accents do the rest (see "Colour direction").
3. Values on the marks or a light axis, never both.
4. Label directly. Legends only for stacked charts with 2+ series.
5. Every number has a source in the footer. Derived or estimated figures say so in the method note.

## Layout (1920 × 1080)
- 12 columns, 80px margins, 32px gutters (column 117.3px). Blocks span 3, 4, 6 or 12 columns.
- Anchors: wordmark y 70, headline top y 190, content baseline y 900, method note y 940, corner labels y 1000.
- Spacing scale: 8, 16, 32, 64, 128.
- One slide mode: Statement (display type only), Data (headline + one graphic), Split (text columns 1 to 6, graphic or cloud tile on the right). Two graphics only as matched panels.

## Type (Instrument Sans)
| Role | Size / weight |
| --- | --- |
| Display | 140 / Medium, −3% tracking |
| Headline | 64 / Medium, −2% |
| Hero number | 140 / SemiBold |
| Body | 28 / Regular |
| Chart and panel title | 28 / Medium |
| Label | 24 / Regular |
| Value on mark, table header, delta | 24 / Medium |
| Meta (notes, corners) | 18 / Regular |

Data labels never go below 24px.

## Text colour
| Role | Colour |
| --- | --- |
| Strong: key numbers, focus values, table values | Black #000000 |
| Title: headlines, chart and panel titles | Black #000000 (the `strong` colour; never blue) |
| Secondary: subtitles, labels, notes, corners | Grey #808080 |
| Highlight: one phrase inside a headline or subtitle, or the one focus value | Sanctum blue #006BFF. This is the page's one blue |
| Accent text: rank numerals, dates, small labels | Deep lilac #5A66E0 (`text/accent-lilac`), on A4 collateral and data slides alike |
| Accent highlight (names a category) | Lilac #5A66E0, green #138A3D, yellow #A36F00 |
| Status, deltas only | Up #027E02, down #ED4763 |

One highlight colour per slide. Coral is never a highlight.

## Fill colour
| Role | Value |
| --- | --- |
| Focus | #006BFF |
| Order ramp (time) | #B4E1FF → #6DC4FE → #47A6FF → #006BFF |
| Context | Cool grey #E0E7F1 |
| SOL ramp | #D6DAFF → #BDC3FF → #98A1F7 → #7884F7 |
| Category order | Blue #006BFF, lilac #98A1F7, gold #FFC547, green #49D172, soft coral #F490A0, Other cool grey |
| Pending | Dashed powder outline |

- Same category, same colour, whole deck.
- Full-strength coral #ED4763 means negative. Never a category.
- Lilac marks SOL, so a SOL panel and a lilac category never share a slide.
- Labels on accent fills are black. White text only on #006BFF.

## Lines
- Block rule: 1px grey #CBD3DE on top of every content block. Always grey: never blue, never black, never under a headline.
- Table hairline: 1px cool grey between rows. No vertical rules, no stripes.
- Data line: 4px or heavier, coloured by role.

## Colour direction (set Nov 2026)
Why: pages with blue headings, blue bands and blue cards read as a generic blue fintech brand. Sanctum's own world is sky, Albus and warmth, so the page stays neutral and blue stays on the data and shapes. The final direction for A4 collateral was set on 5 Nov 2026 ("lilac accents"). Reference: the section named `YYYY-MM-DD_Name` on the main Figma page (see `references/figma.md`).

| Job | Colour |
| --- | --- |
| Headlines, section labels, table text, body, stats | Black. Kickers grey #808080 caps. On A4 every other label stays black |
| Charts, cloud diagram, bars and other shapes | Stay blue: Sanctum blue #006BFF for the core and the one focus value, sky #6DC4FE, azure and powder #B4E1FF for the rest. The institutional wordmark is blue |
| Pale sky bands | Ice #E2F2FC behind table header rows |
| Lilac accent (A4 collateral) | Pale lilac #EDEFFF (`color/accent/lilac/1`) fills the highlighted table column, black text on it. Deep lilac #5A66E0 (`color/text/accent-lilac`) for rank numerals, step numbers, section numbers and timeline dates |
| Gold (reserved third colour) | Bright gold #FFC547 for fills and deep gold #A36F00 for small text, only when a piece needs a third colour (a third series or category). It is not used for the signature bar, numerals or table highlights |
| Lines | 1px light hairlines only (#CBD3DE). No ink rules between sections, no solid blue bands |

- Blue is for data and shapes, lilac is for marking and emphasis in tables and numbering. Neither is used for headings or paragraphs.
- Colour hierarchy (set 5 Nov 2026): blue first, lilac second, gold third. Reach for the next colour only when the one before it is already in use on the page.
- Signature mark: a two-tone bar, sky then lilac (`lilac/4`), above the headline on 1920 × 1080 slides (48 + 48 × 6px). Not used on A4 collateral.
- Deep lilac sits close to the wordmark blue at small sizes. If it needs to read more clearly as purple, use a more violet shade, but keep it one colour across the piece.
- Bright gold fails contrast as text. Gold text is always #A36F00.
- Avoid the generic fintech look: blue headlines, full-bleed blue closing bands, tinted rounded cards, pill buttons.
- Keep one typeface. Display serifs were tried and rejected.
- Grey labels only at slide sizes (24px and up). On A4 at 14 to 16px, labels stay black; #808080 is too faint.
- A full-bleed blue is for covers only (sky gradient with Albus, white type), as in the Sanctum Quarterly.

## Honesty
- Bars start at zero. No cut axes.
- Uneven periods are labelled as uneven in the note.
- Pending data is drawn as pending, never guessed.
- No placeholders ("XX%", "TBD") in a finished chart.
- Same unit and decimals across a slide.
- Sanctum copy uses no em dashes.


## Crypto data
- Signed data always shows a zero line (2px grey). Gains above, losses below; never hide the negative side by starting the axis at zero.
- Outflows and losses use coral tints, the one meaning coral carries. Inflows use the blue ramp.
- Sanctum is always Sanctum blue with the Albus badge. Other protocols take accent colours in order, never their own brand colours, and never their logos drawn by us: their badge is a ticker placeholder for a designer to fill.
- Dense series (daily data) carry no point markers and no per-point values; the end value beside the badge is the number that matters.
- Say how a flow is counted in the method note (daily net, summed from a date; Monday to Sunday weeks; trailing 30-day APY).


## Accessibility (contrast)
Targets: text 4.5:1 (3:1 for 24px and larger, which is everything on a slide), chart marks 3:1 against white (WCAG 1.4.11). The builders enforce this through `MARK` in `core.js`; keep to it when editing by hand.

| Use | Colour | On white |
| --- | --- | --- |
| Fills only (areas, bands, badge backgrounds) | powder, sky, lilac/4, green/4, yellow/4, coral/2, cool grey | 1.2 to 2.4:1, too pale for lines or small marks |
| Lines and small marks | Sanctum sky #6DC4FE (brand exception, see below), blue #006BFF for text, lilac #5A66E0, green #138A3D, yellow #A36F00, coral #ED4763, grey #808080 | 3.7 to 5.3:1 |
| Text on a pale badge | black | 6 to 13:1 (white would be 2:1) |

- A pale fill is fine when the same thing also has a deep line (flow fills, share bands), a label inside or beside it (badges carry black tickers and names), or a printed value next to it (column bars, outflow bars).
- Logos and badges never get outlines.
- Outflows and losses use soft coral #F490A0 as a fill, not the deep #ED4763, which reads as an error state. Deep coral is only for small text like a "↓ 0.12%" change.
- Never let colour alone carry a meaning: outflows also have a minus sign and sit below zero; pending dots are rings, counted dots are solid; projections are dashed.
- Context lines are mid grey #808080, never cool grey (1.2:1).


## Emphasis
Three levers, used alone or together, always on one or two targets:
- **Colour**: target in Sanctum blue (competitor series keep their accent); everything else cool grey fills, mid grey lines, grey text, other badges at half opacity.
- **Size**: target only gets bigger. Bars 1.4x wider (columns) or thicker (horizontal bars), lines 1.75x heavier (5px minimum), points and badges 1.25 to 1.5x, its value 1.6x. Never change a bar's length or a segment's width: those carry the data.
- **Typography**: target value SemiBold 32px or more, target label Medium black; every other value and label Regular grey.
- **Callout**: one line, 40 characters or fewer, blue Medium 24px, above the target value with a 1px blue leader.
- The emphasised thing and the headline must agree.


## Sanctum's data colour is light blue
- Sanctum's own marks (its bars, line, area, band, dots, sparkline, the emphasised item) use Sanctum sky #6DC4FE, as in the brand's reference charts. Earlier periods and context sit in powder #B4E1FF or grey.
- Deep Sanctum blue #006BFF is for text (titles, highlighted numbers, the emphasised value) and for one focus mark at most: the core of nested diagrams (cloud rings) and the heat map's darkest step.
- Nested diagrams keep their words outside the shapes: a legend table beside them, joined by 2px leader lines in each ring's colour.
- Sky is 1.9:1 on white, below the 3:1 mark guideline. This is a deliberate brand choice; keep Sanctum lines at 4px, always label the end value, and print values on bars so the colour is never the only carrier.


## Logo
Two corner logos, and the person always chooses which:
- **Official**: full-colour lockup (Albus app mark in sky + black "sanctum" wordmark), 56px visible height on 1920 slides at x 80, y 70; 40px on A4 pages. Dark Background variant on dark slides.
- **Institutional**: the "sanctum" wordmark alone in deep blue (#006BFF), native size (220 × 39) on slides at x 80, y 70. White variant on dark slides.
Never mix the two within one deck or document.
