// ===== Sanctum dataviz CORE. Paste this, then ONE template file, then the run line. =====
// Runs inside Figma use_figma (Plugin API, top-level await). Expects a const SPEC defined after the template.
const F = 'Instrument Sans';
const OUT_PAGE = 'Data viz';
const IDS = { wordmark:'243:7925', footer:'243:7958', panel:'243:8110', stat:'243:8159', progress:'243:8163',
  hero:'243:8139', method:'243:8150', cell:'243:8118', rule:'243:8170', appmark:'257:7075', lockup:'257:7060' };
// Sanctum's data colour is the light Sanctum blue (sky), as in the brand's own charts. Deep blue #006BFF is for text only.
const SANCTUM = 'color/brand/sky';
const RAMP = ['color/brand/powder','color/brand/powder','color/brand/powder', SANCTUM];   // earlier periods powder, the focus sky
const SOL = ['color/sol/1','color/sol/2','color/sol/3','color/sol/4'];
// colour hierarchy: blue (primary), lilac (secondary), gold (third, only when a third colour is needed), then green and coral
const CAT = [SANCTUM,'color/accent/lilac/4','color/accent/yellow/4','color/accent/green/4','color/accent/coral/3'];
const CAT_TEXT = ['color/text/highlight','color/text/accent-lilac','color/text/accent-yellow','color/text/accent-green','color/text/strong'];
const OTHER = 'color/neutral/cool-grey';
// Accessibility: pale tones are for fills only. Lines, outlines, small marks and badge edges use the deep partner,
// which clears 3:1 on white (WCAG 1.4.11). Text uses CAT_TEXT (4.3:1 or more, all text here is 24px or larger).
const MARK = {'color/brand/blue':SANCTUM, 'color/brand/sky':SANCTUM, 'color/brand/azure':SANCTUM, 'color/brand/powder':SANCTUM,
  'color/accent/lilac/4':'color/text/accent-lilac', 'color/accent/green/4':'color/text/accent-green', 'color/accent/yellow/4':'color/text/accent-yellow',
  'color/accent/coral/2':'color/accent/coral/4', 'color/accent/coral/3':'color/accent/coral/4', 'color/neutral/cool-grey':'color/neutral/grey'};
const mark = c => MARK[c] || c;
const COLW = (1760 - 11*32) / 12;
const col = i => 80 + (i-1)*(COLW+32);          // x of column i (1..12)
const span = n => n*COLW + (n-1)*32;             // width of n columns
const S = { V:{}, warnings:[], slide:null };

async function setup(){
  for (const st of ['Regular','Medium','SemiBold']) await figma.loadFontAsync({family:F, style:st});
  const coll = (await figma.variables.getLocalVariableCollectionsAsync()).find(c=>c.name==='Sanctum');
  if (!coll) throw new Error('Colour collection "Sanctum" not found in this file');
  S.VID = {}; S.RGB = {}; for (const id of coll.variableIds){ const v = await figma.variables.getVariableByIdAsync(id); S.V[v.name]=v; S.VID[v.id]=v.name; }
  // Resolve each colour so the paint carries the right value even if Figma drops a binding it considers unchanged.
  for (const [name, v] of Object.entries(S.V)){ let val = v.valuesByMode[Object.keys(v.valuesByMode)[0]], guard = 0;
    while (val && val.type==='VARIABLE_ALIAS' && guard++ < 5){ const a = await figma.variables.getVariableByIdAsync(val.id); val = a.valuesByMode[Object.keys(a.valuesByMode)[0]]; }
    if (val && val.r!=null) S.RGB[name] = {r:val.r, g:val.g, b:val.b}; }
  let page = figma.root.children.find(p=>p.name===OUT_PAGE);
  if (!page){ page = figma.createPage(); page.name = OUT_PAGE; }
  await figma.setCurrentPageAsync(page); S.page = page;
  S.C = {};
  for (const [k,id] of Object.entries(IDS)){ const n = await figma.getNodeByIdAsync(id); if(!n) throw new Error('Component missing: '+k+' ('+id+'). Update IDS in core.js from references/figma.md'); S.C[k]=n; }
}
function P(name, opacity){
  const v = S.V[name]; if(!v) throw new Error('Variable missing: '+name);
  const p = figma.variables.setBoundVariableForPaint({type:'SOLID', color: S.RGB[name] || {r:0,g:0,b:0}}, 'color', v);
  return opacity==null ? p : Object.assign({}, p, {opacity});
}
function variant(set, name){ const c = set.type==='COMPONENT_SET' ? set.children.find(x=>x.name===name) : set; if(!c) throw new Error('Variant '+name+' not in '+set.name); return c; }
function setProps(inst, map){ const keys = Object.keys(inst.componentProperties); const o={}; for (const [k,v] of Object.entries(map)){ const key = keys.find(z=>z.split('#')[0]===k); if (key) o[key]=v; } inst.setProperties(o); }

