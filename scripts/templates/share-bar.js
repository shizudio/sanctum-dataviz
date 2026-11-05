// share-bar · parts of a whole. spec: data[{label,value}] up to 5 (+ Other), valueFormat unused (percent computed)
const TEMPLATE = { defaultLayout:'full', async build(spec, box){
  chartHead(box.x, box.top, box.w, spec.chartTitle, spec.unit, false);
  let parts = [...spec.data]; if (parts.length > 5){ const rest = parts.slice(5).reduce((s,d)=>s+d.value,0); parts = parts.slice(0,5).concat([{label:'Other', value:rest, other:true}]); }
  const sum = parts.reduce((s,d)=>s+d.value,0) || 1, H = 140, y = box.bottom - 48 - H; let x = box.x; let ci = 0;
  for (const d of parts){ const w = box.w * d.value/sum, other = d.other || /^other$/i.test(d.label), c = other ? OTHER : CAT[ci], tc = other ? 'color/text/secondary' : CAT_TEXT[ci]; if (!other) ci++;
    R(x, y, Math.max(2, w-4), H, c, {name:'Segment · '+d.label, key:d.label, orient:'h'});
    T(Math.round(d.value/sum*100)+'%', 24, 'Medium', tc, {x, bottom: y-12, key:d.label, role:'value'});
    T(d.label, 24, 'Regular', 'color/text/secondary', {x, y: box.bottom-36, w: Math.max(80, w-8), key:d.label});
    x += w; }
}};
