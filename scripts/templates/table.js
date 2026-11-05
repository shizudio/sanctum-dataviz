// table · items × attributes. spec: columns[], rows[][], highlightColumn? (column index), numeric?[] (column indexes)
const TEMPLATE = { defaultLayout:'full', async build(spec, box){
  const y0 = chartHead(box.x, box.top, box.w, spec.chartTitle, spec.unit, false);
  const nc = spec.columns.length, first = Math.max(460, box.w*0.28), rest = (box.w-first)/(nc-1), H = 88, num = new Set(spec.numeric||[]);
  if (spec.rows.length > 6) S.warnings.push('Table has '+spec.rows.length+' rows. Keep to 6 per slide.');
  const cell = (type, align, text, x, y, w) => { const i = variant(S.C.cell, 'Type='+type+', Align='+align).createInstance(); S.slide.appendChild(i); i.resize(w, H); i.x = x; i.y = y; if (type!=='Empty') setProps(i, {Text: text}); return i; };
  const startY = Math.min(y0, box.bottom - H*(spec.rows.length+1));
  [spec.columns, ...spec.rows].forEach((row, r)=>{ let x = box.x;
    row.forEach((v, c)=>{ const w = c===0 ? first : rest, hi = c===spec.highlightColumn, align = num.has(c) ? 'Right' : 'Left', empty = r>0 && (v===''||v==null||v==='-');
      const type = r===0 ? (hi?'Highlight header':'Header') : empty ? (hi?'Highlight body':'Empty') : (hi?'Highlight body':'Body');
      cell(type, align, empty ? '–' : String(v), x, startY + r*H, w); x += w; }); });
}};
