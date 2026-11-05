# Template catalog

Twenty templates: sixteen general ones and four built for crypto product data (flow, net-flow, share-area, ticker). Each has an id (the `template` field in the spec), the question it answers, the data shape it needs, and its limits. Show the user the menu (see SKILL.md), recommend one, and build what they pick.

## How to recommend

Match the user's point, not the data columns. Work down this list and take the first match.

| If the point is about... | Recommend | Strong alternatives |
| --- | --- | --- |
| One number that matters most | `hero` | `stats` |
| 2 to 4 headline numbers side by side | `stats` | `table` |
| A percentage of a target or a whole, 1 to 4 of them | `progress` | `share-bar`, `donut` |
| A total moving from one value to another through steps | `waterfall` | `column` |
| The same measure in two units (USD and SOL) | `panels` | two `column` slides |
| One measure over 3 to 10 periods | `column` | `line` |
| One or more measures over 11+ points, or a trend shape | `line` | `area`, `column` |
| How a total over time splits into parts | `column-stacked` | `area` |
| Parts of a whole at one moment, up to 5 parts | `share-bar` | `donut` |
| Ranking items by one measure | `bar` | `table` |
| Comparing items on several different attributes | `table` | `heatmap` |
| Intensity across two dimensions (day by hour, product by month) | `heatmap` | `table` |
| Relationship between two measures across items | `scatter` | `table` |
| A count of units out of a total (holders, validators) | `dot-matrix` | `progress` |
| Nested markets (TAM, SAM, SOM) | `cloud-rings` | `stats` |
| Net gain or loss over time for Sanctum vs other protocols (cumulative stake flows, PnL, net deposits) | `flow` | `line`, `share-area` |
| Inflows and outflows per period (weekly net stake, deposits minus withdrawals) | `net-flow` | `waterfall`, `column` |
| Market share or dominance changing over time (LST TVL share, volume share) | `share-area` | `flow`, `share-bar` |
| Token or vault figures side by side (APY, price, TVL per LST) with a recent trend | `ticker` | `stats`, `bar` |

Pie or donut is never the default recommendation: a `share-bar` is easier to read. Offer `donut` as an alternative and build it if the user picks it.

## Templates

### `column` · Column chart
- **Answers**: how one measure changed over periods.
- **Data**: `data: [{label, value, group?}]`, 2 to 10 rows. `group` (e.g. a year) splits the columns into groups with a gap and a group label.
- **Colour**: `palette: "blue"` (default) puts the focus in Sanctum sky and every other period in powder. `"sol"` uses the lilac ramp. `"category"` uses the category order. `focus` names the label that gets Sanctum sky; default is the last row.
- **Limits**: values ≥ 0, bars start at zero. Values on the bars, no axis.

### `column-stacked` · Stacked columns
- **Answers**: how a total over time splits into parts.
- **Data**: `series: ["A","B",...]` (2 to 5), `data: [{label, values: {A: n, B: n}}]`, 2 to 10 rows.
- **Colour**: category order per series. Legend top-left (the one place legends are allowed). Total printed above each column.

### `bar` · Horizontal ranking
- **Answers**: which items lead on one measure.
- **Data**: `data: [{label, value}]`, 2 to 10 rows. Sorted largest first automatically.
- **Colour**: `focus` label in Sanctum sky (default: Sanctum if present, else the top row), the rest cool grey.

### `line` · Line chart
- **Answers**: trend over many points; comparing 2 to 3 series over time.
- **Data**: `x: ["Jan",...]`, `series: [{name, values: [...], role: "focus"|"context"}]`, 1 to 3 series, 4 to 36 points. Optional `projectionFrom` (index where values become forecast, drawn dashed). Optional `reference: {value, label}` (target line).
- **Colour**: focus 4px Sanctum sky, context 2px mid grey. Labels at the line ends, no legend. Light y axis (4 steps) because values are not printed on every point.

### `area` · Area chart
- Same data as `line` with one series. Filled with powder blue under a 4px blue line. Use when the volume under the line is the point (TVL).

