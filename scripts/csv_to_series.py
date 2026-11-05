#!/usr/bin/env python3
"""Turn a CSV export (DefiLlama, Dune, Flipside, a sheet) into the x/series fields of a chart spec.

Usage: python3 csv_to_series.py data.csv [--max-points 400] [--cumulative] [--scale 1e6] [--decimals 2]
              [--sanctum "Sanctum LSTs"] [--tickers "JitoSOL=JITO,mSOL=mSOL"] [--weekly]
First column is the date (any of 2026-01-31, 2026/01/31, 31/01/2026, unix seconds); every other column is a series.
--cumulative turns daily flows into a running total (for 'flow'); --weekly sums to weeks (for 'net-flow', prints data[]).
Prints JSON to paste into the spec.
"""
import csv, json, sys, argparse, datetime as dt

ap = argparse.ArgumentParser(); ap.add_argument("csv")
ap.add_argument("--max-points", type=int, default=400); ap.add_argument("--cumulative", action="store_true")
ap.add_argument("--scale", type=float, default=1.0); ap.add_argument("--decimals", type=int, default=2)
ap.add_argument("--sanctum", default=""); ap.add_argument("--tickers", default=""); ap.add_argument("--weekly", action="store_true")
a = ap.parse_args()

def day(v):
    v = v.strip()
    if v.replace(".", "").isdigit() and len(v.split(".")[0]) >= 9:
        return dt.datetime.utcfromtimestamp(float(v)).date()
    for f in ("%Y-%m-%d", "%Y/%m/%d", "%d/%m/%Y", "%m/%d/%Y", "%Y-%m-%dT%H:%M:%S", "%Y-%m-%d %H:%M:%S"):
        try: return dt.datetime.strptime(v[:19], f).date()
        except ValueError: pass
    raise SystemExit(f"Cannot read date '{v}'")

rows = list(csv.reader(open(a.csv, newline="", encoding="utf-8-sig")))
head, body = rows[0], [r for r in rows[1:] if r and r[0].strip()]
body.sort(key=lambda r: day(r[0]))
dates = [day(r[0]) for r in body]
num = lambda v: float(v.replace(",", "")) / a.scale if v.strip() not in ("", "-") else 0.0
cols = {h: [num(r[i]) if i < len(r) else 0.0 for r in body] for i, h in enumerate(head) if i > 0}
tick = dict(p.split("=", 1) for p in a.tickers.split(",") if "=" in p)

if a.weekly:
    name = head[1]; wk = {}
    for d, v in zip(dates, cols[name]):
        k = d - dt.timedelta(days=d.weekday()); wk[k] = wk.get(k, 0) + v
    data = [{"label": k.strftime("%d %b").lstrip("0"), "value": round(v, a.decimals)} for k, v in sorted(wk.items())]
    print(json.dumps({"data": data}, ensure_ascii=False)); sys.exit()

if a.cumulative:
    for h, vs in cols.items():
        t = 0; out = []
        for v in vs: t += v; out.append(t)
        cols[h] = out
step = max(1, -(-len(dates) // a.max_points))
idx = list(range(0, len(dates), step))
if idx[-1] != len(dates) - 1: idx.append(len(dates) - 1)
series = []
for h, vs in cols.items():
    s = {"name": h, "values": [round(vs[i], a.decimals) for i in idx]}
    if h == a.sanctum: s["sanctum"] = True
    if h in tick: s["ticker"] = tick[h]
    series.append(s)
print(json.dumps({"x": [dates[i].isoformat() for i in idx], "series": series}, ensure_ascii=False))
