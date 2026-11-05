// column · one measure over periods. spec: data[{label,value,group?,pending?}], palette, focus, valueFormat, chartTitle, unit
const TEMPLATE = { defaultLayout:'split', async build(spec, box){
  const y = chartHead(box.x, box.top, box.w, spec.chartTitle, spec.unit, true);
  columns(spec.data, {x: box.x + 16, w: box.w - 32, top: y, bottom: box.bottom}, {palette: spec.palette||'blue', focus: spec.focus, vf: spec.valueFormat});
}};
