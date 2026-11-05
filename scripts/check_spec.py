#!/usr/bin/env python3
"""Check a Sanctum chart spec against the brand rules before building it in Figma.

Usage: python3 check_spec.py spec.json
Prints ERRORS (must fix before building) and WARNINGS (tell the user, build anyway if they agree).
Exit code 1 if there are errors.
"""
import json, sys

TEMPLATES = {"column", "column-stacked", "bar", "line", "area", "panels", "share-bar", "donut", "table",
             "heatmap", "stats", "hero", "progress", "waterfall", "scatter", "dot-matrix", "cloud-rings",
             "flow", "net-flow", "share-area", "ticker"}
NEEDS_SOURCE = TEMPLATES - {"hero"}
PLACEHOLDERS = ("XX", "TBD", "TODO", "lorem", "???")


def check(spec):
    E, W = [], []
    t = spec.get("template")
    if t not in TEMPLATES:
        return [f"Unknown template '{t}'. Use one of: {', '.join(sorted(TEMPLATES))}"], W
    for f in ("name", "headline"):
        if not spec.get(f):
            E.append(f"Missing '{f}'.")
    h = spec.get("headline", "")
    if len(h) > 60:
        W.append(f"Headline is {len(h)} characters. Keep it under 60 so it fits on one or two lines.")
    if not any(ch.isdigit() for ch in h) and t not in ("table",):
        W.append("Headline has no number. The finding should carry its number.")
    if t in NEEDS_SOURCE and not spec.get("source"):
        E.append("Missing 'source'. Every number needs a source in the footer.")
    blob = json.dumps(spec, ensure_ascii=False)
    if "—" in blob:
        E.append("Em dash found. Sanctum copy uses no em dashes; use a comma, colon or full stop.")
    for p in PLACEHOLDERS:
        if p in blob:
            E.append(f"Placeholder '{p}' found. Replace it with real content or remove it.")
    if spec.get("highlight") and spec["highlight"] not in h + spec.get("subtitle", ""):
        W.append("'highlight' is not found in the headline or subtitle, so nothing will be highlighted.")

    def values(rows, key="value"):
        return [r.get(key) for r in rows if not r.get("pending")]

    if t in ("column", "bar", "share-bar", "donut"):
        data = spec.get("data") or []
        if len(data) < 2:
            E.append("Need at least 2 data rows.")
        if any(v is None or v < 0 for v in values(data)):
            E.append("Values must be zero or more. Show negative changes with 'waterfall'.")
        if t == "column" and len(data) > 10:
            E.append(f"{len(data)} columns. Use at most 10, or switch to 'line'.")
        if t == "bar" and len(data) > 10:
            W.append("More than 10 rows. Show the top 9 and group the rest as Other.")
        if t in ("share-bar", "donut") and len(data) > 5:
            W.append("More than 5 parts. The smallest will be grouped into Other.")
        if t == "column" and spec.get("focus") and spec["focus"] not in [d.get("label") for d in data]:
            E.append("'focus' does not match any label.")
        if t == "column" and spec.get("palette") == "category" and len(data) > 5:
            E.append("Category colours run out after 5. Use the blue ramp or group items.")
        if t == "column":
            longest = max((len(str(d.get("label", ""))) for d in data), default=0)
            if longest > 8 and len(data) > 6:
                W.append("Long period labels with many columns may collide. Shorten labels (e.g. 'Q3 26').")
    if t == "column-stacked":
        s = spec.get("series") or []
        if not 2 <= len(s) <= 5:
            E.append("'series' needs 2 to 5 names.")
    if t in ("line", "area"):
        series = spec.get("series") or []
        x = spec.get("x") or []
        if not 1 <= len(series) <= 3:
            E.append("Line charts take 1 to 3 series.")
        if t == "area" and len(series) != 1:
            E.append("Area charts take exactly 1 series.")
        if any(len(s.get("values", [])) != len(x) for s in series):
            E.append("Every series needs one value per x label.")
        if sum(1 for s in series if s.get("role") == "focus") > 1:
            E.append("Only one series can be the focus.")
        if len(series) > 1 and not any(s.get("role") == "focus" for s in series):
            W.append("No focus series. Mark the series the headline is about with role 'focus'.")
        if len(x) < 4:
            W.append("Fewer than 4 points. A column chart reads better.")
    if t == "panels":
        p = spec.get("panels") or []
        if len(p) != 2:
            E.append("'panels' needs exactly 2 panels.")
        if sum(1 for q in p if q.get("palette") == "sol") > 1:
            W.append("Both panels use the SOL palette. Usually one is USD (blue) and one is SOL (lilac).")
    if t == "table":
        cols, rows = spec.get("columns") or [], spec.get("rows") or []
        if len(cols) > 5:
            E.append("Tables take at most 5 columns per slide.")
        if len(rows) > 6:
            W.append("More than 6 rows. Split across slides or keep the 6 that matter.")
        if any(len(r) != len(cols) for r in rows):
            E.append("Every row needs one cell per column.")
    if t == "heatmap":
        r, c, v = spec.get("rows") or [], spec.get("columns") or [], spec.get("values") or []
        if len(r) > 8 or len(c) > 12:
            E.append("Heat maps take up to 8 rows and 12 columns.")
        if len(v) != len(r) or any(len(row) != len(c) for row in v):
            E.append("'values' must have one row per row label and one value per column.")
    if t == "stats":
        s = spec.get("stats") or []
        if not 2 <= len(s) <= 4:
            E.append("Stat rows take 2 to 4 stats.")
    if t == "progress":
        items = spec.get("items") or []
        if not 1 <= len(items) <= 4:
            E.append("Progress takes 1 to 4 items.")
        if any(not 0 <= i.get("ratio", -1) <= 1 for i in items):
            E.append("Each progress 'ratio' must be between 0 and 1.")
    if t == "waterfall":
        if not spec.get("start") or not spec.get("steps") or not spec.get("end"):
            E.append("Waterfall needs 'start', 'steps' and 'end'.")
    if t == "scatter":
        if len(spec.get("points") or []) < 3:
            E.append("Scatter needs at least 3 points.")
        if any(p.get("x", -1) < 0 or p.get("y", -1) < 0 for p in spec.get("points", [])):
            E.append("Scatter axes start at zero; negative values are not supported.")
    if t in ("flow", "share-area"):
        series, x = spec.get("series") or [], spec.get("x") or []
        if not 1 <= len(series) <= (4 if t == "flow" else 5):
            E.append(f"'{t}' takes 1 to {4 if t == 'flow' else 5} series.")
        if any(len(s.get("values", [])) != len(x) for s in series):
            E.append("Every series needs one value per x point.")
        if sum(1 for s in series if s.get("sanctum")) > 1:
            E.append("Only one series can be Sanctum.")
        if not any(s.get("sanctum") or s.get("role") == "focus" for s in series):
            W.append("No series is marked sanctum or focus, so nothing is in Sanctum blue.")
        if len(x) > 800:
            W.append(f"{len(x)} points. Downsample to about 400 with scripts/csv_to_series.py --max-points 400.")
        if t == "share-area" and any(v < 0 for s in series for v in s.get("values", [])):
            E.append("Share charts need amounts of zero or more, not net flows. Use 'flow' for signed data.")
    if t == "net-flow":
        d = spec.get("data") or []
        if not 2 <= len(d) <= 60:
            E.append("Net flow takes 2 to 60 bars. Aggregate daily data to weeks.")
        if all(r.get("value", 0) >= 0 for r in d):
            W.append("No outflows. A plain 'column' chart reads better.")
    if t == "ticker":
        tk = spec.get("tokens") or []
        if not 1 <= len(tk) <= 4:
            E.append("Ticker takes 1 to 4 tokens.")
        if any(not k.get("value") for k in tk):
            E.append("Every token needs a 'value'.")
        if any(k.get("direction") not in (None, "up", "down", "flat") for k in tk):
            E.append("'direction' must be up, down or flat.")
    if spec.get("logo") not in ("official", "institutional"):
        W.append("No 'logo' set. Ask: Sanctum official logo (cloud + black wordmark) or institutional logo (deep blue wordmark)? Defaults to official.")
    em = spec.get("emphasis")
    if em:
        tg = em.get("targets")
        if not tg:
            E.append("'emphasis' needs 'targets': the labels, series names or numbers to stand out.")
        bad = [b for b in em.get("by", []) if b not in ("colour", "size", "type")]
        if bad:
            E.append(f"'emphasis.by' takes colour, size and type only (got {', '.join(bad)}).")
        if t in ("table", "heatmap", "hero", "cloud-rings", "dot-matrix"):
            W.append(f"'{t}' does not support emphasis. Use its own highlight (highlightColumn, focus, highlight) instead.")
        if len(str(em.get("callout", ""))) > 40:
            W.append("Callout over 40 characters. Keep it to one short line.")
        if isinstance(tg, list) and len(tg) > 2:
            W.append("More than 2 emphasis targets. Emphasis works when one or two things stand out.")
    if t == "dot-matrix":
        if spec.get("counted", 0) + spec.get("pending", 0) > spec.get("total", 0):
            E.append("'counted' plus 'pending' is more than 'total'.")
        if spec.get("total", 0) > 200:
            E.append("More than 200 dots. Scale the unit (1 dot = 10) first.")
    if t == "cloud-rings":
        if not 2 <= len(spec.get("levels") or []) <= 4:
            E.append("Cloud rings take 2 to 4 levels.")
    if spec.get("layout") not in (None, "split", "full"):
        E.append("'layout' must be 'split' or 'full'.")
    return E, W


if __name__ == "__main__":
    spec = json.load(open(sys.argv[1]))
    errors, warnings = check(spec)
    for e in errors:
        print("ERROR:", e)
    for w in warnings:
        print("WARNING:", w)
    if not errors and not warnings:
        print("OK")
    sys.exit(1 if errors else 0)
