// line / area · trend. spec: x[], series[{name, values[], role}], projectionFrom?, reference?{value,label}, valueFormat. template "area" fills under the focus line.
const TEMPLATE = { defaultLayout:'full', async build(spec, box){
  const y = chartHead(box.x, box.top, box.w, spec.chartTitle, spec.unit, false);
  const all = spec.series.flatMap(s=>s.values).concat(spec.reference?[spec.reference.value]:[]);
  const step = niceStep(Math.max(...all)), top = Math.ceil(Math.max(...all)/step)*step, vf = spec.valueFormat||{}, dec = decimalsFor(all);
  const gutter = 96, endRoom = 220, px0 = box.x + gutter, px1 = box.x + box.w - endRoom, pb = box.bottom - 44, pt = y + 16;
  const X = i => px0 + (px1-px0) * (spec.x.length===1 ? 0.5 : i/(spec.x.length-1)), Y = v => pb - (v/top)*(pb-pt);
  for (let v=0; v<=top+1e-9; v+=step){ R(px0, Y(v), px1-px0, 1, v===0?'color/neutral/line':'color/neutral/cool-grey', {name:'Grid'}); if (v>0) T(fmt(v, vf, dec), 24, 'Regular', 'color/text/secondary', {right: px0-16, y: Y(v)-15}); }
  const every = Math.ceil(spec.x.length/8);
  drawXTicks(xTicks(spec.x), X, pb+12);
  if (spec.reference){ const ry = Y(spec.reference.value); path([[px0,ry],[px1,ry]], 'color/neutral/grey', 2, {dash:[8,8], name:'Reference'}); T(spec.reference.label, 24, 'Regular', 'color/text/secondary', {right: px1-8, y: ry+8, name:'Reference label'}); }
  const order = [...spec.series].sort((a,b)=>(a.role==='focus')-(b.role==='focus'));
  const ends = [];
  for (const s of order){ const f = s.role==='focus' || spec.series.length===1; const pts = s.values.map((v,i)=>[X(i),Y(v)]);
    const cut = spec.projectionFrom!=null ? spec.projectionFrom : pts.length-1;
    if ((spec.area || spec.template==='area') && f) path([[pts[0][0],pb], ...pts, [pts[pts.length-1][0],pb]], null, 0, {closed:true, fill:'color/brand/powder', fillOpacity:0.6, name:'Area', key:s.name});
    path(pts.slice(0, cut+1), f?SANCTUM:'color/neutral/grey', f?4:2, {name:s.name, key:s.name});
    if (cut < pts.length-1) path(pts.slice(cut), f?SANCTUM:'color/neutral/grey', f?4:2, {dash:[8,8], name:s.name+' · projection', key:s.name});
    const last = pts[pts.length-1];
    if (f){ const d = figma.createEllipse(); S.slide.appendChild(d); d.resize(12,12); d.x=last[0]-6; d.y=last[1]-6; d.fills=[P(SANCTUM)]; tag(d, s.name, 'mark'); }
    ends.push({y:last[1], name:s.name, val:fmt(s.values[s.values.length-1], vf, dec), f}); }
  ends.sort((a,b)=>a.y-b.y); let prevY = -1e9;
  for (const e of ends){ const yy = Math.max(e.y-30, prevY+64); prevY = yy;
    T(e.val, 24, 'Medium', e.f?'color/text/strong':'color/text/secondary', {x: px1+16, y: yy, key:e.name, role:'value'});
    if (spec.series.length>1) T(e.name, 24, 'Regular', 'color/text/secondary', {x: px1+16, y: yy+30, key:e.name}); }
}};
