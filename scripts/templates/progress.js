// progress · share of a target. spec: items[{label, number, ratio 0..1}] up to 4
const TEMPLATE = { defaultLayout:'split', async build(spec, box, layout){
  const y0 = chartHead(box.x, box.top, box.w, spec.chartTitle, spec.unit, false);
  const items = spec.items.slice(0,4), made = [];
  for (const it of items){ const p = S.C.progress.createInstance(); S.slide.appendChild(p); p.resize(box.w, p.height); p.x = box.x;
    setProps(p, {Label: it.label, Number: it.number}); tag(p, [it.label, it.number], 'stat');
    const track = p.findOne(n=>n.name==='Track'), fill = p.findOne(n=>n.name.startsWith('Fill'));
    if (track && fill) fill.resize(Math.max(2, track.width*Math.max(0, Math.min(1, it.ratio))), fill.height);
    made.push(p); }
  let y = box.bottom; for (let i=made.length-1; i>=0; i--){ y -= made[i].height; made[i].y = y; y -= 64; }
  if (y + 64 < y0) S.warnings.push('Progress items overflow the chart area. Use fewer items or layout "full".');
}};
