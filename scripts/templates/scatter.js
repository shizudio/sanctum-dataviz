// scatter · two measures across items. spec: xLabel, yLabel, points[{label,x,y}], focus?, labelAll?, valueFormat{x,y}?
const TEMPLATE = { defaultLayout:'full', async build(spec, box){
  const y0 = chartHead(box.x, box.top, box.w, spec.chartTitle, spec.unit, false);
  const xs = spec.points.map(p=>p.x), ys = spec.points.map(p=>p.y), sx = niceStep(Math.max(...xs)), sy = niceStep(Math.max(...ys));
  const xt = Math.ceil(Math.max(...xs)/sx)*sx, yt = Math.ceil(Math.max(...ys)/sy)*sy, vfx = (spec.valueFormat||{}).x||{}, vfy = (spec.valueFormat||{}).y||{};
  const px0 = box.x+96, px1 = box.x+box.w-160, pt = y0+80, pb = box.bottom-80, X = v => px0+v/xt*(px1-px0), Y = v => pb-v/yt*(pb-pt);
  for (let v=0; v<=yt+1e-9; v+=sy){ R(px0, Y(v), px1-px0, 1, v===0?'color/neutral/line':'color/neutral/cool-grey'); T(fmt(v, vfy, decimalsFor([sy])), 24, 'Regular', 'color/text/secondary', {right: px0-16, y: Y(v)-15}); }
  for (let v=0; v<=xt+1e-9; v+=sx) T(fmt(v, vfx, decimalsFor([sx])), 24, 'Regular', 'color/text/secondary', {cx: X(v), y: pb+12});
  T(spec.yLabel, 24, 'Medium', 'color/text/secondary', {x: box.x, y: y0});
  T(spec.xLabel, 24, 'Medium', 'color/text/secondary', {right: px1, y: pb+48});
  const pts = [...spec.points].sort((a,b)=>(a.label===spec.focus)-(b.label===spec.focus));
  for (const p of pts){ const f = p.label===spec.focus, d = f?24:16, e = figma.createEllipse(); S.slide.appendChild(e); e.resize(d,d); e.x = X(p.x)-d/2; e.y = Y(p.y)-d/2; e.name = 'Point · '+p.label; tag(e, p.label, 'mark'); e.fills=[P(f?SANCTUM:'color/neutral/grey')];
    if (f || spec.labelAll) T(p.label, 24, f?'Medium':'Regular', f?'color/text/strong':'color/text/secondary', {x: X(p.x)+d/2+8, y: Y(p.y)-15, key:p.label}); }
}};
