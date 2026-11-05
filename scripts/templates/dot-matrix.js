// dot-matrix · a count out of a total. spec: total, counted, pending?, unit ("1 dot = 1 validator"), labels?{counted,pending,remainder}
const TEMPLATE = { defaultLayout:'split', async build(spec, box){
  const y0 = chartHead(box.x, box.top, box.w, spec.chartTitle, spec.unit && !spec.chartTitle ? null : spec.unit, false);
  if (spec.total > 200) S.warnings.push('More than 200 dots. Scale the unit (1 dot = 10) before building.');
  const cols = Math.floor(box.w/32), rows = Math.ceil(spec.total/cols), pend = spec.pending||0, L = spec.labels||{};
  const gy = box.bottom - 56 - rows*32;
  // Accessibility: counted = solid blue, pending = blue ring, remaining = grey ring. Shape and colour both differ, and every mark clears 3:1.
  const dot = (x, y, kind) => { const e = figma.createEllipse(); S.slide.appendChild(e); e.resize(14,14); e.x = x; e.y = y;
    if (kind==='counted'){ e.fills=[P(SANCTUM)]; } else { e.fills=[]; e.strokes=[P(kind==='pending' ? SANCTUM : 'color/neutral/grey')]; e.strokeWeight=2; e.strokeAlign='INSIDE'; } return e; };
  for (let i=0;i<spec.total;i++) dot(box.x + (i%cols)*32, gy + Math.floor(i/cols)*32, i < spec.counted ? 'counted' : i < spec.counted+pend ? 'pending' : 'remaining');
  let kx = box.x; const ky = box.bottom - 30;
  for (const [n,k,l] of [[spec.counted,'counted',L.counted||'Counted'], [pend,'pending',L.pending||'Pending'], [spec.total-spec.counted-pend,'remaining',L.remainder||'Remaining']]){
    if (!n) continue; dot(kx, ky+8, k);
    const t = T(l+' '+n, 24, 'Regular', 'color/text/secondary', {x: kx+24, y: ky}); kx += 24 + t.width + 40; }
  if (gy < y0) S.warnings.push('Dot matrix overflows the chart area. Scale the unit or use layout "full".');
}};
