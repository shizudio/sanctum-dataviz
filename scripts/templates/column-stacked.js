// column-stacked · composition over time. spec: series[], data[{label, values:{name:n}}], valueFormat
const TEMPLATE = { defaultLayout:'full', async build(spec, box){
  let y = chartHead(box.x, box.top, box.w, spec.chartTitle, spec.unit, false);
  const cols = spec.series.map((_,i)=>CAT[i]||OTHER);
  y = legend(spec.series, cols, box.x, y) + 16;
  const n = spec.data.length, totals = spec.data.map(d=>spec.series.reduce((s,k)=>s+(d.values[k]||0),0));
  const max = Math.max(...totals) || 1, dec = decimalsFor(spec.data.flatMap(d=>Object.values(d.values)));
  const base = box.bottom - 44, maxH = base - y - 44, pitch = Math.min(box.w/n, 240), bw = Math.min(96, pitch*0.6), x0 = box.x + (box.w - pitch*n)/2;
  R(box.x, base, box.w, 1, 'color/neutral/line', {name:'Baseline'});
  spec.data.forEach((d,i)=>{ const cx = x0 + pitch*i + pitch/2; let top = base;
    spec.series.forEach((k,j)=>{ const h = (d.values[k]||0)/max*maxH; if (h<=0) return; R(cx-bw/2, top-h, bw, h, cols[j], {name: k+' · '+d.label, key:[d.label, k]}); top -= h; });
    T(fmt(totals[i], spec.valueFormat||{}, dec), 24, 'Medium', i===n-1?'color/text/strong':'color/text/secondary', {cx, bottom: top-12, key:d.label, role:'value'});
    T(d.label, 24, 'Regular', 'color/text/secondary', {cx, y: base+12, key:d.label}); });
}};
