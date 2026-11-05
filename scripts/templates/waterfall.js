// waterfall · bridge from start to end. spec: start{label,value}, steps[{label,value signed}], end{label}, valueFormat
const TEMPLATE = { defaultLayout:'full', async build(spec, box){
  const y0 = chartHead(box.x, box.top, box.w, spec.chartTitle, spec.unit, false);
  const vf = spec.valueFormat||{}, items = []; let run = spec.start.value;
  items.push({label: spec.start.label, a:0, b:run, kind:'start', v:run});
  for (const s of spec.steps){ items.push({label:s.label, a:Math.min(run, run+s.value), b:Math.max(run, run+s.value), kind: s.value>=0?'up':'down', v:s.value}); run += s.value; }
  items.push({label: spec.end.label, a:0, b:run, kind:'end', v:run});
  const dec = decimalsFor(items.map(i=>i.v)), max = Math.max(...items.map(i=>i.b)) || 1, n = items.length;
  const base = box.bottom - 44, maxH = base - y0 - 44, pitch = box.w/n, bw = Math.min(88, pitch*0.6), Y = v => base - v/max*maxH;
  const fill = {start:'color/brand/powder', up:'color/brand/powder', down:'color/accent/coral/2', end:SANCTUM};
  R(box.x, base, box.w, 1, 'color/neutral/line', {name:'Baseline'});
  items.forEach((it,i)=>{ const cx = box.x + pitch*i + pitch/2, top = Y(it.b), h = Math.max(2, Y(it.a)-top);
    R(cx-bw/2, top, bw, h, fill[it.kind], {name:'Step · '+it.label, key:it.label});
    const label = it.kind==='up' ? '+'+fmt(it.v, vf, dec) : fmt(it.v, vf, dec);
    T(label, 24, 'Medium', it.kind==='end' ? 'color/text/strong' : 'color/text/secondary', {cx, bottom: top-12, key:it.label, role:'value'});
    T(it.label, 24, 'Regular', 'color/text/secondary', {cx, y: base+12, key:it.label});
    if (i < n-1){ const lvl = it.kind==='down' ? Y(it.a) : top; R(cx+bw/2, lvl, pitch-bw, 1, 'color/neutral/cool-grey', {name:'Connector'}); } });
}};
