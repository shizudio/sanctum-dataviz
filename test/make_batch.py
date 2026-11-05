"""Build a test harness for a subset of templates: python3 test/make_batch.py out.js column line ..."""
import json, sys, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
out, names = sys.argv[1], sys.argv[2:]
specs = {s['template']: s for s in json.load(open(root/'test/specs.json'))}
core = (root/'scripts/core.js').read_text()
parts = [core, "const OUT=[];",
 "{ const pg = figma.root.children.find(p=>p.name==='Data viz'); if (pg){ await figma.setCurrentPageAsync(pg); const kill = new Set(%s); for (const c of [...pg.children]) if (kill.has(c.name)) c.remove(); } }" % json.dumps([f"Example · {n}" for n in names])]
for n in names:
    file = 'line' if n == 'area' else n
    tpl = (root/f'scripts/templates/{file}.js').read_text()
    spec = dict(specs[n], noPreview=True)
    parts.append("{\n%s\ntry { const r = await run(%s, TEMPLATE); OUT.push({t:'%s', id:r.nodeId, w:r.warnings}); } catch(e){ OUT.push({t:'%s', error:String(e).slice(0,300)}); } }" % (tpl, json.dumps(spec, ensure_ascii=False), n, n))
parts.append("for (const o of OUT) if (o.id) await (await figma.getNodeByIdAsync(o.id)).screenshot({scale:0.3});\nreturn OUT;")
code = "\n".join(parts)
open(out, 'w').write(code); print(len(code))
