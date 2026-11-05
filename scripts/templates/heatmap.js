// heatmap · intensity across two dimensions. spec: rows[], columns[], values[][], valueFormat
const TEMPLATE = { defaultLayout:'full', async build(spec, box){
  const y0 = chartHead(box.x, box.top, box.w, spec.chartTitle, spec.unit, false);
  const STEPS = ['color/brand/ice','color/brand/powder','color/brand/sky','color/brand/azure','color/brand/blue'];
  const flat = spec.values.flat(), mn = Math.min(...flat), mx = Math.max(...flat), dec = decimalsFor(flat), vf = spec.valueFormat||{};
  const bin = v => mx===mn ? 4 : Math.min(4, Math.floor((v-mn)/(mx-mn)*5));
  const lw = 160, keyH = 56, cw = (box.w - lw)/spec.columns.length, ch = Math.min(cw*0.75, (box.bottom - keyH - y0 - 40)/spec.rows.length);
  const gy = box.bottom - keyH - ch*spec.rows.length;
  spec.columns.forEach((c,j)=> T(c, 24, 'Regular', 'color/text/secondary', {cx: box.x+lw+cw*j+cw/2, bottom: gy-8}));
  spec.rows.forEach((r,i)=>{ T(r, 24, 'Regular', 'color/text/secondary', {x: box.x, y: gy+ch*i+ch/2-15});
    spec.values[i].forEach((v,j)=>{ const b = bin(v), x = box.x+lw+cw*j, y = gy+ch*i; R(x+2, y+2, cw-4, ch-4, STEPS[b], {name:r+' · '+spec.columns[j]});
      if (cw >= 64 && ch >= 40) T(fmt(v, vf, dec), 24, 'Regular', b===4 ? 'color/neutral/white' : 'color/text/strong', {cx: x+cw/2, y: y+ch/2-15}); }); });
  let kx = box.x + lw; const ky = box.bottom - 24;
  T(fmt(mn, vf, dec), 24, 'Regular', 'color/text/secondary', {right: kx-12, y: ky-14});
  STEPS.forEach(s=>{ R(kx, ky-8, 48, 16, s); kx += 52; });
  T(fmt(mx, vf, dec), 24, 'Regular', 'color/text/secondary', {x: kx+8, y: ky-14});
}};
