// cloud-rings · nested sets. spec: levels[{label,value}] outermost first, 2 to 4. Note defaults to "Diagram not to scale".
const CLOUD = "M 491.44 0 C 674.1 0 828.06 121.65 877.19 288.37 C 915.37 341.77 938 407.33 938 478.08 C 938 658.24 792 804.42 611.71 804.42 L 361.74 804.42 C 162.67 804.42 1.27 643.63 0.01 444.96 L 0 442.62 L 0.01 440.59 C 0.8 295.13 87.3 170.23 211.54 113.44 C 283.77 43.43 382.53 0 491.44 0 Z";
// Rings step from pale sky to deep Sanctum blue: sky, sky, azure, then the core in deep blue (#006BFF) as the one focus mark.
// Each ring sits on the ones outside it; layer opacities are tuned so the stack reads as clear, even steps.
// Labels live in a legend table beside the clouds, joined to each ring by a 2px leader line in that ring's colour.
const TEMPLATE = { defaultLayout:'split', async build(spec, box){
  if (!spec.note) spec.note = 'Diagram not to scale.';
  const lv = spec.levels.slice(0,4), n = lv.length;
  const RING = { 4: [['color/brand/sky',0.25],['color/brand/sky',1/3],['color/brand/azure',0.5],['color/brand/blue',1]],
                 3: [['color/brand/sky',1/3],['color/brand/azure',0.5],['color/brand/blue',1]],
                 2: [['color/brand/sky',0.5],['color/brand/blue',1]] }[n] || [['color/brand/blue',1]];
  const SWATCH = { 4: ['#DBF0FF','#B6E1FF','#7FC3FF','#006BFF'], 3: ['#B6E1FF','#7FC3FF','#006BFF'], 2: ['#B6E1FF','#006BFF'] }[n] || ['#006BFF'];
  const hex = h => ({r:parseInt(h.slice(1,3),16)/255, g:parseInt(h.slice(3,5),16)/255, b:parseInt(h.slice(5,7),16)/255});
  const cw = box.w*0.46, H0 = Math.min(box.bottom - box.top - 40, cw*0.8576), W0 = H0/0.8576, cx = box.x + W0/2, bottom = box.bottom - 20;
  const rings = [];
  lv.forEach((l,k)=>{ const s = 1 - 0.2*k, w = W0*s, h = H0*s, v = figma.createVector(); S.slide.appendChild(v);
    v.vectorPaths = [{windingRule:'NONZERO', data: CLOUD}]; v.resize(w, h); v.x = cx - w/2; v.y = bottom - h - (H0-h)*0.15;
    v.fills = [P(RING[k][0])]; v.opacity = RING[k][1]; v.strokes = []; v.name = 'Ring · '+l.label; tag(v, l.label, 'mark'); rings.push(v); });
  // legend table: each row sits level with the band of its ring that no inner ring covers, so the leader lines run straight
  const lx = box.x + cw + 64, lw = box.x + box.w - lx;
  const mids = rings.map((r,k)=> k < n-1 ? (r.y + rings[k+1].y)/2 : r.y + r.height*0.42);
  T(spec.legendTitle || 'Where it sits', 24, 'SemiBold', 'color/text/strong', {x: lx, bottom: mids[0] - 40});
  R(lx, mids[0] - 32, lw, 1, 'color/text/strong', {name:'Legend rule'});
  lv.forEach((l,k)=>{ const mid = mids[k], core = k===n-1;
    const sw = figma.createRectangle(); S.slide.appendChild(sw); sw.resize(24,24); sw.x = lx; sw.y = mid-12; sw.cornerRadius = 4; sw.fills = [{type:'SOLID', color: hex(SWATCH[k])}]; sw.name = 'Swatch · '+l.label;
    T(l.label, 24, core?'SemiBold':'Regular', 'color/text/strong', {x: lx+40, y: mid-17, key:l.label});
    if (l.value) T(l.value, 28, 'Medium', core?'color/text/highlight':'color/text/strong', {right: l.share ? lx+lw-96 : lx+lw, y: mid-21, key:l.label, role:'value'});
    if (l.share) T(l.share, 24, 'Regular', 'color/text/strong', {right: lx+lw, y: mid-17, key:l.label});
    if (k < n-1) R(lx, (mid + mids[k+1])/2, lw, 1, 'color/neutral/line', {name:'Hairline'});
    const endX = cx + rings[k].width*0.3; const ld = figma.createRectangle(); S.slide.appendChild(ld); ld.resize(Math.max(1, lx - 12 - endX), 2); ld.x = endX; ld.y = mid-1; ld.fills = [{type:'SOLID', color: hex(SWATCH[k])}]; ld.name = 'Leader · '+l.label; });
  if (mids[n-1] - mids[0] < (n-1)*48) S.warnings.push('Cloud rings are small for the legend; use layout "full" or fewer levels.');
}};
