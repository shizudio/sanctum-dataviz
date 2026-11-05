// stats · 2 to 4 headline numbers. spec: stats[{number,label}], focus? (index)
const TEMPLATE = { defaultLayout:'full', async build(spec, box){
  const n = Math.min(4, spec.stats.length), sp = n===2 ? 6 : n===3 ? 4 : 3, made = [];
  spec.stats.slice(0,n).forEach((s,i)=>{ const b = S.C.stat.createInstance(); S.slide.appendChild(b); b.resize(span(sp), b.height); b.x = col(1+i*sp);
    setProps(b, {Number: s.number, Label: s.label}); tag(b, [s.number, s.label], 'stat');
    if (i===spec.focus){ const r = b.findOne(x=>x.type==='INSTANCE'); if (r) r.swapComponent(variant(S.C.rule,'Colour=Blue')); const num = b.findOne(x=>x.type==='TEXT' && x.name==='Number'); if (num) num.fills=[P('color/text/highlight')]; }
    made.push(b); });
  const h = Math.max(...made.map(b=>b.height)); made.forEach(b=> b.y = box.bottom - h);
}};
