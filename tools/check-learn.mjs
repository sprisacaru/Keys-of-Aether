// Checks every Learn lesson in learn/*.js. Run: node tools/check-learn.mjs
import fs from 'fs';
const win = {}; const lessonIds = new Set(JSON.parse(fs.readFileSync('lessons/index.json')).regions.flatMap(r => r.lessons));
for (const f of fs.readdirSync('learn').filter(f => f.endsWith('.js'))) new Function('window', fs.readFileSync('learn/' + f, 'utf8'))(win);
const LO = 60, HI = 84, errs = [], ids = new Set(); let pages = 0, qs = 0, words = 0;
const inKb = m => m >= LO && m <= HI, err = (L, m) => errs.push(`${L.id}: ${m}`);
for (const L of win.KOA_LEARN) {
  if (ids.has(L.id)) err(L, 'duplicate id'); ids.add(L.id);
  for (const k of ['id', 'learn', 'title', 'short', 'takeaway', 'pages', 'quiz', 'pass']) if (L[k] == null) err(L, 'missing ' + k);
  for (const t of [L.learn, ...(L.also || [])]) if (!lessonIds.has(t)) err(L, 'points at unknown stop ' + t);
  if (!(L.pass >= 1 && L.pass <= L.quiz.length)) err(L, `pass ${L.pass} not within 1..${L.quiz.length}`);
  L.pages.forEach((p, i) => { const w = `page ${i + 1}`; pages++;
    if (!p.h || !p.t) err(L, w + ' needs h and t'); const txt = [].concat(p.t).join(' '); words += txt.split(/\s+/).length;
    if (/\$\{|—|genuinely|honestly/.test(txt)) err(L, w + ' has a banned character or word');
    if ((txt.match(/<b>/g) || []).length !== (txt.match(/<\/b>/g) || []).length) err(L, w + ' has unbalanced <b>');
    for (const m of Object.keys(p.hl || {})) if (!inKb(+m)) err(L, `${w} highlights key ${m} outside the on-screen keys`);
    if (p.do) { const d = p.do; if (!d.text) err(L, w + ' task needs text');
      if (d.kind === 'seq') { if (!d.seq.every(inKb)) err(L, w + ' task uses keys outside the on-screen keyboard'); }
      else if (d.kind === 'pcs') { if (!d.pcs.every(x => x >= 0 && x < 12)) err(L, w + ' bad pcs'); }
      else if (d.kind === 'octs') { if (!(d.n <= 3)) err(L, w + ' asks for more octaves than the on-screen keys have'); }
      else if (d.kind === 'span') { if (d.span > 24) err(L, w + ' span too wide'); }
      else if (d.kind === 'taps') { if (!(d.n > 0)) err(L, w + ' taps needs n'); }
      else err(L, w + ' unknown task kind ' + d.kind); }
    for (const d of p.demos || []) if (!d.label || !(d.notes || d.chords || d.pulse)) err(L, w + ' demo needs a label and notes, chords or pulse'); });
  L.quiz.forEach((q, i) => { const w = `question ${i + 1}`; qs++;
    if (!q.q || !q.hint || !q.why) err(L, w + ' needs q, hint and why');
    if (q.type === 'choice') { if (!(q.a >= 0 && q.a < q.opts.length)) err(L, w + ' answer index out of range'); if (new Set(q.opts).size !== q.opts.length) err(L, w + ' repeated option'); }
    else if (q.type === 'key') { if (q.midi) { if (!q.midi.every(inKb)) err(L, w + ' exact key is outside the on-screen keyboard'); } else if (!q.pcs || !q.pcs.length) err(L, w + ' needs midi or pcs'); }
    else err(L, w + ' unknown type');
    for (const s of q.sounds || []) if (!s.label || !(s.notes || s.chords || s.pulse)) err(L, w + ' sound needs a label and notes, chords or pulse'); });
}
for (const id of lessonIds) if (![...win.KOA_LEARN].some(L => L.learn === id || (L.also || []).includes(id))) console.log('note: stop has no lesson:', id);
// Feel: every stop needs the two-players question, the teacher's lines and a piece to listen to
const FEEL = win.KOA_FEEL || {}, arcIds = new Set((() => { const w = {}; try { new Function('window', fs.readFileSync('arcade/songs.js', 'utf8'))(w); } catch (e) {} return ((w.KOA_ARCADE || {}).songs || []).map(s => s.id); })());
for (const id of lessonIds) { const F = FEEL[id]; if (!F) { errs.push(`feel: stop ${id} has no Feel part`); continue; }
  for (const k of ['ask', 'tell', 'before', 'after']) { if (typeof F[k] !== 'string' || F[k].length < 30) errs.push(`feel ${id}: missing or thin ${k}`); else if (/—|genuinely|honestly|\$\{/.test(F[k])) errs.push(`feel ${id}: banned text in ${k}`); }
  if (!F.listen || !F.listen.piece || !F.listen.what) errs.push(`feel ${id}: no listening piece`); if (F.arc && !arcIds.has(F.arc)) errs.push(`feel ${id}: unknown arcade song ${F.arc}`); }
for (const k of Object.keys(FEEL)) if (k !== '_arcade' && !lessonIds.has(k)) errs.push(`feel: unknown stop ${k}`);
for (const [song, stop] of Object.entries(FEEL._arcade || {})) { if (!arcIds.has(song)) errs.push(`feel: _arcade names unknown song ${song}`); if (!lessonIds.has(stop)) errs.push(`feel: _arcade names unknown stop ${stop}`); }
if (errs.length) { console.log(errs.join('\n')); process.exit(1); }
console.log(`All ${win.KOA_LEARN.length} lessons pass: ${pages} pages, ${qs} questions, about ${Math.round(words / 100) * 100} words`);
