// Builds lessons/*.json from compact shorthand. Run: node tools/make-lessons.mjs
// Note shorthand: "C4:1:1" = pitch : length in beats : finger. "x:1" = any key (rhythm drill). "r:1" = rest.
import { writeFileSync } from 'node:fs';
const PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const midi = n => { const m = /^([A-G])(#|b)?(\d)$/.exec(n); if (!m) throw new Error('bad pitch ' + n); return PC[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0) + 12 * (+m[3] + 1); };
function notes(str, hand = 'R', vel = 0.7) {
  let t = 0; const out = [];
  for (const tok of str.trim().split(/\s+/)) {
    if (tok === '|') continue;
    const [p, len, finger] = tok.split(':');
    if (p !== 'r') out.push(p === 'x' ? { pitch: 'any', start: t, len: +len, hand, finger: 0, vel } : { pitch: midi(p), start: t, len: +len, hand, finger: +finger, vel });
    t += +len;
  }
  return out;
}
const L = (o, str) => ({ region: 1, timeSig: [4, 4], key: 'C', hand: 'R', pass: { stars2: 0.7, stars3: 0.9 }, ...o, notes: notes(str) });
const lessons = [
  L({ id: 'r1-01-landmarks', title: 'Two landmarks', tempo: 60, skills: ['reading', 'technique'], introduces: { pitches: ['C4', 'G4'], lengths: [1, 2] },
    technique: { title: 'Sit and shape', feel: 'Sit so your forearms are level with the keys. Let your hand hang, then set it on the keys: the fingers stay curved, like holding a small ball.' },
    theory: [{ q: 'Middle C', a: 'The C nearest the middle of the piano. On the staff it sits on its own short line just below the five lines.' }, { q: 'Treble G', a: 'The second line from the bottom of the treble staff. The curl of the treble clef wraps around it.' }],
    intro: 'Reading starts with landmarks, not memorized letter rhymes. Middle C is thumb (finger 1). Treble G is five keys up, pinky (finger 5).' },
    'C4:1:1 C4:1:1 C4:2:1 | G4:1:5 G4:1:5 G4:2:5 | C4:1:1 G4:1:5 C4:1:1 G4:1:5 | C4:2:1 G4:2:5'),
  L({ id: 'r1-02-steps', title: 'Steps: C D E', tempo: 66, skills: ['reading', 'technique'], introduces: { pitches: ['D4', 'E4'], lengths: [] },
    technique: { title: 'One finger per key', feel: 'Fingers 1, 2, 3 rest on C, D, E. Press with the fingertip and keep the other fingers resting on their keys, not lifted.' },
    theory: [{ q: 'Step', a: 'Moving to the very next note: line to the next space, or space to the next line. On the keys it is the next white key.' }],
    intro: 'A step on the staff is line to space or space to line. Read the direction: up, down, or same.' },
    'C4:1:1 D4:1:2 E4:2:3 | E4:1:3 D4:1:2 C4:2:1 | C4:1:1 D4:1:2 E4:1:3 D4:1:2 | C4:2:1 C4:2:1'),
  L({ id: 'r1-03-five', title: 'Five fingers, C to G', tempo: 69, skills: ['technique', 'reading'], introduces: { pitches: ['F4'], lengths: [] },
    technique: { title: 'Loose wrist', feel: 'Your wrist floats level with your hand. If the forearm tightens, stop, shake the hand out and start slower.' },
    theory: [{ q: 'Skip', a: 'Jumping over one note: line to line, or space to space. On the keys you skip one white key.' }],
    intro: 'All five fingers now, C up to G. Bar 3 uses skips: line to line on the staff.' },
    'C4:1:1 D4:1:2 E4:1:3 F4:1:4 | G4:1:5 F4:1:4 E4:1:3 D4:1:2 | C4:1:1 E4:1:3 G4:1:5 E4:1:3 | C4:2:1 C4:2:1'),
  L({ id: 'r1-04-pulse', title: 'Pulse drill', tempo: 72, skills: ['rhythm'], introduces: { pitches: [], lengths: [] },
    technique: { title: 'Count out loud', feel: 'Say "1, 2, 3, 4" with the click. A long note gets "1-2". Counting aloud feels silly and works.' },
    theory: [{ q: 'Quarter note and half note', a: 'A quarter note lasts one beat (filled notehead). A half note lasts two beats (hollow notehead).' }],
    intro: 'Rhythm only. Tap ANY key in time with the notes. Filled notes last one beat, hollow notes two.' },
    'x:1 x:1 x:1 x:1 | x:2 x:2 | x:1 x:1 x:2 | x:2 x:1 x:1 | x:1 x:2 x:1 | x:2 x:2'),
  L({ id: 'r1-05-g-home', title: 'Same shape, new home: G', tempo: 66, skills: ['technique', 'reading'], introduces: { pitches: ['A4', 'B4', 'C5', 'D5'], lengths: [] },
    technique: { title: 'Move the whole hand', feel: 'Slide your arm so the thumb sits on G. Finger 1 is not "C": finger numbers describe the hand, not the key.' },
    theory: [{ q: 'Five-finger pattern', a: 'Five neighbouring notes under five fingers. The same pattern can start on any key.' }],
    intro: 'The same five-finger shape, with your thumb on Treble G. The staff notes sit higher; read them as steps up from your landmark G.' },
    'G4:1:1 A4:1:2 B4:1:3 C5:1:4 | D5:1:5 C5:1:4 B4:1:3 A4:1:2 | G4:1:1 B4:1:3 D5:1:5 B4:1:3 | G4:2:1 G4:2:1'),
  L({ id: 'r1-06-f-home', title: 'New home: F, and a black key', key: 'F', tempo: 66, skills: ['technique', 'theory'], introduces: { pitches: ['Bb4'], lengths: [] },
    technique: { title: 'Reach in for black keys', feel: 'Finger 4 plays the black key. Move your hand slightly toward the back of the keys instead of twisting the wrist.' },
    theory: [{ q: 'Flat (♭)', a: 'A flat lowers a note to the very next key on the left. B-flat is the black key just left of B.' }],
    intro: 'Thumb on F. To keep the same sound-shape, finger 4 plays B-flat, the black key in the group of three. Your first black key.' },
    'F4:1:1 G4:1:2 A4:1:3 Bb4:1:4 | C5:1:5 Bb4:1:4 A4:1:3 G4:1:2 | F4:1:1 A4:1:3 C5:1:5 A4:1:3 | F4:2:1 F4:2:1'),
  L({ id: 'r1-07-boss-ode', title: 'BOSS · Ode to Joy', boss: true, tempo: 76, skills: ['technique', 'reading', 'rhythm'], introduces: { pitches: [], lengths: [] },
    technique: { title: 'Breathe and look ahead', feel: 'Keep your eyes one note ahead on the staff. If your hand tenses, drop the shoulders and exhale.' },
    theory: [{ q: 'Phrase', a: 'A musical sentence. Ode to Joy has two four-bar phrases: a question that ends on D, and an answer that ends on C.' }],
    intro: 'Beethoven, 1824. Hand in C position, starting on finger 3 (E). Two phrases; the second one lands home on C.' },
    'E4:1:3 E4:1:3 F4:1:4 G4:1:5 | G4:1:5 F4:1:4 E4:1:3 D4:1:2 | C4:1:1 C4:1:1 D4:1:2 E4:1:3 | E4:1:3 D4:1:2 D4:2:2 | E4:1:3 E4:1:3 F4:1:4 G4:1:5 | G4:1:5 F4:1:4 E4:1:3 D4:1:2 | C4:1:1 C4:1:1 D4:1:2 E4:1:3 | D4:1:2 C4:1:1 C4:2:1'),
];
for (const l of lessons) writeFileSync(`lessons/${l.id}.json`, JSON.stringify(l, null, 1));
writeFileSync('lessons/index.json', JSON.stringify({ version: 1, regions: [{ id: 1, name: 'Middle C Village', lessons: lessons.map(l => l.id) }] }, null, 1));
console.log('wrote', lessons.length, 'lessons');