// ---- primitives (all positions are slide coordinates unless a parent is given)
function T(chars, size, weight, colour, o={}){
  const t = figma.createText(); t.fontName = {family:F, style:weight}; t.fontSize = size; t.characters = String(chars);
  t.fills = [P(colour)];
  if (size>=60) t.letterSpacing = {unit:'PERCENT', value: size>=120 ? -3 : -2};
  t.lineHeight = {unit:'PERCENT', value: size>=120 ? 100 : size>=60 ? 105 : size>=28 ? 140 : 130};
  (o.parent||S.slide).appendChild(t);
  if (o.w){ t.textAutoResize='HEIGHT'; t.resize(o.w, t.height); }
  if (o.align) t.textAlignHorizontal = o.align;
  if (o.name) t.name = o.name;
  if (o.cx!=null) t.x = o.cx - t.width/2; else if (o.right!=null) t.x = o.right - t.width; else if (o.x!=null) t.x = o.x;
  if (o.bottom!=null) t.y = o.bottom - t.height; else if (o.y!=null) t.y = o.y;
  if (o.key!=null) tag(t, o.key, o.role || 'label', (o.cx!=null ? 'c' : o.right!=null ? 'r' : 'l') + (o.bottom!=null ? 'b' : 't'));
  return t;
}
function R(x, y, w, h, colour, o={}){
  const r = figma.createRectangle(); r.resize(Math.max(1,w), Math.max(1,h)); (o.parent||S.slide).appendChild(r);
  r.x = x; r.y = y; r.fills = colour ? [P(colour)] : []; if (o.opacity!=null) r.opacity = o.opacity; if (o.name) r.name = o.name;
  if (o.stroke){ r.strokes=[P(o.stroke)]; r.strokeWeight=o.sw||2; r.strokeAlign='INSIDE'; if(o.dash) r.dashPattern=o.dash; }
  if (o.radius) r.cornerRadius = o.radius;
  if (o.key!=null) tag(r, o.key, o.role || 'mark', o.orient || 'v');
  return r;
}
function path(points, colour, weight, o={}){        // polyline or polygon from [[x,y],...]
  const xs = points.map(p=>p[0]), ys = points.map(p=>p[1]); const mx = Math.min(...xs), my = Math.min(...ys);
  const d = points.map((p,i)=>(i?'L ':'M ')+(p[0]-mx).toFixed(2)+' '+(p[1]-my).toFixed(2)).join(' ') + (o.closed?' Z':'');
  const v = figma.createVector(); (o.parent||S.slide).appendChild(v); v.vectorPaths = [{windingRule:'NONZERO', data:d}];
  v.x = mx; v.y = my;
  if (o.fill){ v.fills=[P(o.fill)]; v.strokes=[]; if (o.fillOpacity!=null) v.opacity = o.fillOpacity; }
  else { v.fills=[]; v.strokes=[P(colour)]; v.strokeWeight=weight; v.strokeCap='ROUND'; v.strokeJoin='ROUND'; if(o.dash) v.dashPattern=o.dash; }
  if (o.name) v.name=o.name;
  if (o.key!=null) tag(v, o.key, o.role || (o.fill ? 'area' : 'line'));
  return v;
}
// Colour direction (Nov 2026): blue is used once per page. Rules are always light grey, titles are black.
function rule(x, y, w, blue){ const i = variant(S.C.rule, 'Colour=Grey').createInstance(); S.slide.appendChild(i); i.resize(w,1); i.x=x; i.y=y; return i; }
// Chart heading: block rule (grey), title (black), unit (grey). Returns the y where the graphic may start.
function chartHead(x, y, w, title, unit, blue){
  if (!title) return y;
  rule(x, y, w); T(title, 28, 'Medium', 'color/text/strong', {x, y:y+16, name:'Chart title'});
  if (unit) T(unit, 24, 'Regular', 'color/text/secondary', {x, y:y+60, name:'Unit'});
  return y + (unit ? 60+34 : 16+40) + 32;
}

