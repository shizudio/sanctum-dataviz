// donut · parts of a whole as a ring. spec: data[{label,value}] up to 5 (+ Other), centerLabel?, valueFormat for the centre total
const TEMPLATE = { defaultLayout:'full', async build(spec, box){
  const y0 = chartHead(box.x, box.top, box.w, spec.chartTitle, spec.unit, false);
  let parts = [...spec.data]; if (parts.length > 5){ const rest = parts.slice(5).reduce((s,d)=>s+d.value,0); parts = parts.slice(0,5).concat([{label:'Other', value:rest, other:true}]); }
  const sum = parts.reduce((s,d)=>s+d.value,0) || 1, D = Math.min(box.bottom - y0, span(5)), cx = col(1) + span(5)/2, cy = box.bottom - D/2;
  let a = -Math.PI/2, ci = 0; const rows = [];
  for (const d of parts){ const sweep = 2*Math.PI*d.value/sum, other = d.other || /^other$/i.test(d.label), c = other ? OTHER : CAT[ci], tc = other ? 'color/text/secondary' : CAT_TEXT[ci]; if (!other) ci++;
    const e = figma.createEllipse(); S.slide.appendChild(e); e.resize(D, D); e.x = cx-D/2; e.y = cy-D/2; e.name = 'Slice · '+d.label; tag(e, d.label, 'mark');
    e.arcData = {startingAngle: a, endingAngle: a+sweep, innerRadius: 0.62}; e.fills = [P(c)]; e.strokes = [P('color/neutral/white')]; e.strokeWeight = 4; e.strokeAlign = 'CENTER';
    rows.push({d, c, tc, pct: Math.round(d.value/sum*100)}); a += sweep; }
  const tot = T(spec.centerValue || fmt(sum, spec.valueFormat||{}, decimalsFor(parts.map(p=>p.value))), 64, 'Medium', 'color/text/strong', {cx, y: cy-50});
  if (spec.centerLabel) T(spec.centerLabel, 24, 'Regular', 'color/text/secondary', {cx, y: tot.y+tot.height+4});
  const lx = col(7), rowH = 72; let ly = box.bottom - rows.length*rowH;
  for (const r of rows){ R(lx, ly+8, 16, 16, r.c, {radius:4, key:r.d.label}); T(r.pct+'%', 24, 'Medium', r.tc, {x: lx+32, y: ly, key:r.d.label, role:'value'}); T(r.d.label, 24, 'Regular', 'color/text/secondary', {x: lx+120, y: ly, key:r.d.label}); R(lx, ly+rowH-16, span(6), 1, 'color/neutral/cool-grey'); ly += rowH; }
}};
