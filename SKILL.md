---
name: "sanctum-dataviz"
description: "Build on-brand Sanctum data visualizations (charts, graphs, tables, KPI rows, heat maps, pie/donut, waterfall, line, bar, scatter, dot matrix, market rings, and crypto views such as net stake flows vs competitors, inflow/outflow bars, market share over time, token APY/price cards) as editable 1920x1080 slides in the Sanctum Brand Update Figma file, with a preview image in the chat and a Figma link. Use this whenever someone wants to chart, graph, plot or visualize Sanctum numbers, make a data slide or KPI slide for a Sanctum deck or report, turn figures (TVL, SOL staked, revenue, APY, LST market share, net flows, token prices, users, market size) or a DefiLlama/Dune CSV into a graphic, or asks which chart to use for Sanctum data, even if they don't say \"chart\" or \"Figma\". Also use it for Sanctum institutional collateral (A4 sales briefs, one-pagers, report pages) and for any question about Sanctum's colour direction (black headings, blue charts and shapes, pale sky bands, lilac accents)."
---

# Sanctum data visualization

Turn numbers into a Sanctum data slide that follows the brand system every time. The person always picks the chart type; you recommend one. Every chart is built in Figma from the brand's own components and colour variables, previewed in the chat, and linked so they can edit it by hand. If the person has no Figma access, the slide is still made, as a PNG (step 4b).

Consistency comes from the files in this skill, not from memory: the builders in `scripts/` encode the grid, type, colours and lines, so write the spec and let them draw.

Colour direction in one line: black headings and light hairlines carry the page, charts and shapes stay blue, pale sky is for table header bands, and on A4 collateral lilac is the accent (pale lilac for a highlighted table column, deep lilac for numerals and dates). Colour hierarchy is blue, then lilac, then gold; gold is held back as the third colour for when a piece needs one. No bar or hairline above the headline on any slide or page. Full rules are in `references/rules.md`.

## Files
- `references/templates.md`: the 20 templates, when each fits, the data each needs, and the recommendation table. Read it on every request.
- `references/rules.md`: the brand rules for data graphics. Read it when writing headlines and notes, or when reviewing a preview.
- `references/collateral.md`: the A4 institutional brief recipe (page grid, type, colour roles, tables, spacing). Read it for any A4 piece in the Sanctum file.
- `references/figma.md`: file key, component IDs, link format, reference frames, and what to do when a build fails.
- `scripts/check_spec.py`: checks a spec against the rules.
- `scripts/csv_to_series.py`: turns a CSV export (DefiLlama, Dune, a sheet) into spec fields, with running totals, weekly sums and downsampling.
- `scripts/pick_option.py`: keeps the chosen emphasis option and deletes the other two.
- `scripts/assemble.py`: joins `core.js`, the template and the spec into one Figma script.

## Workflow

### 0. Ask before you build (every time, no exceptions)
Every request gets questions before anything is built, however small or urgent it sounds and even if the person already gave some answers. Send them in one `AskUserQuestion` call (up to four questions, so split into two calls if you need more). Pre-fill your recommendation from what the person already said, put it first, and mark it "(Recommended)", so a confirmed answer costs one tap. A fast turnaround is never a reason to skip: a wrong guess costs a rebuild, a question costs one tap. If `AskUserQuestion` is not available, ask in plain text and wait.

Ask these, in this order:
1. **Purpose and format.** Where will this be used, and in what size? This decides what you build. Options: a slide in a deck (1920 × 1080, what the builders draw), a page in an A4 brief or one-pager (1240 × 1754, see `references/collateral.md`), a social post or story, a web or email banner, or something else they name. Ask for the exact dimensions when they pick social, banner or other. The builders only draw 1920 × 1080 slides and the A4 recipe today. If the person needs another size, say so in one line, then offer to build the 1920 × 1080 slide and give them the Figma link to resize by hand, or to rebuild the layout by hand at their size.
2. **Template**, unless they named one (step 2).
3. **Logo** (step 2a).
4. **Data basis**: raw or smoothed (name the window), the metric and source (for example DefiLlama base APY), the period and sampling, and for a line chart whether the axis starts at zero or is cut. For a growth story (cumulative totals, TVL, users, SOL staked), also ask whether to use growth framing (step 2d), recommended.
5. **Emphasis** (step 2b), when the template supports it.
6. **Text on the image.** Should the headline and subtitle sit on the image, or will they live in the post or deck text instead? Every word on the image takes height from the chart, so this changes the composition. Options:
   - **Headline and subtitle on the image** (Recommended for decks and standalone slides): the default build.
   - **Headline only**: leave `subtitle` out of the spec, or move its content to `note`.
   - **Chart only** (Recommended for X posts and other social, where the post text carries the message): the chart fills the frame under the logo. Build with `"layout": "full"` and no subtitle, then run the chart-only step in step 4.
