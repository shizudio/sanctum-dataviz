// panels · same measure in two units. spec: panels[2]{title, number, delta:{value,direction}, comparison, data[], palette, focus?}, valueFormat per panel optional
const TEMPLATE = { defaultLayout:'full', async build(spec, box){
  spec.panels.slice(0,2).forEach((p,k)=>{
    const x = k ? col(7) : col(1), w = span(6);
    const h = S.C.panel.createInstance(); S.slide.appendChild(h); h.resize(w, h.height); h.x = x; h.y = box.top;
    setProps(h, {Title: p.title, Number: p.number, Comparison: p.comparison || ''});
    const d = h.findOne(n=>n.type==='INSTANCE' && n.name==='Delta');
    if (d && p.delta) setProps(d, {Value: p.delta.value, Direction: p.delta.direction==='up' ? 'Up' : 'Down'});
    else if (d) d.visible = false;
    columns(p.data, {x: x+16, w: w-32, top: h.y + h.height + 48, bottom: box.bottom}, {palette: p.palette || (k ? 'sol' : 'blue'), focus: p.focus, vf: p.valueFormat || {}});
  });
}};
