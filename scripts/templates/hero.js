// hero · the one number. spec: number, caption, support? (sentence on the left)
const TEMPLATE = { defaultLayout:'full', async build(spec, box){
  if (spec.support) T(spec.support, 28, 'Regular', 'color/text/secondary', {x: col(1), w: span(5), bottom: box.bottom});
  const h = S.C.hero.createInstance(); S.slide.appendChild(h); setProps(h, {Number: spec.number, Caption: spec.caption || ''});
  h.x = spec.support ? col(7) : col(1); h.y = box.bottom - h.height;
}};