7. **Footer**, only when the purpose from question 1 is a deck, an investor or institutional report, or other formal material. Ask whether it needs a footer and what goes in it (multi-select): **source** (Recommended, always on for investor material), **section label** (for example "Traction"), **page number**. Fill `source`, `section` and `page` in the spec for what they pick; leave the rest out. If they want no footer at all, run the no-footer step in step 4.
   For social and marketing material (X posts, other social, banners), do not ask: build without a footer, using the no-footer step in step 4. The source still appears, as one small grey line, because every Sanctum chart carries its source.

Do not build until the answers are in. Record the purpose and size in the spec `name` or `note` so the next person knows what the frame is for.

### 1. Get the point and the data
Find out three things: the numbers, what the slide should say (the finding), and where the numbers come from. If the person gave numbers without a finding, propose one in a sentence ("SOL staked grew every quarter, 7.3M to 18.2M") and let them correct it. If there is no source, ask; every Sanctum chart carries one. Never invent figures. If data is missing, ask for it rather than filling in.

### 2. Recommend a template and let them choose
Read `references/templates.md` and use its recommendation table. Then give the person the choice:

- Send a short menu of the templates that genuinely fit this data (usually 3 to 6), each with one line on what it shows best. Put your recommendation first with a sentence on why.
- Ask with `AskUserQuestion` when it is available: the recommended template first, labelled "(Recommended)", plus up to 3 alternatives. The person can type any other template name in "Other", so mention that the full list is available (column, stacked columns, horizontal bar, line, area, two panels, share bar, donut, table, heat map, stat row, hero metric, progress, waterfall, scatter, dot matrix, cloud rings, and the crypto set: flow, net flow, share over time, token cards).
- If `AskUserQuestion` is not available, ask in plain text and wait.
- Build what they choose, even if it is not your recommendation. If their choice breaks a brand rule (a pie with 9 slices, a line with 3 points), say so in one line and offer the fix, but build their choice if they still want it.
- Skip the question only when the person already named a template.

### 2a. Ask which logo
Every time, before building, ask which logo the slide carries (`AskUserQuestion` when available), unless the person already said:
- **Sanctum official logo**: the Albus cloud with the black wordmark. Spec: `"logo": "official"`.
- **Sanctum institutional logo**: the wordmark alone in deep blue, for institutional and investor material. Spec: `"logo": "institutional"`.
Ask once per request and reuse the answer for every slide in it. If nobody is there to answer, use `official` and say so in one line.

### 2b. Ask what to emphasise
Once the template is chosen, ask what the person wants the audience to notice first: a period ("Q2 2026"), a protocol or series ("JitoSOL"), or a number, and whether they want a short callout line on it.

