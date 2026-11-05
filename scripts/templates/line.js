// line / area · trend. spec: x[], series[{name, values[], role}], projectionFrom?, reference?{value,label}, yMin?/yMax?/yStep? (cut axis for lines), valueFormat. template "area" fills under the focus line.
const TEMPLATE = { defaultLayout:'full', async build(spec, box){
  const y = chartHead(box.x, box.top, box.w, spec.chartTitle, spec.unit, false);
  const all = spec.series.flatMap(s=>s.values).concat(spec.reference?[spec.reference.value]:[]);
  // Axis: from zero by default. spec.yMin (optional) cuts the axis for lines whose differences are small next to their level; say so in the note.
  const cutAxis = spec.yMin!=null, lo = cutAxis ? spec.yMin : 0, hiRaw = Math.max(...all);
  const step = cutAxis ? (spec.yStep || niceStep(hiRaw-lo)) : niceStep(hiRaw), top = cutAxis ? (spec.yMax!=null ? spec.yMax : lo + Math.ceil((hiRaw-lo)/step - 1e-9)*step) : Math.ceil(hiRaw/step)*step, vf = spec.valueFormat||{}, dec = decimalsFor(all);
  const gutter = 96, endRoom = spec.series.length>1 ? 360 : 220, px0 = box.x + gutter, px1 = box.x + box.w - endRoom, pb = box.bottom - 44, pt = y + 16;
  const X = i => px0 + (px1-px0) * (spec.x.length===1 ? 0.5 : i/(spec.x.length-1)), Y = v => pb - ((v-lo)/(top-lo))*(pb-pt);
  for (let v=lo; v<=top+1e-9; v+=step){ const base = Math.abs(v-lo)<1e-9; R(px0, Y(v), px1-px0, 1, base?'color/neutral/line':'color/neutral/cool-grey', {name:'Grid'}); if (v>0 && (!base || cutAxis)) T(fmt(v, vf, dec), 24, 'Regular', 'color/text/secondary', {right: px0-16, y: Y(v)-15}); }
  const every = Math.ceil(spec.x.length/8);
  drawXTicks(xTicks(spec.x), X, pb+12);
  if (spec.reference){ const ry = Y(spec.reference.value); path([[px0,ry],[px1,ry]], 'color/neutral/grey', 2, {dash:[8,8], name:'Reference'}); T(spec.reference.label, 24, 'Regular', 'color/text/secondary', {right: px1-8, y: ry+8, name:'Reference label'}); }
  const cols = seriesColours(spec.series), multi = spec.series.length > 1;   // each project gets its own colour: sky, lilac, gold, green, coral
  const order = spec.series.map((s,i)=>({s,c:cols[i]})).sort((a,b)=>(a.s.role==='focus')-(b.s.role==='focus'));
  const ends = [];
  for (const {s, c} of order){ const f = s.role==='focus' || spec.series.length===1; const pts = s.values.map((v,i)=>[X(i),Y(v)]);
    const cut = spec.projectionFrom!=null ? spec.projectionFrom : pts.length-1;
    if ((spec.area || spec.template==='area') && f) path([[pts[0][0],pb], ...pts, [pts[pts.length-1][0],pb]], null, 0, {closed:true, fill:'color/brand/powder', fillOpacity:0.6, name:'Area', key:s.name});
    path(pts.slice(0, cut+1), mark(c), f?4:3, {name:s.name, key:s.name});
    if (cut < pts.length-1) path(pts.slice(cut), mark(c), f?4:3, {dash:[8,8], name:s.name+' · projection', key:s.name});
    const last = pts[pts.length-1];
    { const r = f?12:10, d = figma.createEllipse(); S.slide.appendChild(d); d.resize(r,r); d.x=last[0]-r/2; d.y=last[1]-r/2; d.fills=[P(mark(c))]; tag(d, s.name, 'mark'); }
    ends.push({y:last[1], s, c, f, val:fmt(s.values[s.values.length-1], vf, dec)}); }
  ends.sort((a,b)=>a.y-b.y); let prevY = -1e9; const BS = 48;
  for (const e of ends){
    if (multi){ const yy = Math.max(e.y-BS/2, prevY+BS+16); prevY = yy; const lx = px1+24+BS+16;
      badge(px1+24, yy, BS, {sanctum: e.s.sanctum || e.f, colour: e.c, text: e.s.ticker || e.s.name, logoNode: e.s.logoNode, key:[e.s.name, e.s.ticker||e.s.name]});
      T(e.val, 24, 'Medium', e.f?'color/text/strong':textFor(e.c), {x: lx, y: yy-4, key:e.s.name, role:'value'});
      T(e.s.name, 24, 'Regular', 'color/text/secondary', {x: lx, y: yy+28, key:e.s.name}); }
    else { T(e.val, 24, 'Medium', 'color/text/strong', {x: px1+16, y: e.y-15, key:e.s.name, role:'value'}); } }
}};