// ---- numbers
function decimalsFor(vals){ let d=0; for (const v of vals){ const s=String(v); if (s.includes('.')) d=Math.max(d, Math.min(2, s.split('.')[1].length)); } return d; }
function fmt(v, vf={}, dec){ const d = vf.decimals!=null ? vf.decimals : (dec!=null?dec:0);
  const n = Math.abs(v).toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return (v<0?'−':'') + (vf.prefix||'') + n + (vf.suffix||''); }
function niceStep(max, steps=4){ const raw = max/steps; const p = Math.pow(10, Math.floor(Math.log10(raw))); const m = raw/p; return (m<=1?1:m<=2?2:m<=2.5?2.5:m<=5?5:10)*p; }

// ---- colour helpers
// Order ramp: the focus gets the darkest step, each earlier item one step lighter, the rest the lightest.
function rampColours(n, focusIdx, palette){
  if (palette==='category') return Array.from({length:n}, (_,i)=> CAT[i] || OTHER);
  if (palette==='focus') return Array.from({length:n}, (_,i)=> i===focusIdx ? SANCTUM : OTHER);
  const r = palette==='sol' ? SOL : RAMP;
  return Array.from({length:n}, (_,i)=>{ const d = focusIdx - i; return d===0 ? r[3] : d===1 ? r[2] : d===2 ? r[1] : r[0]; });
}

// ---- shared column renderer (used by column and panels)
// items: [{label, value, group?, pending?}]  box: {x, w, top, bottom}
function columns(items, box, o={}){
  const n = items.length, vals = items.map(d=>d.value||0), max = Math.max(...vals, 0) || 1;
  const dec = decimalsFor(vals), vf = o.vf || {};
  const groups = []; items.forEach((d,i)=>{ const g = d.group ?? null; if (!groups.length || groups[groups.length-1].g!==g) groups.push({g, from:i, to:i}); else groups[groups.length-1].to=i; });
  const hasGroups = groups.length>1 || groups[0].g!=null, GAP = 64;
  const inner = box.w - GAP*(groups.length-1);
  const pitch = Math.min(inner/n, 200), bw = Math.min(68, pitch*0.6);
  const used = pitch*n + GAP*(groups.length-1);
  const groupRow = hasGroups ? 40 : 0, periodRow = 32;
  const base = box.bottom - groupRow - periodRow - 12;
  const maxH = base - box.top - 44;
  if (maxH < 80) S.warnings.push('Column chart is very short ('+Math.round(maxH)+'px). Shorten the subtitle or use layout "full".');
  const focusIdx = o.focus!=null ? items.findIndex(d=>d.label===o.focus) : n-1;
  const cols = rampColours(n, focusIdx<0?n-1:focusIdx, o.palette||'blue');
  R(box.x, base, box.w, 1, 'color/neutral/line', {name:'Baseline'});
  let x = box.x + (box.w - used)/2, gi = 0; const centres = [];
  items.forEach((d,i)=>{
    if (i>0 && groups[gi].to < i){ x += GAP; gi++; }
    const cx = x + pitch/2; centres.push(cx);
    const h = d.pending ? Math.max(24, maxH*0.4) : Math.max(2, (d.value/max)*maxH);
    if (d.pending) R(cx-bw/2, base-h, bw, h, null, {stroke:'color/brand/powder', dash:[8,8], name:'Bar · pending'});
    else R(cx-bw/2, base-h, bw, h, cols[i], {name:'Bar · '+d.label, key:d.label});
    const strong = i===(focusIdx<0?n-1:focusIdx);
    if (o.showValues!==false) T(d.pending ? 'Pending' : fmt(d.value, vf, dec), 24, 'Medium', strong?'color/text/strong':'color/text/secondary', {cx, bottom: base-h-12, name:'Value', key:d.label, role:'value'});
    const lab = T(d.label, 24, 'Regular', 'color/text/secondary', {cx, y: base+12, name:'Period', key:d.label});
    if (lab.width > pitch-6) S.warnings.push('Period label "'+d.label+'" is wider than its column. Shorten labels or use fewer periods.');
    x += pitch;
  });
  if (hasGroups) groups.forEach((g,k)=>{
    const c = (centres[g.from]+centres[g.to])/2; if (g.g!=null) T(g.g, 24, 'Medium', 'color/text/secondary', {cx:c, y: base+12+periodRow+8, name:'Group label'});
    if (k>0){ const dx = centres[g.from] - pitch/2 - GAP/2; R(dx-1, base-maxH, 2, maxH, OTHER, {name:'Group divider'}); }
  });
  return {top: base - maxH - 44, base};
}


