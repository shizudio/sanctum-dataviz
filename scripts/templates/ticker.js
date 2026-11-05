// ticker · token cards: badge, name, headline figure, change and sparkline. spec: tokens[{name, ticker, sanctum?, value, label, change, direction:'up'|'down'|'flat', spark[]}] 1 to 4
const TEMPLATE = { defaultLayout:'full', async build(spec, box){
  const tk = spec.tokens.slice(0,4), n = tk.length, sp = 12/n, cols = seriesColours(tk);
  const H = Math.min(520, box.bottom - box.top), top = box.bottom - H;
  tk.forEach((t,i)=>{ const x = col(1 + i*sp), w = span(sp), f = !!t.sanctum;
    rule(x, top, w, f);
    badge(x, top+32, 64, {sanctum: f, colour: cols[i], text: t.ticker || t.name, key:[t.name, t.ticker||t.name]});
    T(t.name, 28, 'Medium', 'color/text/strong', {x: x+84, y: top+30, key:[t.name, t.ticker||t.name]});
    if (t.ticker) T(t.ticker, 24, 'Regular', 'color/text/secondary', {x: x+84, y: top+68});
    const big = T(t.value, n>=4 ? 72 : 96, 'Medium', f ? 'color/text/highlight' : 'color/text/strong', {x, y: top+136, key:[t.name, t.ticker||t.name], role:'value'});
    T(t.label || '', 24, 'Regular', 'color/text/secondary', {x, y: big.y+big.height+4});
    if (t.change){ const up = t.direction==='up', dn = t.direction==='down';
      T((up?'↑ ':dn?'↓ ':'')+t.change, 24, 'Medium', up ? 'color/text/accent-green' : dn ? 'color/accent/coral/4' : 'color/text/secondary', {right: x+w, y: top+40}); }
    if (t.spark && t.spark.length > 1){ const sy0 = box.bottom - 120, sh = 112, mn = Math.min(...t.spark), mx = Math.max(...t.spark), r = (mx-mn)||1;
      const pts = t.spark.map((v,j)=>[x + w*j/(t.spark.length-1), sy0 + sh - (v-mn)/r*sh]);
      if (f) path([[x, sy0+sh], ...pts, [x+w, sy0+sh]], null, 0, {closed:true, fill:'color/brand/powder', fillOpacity:0.6, name:'Spark fill'});
      path(pts, f ? SANCTUM : 'color/neutral/grey', f ? 3 : 2, {name:'Sparkline · '+t.name, key:[t.name, t.ticker||t.name]});
      R(x, sy0+sh, w, 1, 'color/neutral/line', {name:'Spark base'}); }
  });
}};
