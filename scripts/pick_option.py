#!/usr/bin/env python3
"""Write the Figma script that keeps one emphasis option and removes the other two.

Usage: python3 pick_option.py <keep_node_id> <other_id> <other_id> [final name]
Prints the code to pass to one use_figma call. The kept frame is renamed (Option suffix dropped unless a name is given).
"""
import json, sys
keep, others = sys.argv[1], sys.argv[2:4]
name = sys.argv[4] if len(sys.argv) > 4 else None
print(f"""const keep = await figma.getNodeByIdAsync({json.dumps(keep)});
for (const id of {json.dumps(others)}) {{ const n = await figma.getNodeByIdAsync(id); if (n) n.remove(); }}
keep.name = {json.dumps(name)} || keep.name.split(' · Option ')[0];
return {{ kept: keep.id, name: keep.name, link: 'https://www.figma.com/design/GgkXzTiYzGrFM6Xp8C2IFS/Sanctum-Brand-Update--Team-?node-id=' + keep.id.replace(':','-') }};""")