// ---- crypto helpers (flow, net-flow, share-area, ticker)
// Series colour: Sanctum (or the focus) gets Sanctum blue, the rest take lilac, gold, green, coral in order.
function seriesColours(series){ let k = 1; return series.map(s => (s.sanctum || s.role==='focus') ? SANCTUM : (s.colour || CAT[k++] || OTHER)); }
// Token badge: Sanctum uses the Albus app mark; anyone else gets a squircle in their series colour with the ticker.
// Competitor logos are never drawn; the badge is a named frame so a designer can drop the real logo in.
function badge(x, y, size, o={}){
  const f = figma.createFrame(); S.slide.appendChild(f); f.resize(size, size); f.x = x; f.y = y; f.cornerRadius = size*0.28; f.cornerSmoothing = 0.6; f.clipsContent = true;
  // No outline on logos or badges (brand decision). The black ticker and the name beside the badge carry identity.
  if (o.sanctum){ const i = variant(S.C.appmark, 'Shape=Squircle, Fill=Blue').createInstance(); f.appendChild(i); i.rescale(size/i.width); i.x = 0; i.y = 0; f.fills = []; f.name = 'Badge · Sanctum'; if (o.key!=null) tag(f, o.key, 'badge'); return f; }
  f.fills = [P(o.colour || OTHER)]; f.name = 'Badge · '+(o.text||'token')+' (drop logo here)'; if (o.key!=null) tag(f, o.key, 'badge');
  // Black on every pale accent: 6:1 to 13:1. White on these fills would be 2:1.
  const t = T((o.text||'?').slice(0,4), 20, 'SemiBold', 'color/text/strong', {parent: f});
  while (t.width > size-12 && t.fontSize > 10) t.fontSize = t.fontSize - 1;
  t.x = (size - t.width)/2; t.y = (size - t.height)/2;
  return f;
}
// Value range with nice ticks, always including zero.
function niceRange(lo, hi, steps=4){ lo = Math.min(0, lo); hi = Math.max(0, hi); const st = niceStep((hi-lo)||1, steps); return {lo: Math.floor(lo/st+1e-9)*st, hi: Math.ceil(hi/st-1e-9)*st, step: st}; }
// x-axis labels: ISO dates get month labels at month starts (year added on January); anything else is thinned to about 8 labels.
const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function xTicks(x, maxLabels=8){
  const iso = x.length && x.every(v => /^\d{4}-\d{2}(-\d{2})?$/.test(String(v)));
  if (!iso){ const every = Math.ceil(x.length/maxLabels); return x.map((v,i)=>({i, label:String(v)})).filter(t=> t.i%every===0 || t.i===x.length-1); }
  const starts = []; let prev = null;
  x.forEach((v,i)=>{ const ym = String(v).slice(0,7); if (ym!==prev){ prev = ym; const m = +ym.slice(5,7); starts.push({i, label: m===1 && i>0 ? 'Jan '+ym.slice(0,4) : MON[m-1]}); } });
  const every = Math.ceil(starts.length/maxLabels); return starts.filter((t,k)=> k%every===0);
}
function drawXTicks(ticks, X, y){ for (const t of ticks){ if (t.i===0) T(t.label, 24, 'Regular', 'color/text/secondary', {x: X(0), y, name:'Period'}); else T(t.label, 24, 'Regular', 'color/text/secondary', {cx: X(t.i), y, name:'Period'}); } }
// Stack end labels so they never collide: items [{y, h}] sorted by y, min gap between tops.
function spread(items, gap, minY, maxY){ items.sort((a,b)=>a.y-b.y); let prev = minY - gap; for (const it of items){ it.y = Math.max(it.y, prev + gap); prev = it.y; }
  const over = prev + gap - maxY; if (over > 0){ let next = maxY; for (let i=items.length-1;i>=0;i--){ items[i].y = Math.min(items[i].y, next - gap); next = items[i].y; } } return items; }


