// share-area · market share over time, 100% stacked. spec: x[] (ISO dates or labels), series[{name, values[] (amounts), ticker?, sanctum?}] up to 5, chartTitle, unit
const TEMPLATE = { defaultLayout:'full', async build(spec, box){
  const y = chartHead(box.x, box.top, box.w, spec.chartTitle, spec.unit, false);
  const ser = [...spec.series].sort((a,b)=>(b.sanctum?1:0)-(a.sanctum?1:0)), n = spec.x.length, cols = seriesColours(ser);
  const tot = spec.x.map((_,i)=>ser.reduce((s,q)=>s+(q.values[i]||0),0) || 1);
  const px0 = box.x + 96, px1 = box.x + box.w - 300, pb = box.bottom - 44, pt = y + 16;
  const X = i => px0 + (px1-px0)*(n===1?0.5:i/(n-1)), Y = f => pb - f*(pb-pt);
  [0,0.25,0.5,0.75,1].forEach(f=>{ T(Math.round(f*100)+'%', 24, 'Regular', 'color/text/secondary', {right: px0-16, y: Y(f)-15}); });
  let below = spec.x.map(()=>0); const ends = [];
  ser.forEach((q,k)=>{ const above = below.map((b,i)=> b + (q.values[i]||0)/tot[i]);
    const poly = [...above.map((f,i)=>[X(i), Y(f)]), ...below.map((f,i)=>[X(i), Y(f)]).reverse()];
    path(poly, null, 0, {closed:true, fill: cols[k], name:'Share · '+q.name, key:q.name, role:'mark'});
    path(above.map((f,i)=>[X(i), Y(f)]), 'color/neutral/white', 2, {name:'Edge'});
    const mid = (above[n-1] + below[n-1])/2, share = above[n-1] - below[n-1];
    ends.push({y: Y(mid) - 28, q, c: cols[k], k, share}); below = above; });
  for (let v=0; v<=1; v+=0.25) R(px0, Y(v), px1-px0, 1, v===0 ? 'color/neutral/line' : 'color/neutral/white', {name:'Grid', opacity: v===0 ? 1 : 0.6});
  drawXTicks(xTicks(spec.x), X, pb+12);
  spread(ends, 72, pt - 8, pb);
  for (const e of ends){ badge(px1+24, e.y, 56, {sanctum: e.q.sanctum, colour: e.c, text: e.q.ticker || e.q.name, key:[e.q.name, e.q.ticker||e.q.name]});
    T(Math.round(e.share*100)+'%', 24, 'Medium', e.q.sanctum ? 'color/text/highlight' : (CAT.indexOf(e.c) > 0 && CAT.indexOf(e.c) < 4 ? CAT_TEXT[CAT.indexOf(e.c)] : 'color/text/secondary'), {x: px1+96, y: e.y-2, key:e.q.name, role:'value'});
    T(e.q.name, 24, 'Regular', 'color/text/secondary', {x: px1+96, y: e.y+28, key:e.q.name}); }
}};
