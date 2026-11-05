// Outflows use the soft coral (coral/3, 2.3:1) so a dip never reads as an alarm. Direction is still carried by the minus sign,
// the printed value and the bar sitting below zero, so colour is not the only signal.
// net-flow · inflows and outflows per period, signed bars around zero. spec: data[{label, value}] (signed, up to 60), focus? label, valueFormat, chartTitle, unit, total? (true prints the net sum)
const TEMPLATE = { defaultLayout:'full', async build(spec, box){
  const y = chartHead(box.x, box.top, box.w, spec.chartTitle, spec.unit, false);
  const vf = spec.valueFormat||{}, d = spec.data, n = d.length, vals = d.map(r=>r.value), rg = niceRange(Math.min(...vals), Math.max(...vals));
  const dec = vf.decimals!=null ? vf.decimals : decimalsFor(vals), showVals = n <= 12, axis = !showVals;
  const px0 = box.x + (axis ? 120 : 0), px1 = box.x + box.w - (spec.total ? 260 : 0), pb = box.bottom - 44, pt = y + (showVals ? 48 : 16);
  const Y = v => pb - (v-rg.lo)/(rg.hi-rg.lo)*(pb-pt), Z = Y(0), pitch = (px1-px0)/n, bw = Math.max(3, Math.min(68, pitch*0.62));
  if (axis) for (let v=rg.lo; v<=rg.hi+1e-9; v+=rg.step){ const vv = Math.abs(v)<1e-9 ? 0 : v; if (vv!==0) R(px0, Y(vv), px1-px0, 1, 'color/neutral/cool-grey', {name:'Grid'}); T(fmt(vv, vf, decimalsFor([rg.step])), 24, 'Regular', 'color/text/secondary', {right: px0-16, y: Y(vv)-15}); }
  const focus = spec.focus!=null ? d.findIndex(r=>r.label===spec.focus) : n-1;
  d.forEach((r,i)=>{ const cx = px0 + pitch*i + pitch/2, top = Math.min(Y(r.value), Z), h = Math.max(2, Math.abs(Y(r.value)-Z)), up = r.value >= 0;
    R(cx-bw/2, top, bw, h, up ? SANCTUM : 'color/accent/coral/3', {name:(up?'Inflow · ':'Outflow · ')+r.label, key:r.label});
    if (showVals){ const lab = (up?'+':'') + fmt(r.value, vf, dec), o = up ? {cx, bottom: top-10, key:r.label, role:'value'} : {cx, y: top+h+10, key:r.label, role:'value'};
      T(lab, 24, 'Medium', i===focus ? 'color/text/strong' : 'color/text/secondary', o); } });
  R(px0, Z-1, px1-px0, 2, 'color/neutral/grey', {name:'Zero line'});
  const ticks = showVals ? d.map((r,i)=>({i, label:r.label})) : xTicks(d.map(r=>r.label));
  for (const t of ticks) T(t.label, 24, 'Regular', 'color/text/secondary', {cx: px0 + pitch*t.i + pitch/2, y: pb+12, key:t.label});
  if (showVals && vals.some(v=>v<0)) S.warnings.push('Negative bars put their values below the bar; check they clear the period labels.');
  if (spec.total){ const sum = vals.reduce((a,b)=>a+b,0);
    T('Net', 24, 'Regular', 'color/text/secondary', {x: px1+40, y: pt});
    T((sum>0?'+':'') + fmt(sum, vf, dec), 64, 'Medium', sum>=0 ? 'color/text/highlight' : 'color/text/strong', {x: px1+40, y: pt+34}); }
}};