// ---- emphasis: tag every mark and label with the data key it belongs to, then apply emphasis after the build.
// key may be a string or an array (a stacked segment belongs to its period and its series).
function tag(n, key, role, anchor){ const keys = (Array.isArray(key) ? key : [key]).map(k=>String(k).toLowerCase()); PD(n,'k', JSON.stringify(keys)); PD(n,'r', role); if (anchor) PD(n,'a', anchor); return n; }
// Shared plugin data (plain setPluginData is blocked for this connection).
function PD(n, k, v){ if (v===undefined) return n.getSharedPluginData('sanctumviz', k); n.setSharedPluginData('sanctumviz', k, String(v)); }
function paintVar(n, prop){ const p = (n[prop]||[])[0]; const id = p && p.boundVariables && p.boundVariables.color && p.boundVariables.color.id; return id ? S.VID[id] : null; }
const isCategory = name => !!name && /accent|sol\//.test(name);
function textFill(n, name){ if (paintVar(n,'fills')!==name) n.fills = [P(name)]; }
function reanchor(n, before){ const a = PD(n,'a') || 'lt';
  const x = a[0]==='c' ? before.x + before.w/2 - n.width/2 : a[0]==='r' ? before.x + before.w - n.width : before.x;
  const y = a[1]==='b' ? before.y + before.h - n.height : before.y; n.x = x; n.y = y; }
function applyEmphasis(frame, em){
  const targets = (Array.isArray(em.targets) ? em.targets : [em.targets]).filter(t=>t!=null).map(t=>String(t).toLowerCase());
  const by = new Set(em.by && em.by.length ? em.by : ['colour','type']);
  const nodes = frame.findAll(n => !!PD(n,'k'));
  if (!nodes.length){ S.warnings.push('This template does not support emphasis yet; use its own focus or highlight field.'); return; }
  const hitOf = n => JSON.parse(PD(n,'k')).some(k => targets.includes(k));
  if (!nodes.some(hitOf)){ const keys = [...new Set(nodes.flatMap(n=>JSON.parse(PD(n,'k'))))].slice(0,20); S.warnings.push('Emphasis target not found. Use one of: '+keys.join(', ')); return; }
  for (const n of nodes){
    const hit = hitOf(n), role = PD(n,'r');
    const before = {x:n.x, y:n.y, w:n.width, h:n.height};
    if (by.has('colour')){
      if (role==='mark' && n.type!=='TEXT'){ const cur = paintVar(n,'fills'); if (cur){ n.fills = [P(hit ? (isCategory(cur) ? cur : SANCTUM) : 'color/neutral/cool-grey')]; } }
      if (role==='area' && !hit) n.opacity = Math.min(n.opacity, 0.06);
      if (role==='line'){ const cur = paintVar(n,'strokes'); if (hit) n.strokes = [P(isCategory(cur) ? cur : SANCTUM)]; else { n.strokes = [P('color/neutral/grey')]; n.strokeWeight = Math.min(n.strokeWeight, 2); } }
      if (role==='value' && n.type==='TEXT') textFill(n, hit ? 'color/text/highlight' : 'color/text/secondary');
      if (role==='label' && n.type==='TEXT') textFill(n, hit ? 'color/text/strong' : 'color/text/secondary');
      if (role==='stat'){ const num = n.findOne(x=>x.type==='TEXT' && x.name==='Number'); if (num) textFill(num, hit ? 'color/text/highlight' : 'color/text/secondary');
        const r = n.findOne(x=>x.type==='INSTANCE'); if (r && hit) r.swapComponent(variant(S.C.rule,'Colour=Blue'));
        const fill = n.findOne(x=>x.name && x.name.startsWith('Fill')); if (fill) fill.fills = [P(hit ? SANCTUM : 'color/neutral/grey')]; }
      if (role==='badge' && !hit) n.opacity = 0.5;
    }
    if (by.has('type')){
      if ((role==='value' || role==='label') && n.type==='TEXT'){
        n.fontName = {family:F, style: hit ? (role==='value' ? 'SemiBold' : 'Medium') : 'Regular'};
        if (hit && role==='value') n.fontSize = Math.max(n.fontSize, 32);
        if (!by.has('colour')) textFill(n, hit ? 'color/text/strong' : 'color/text/secondary'); }
      if (role==='stat'){ const num = n.findOne(x=>x.type==='TEXT' && x.name==='Number'); if (num && !hit) num.fontName = {family:F, style:'Regular'}; }
    }
    if (by.has('size') && hit){
      if (role==='mark' && n.type==='RECTANGLE'){ const o = PD(n,'a')||'v'; if (o==='v'){ const w = n.width*1.4; n.resize(w, n.height); n.x = before.x - (w-before.w)/2; } else { const h = n.height*1.4; n.resize(n.width, h); n.y = before.y - (h-before.h)/2; } }
      if (role==='mark' && n.type==='ELLIPSE' && !(n.arcData && n.arcData.endingAngle - n.arcData.startingAngle < 6.28)){ n.resize(n.width*1.5, n.height*1.5); n.x = before.x - before.w*0.25; n.y = before.y - before.h*0.25; }
      if (role==='line') n.strokeWeight = Math.max(n.strokeWeight*1.75, 5);
      if (role==='value' && n.type==='TEXT') n.fontSize = Math.round(n.fontSize*1.6);
      if (role==='badge'){ n.rescale(1.25); n.y = before.y - (n.height-before.h)/2; }
      if (role==='stat'){ const num = n.findOne(x=>x.type==='TEXT' && x.name==='Number'); if (num) num.fontSize = Math.round(num.fontSize*1.3); }
    }
    if (n.type==='TEXT'){ reanchor(n, before);
      const grow = n.height - before.h, a = PD(n,'a') || 'lt';
      if (role==='value' && grow > 0 && a[1]==='t') for (const m of nodes) if (m!==n && m.type==='TEXT' && PD(m,'r')==='label' && PD(m,'k')===PD(n,'k') && m.y >= before.y + before.h - 4 && m.y < before.y + before.h + 24 && m.x < n.x + n.width && n.x < m.x + m.width) m.y += grow; }
  }
  if (em.callout){
    const anchor = nodes.find(n => hitOf(n) && PD(n,'r')==='value') || nodes.find(n => hitOf(n) && PD(n,'r')==='mark');
    if (!anchor){ S.warnings.push('Callout skipped: the emphasised item has no value or mark to point at.'); return; }
    const b = anchor.absoluteBoundingBox, fb = frame.absoluteBoundingBox, ax = b.x - fb.x, ay = b.y - fb.y;
    const c = T(em.callout, 24, 'Medium', 'color/text/highlight', {name:'Callout'});
    c.x = Math.max(80, Math.min(1840 - c.width, ax + b.width/2 - c.width/2)); c.y = ay - c.height - 12;
    R(ax + b.width/2, c.y + c.height + 2, 1, Math.max(1, ay - (c.y + c.height) - 6), 'color/brand/blue', {name:'Callout leader'});
  }
}

