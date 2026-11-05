// bar · horizontal ranking. spec: data[{label,value}], focus, valueFormat
const TEMPLATE = { defaultLayout:'full', async build(spec, box){
  const y = chartHead(box.x, box.top, box.w, spec.chartTitle, spec.unit, false);
  const data = [...spec.data].sort((a,b)=>b.value-a.value);
  const focus = spec.focus || (data.find(d=>/sanctum/i.test(d.label))||data[0]).label;
  const max = Math.max(...data.map(d=>d.value)) || 1, dec = decimalsFor(data.map(d=>d.value));
  const labelW = span(3), x0 = box.x + labelW + 32, barMax = box.w - labelW - 32 - 180;
  const rowH = Math.min(72, (box.bottom - y)/data.length), th = Math.min(32, rowH*0.5);
  const startY = box.bottom - rowH*data.length;
  data.forEach((d,i)=>{ const ry = startY + rowH*i, f = d.label===focus, w = Math.max(2, d.value/max*barMax);
    T(d.label, 24, f?'Medium':'Regular', f?'color/text/strong':'color/text/secondary', {x: box.x, y: ry + rowH/2 - 15, key:d.label});
    R(x0, ry + rowH/2 - th/2, w, th, f?SANCTUM:OTHER, {name:'Bar · '+d.label, key:d.label, orient:'h'});
    T(fmt(d.value, spec.valueFormat||{}, dec), 24, 'Medium', f?'color/text/strong':'color/text/secondary', {x: x0+w+16, y: ry + rowH/2 - 15, key:d.label, role:'value'}); });
}};
