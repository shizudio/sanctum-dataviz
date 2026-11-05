// flow · net gain/loss over time for several products, signed around a zero line. spec: x[] (ISO dates or labels), series[{name, values[], ticker?, sanctum?, role?}], valueFormat, chartTitle, unit
const TEMPLATE = { defaultLayout:'full', async build(spec, box){
  const y = chartHead(box.x, box.top, box.w, spec.chartTitle, spec.unit, false);
  const vf = spec.valueFormat||{}, all = spec.series.flatMap(s=>s.values), rg = niceRange(Math.min(...all), Math.max(...all));
  const dec = vf.decimals!=null ? vf.decimals : decimalsFor([rg.step]);
  const gutter = 120, endRoom = 260, px0 = box.x + gutter, px1 = box.x + box.w - endRoom, pb = box.bottom - 44, pt = y + 16;
  const n = spec.x.length, X = i => px0 + (px1-px0) * (n===1 ? 0.5 : i/(n-1)), Y = v => pb - (v-rg.lo)/(rg.hi-rg.lo)*(pb-pt), Z = Y(0);
  for (let v=rg.lo; v<=rg.hi+1e-9; v+=rg.step){ const vv = Math.abs(v)<1e-9 ? 0 : v; if (vv!==0) R(px0, Y(vv), px1-px0, 1, 'color/neutral/cool-grey', {name:'Grid'});
    T(fmt(vv, vf, dec), 24, 'Regular', 'color/text/secondary', {right: px0-16, y: Y(vv)-15}); }
  R(px0, Z-1, px1-px0, 2, 'color/neutral/grey', {name:'Zero line'});
  drawXTicks(xTicks(spec.x), X, pb+12);
  const cols = seriesColours(spec.series);
  const order = spec.series.map((s,i)=>({s, c: cols[i], f: !!(s.sanctum || s.role==='focus')})).sort((a,b)=>a.f-b.f);
  const ends = [];
  for (const o of order){ o.pts = o.s.values.map((v,i)=>[X(i), Y(v)]);
    path([[o.pts[0][0], Z], ...o.pts, [o.pts[o.pts.length-1][0], Z]], null, 0, {closed:true, fill:o.c, fillOpacity: o.f ? 0.2 : 0.12, name:o.s.name+' · fill', key:o.s.name}); }
  for (const o of order){ const pts = o.pts;
    path(pts, mark(o.c), o.f ? 4 : 3, {name:o.s.name, key:o.s.name});
    const lv = o.s.values[n-1]; ends.push({y: pts[n-1][1] - 28, s:o.s, c:o.c, f:o.f, v: (lv>0?'+':'') + fmt(lv, vf, dec)}); }
  spread(ends, 72, pt - 8, pb + 20);
  for (const e of ends){ badge(px1+16, e.y, 56, {sanctum: e.s.sanctum, colour: e.c, text: e.s.ticker || e.s.name, key:[e.s.name, e.s.ticker||e.s.name]});
    T(e.v, 24, 'Medium', e.f ? 'color/text/strong' : 'color/text/secondary', {x: px1+88, y: e.y - 2, key:e.s.name, role:'value'});
    T(e.s.name, 24, 'Regular', 'color/text/secondary', {x: px1+88, y: e.y + 28, key:e.s.name}); }
}};