// ---- legend (stacked charts only)
function legend(names, colours, x, y){ let cx = x; names.forEach((nm,i)=>{ R(cx, y+6, 16, 16, colours[i], {radius:4}); const t = T(nm, 24, 'Regular', 'color/text/secondary', {x:cx+28, y}); cx += 28 + t.width + 32; }); return y + 40; }

// ---- slide shell
async function run(spec, tpl){
  const TPL = tpl || (typeof TEMPLATE !== 'undefined' ? TEMPLATE : null);
  if (!TPL) throw new Error('No template loaded');
  if (!S.ready){ await setup(); S.ready = true; }
  S.warnings = [];
  const prev = spec.replace ? await figma.getNodeByIdAsync(spec.replace) : null;
  const f = figma.createFrame(); f.name = spec.name || ('Chart · '+spec.template); f.resize(1920,1080); f.fills=[P('color/neutral/white')]; f.clipsContent = true;
  S.page.appendChild(f); S.slide = f;
  if (prev){ f.x = prev.x; f.y = prev.y; prev.remove(); }
  else { const others = S.page.children.filter(c=>c!==f); f.x = others.length ? Math.max(...others.map(c=>c.x+c.width)) + 160 : 0; f.y = 0; }
  f.layoutGrids = [{pattern:'COLUMNS', alignment:'STRETCH', count:12, gutterSize:32, offset:80, visible:false, color:{r:0,g:0.42,b:1,a:0.06}}];
  f.guides = [{axis:'Y',offset:190},{axis:'Y',offset:900},{axis:'Y',offset:940},{axis:'Y',offset:1000}];
  // Corner logo: the full-colour lockup (Albus app mark + black wordmark). The component has padding, so place by its visible box.
  // Two logo options, chosen by the person (spec.logo): 'official' = cloud + black wordmark lockup; 'institutional' = wordmark alone in deep blue.
  if (spec.logo === 'institutional'){
    const wm = variant(S.C.wordmark, spec.dark ? 'Colour=White' : 'Colour=Blue').createInstance(); f.appendChild(wm); wm.x = 80; wm.y = 70; wm.name = 'Sanctum logo · institutional';
  } else {
    const lg = variant(S.C.lockup, spec.dark ? 'Colour=Full colour, Background=Dark' : 'Colour=Full colour, Background=Light').createInstance(); f.appendChild(lg);
    const ls = 56 / 234.244; lg.rescale(ls); lg.x = 80 - 127.955*ls; lg.y = 70 - 94.41*ls; lg.name = 'Sanctum logo · official';
  }
  const layout = spec.layout || (TPL.defaultLayout || 'full');
  // accent bar: sky and lilac, 48 x 6 each, between the logo and the headline (spec.accentBar:false removes it)
  if (spec.accentBar !== false){ R(80, 150, 48, 6, 'color/brand/sky', {name:'Accent bar · sky'}); R(128, 150, 48, 6, 'color/accent/lilac/4', {name:'Accent bar · lilac'}); }
  // headline: black. The highlight phrase, if it sits in the headline, is the one blue mark of the slide.
  const hl = T(spec.headline, 64, 'Medium', 'color/text/strong', {x:80, y:190, w: span(layout==='split'?6:(spec.headlineSpan||10)), name:'Headline'});
  if (spec.highlight && spec.headline.includes(spec.highlight)){ const i = spec.headline.indexOf(spec.highlight); hl.setRangeFills(i, i+spec.highlight.length, [P('color/text/highlight')]); }
  let top = hl.y + hl.height + 64;
  if (spec.subtitle){
    const st = T(spec.subtitle, 28, 'Regular', 'color/text/secondary', {x:80, w: span(layout==='split'?4:8), name:'Subtitle'});
    if (layout==='split') st.y = 900 - st.height; else { st.y = hl.y + hl.height + 24; top = st.y + st.height + 64; }
    if (spec.highlight && spec.subtitle.includes(spec.highlight) && !spec.headline.includes(spec.highlight)){ const i = spec.subtitle.indexOf(spec.highlight); st.setRangeFills(i, i+spec.highlight.length, [P('color/text/highlight')]); }
  }
  const box = layout==='split' ? {x: col(7), w: span(6), top: 254, bottom: 900} : {x: 80, w: 1760, top, bottom: 900};
    await TPL.build(spec, box, layout);
  if (spec.emphasis) applyEmphasis(f, spec.emphasis);
  if (spec.note){ const m = S.C.method.createInstance(); f.appendChild(m); m.resize(layout==='split'? box.w : 1760, m.height); setProps(m, {Note: spec.note}); m.x = layout==='split' ? box.x : 80; m.y = 940; }
  const ft = S.C.footer.createInstance(); f.appendChild(ft); ft.x=0; ft.y=1000; ft.resize(1920, ft.height);
  setProps(ft, {'Section label': spec.section || '', 'Source note': spec.source || '', 'Page number': spec.page || '', 'Show source': !!spec.source});
  // checks: text overlaps and text outside the slide
  const texts = f.findAll(n=>n.type==='TEXT' && n.visible && n.characters.trim()).map(t=>({t, b:t.absoluteBoundingBox}));
  const fb = f.absoluteBoundingBox;
  for (let i=0;i<texts.length;i++){ const a=texts[i].b;
    if (a.x < fb.x-1 || a.y < fb.y-1 || a.x+a.width > fb.x+fb.width+1 || a.y+a.height > fb.y+fb.height+1) S.warnings.push('Text outside slide: "'+texts[i].t.characters.slice(0,30)+'"');
    for (let j=i+1;j<texts.length;j++){ const b=texts[j].b; if (a.x < b.x+b.width-2 && b.x < a.x+a.width-2 && a.y < b.y+b.height-2 && b.y < a.y+a.height-2) S.warnings.push('Overlap: "'+texts[i].t.characters.slice(0,24)+'" × "'+texts[j].t.characters.slice(0,24)+'"'); } }
  // Preview: the screenshot comes back as an image attached to the tool result (saved as a file in the workspace).
  if (!spec.noPreview) await f.screenshot({scale: spec.previewScale || 0.5});
  return { nodeId: f.id, page: S.page.name, link: 'https://www.figma.com/design/GgkXzTiYzGrFM6Xp8C2IFS/Sanctum-Brand-Update--Team-?node-id='+f.id.replace(':','-'), warnings: [...new Set(S.warnings)] };
}