**Default: show three options, let them pick.** Do not ask which method; build all three side by side by adding `"options": true` to the emphasis (`"emphasis": {"targets": ["Q2 2026"], "callout": "Infinity launch", "options": true}`). `assemble.py` then builds:
- **Option A, colour + type** (the safe default, recommend it unless the chart already leans on category colours)
- **Option B, size + type** (keeps the template's palette, good when colours mean something, like competitors)
- **Option C, colour + size + type, plus the callout** (for the one hero number of a slide)

The call returns three `{option, nodeId, link}` results and three screenshots. Send all three previews in one `SendUserFile` call with a caption naming A, B and C, recommend one in a sentence, and ask which to keep (`AskUserQuestion`: A, B, C). Then run `python3 scripts/pick_option.py <kept id> <other id> <other id>` and pass its output to `use_figma`: it deletes the other two and renames the kept frame. If they want a mix ("B but with the callout"), rebuild that one with an explicit `by` and `"replace"`.

If they already said how ("just make it bigger"), skip the options and build one with an explicit `by`. The methods:
- **Colour (Recommended)**: the target goes Sanctum blue (or keeps its own accent if it is a competitor series); everything else recedes to grey.
- **Size**: the target's mark grows (bars 1.4x wider or thicker, lines 1.75x heavier, dots and badges larger, its value 1.6x bigger). Nothing else changes.
- **Typography**: the target's value goes SemiBold at 32px or more and its label Medium black; every other value and label drops to Regular grey.
- Optional **callout**: one short line (40 characters or fewer) in blue above the emphasised value, with a hairline leader, e.g. "Infinity launch".

If they skip it, use the template's default focus (usually the latest period or Sanctum). Combine methods freely; colour plus typography is the safe default, all three is for a single hero point. Emphasise one thing, two at most: emphasis on everything is emphasis on nothing.

Write it into the spec as `"emphasis": {"targets": ["Q2 2026"], "by": ["colour","type"], "callout": "Infinity launch"}`. Targets match data labels, series names or tickers, ignoring case. If a target does not match, the build returns a warning listing the names it can match; fix the spelling and rebuild. Emphasis works on every chart template; for `table`, `heatmap`, `hero`, `cloud-rings` and `dot-matrix` use their own highlight fields instead. Keep the headline consistent: if the emphasis is on Q2, the headline should be about Q2.

Also settle `layout` when it matters: `split` (text left, graphic on the right half) or `full` (graphic across the slide). Each template has a default; only ask if the content clearly fits either.

If the person gives a CSV or an export link they downloaded, run `python3 scripts/csv_to_series.py <file> ...` (see the Crypto templates section of `references/templates.md`) and paste its output into the spec rather than typing numbers.

### 2c. Comparisons need logos
When a slide compares projects (Sanctum against Jito, Marinade, Jupiter and so on), find and add each project's real logo. Check `LOGOS` in `scripts/core.js` and the Project logos section of `references/figma.md` first; if a logo is missing, find one (browser pane, project site, or ask the person once) and add it. Give each project its own colour: Sanctum sky, then lilac, then gold. Never leave competitors grey and never leave a ticker placeholder without saying so.

### 2d. Growth framing (line and area charts that tell a growth story)
A growth chart should look like growth. The same honest data can look flat or steep depending on how much of the chart the climb is allowed to fill. Growth framing makes the climb fill the chart without distorting anything. Use it by default for cumulative totals, TVL, users, SOL staked and any "since launch" figure; ask in step 0 and recommend it.

Do these, all of them:
1. **Ceiling hugs the data.** The builders round the top of the axis up to a whole step, which can leave a quarter of the chart empty (230 becomes 300). Set the axis yourself: `"yMin": 0, "yMax": <ceiling>, "yStep": <step>`. The ceiling is the next round number 3 to 10% above the highest value, and the step divides it into 4 to 6 gridlines. Examples: 230 gives yMax 250, yStep 50. 18.2 gives yMax 20, yStep 5. 87 gives yMax 90, yStep 15. Never more than one step of empty space above the last value. This works on `line` and `area` only; `column` sets its own axis, so for a growth story in columns, suggest `area` instead.
2. **Zero stays the baseline.** `yMin: 0` here is not a cut axis, so the note does not need "Axis starts at". Never cut the axis above zero, never use a log scale and never stretch or crop the timeline on a growth chart. Those read as manipulation to anyone who checks DefiLlama, and institutional readers do.
3. **Give the chart the height.** The plot should be at least 40% as tall as it is wide. A plot that is 4 or 5 times wider than tall flattens any curve. The text-on-image answer from step 0 decides most of this:
   - **Chart only** gives the chart the most room: `layout: "full"` plus the chart-only step in step 4.
   - With text on the image, prefer `"layout": "split"` for a single growth series: headline and subtitle on the left, the chart on the right half, which gives a tall plot.
   - With `"layout": "full"` and text, keep the headline to one line and drop the subtitle: put that context in `note` instead. A two-line subtitle costs the chart about 100px of height.
4. **End top right.** With the ceiling set, the last point lands near the top-right corner, which reads as "still climbing". Keep the end value at its default size; do not add a callout on the last point unless the person asks.
5. **Let the line carry it.** Use the `area` template for cumulative series (pale fill under a heavy line). Add `"emphasis": {"targets": ["<series name>"], "by": ["size"]}` for a heavier line when there is only one series. Keep x-axis labels few. The builder draws up to 8, which collide on the narrow `split` plot: after the build, run one `use_figma` call that keeps the first label, adds one label at each year start ("2025", "2026") and keeps the last period ("Oct 26"), deleting the rest. On `full`, about 6 labels fit.

Tell the person in one line that growth framing is on and what the ceiling is ("Axis to $250M so the climb fills the chart, still from zero"). If the latest value is below an earlier peak, growth framing does not apply: say so and use the defaults.

Example, cumulative staking rewards reaching $230M:
```json
{"template": "area", "layout": "split", "headline": "$230M in staking rewards to holders.", "highlight": "$230M",
 "subtitle": "Cumulative rewards across partner LSTs and Infinity since 2024.",
 "chartTitle": "Cumulative staking rewards", "unit": "Millions of USD",
 "yMin": 0, "yMax": 250, "yStep": 50,
 "x": ["...from csv_to_series.py"], "series": [{"name": "Rewards", "values": ["..."]}],
 "emphasis": {"targets": ["Rewards"], "by": ["size"]}}
```

### 3. Write and check the spec
Write the spec as JSON to a working folder (for example `<scratchpad>/charts/<slug>/spec.json`), using the fields in `references/templates.md`. Headline rules from `references/rules.md`: state the finding with its number, under 60 characters, no em dashes. Use `highlight` for the one phrase that should turn blue.

Run `python3 scripts/check_spec.py spec.json`. Fix every ERROR. Mention WARNINGS to the person in one line each and build anyway unless a warning changes the chart.

### 4. Build in Figma
1. If the Figma tools are deferred, load `use_figma` (and `create_session`) with ToolSearch, then call `create_session` with file key `GgkXzTiYzGrFM6Xp8C2IFS` once per task. Load the Figma `figma-use` skill guidance if this session has not yet. If there are no Figma tools, or the file cannot be accessed, go to step 4b.
2. Run `python3 scripts/assemble.py spec.json` and pass the contents of the `build.js` it writes, unchanged, as the `code` of one `use_figma` call on file `GgkXzTiYzGrFM6Xp8C2IFS`. Do not hand-edit `build.js`; change the spec or the template instead.
3. The call returns `{nodeId, link, warnings}` plus a screenshot of the slide (960px). If it throws, read `references/figma.md` ("If a build fails").
4. **Chart only.** When the person chose a chart-only image, run this as a second `use_figma` call with the new node id. It removes the headline and subtitle, moves the chart title up to y 190, and stretches the plot to fill the freed height. Data shapes (`area`, `line`) stretch; text, dots and decorations keep their size and only move.
```js
const f = await figma.getNodeByIdAsync('<nodeId>');
for (const n of f.children.filter(n=>n.name==='Headline'||n.name==='Subtitle')) n.remove();
const fixed = n => /Sanctum logo|Slide footer|Method note/.test(n.name), chart = f.children.filter(n=>!fixed(n));
const grids = f.children.filter(n=>n.name==='Grid'), base = Math.max(...grids.map(g=>g.y));
const oldTop = Math.min(...chart.map(n=>n.y)), newTop = 190, band = 100;
const k = (base-newTop-band)/(base-oldTop-band), Y = y => base-(base-y)*k;
for (const n of chart){
  if (n.y < oldTop+band){ n.y = newTop+(n.y-oldTop); continue; }
  const role = n.getSharedPluginData('sanctumviz','r');
  if (n.type==='VECTOR' && (role==='area'||role==='line') && n.height>2){ const top = Y(n.y), bot = Y(n.y+n.height); n.resize(n.width, bot-top); n.y = top; }
  else if (n.type==='RECTANGLE' && n.height<=2) n.y = Y(n.y);
  else { const cy = n.y+n.height/2; n.y = Y(cy)-n.height/2; }
}
await f.screenshot({scale:0.5}); return 'ok';
```
Check the preview: labels must still clear each other after the stretch.
5. **No footer.** For social and marketing images, or when the person said no footer, run this as one more `use_figma` call. It removes the footer and keeps the source as one 18px grey line at the bottom right.
```js
const f = await figma.getNodeByIdAsync('<nodeId>');
const ft = f.children.find(n=>n.type==='INSTANCE' && n.name==='Slide footer');
const src = ft ? (Object.entries(ft.componentProperties).find(([k])=>k.startsWith('Source note'))||[])[1]?.value : '';
if (ft) ft.remove();
if (src){ await figma.loadFontAsync({family:'Instrument Sans', style:'Regular'});
  const v = (await figma.variables.getLocalVariablesAsync('COLOR')).find(x=>x.name==='color/text/secondary');
  const t = figma.createText(); f.appendChild(t); t.fontName={family:'Instrument Sans', style:'Regular'}; t.fontSize=18; t.characters='Source: '+src; t.name='Source';
  t.fills=[figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:.5,g:.5,b:.5}},'color',v)]; t.x=1840-t.width; t.y=1000; }
await f.screenshot({scale:0.5}); return 'ok';
```

### 4b. No Figma access: build the image anyway
If this session has no Figma tools, or `create_session` or `use_figma` says the file cannot be accessed (check with `whoami`: the account must be on the Sanctum team), still make the image. Do not stop and do not only ask them to fix access.
1. Build the same slide as one self-contained HTML page at the chosen size (1920 × 1080 by default): the same grid, type sizes, colours, axis, text-on-image, footer and growth-framing rules from this skill and `references/rules.md`, with the chart drawn as inline SVG. Use Instrument Sans from Google Fonts; if the font cannot load in this environment, use the closest available sans and say so in one line.
2. Render it with Playwright (pre-installed: `require('playwright')`, `chromium.launch()`) at `deviceScaleFactor: 2` and save a PNG, or a JPEG if they asked for one.
3. Look at the image yourself and check it against step 6.
4. Send it with `SendUserFile` (`display: "render"`) and say in one line: "I made this as a PNG because this session isn't signed in to Figma with access to the Sanctum Brand Update file. Sign in to Figma (the Figma connector, with your Sanctum account) and I can rebuild it as an editable Figma frame."
Keep the HTML file so a later Figma rebuild can use the same numbers and wording.

### 5. Preview in the chat, and link to Figma
1. The screenshot in the tool result is saved as an image file; its path appears in the result as `[Image: source: <path>]`. Send that file with `SendUserFile` (`display: "render"`). If no path appears, run a follow-up `use_figma` call: `await (await figma.getNodeByIdAsync('<nodeId>')).screenshot({scale:0.5}); return 'ok';`.
2. Give the `link` from the result (format `https://www.figma.com/design/GgkXzTiYzGrFM6Xp8C2IFS/Sanctum-Brand-Update--Team-?node-id=<nodeId with "-">`), and say it is on the **Data viz** page and fully editable.

Do not try to return the image as base64: `use_figma` caps return values at 48 KB and a slide export is larger.

### 6. Look before you hand it over
Check the returned `warnings` and the preview image against this list:
- One focus only: one blue bar, line or number.
- No overlapping or clipped labels; nothing outside the slide.
- Headline at the top, graphic sitting on the bottom baseline, note and corner labels clear of the graphic.
- Values readable, units stated, source in the footer (or the small source line when there is no footer).
- Contrast: every line and small mark clears 3:1 on white, badge text is black, and anything paler carries a label or value (see Accessibility in `references/rules.md`). No outlines on logos or badges.

If something fails, fix the spec (shorter labels, fewer periods, `layout: "full"`, a shorter subtitle) and rebuild with `"replace": "<nodeId>"` in the spec so the new version takes the old one's place. Do not report a chart as done while a warning about overlap stands; say what you changed.

### 7. Revisions
For "make it a line instead" or "highlight Q2" (that is an `emphasis` change), edit the spec and rebuild with `"replace": "<nodeId>"`. For changes the person wants to make by hand, point them to the Figma link. If they change a chart in Figma and later ask for a rebuild, warn that rebuilding replaces their manual edits.

## Reply format
Keep the reply short:
1. The preview image.
2. One line on what the chart shows and which template, plus the Figma link (or, without Figma access, the line from step 4b).
3. Any warning or rule exception in one line each.
4. One natural next step only if there is a real one (for example, "Want the SOL panel beside it?").

## Example

Request: "chart our SOL staked: Q4 24 7.3M, Q4 25 14.4M, Q2 26 16.6M, Aug 26 18.0M, Sep 26 18.2M. source DefiLlama Oct 2026"

Recommend `column` (one measure over 5 periods), alternatives `line`, `area`, `stats`. After they pick `column`:

```json
{
  "template": "column", "name": "Traction · SOL staked", "layout": "split",
  "headline": "11 quarters of growth.",
  "subtitle": "SOL staked through Sanctum has grown every quarter, making it #1 on Solana by TVL in August 2026.",
  "highlight": "#1 on Solana by TVL",
  "chartTitle": "SOL staked on Sanctum", "unit": "Millions of SOL",
  "data": [
    {"label": "Q4 2024", "value": 7.3, "group": "2024"},
    {"label": "Q4 2025", "value": 14.4, "group": "2025 to 2026"},
    {"label": "Q2 2026", "value": 16.6, "group": "2025 to 2026"},
    {"label": "Aug 2026", "value": 18.0, "group": "2025 to 2026"},
    {"label": "Sep 2026", "value": 18.2, "group": "2025 to 2026"}
  ],
  "valueFormat": {"suffix": "M", "decimals": 1},
  "note": "Uneven periods: annual, then quarterly, then monthly.",
  "source": "Sanctum quarterly reports · DefiLlama, Oct 2026",
  "section": "Traction", "page": "02"
}
```

## Testing changes to the builders
`test/specs.json` holds one example spec per template. `python3 test/make_batch.py out.js column line bar` writes a single script that rebuilds those examples on the Data viz page (frames named "Example · <template>") and screenshots each one. Keep a batch under about 45,000 characters (6 to 8 templates) so it fits one `use_figma` call.