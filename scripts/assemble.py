#!/usr/bin/env python3
"""Assemble the Figma build script for one chart.

Usage: python3 assemble.py spec.json [out.js]
Writes core.js + the template file + the spec and run line to out.js (default: build.js next to the spec)
and prints its size. Paste the file's full contents as the `code` of one use_figma call.

Emphasis options: if the spec has "emphasis" with "options": true, the script builds three versions side by
side so the person can pick one:
  A  colour + type      (the safe default)
  B  size + type        (no colour change; keeps the template's palette)
  C  colour + size + type, plus the callout if one is given (for a single hero point)
Each returns its own nodeId and screenshot. Then run pick_option (see SKILL.md) to keep one.
"""
import json, os, sys, copy
here = os.path.dirname(os.path.abspath(__file__))
spec_path = sys.argv[1]
spec = json.load(open(spec_path))
tpl = "line" if spec["template"] == "area" else spec["template"]
parts = [open(os.path.join(here, "core.js")).read(), open(os.path.join(here, "templates", tpl + ".js")).read()]

em = spec.get("emphasis") or {}
if em.get("options"):
    callout = em.get("callout")
    variants = [("A", "colour + type", ["colour", "type"], None),
                ("B", "size + type", ["size", "type"], None),
                ("C", "colour + size + type", ["colour", "size", "type"], callout)]
    specs = []
    for letter, label, by, co in variants:
        s = copy.deepcopy(spec)
        s.pop("replace", None)
        s["name"] = f'{spec.get("name", "Chart")} · Option {letter} ({label})'
        s["emphasis"] = {"targets": em["targets"], "by": by}
        if co: s["emphasis"]["callout"] = co
        specs.append(s)
    parts.append("const OUT = [];")
    if spec.get("replace"):
        parts.append("{ const old = await figma.getNodeByIdAsync(%s); if (old) old.remove(); }" % json.dumps(spec["replace"]))
    for s in specs:
        parts.append("OUT.push(Object.assign({option: %s}, await run(%s)));" % (json.dumps(s["name"].split(" · Option ")[1]), json.dumps(s, ensure_ascii=False)))
    parts.append("return OUT;")
else:
    parts += ["const SPEC = " + json.dumps(spec, ensure_ascii=False) + ";", "return await run(SPEC);"]
code = "\n".join(parts)
out = sys.argv[2] if len(sys.argv) > 2 else os.path.join(os.path.dirname(os.path.abspath(spec_path)), "build.js")
open(out, "w").write(code)
print(f"{out} · {len(code)} characters" + ("  (over the 50,000 limit!)" if len(code) > 50000 else ""))