### `panels` · Two matched panels
- **Answers**: the same measure in two units, usually USD and SOL.
- **Data**: `panels: [{title, number, delta: {value, direction: "up"|"down"}, comparison, data: [{label, value, group?}], palette}]`, exactly 2. Usually `palette: "blue"` then `"sol"`.

### `share-bar` · 100% share bar
- **Answers**: parts of a whole at one moment.
- **Data**: `data: [{label, value}]`, 2 to 5 parts plus an automatic Other. Values are shares or amounts; percentages are computed.
- **Colour**: category order. Percent above each segment in the matching text colour, label below.

### `donut` · Donut
- **Answers**: same as `share-bar`, when the user prefers a circle.
- **Data**: as `share-bar`, 2 to 5 parts plus Other. Centre shows the total or `centerLabel`. Labels in a list beside the donut, never on the slices.

### `table` · Comparison table
- **Answers**: items compared on attributes of different kinds.
- **Data**: `columns: ["Criteria","Sanctum","Jito",...]`, `rows: [["Shared LST liquidity","Infinity","",...]]`, up to 6 rows and 5 columns. `highlightColumn`: column index for Sanctum (ice blue). `numeric: [indexes]` right-aligns those columns. Empty cells become a grey en dash.

### `heatmap` · Heat map
- **Answers**: where values concentrate across two dimensions.
- **Data**: `rows: ["Mon",...]`, `columns: ["00",...]`, `values: [[...],[...]]`, up to 8 rows and 12 columns.
- **Colour**: one blue ramp in 5 steps, powder to Sanctum blue. Value text black on light cells, white only on the darkest. Scale key underneath.

### `stats` · Stat row
- **Answers**: 2 to 4 headline numbers.
- **Data**: `stats: [{number, label}]`. `focus`: index of the stat that gets the blue rule and blue number (optional).

### `hero` · Hero metric
- **Answers**: the one number of the slide.
- **Data**: `number`, `caption`, optional `support` (a sentence on the left).

### `progress` · Progress metrics
- **Answers**: a percentage of a target or whole.
- **Data**: `items: [{label, number, ratio}]`, 1 to 4, `ratio` from 0 to 1.

### `waterfall` · Waterfall (bridge)
- **Answers**: what moved a total from A to B.
- **Data**: `start: {label, value}`, `steps: [{label, value}]` (signed), `end: {label}` (computed).
- **Colour**: start total powder, end total Sanctum sky, increases powder, decreases coral tint #FFB6C2 with "−" values. This is the one place a coral tint fills a mark, because a decrease is the negative meaning coral is reserved for.

### `scatter` · Scatter
- **Answers**: how two measures relate across items.
- **Data**: `xLabel`, `yLabel`, `points: [{label, x, y}]`, 3 to 40. `focus`: label to highlight (blue, labelled). Others mid grey, labelled only if `labelAll`.

### `dot-matrix` · Dot matrix
- **Answers**: a count out of a total.
- **Data**: `total`, `counted`, optional `pending`, `unit` ("1 dot = 1 validator"). Up to 200 dots; above that, scale the unit.
- **Marks**: counted solid blue, pending blue ring, remaining grey ring, so shape as well as colour tells them apart.

