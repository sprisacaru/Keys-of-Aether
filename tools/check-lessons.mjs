// Lesson checker. Run: node tools/check-lessons.mjs   (exit code 1 if any lesson fails)
import { readFileSync } from 'node:fs';
const PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const midi = n => { const m = /^([A-G])(#|b)?(\d)$/.exec(n); return PC[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0) + 12 * (+m[3] + 1); };
const idx = JSON.parse(readFileSync('lessons/index.json', 'utf8'));
let errors = 0; const err = (id, msg) => { errors++; console.log(`FAIL ${id}: ${msg}`); };
for (const region of idx.regions) {
  const taughtP = new Set(), taughtL = new Set();
  for (const id of region.lessons) {
    const l = JSON.parse(readFileSync(`lessons/${id}.json`, 'utf8'));
    for (const f of ['id', 'title', 'region', 'tempo', 'timeSig', 'key', 'skills', 'notes', 'pass', 'introduces', 'technique', 'theory']) if (l[f] == null) err(id, `missing field "${f}"`);
    if (l.id !== id) err(id, 'id does not match file name');
    (l.introduces?.pitches || []).forEach(p => taughtP.add(midi(p)));
    (l.introduces?.lengths || []).forEach(x => taughtL.add(x));
    const bar = l.timeSig[0] * 4 / l.timeSig[1];
    const end = Math.max(...l.notes.map(n => n.start + n.len));
    if (end % bar !== 0) err(id, `bars do not add up: music ends at beat ${end}, bar length ${bar}`);
    const byHand = {};
    for (const n of l.notes) {
      if (Math.floor(n.start / bar) !== Math.floor((n.start + n.len - 1e-9) / bar)) err(id, `note at beat ${n.start} crosses a barline`);
      if (!taughtL.has(n.len)) err(id, `note length ${n.len} at beat ${n.start} has not been taught`);
      if (n.pitch !== 'any') {
        if (!taughtP.has(n.pitch)) err(id, `pitch ${n.pitch} at beat ${n.start} has not been taught`);
        if (!(n.finger >= 1 && n.finger <= 5)) err(id, `missing fingering at beat ${n.start}`);
      }
      (byHand[n.hand] ||= []).push(n);
    }
    for (const [hand, ns] of Object.entries(byHand)) {
      ns.sort((a, b) => a.start - b.start);
      for (let i = 1; i < ns.length; i++) if (ns[i].start < ns[i - 1].start + ns[i - 1].len - 1e-9 && ns[i].start !== ns[i - 1].start) err(id, `${hand} hand notes overlap at beat ${ns[i].start}`);
      const pitched = ns.filter(n => n.pitch !== 'any');
      for (let b = 0; b * bar < end; b++) {
        const inBar = pitched.filter(n => Math.floor(n.start / bar) === b); if (!inBar.length) continue;
        const ps = inBar.map(n => n.pitch); if (l.advanced) continue; // real repertoire shifts hand position: reach and finger-order rules do not apply
        if (Math.max(...ps) - Math.min(...ps) > 12) err(id, `${hand} hand reach over an octave in bar ${b + 1}`);
        for (const a of inBar) for (const c of inBar) {
          const up = hand === 'R' ? 1 : -1;
          if (a.pitch < c.pitch && (a.finger - c.finger) * up >= 0) err(id, `fingering inconsistent in bar ${b + 1}: finger ${a.finger} on a lower note than finger ${c.finger}`);
        }
      }
    }
    console.log(`ok   ${id} (${l.notes.length} notes, ${end / bar} bars)`);
  }
}
console.log(errors ? `\n${errors} problem(s)` : '\nAll lessons pass');
process.exit(errors ? 1 : 0);
