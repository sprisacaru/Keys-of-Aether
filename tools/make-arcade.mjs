// Builds arcade/songs.js from compact song definitions. Run: node tools/make-arcade.mjs
// Melody shorthand: "C4:1" = pitch : length in beats, "r:1" = rest, "|" = bar line. Chords: one root letter per bar ("N" = left hand rests).
// Each song is written once and arranged three ways: easy = tune only, slower; medium = tune + one bass note a bar; hard = tune + moving left hand, full speed.
import { writeFileSync } from 'node:fs';
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
const KING = 'A3:.5 B3:.5 C4:.5 D4:.5 E4:.5 C4:.5 E4:1 | Eb4:.5 B3:.5 Eb4:1 D4:.5 Bb3:.5 D4:1 | A3:.5 B3:.5 C4:.5 D4:.5 E4:.5 C4:.5 E4:.5 A4:.5 | G4:.5 E4:.5 C4:.5 E4:.5 G4:2';
const ENT = 'r:3 D4:.5 Eb4:.5 | E4:.5 C5:1 E4:.5 C5:1 E4:.5 C5:.5 | r:2.5 C5:.5 D5:.5 Eb5:.5 | E5:.5 C5:.5 D5:.5 E5:1 B4:.5 D5:1 | C5:3 D4:.5 Eb4:.5 | E4:.5 C5:1 E4:.5 C5:1 E4:.5 C5:.5 | r:2.5 A4:.5 G4:.5 F#4:.5 | A4:.5 C5:.5 E5:1 D5:.5 C5:.5 A4:1 | D5:3 D4:.5 Eb4:.5 | E4:.5 C5:1 E4:.5 C5:1 E4:.5 C5:.5 | r:2.5 C5:.5 D5:.5 Eb5:.5 | E5:.5 C5:.5 D5:.5 E5:1 B4:.5 D5:1 | C5:4';
const ELISE = 'r:2 E5:.5 D#5:.5 | E5:.5 D#5:.5 E5:.5 B4:.5 D5:.5 C5:.5 | A4:1 r:.5 C4:.5 E4:.5 A4:.5 | B4:1 r:.5 E4:.5 G#4:.5 B4:.5 | C5:1 r:.5 E4:.5 E5:.5 D#5:.5 | E5:.5 D#5:.5 E5:.5 B4:.5 D5:.5 C5:.5 | A4:1 r:.5 C4:.5 E4:.5 A4:.5 | B4:1 r:.5 E4:.5 C5:.5 B4:.5 | A4:3';
const ELISE_L = 'r:3 | r:3 | A2:.5 E3:.5 A3:.5 r:1.5 | E2:.5 E3:.5 G#3:.5 r:1.5 | A2:.5 E3:.5 A3:.5 r:1.5 | r:3 | A2:.5 E3:.5 A3:.5 r:1.5 | E2:.5 E3:.5 G#3:.5 r:1.5 | A2:.5 E3:.5 A3:2';
// Clair de Lune, bars 1 to 8, checked against the Mutopia Project engraving of the 1905 Fromont first edition (public domain) and moved from D flat to C.
// Written in 9/8 with one game beat per eighth note; the duplets are 1.5 beats each. Tied notes are struck again.
const CLAIR = 'r:1 G4:1 G5:4 E5:3 | E5:1 D5:1 E5:1 D5:6 | D5:1 C5:1 D5:1 C5:1.5 E5:3 C5:1.5 | C5:1 B4:1 C5:1 B4:6 | B4:1 A4:1 B4:1 A4:1 D5:1 A4:1 G4:1 A4:1 G4:1 | G4:1 F4:1 G4:1 F4:3 E4:3 | E4:1 E4:1 F4:1 E4:1 A4:1 E4:1 D4:1 E4:1 D4:1 | D4:1 C4:1 D4:1 C4:3 B3:3';
const CLAIR_H = 'r:1 E4+G4:1 E5+G5:4 C5+E5:3 | C5+E5:1 B4+D5:1 C5+E5:1 B4+D5:6 | B4+D5:1 A4+C5:1 B4+D5:1 C5:1.5 E5:3 C5:1.5 | C5:1 G4+B4:1 A4+C5:1 G4+B4:6 | B4:1 A4:1 B4:1 A4:1 D5:1 A4:1 G4:1 A4:1 G4:1 | G4:1 F4:1 G4:1 F4:3 E4:3 | E4:1 E4:1 F4:1 E4:1 A4:1 E4:1 D4:1 E4:1 D4:1 | D4:1 C4:1 D4:1 C4:3 B3:3';
const CLAIR_LM = 'r:1 E3:8 | F3:9 | E3:9 | D3:9 | C3:6 B2:3 | A2:6 G#2:3 | G2:6 F2:3 | E2:6 D2:3';
const CLAIR_LH = 'r:1 E3+G3:8 | F3+Ab3:9 | E3+G3:9 | D3+F3:9 | C3+D3:6 B2+D3:3 | A2+C3:6 G#2+B2:3 | G2+A2:6 F2+A2:3 | E2+G2:6 D2+F2:1.5 G1:1.5';
const songs = [
  { id: 'ode', tier: 0, pos: 'C4', title: 'Ode to Joy', by: 'Beethoven', year: 1824, tempo: 120, blurb: 'The whole tune, nearly all of it by step.', mel: ODE, chords: 'C G C G C G C C G C G G C G C C' },
  { id: 'frere', tier: 0, pos: 'C4', title: 'Frère Jacques', by: 'Traditional, France', year: 1780, tempo: 112, repeat: 2, blurb: 'A round: every two bars the tune repeats itself.', mel: 'C4:1 D4:1 E4:1 C4:1 | C4:1 D4:1 E4:1 C4:1 | E4:1 F4:1 G4:2 | E4:1 F4:1 G4:2 | G4:.5 A4:.5 G4:.5 F4:.5 E4:1 C4:1 | G4:.5 A4:.5 G4:.5 F4:.5 E4:1 C4:1 | C4:1 G3:1 C4:2 | C4:1 G3:1 C4:2', chords: 'C C C C C C C C' },
  { id: 'saints', tier: 0, pos: 'C4', title: 'When the Saints Go Marching In', by: 'Traditional, USA', year: 1896, tempo: 132, blurb: 'New Orleans. Starts after the beat, so count the rest.', mel: 'r:1 C4:1 E4:1 F4:1 | G4:4 | r:1 C4:1 E4:1 F4:1 | G4:4 | r:1 C4:1 E4:1 F4:1 | G4:2 E4:2 | C4:2 E4:2 | D4:4 | r:1 E4:1 E4:1 D4:1 | C4:3 C4:1 | E4:2 G4:2 | G4:1 F4:3 | r:2 E4:1 F4:1 | G4:2 E4:2 | C4:2 D4:2 | C4:4', chords: 'C C C C C C C G C C C F C C G C' },
  { id: 'cancan', tier: 1, title: 'Can-Can', by: 'Offenbach', year: 1858, tempo: 152, repeat: 2, blurb: 'The galop from Orpheus in the Underworld. Runs of half beats.', mel: CAN, chords: 'C C G C C C G C' },
  { id: 'tell', tier: 1, title: 'William Tell: the gallop', by: 'Rossini', year: 1829, tempo: 144, repeat: 2, blurb: 'Ta-ta-TUM, ta-ta-TUM. Repeated notes at speed.', mel: TELL, chords: 'C C C G C C C C' },
  { id: 'king', tier: 1, title: 'In the Hall of the Mountain King', by: 'Grieg', year: 1875, tempo: 132, repeat: 4, blurb: 'Creeping trolls. Two borrowed black keys and no rests.', mel: KING, chords: 'A A A A' },
  { id: 'entertainer', tier: 2, title: 'The Entertainer', by: 'Scott Joplin', year: 1902, tempo: 132, blurb: 'Ragtime: the tune keeps landing between the beats.', mel: ENT, chords: 'N C C G C C F F G C C G C' },
  { id: 'elise', tier: 2, title: 'Für Elise: the theme', by: 'Beethoven', year: 1810, tempo: 126, timeSig: [3, 4], key: 'C', blurb: 'The famous opening, with its real left hand on Hard.', mel: ELISE, chords: 'N N A E A N A E A', left: ELISE_L },
  { id: 'clair', tier: 2, title: 'Clair de Lune: the opening', by: 'Debussy', year: 1905, tempo: 132, timeSig: [9, 8], key: 'C', blurb: 'The first eight bars, moved to C. Nine slow counts to a bar; let it float.', mel: CLAIR, melHard: CLAIR_H, chords: 'C C C C C C C C', leftMed: CLAIR_LM, left: CLAIR_LH }
];
const built = songs.map(build);
writeFileSync('arcade/songs.js', '// Generated by tools/make-arcade.mjs. Do not edit by hand.\nwindow.KOA_ARCADE = ' + JSON.stringify({ songs: built }) + ';\n');
for (const s of built) console.log(s.id.padEnd(12), s.levels.map((l, i) => ['easy', 'medium', 'hard'][i] + ' ' + l.notes.length + ' notes @' + l.tempo).join(' | '), '| fingers', [...new Set(s.levels[2].notes.map(n => n.finger))].sort().join(''));