### `cloud-rings` · Nested cloud rings
- **Answers**: nested shares or market sizes (total > staked > liquid staked > Sanctum; TAM > SAM > SOM).
- **Data**: `levels: [{label, value, share?}]`, 2 to 4, outermost first. Optional `legendTitle` (default "Where it sits"). Always marked "Diagram not to scale" in the note.
- **Colour**: a full ramp from pale sky to sky to azure, with the core in deep Sanctum blue (#006BFF), the one focus mark. Rings carry no text.
- **Legend**: a table beside the clouds (label, value, share), each row level with its ring and joined to it by a 2px leader line in that ring's colour. The core's value is in blue. Best in `layout: "full"`.

## Crypto templates

These follow the reference "Liquid Staking Market on Solana" chart: dense daily data, a zero line, translucent fills, and token badges at the line ends instead of a legend.

**Token badges.** Sanctum always gets the Albus app mark (squircle, sky) with no outline. Every other token gets a pale squircle in its series colour, no outline, and its ticker in black, named "Badge · <ticker> (drop logo here)" so a designer can paste the real logo in Figma. Never draw a competitor's logo. Mark the Sanctum series with `"sanctum": true`; give others a short `ticker` (4 characters fits best).

**Series colours.** Sanctum sky for Sanctum, then lilac, gold, green, coral in order (blue, lilac, gold is the colour hierarchy). Never a competitor's own brand colour. Use `"colour": "color/neutral/cool-grey"` for an "Others" group.

**Getting the data in.** Exports from DefiLlama, Dune or a sheet go through `scripts/csv_to_series.py` (first column dates, one column per series): `--cumulative` turns daily flows into running totals for `flow`, `--weekly` sums to weeks and prints `data` for `net-flow`, `--max-points 400` downsamples, `--scale 1e6` converts to millions, `--sanctum "<column>"` and `--tickers "JitoSOL=JITO"` set badges.

### `flow` · Net gain or loss over time
- **Answers**: who gained and who lost over a period, around zero. The reference chart.
- **Data**: `x: ["2025-01-01", ...]` (ISO dates give month labels; other labels are thinned to 8), `series: [{name, values, ticker?, sanctum?}]`, 1 to 4 series, up to about 400 points.
- **Drawing**: each series fills to the zero line at low opacity, lines on top in the deep partner colour (Sanctum 4px, others 3px), y axis always includes zero, end value and name beside each badge.

### `net-flow` · Inflows and outflows
- **Answers**: money in vs money out per period.
- **Data**: `data: [{label, value}]` signed, 2 to 60 bars. `total: true` prints the net sum on the right. `focus` label (default last).
- **Colour**: inflows Sanctum sky, outflows soft coral #F490A0 (never the deep coral: a dip should not read as a warning). The minus sign, printed value and position below zero carry direction too. The focus period is marked by its black value. Values printed when 12 bars or fewer, otherwise a light y axis.

### `share-area` · Share over time
- **Answers**: how market share moved.
- **Data**: same as `flow` but amounts of zero or more; shares are computed per point. Sanctum is stacked at the bottom so its share reads against the baseline. Up to 5 series.

### `ticker` · Token cards
- **Answers**: the headline figure per token, with direction and a recent trend.
- **Data**: `tokens: [{name, ticker, sanctum?, value: "7.42%", label: "30-day APY", change: "0.31% MoM", direction: "up"|"down"|"flat", spark: [numbers]}]`, 1 to 4.
- **Colour**: Sanctum card gets the blue rule, blue figure and a blue sparkline with powder fill; others black figures and grey sparklines. Up in green text, down in coral.

## Common fields (every template)

| Field | Required | Notes |
| --- | --- | --- |
| `template` | yes | One id from above |
| `name` | yes | Frame name in Figma |
| `headline` | yes | The finding, with its number. Max 60 characters |
| `highlight` | no | A phrase inside the headline or subtitle to colour blue. It is the slide's one blue mark; headlines are otherwise black |
| `accentBar` | no | The sky and lilac bar above the headline is drawn by default; `false` removes it |
| `subtitle` | no | Supporting statement, grey |
| `chartTitle`, `unit` | for charts | Title in blue over a block rule, unit in grey |
| `layout` | no | `"split"` (text left, graphic columns 7 to 12) or `"full"` (graphic across 12 columns). Each template has a sensible default |
| `valueFormat` | no | `{prefix, suffix, decimals}` for printed values |
| `note` | no | Method note at y 940 |
| `source` | yes for data | Footer source note |
| `logo` | yes | `"official"` (cloud + black wordmark) or `"institutional"` (deep blue wordmark only). Always ask the person; see SKILL.md step 2a |
| `emphasis` | no | `{targets: [label or series], by: ["colour","size","type"], callout?}`, or `{targets, callout?, options: true}` to build options A, B and C side by side. Applied after the chart is drawn, on top of the template's own focus. See SKILL.md step 2b |
| `section`, `page` | no | Footer corner labels |
