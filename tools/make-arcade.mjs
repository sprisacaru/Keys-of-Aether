// Builds arcade/songs.js from compact song definitions. Run: node tools/make-arcade.mjs
// Melody shorthand: "C4:1" = pitch : length in beats, "r:1" = rest, "|" = bar line. Chords: one root letter per bar ("N" = left hand rests).
// Arrangements (tunes with no piano original) are written once here and arranged three ways: easy = tune only, slower; medium = tune + one bass note a bar; hard = tune + moving left hand, full speed.
import { writeFileSync, readFileSync } from 'node:fs';
const PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }, LET = 'CDEFGAB';
const parse = n => { const m = /^([A-G])(#|b)?(\d)$/.exec(n); if (!m) throw new Error('bad pitch ' + n); return { midi: PC[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0) + 12 * (+m[3] + 1), di: 7 * +m[3] + LET.indexOf(m[1]) }; };
function melody(str, bar, id) {
  const out = []; let t = 0;
  str.trim().split('|').forEach((b, bi) => { let len = 0; for (const tok of b.trim().split(/\s+/)) { const [p, l] = tok.split(':'); if (p !== 'r') for (const one of p.split('+')) { const q = parse(one); out.push({ pitch: q.midi, di: q.di, start: t + len, len: +l, hand: 'R', vel: .7, bar: bi }); } len += +l; }
    if (Math.abs(len - bar) > 1e-9) throw new Error(`${id}: bar ${bi + 1} has ${len} beats, wants ${bar}`); t += bar; });
  return out;
}
// Finger numbers are only shown where they are certainly right: tunes that sit in one five-finger position (the song names its lowest note in `pos`),
// and the generated left hand, which is always little finger on the root and thumb on the fifth. Everything else gets 0 = no number shown.
function fingerPos(ns, pos) { const low = pos ? parse(pos).di : null; for (const n of ns) n.finger = low !== null && n.di >= low && n.di <= low + 4 ? n.di - low + 1 : 0; return ns; }
const root = c => { const pc = PC[c[0]] + (c[1] === 'b' ? -1 : c[1] === '#' ? 1 : 0), m = pc >= 5 ? 36 + pc : 48 + pc; return { midi: m, di: 7 * (Math.floor(m / 12) - 1) + LET.indexOf(c[0]) }; };
function leftHand(chords, bar, level) {
  const out = [];
  chords.forEach((c, bi) => { if (c === 'N') return; const r = root(c), t = bi * bar, fifth = { midi: r.midi + 7, di: r.di + 4 };
    if (level === 1) out.push({ pitch: r.midi, di: r.di, start: t, len: bar, hand: 'L', vel: .55, bar: bi });
    else for (let k = 0; k < bar; k++) { const x = bar === 3 ? (k === 0 ? r : fifth) : (k % 2 === 0 ? r : fifth); out.push({ pitch: x.midi, di: x.di, start: t + k, len: 1, hand: 'L', vel: .5, bar: bi, finger: x === r ? 5 : 1 }); } });
  out.forEach(n => { if (n.finger == null) n.finger = 5; }); return out;
}
function build(s) {
  const bar = (s.timeSig || [4, 4])[0]; let mel = s.mel, ch = s.chords.trim().split(/\s+/);
  if (s.repeat) { mel = Array(s.repeat).fill(mel).join(' | '); ch = Array(s.repeat).fill(ch).flat(); }
  const R = hard => fingerPos(melody(hard && s.melHard ? s.melHard : mel, bar, s.id), s.pos), asL = (str, tag) => melody(str, bar, s.id + tag).map(n => ({ ...n, hand: 'L', vel: .5, finger: 0 })); if (melody(mel, bar, s.id).reduce((m, n) => Math.max(m, n.bar), 0) + 1 !== ch.length) throw new Error(`${s.id}: ${ch.length} chords for ${melody(mel, bar, s.id).reduce((m, n) => Math.max(m, n.bar), 0) + 1} bars`);
  const tidy = ns => ns.sort((a, b) => a.start - b.start || a.pitch - b.pitch).map(n => { const o = { pitch: n.pitch, start: n.start, len: n.len, hand: n.hand, finger: n.finger, vel: n.vel }; if (n.bar % 8 === 2 || n.bar % 8 === 3 || n.bar % 8 === 6) o.sp = Math.floor(n.bar / 8) * 2 + (n.bar % 8 === 6 ? 1 : 0); return o; });
  const hardL = s.left ? asL(s.left, ' left') : leftHand(ch, bar, 2), medL = s.leftMed ? asL(s.leftMed, ' left (medium)') : leftHand(ch, bar, 1);
  return { id: s.id, title: s.title, by: s.by, year: s.year, tier: s.tier, timeSig: s.timeSig || [4, 4], key: s.key || 'C', blurb: s.blurb,
    levels: [{ tempo: Math.round(s.tempo * .7), notes: tidy(R()) }, { tempo: Math.round(s.tempo * .85), notes: tidy(R().concat(medL)) }, { tempo: s.tempo, notes: tidy(R(true).concat(hardL)) }] };
}
const ODE = 'E4:1 E4:1 F4:1 G4:1 | G4:1 F4:1 E4:1 D4:1 | C4:1 C4:1 D4:1 E4:1 | E4:1.5 D4:.5 D4:2 | E4:1 E4:1 F4:1 G4:1 | G4:1 F4:1 E4:1 D4:1 | C4:1 C4:1 D4:1 E4:1 | D4:1.5 C4:.5 C4:2 | D4:1 D4:1 E4:1 C4:1 | D4:1 E4:.5 F4:.5 E4:1 C4:1 | D4:1 E4:.5 F4:.5 E4:1 D4:1 | C4:1 D4:1 G3:2 | E4:1 E4:1 F4:1 G4:1 | G4:1 F4:1 E4:1 D4:1 | C4:1 C4:1 D4:1 E4:1 | D4:1.5 C4:.5 C4:2';
const CAN = 'C4:2 D4:.5 F4:.5 E4:.5 D4:.5 | G4:1 G4:1 G4:.5 A4:.5 E4:.5 F4:.5 | D4:1 D4:1 D4:.5 F4:.5 E4:.5 D4:.5 | C4:.5 C5:.5 B4:.5 A4:.5 G4:.5 F4:.5 E4:.5 D4:.5 | C4:2 D4:.5 F4:.5 E4:.5 D4:.5 | G4:1 G4:1 G4:.5 A4:.5 E4:.5 F4:.5 | D4:1 D4:1 D4:.5 F4:.5 E4:.5 D4:.5 | C4:.5 G4:.5 D4:.5 E4:.5 C4:2';
const TELL = 'G4:.5 G4:.5 G4:1 G4:.5 G4:.5 G4:1 | G4:.5 G4:.5 C5:1 D5:1 E5:1 | G4:.5 G4:.5 G4:1 G4:.5 G4:.5 C5:1 | E5:1 E5:.5 D5:.5 B4:1 G4:1 | G4:.5 G4:.5 G4:1 G4:.5 G4:.5 G4:1 | G4:.5 G4:.5 C5:1 D5:1 E5:1 | C5:1 E5:1 G5:2 | F5:.5 E5:.5 D5:.5 C5:.5 E5:1 C5:1';
const songs = [
  { id: 'ode', tier: 0, pos: 'C4', title: 'Ode to Joy', by: 'Beethoven', year: 1824, tempo: 120, blurb: 'The whole tune, nearly all of it by step.', mel: ODE, chords: 'C G C G C G C C G C G G C G C C' },
  { id: 'frere', tier: 0, pos: 'C4', title: 'Frère Jacques', by: 'Traditional, France', year: 1780, tempo: 112, repeat: 2, blurb: 'A round: every two bars the tune repeats itself.', mel: 'C4:1 D4:1 E4:1 C4:1 | C4:1 D4:1 E4:1 C4:1 | E4:1 F4:1 G4:2 | E4:1 F4:1 G4:2 | G4:.5 A4:.5 G4:.5 F4:.5 E4:1 C4:1 | G4:.5 A4:.5 G4:.5 F4:.5 E4:1 C4:1 | C4:1 G3:1 C4:2 | C4:1 G3:1 C4:2', chords: 'C C C C C C C C' },
  { id: 'saints', tier: 0, pos: 'C4', title: 'When the Saints Go Marching In', by: 'Traditional, USA', year: 1896, tempo: 132, blurb: 'New Orleans. Starts after the beat, so count the rest.', mel: 'r:1 C4:1 E4:1 F4:1 | G4:4 | r:1 C4:1 E4:1 F4:1 | G4:4 | r:1 C4:1 E4:1 F4:1 | G4:2 E4:2 | C4:2 E4:2 | D4:4 | r:1 E4:1 E4:1 D4:1 | C4:3 C4:1 | E4:2 G4:2 | G4:1 F4:3 | r:2 E4:1 F4:1 | G4:2 E4:2 | C4:2 D4:2 | C4:4', chords: 'C C C C C C C G C C C F C C G C' },
  { id: 'cancan', tier: 1, title: 'Can-Can', by: 'Offenbach', year: 1858, tempo: 152, repeat: 2, blurb: 'The galop from Orpheus in the Underworld. Runs of half beats.', mel: CAN, chords: 'C C G C C C G C' },
  { id: 'tell', tier: 1, title: 'William Tell: the gallop', by: 'Rossini', year: 1829, tempo: 144, repeat: 2, blurb: 'Ta-ta-TUM, ta-ta-TUM. Repeated notes at speed.', mel: TELL, chords: 'C C C G C C C C' }
];
// Real piano scores, converted by tools/real2arcade.py from public-domain engravings. Hard is the score as written.
const real = JSON.parse(readFileSync('arcade/real.json', 'utf8'));
const built = songs.map(build).concat(real.songs).sort((a, b) => a.tier - b.tier);
writeFileSync('arcade/songs.js', '// Generated by tools/make-arcade.mjs. Do not edit by hand.\nwindow.KOA_ARCADE = ' + JSON.stringify({ songs: built }) + ';\n');
for (const s of built) console.log(s.id.padEnd(12), s.levels.map((l, i) => ['easy', 'medium', 'hard'][i] + ' ' + l.notes.length + ' notes @' + l.tempo).join(' | '), '| fingers', [...new Set(s.levels[2].notes.map(n => n.finger))].sort().join(''));
