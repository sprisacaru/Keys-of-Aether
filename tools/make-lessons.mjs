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
    if (p === 'x') out.push({ pitch: 'any', start: t, len: +len, hand, finger: 0, vel });
    else if (p !== 'r') { const ps = p.split('+'), fs = finger.split('+'); ps.forEach((q, i) => out.push({ pitch: midi(q), start: t, len: +len, hand, finger: +fs[i], vel })); }
    t += +len;
  }
  return out;
}
const L = (o, str, left) => ({ region: 1, timeSig: [4, 4], key: 'C', hand: left ? 'both' : 'R', pass: { stars2: 0.7, stars3: 0.9 }, ...o, notes: notes(str).concat(left ? notes(left, 'L', 0.55) : []).sort((a, b) => a.start - b.start) });
const lessons = [
  L({ id: 'r1-01-landmarks', title: 'Two landmarks', tempo: 60, skills: ['reading', 'technique'], introduces: { pitches: ['C4', 'G4'], lengths: [1, 2] },
    technique: { title: 'Sit and shape', feel: 'Sit so your forearms are level with the keys. Let your hand hang, then set it on the keys: the fingers stay curved, like holding a small ball.' },
    theory: [{ staff: { notes: [60] }, q: 'Middle C', a: 'The C nearest the middle of the piano. On the staff it sits on its own short line just below the five lines.' }, { staff: { notes: [67] }, q: 'Treble G', a: 'The second line from the bottom of the treble staff. The curl of the treble clef wraps around it.' }],
    intro: 'Reading starts with landmarks, not memorized letter rhymes. Middle C is thumb (finger 1). Treble G is five keys up, pinky (finger 5).' },
    'C4:1:1 C4:1:1 C4:2:1 | G4:1:5 G4:1:5 G4:2:5 | C4:1:1 G4:1:5 C4:1:1 G4:1:5 | C4:2:1 G4:2:5'),
  L({ id: 'r1-02-steps', title: 'Steps: C D E', tempo: 66, skills: ['reading', 'technique'], introduces: { pitches: ['D4', 'E4'], lengths: [] },
    technique: { title: 'One finger per key', feel: 'Fingers 1, 2, 3 rest on C, D, E. Press with the fingertip and keep the other fingers resting on their keys, not lifted.' },
    theory: [{ staff: { notes: [60, 62, 64] }, q: 'Step', a: 'Moving to the very next note: line to the next space, or space to the next line. On the keys it is the next white key.' }],
    intro: 'A step on the staff is line to space or space to line. Read the direction: up, down, or same.' },
    'C4:1:1 D4:1:2 E4:2:3 | E4:1:3 D4:1:2 C4:2:1 | C4:1:1 D4:1:2 E4:1:3 D4:1:2 | C4:2:1 C4:2:1'),
  L({ id: 'r1-03-five', title: 'Five fingers, C to G', tempo: 69, skills: ['technique', 'reading'], introduces: { pitches: ['F4'], lengths: [] },
    technique: { title: 'Loose wrist', feel: 'Your wrist floats level with your hand. If the forearm tightens, stop, shake the hand out and start slower.' },
    theory: [{ staff: { notes: [60, 64, 67] }, q: 'Skip', a: 'Jumping over one note: line to line, or space to space. On the keys you skip one white key.' }],
    intro: 'All five fingers now, C up to G. Bar 3 uses skips: line to line on the staff.' },
    'C4:1:1 D4:1:2 E4:1:3 F4:1:4 | G4:1:5 F4:1:4 E4:1:3 D4:1:2 | C4:1:1 E4:1:3 G4:1:5 E4:1:3 | C4:2:1 C4:2:1'),
  L({ id: 'r1-04-pulse', title: 'Pulse drill', tempo: 72, skills: ['rhythm'], introduces: { pitches: [], lengths: [] },
    technique: { title: 'Count out loud', feel: 'Say "1, 2, 3, 4" with the click. A long note gets "1-2". Counting aloud feels silly and works.' },
    theory: [{ staff: { notes: [71, 71], lens: [1, 2] }, q: 'Quarter note and half note', a: 'A quarter note lasts one beat (filled notehead). A half note lasts two beats (hollow notehead).' }],
    intro: 'Rhythm only. Tap ANY key in time with the notes. Filled notes last one beat, hollow notes two.' },
    'x:1 x:1 x:1 x:1 | x:2 x:2 | x:1 x:1 x:2 | x:2 x:1 x:1 | x:1 x:2 x:1 | x:2 x:2'),
  L({ id: 'r1-05-g-home', title: 'Same shape, new home: G', tempo: 66, skills: ['technique', 'reading'], introduces: { pitches: ['A4', 'B4', 'C5', 'D5'], lengths: [] },
    technique: { title: 'Move the whole hand', feel: 'Slide your arm so the thumb sits on G. Finger 1 is not "C": finger numbers describe the hand, not the key.' },
    theory: [{ staff: { notes: [67, 69, 71, 72, 74] }, q: 'Five-finger pattern', a: 'Five neighbouring notes under five fingers. The same pattern can start on any key.' }],
    intro: 'The same five-finger shape, with your thumb on Treble G. The staff notes sit higher; read them as steps up from your landmark G.' },
    'G4:1:1 A4:1:2 B4:1:3 C5:1:4 | D5:1:5 C5:1:4 B4:1:3 A4:1:2 | G4:1:1 B4:1:3 D5:1:5 B4:1:3 | G4:2:1 G4:2:1'),
  L({ id: 'r1-06-f-home', title: 'New home: F + black key', key: 'F', tempo: 66, skills: ['technique', 'theory'], introduces: { pitches: ['Bb4'], lengths: [] },
    technique: { title: 'Reach in for black keys', feel: 'Finger 4 plays the black key. Move your hand slightly toward the back of the keys instead of twisting the wrist.' },
    theory: [{ staff: { notes: [69, 70], key: 'F' }, q: 'Flat (♭)', a: 'A flat lowers a note to the very next key on the left. B-flat is the black key just left of B.' }],
    intro: 'Thumb on F. To keep the same sound-shape, finger 4 plays B-flat, the black key in the group of three. Your first black key.' },
    'F4:1:1 G4:1:2 A4:1:3 Bb4:1:4 | C5:1:5 Bb4:1:4 A4:1:3 G4:1:2 | F4:1:1 A4:1:3 C5:1:5 A4:1:3 | F4:2:1 F4:2:1'),
  L({ id: 'r1-07-boss-ode', title: 'BOSS · Ode to Joy', boss: true, tempo: 76, skills: ['technique', 'reading', 'rhythm'], introduces: { pitches: [], lengths: [] },
    technique: { title: 'Breathe and look ahead', feel: 'Keep your eyes one note ahead on the staff. If your hand tenses, drop the shoulders and exhale.' },
    theory: [{ q: 'Phrase', a: 'A musical sentence. Ode to Joy has two four-bar phrases: a question that ends on D, and an answer that ends on C.' }],
    intro: 'Beethoven, 1824. Hand in C position, starting on finger 3 (E). Two phrases; the second one lands home on C.' },
    'E4:1:3 E4:1:3 F4:1:4 G4:1:5 | G4:1:5 F4:1:4 E4:1:3 D4:1:2 | C4:1:1 C4:1:1 D4:1:2 E4:1:3 | E4:1:3 D4:1:2 D4:2:2 | E4:1:3 E4:1:3 F4:1:4 G4:1:5 | G4:1:5 F4:1:4 E4:1:3 D4:1:2 | C4:1:1 C4:1:1 D4:1:2 E4:1:3 | D4:1:2 C4:1:1 C4:2:1'),
  L({ id: 'r1-08-heroic-ode', title: 'HEROIC · Ode to Joy, two hands', heroic: true, tempo: 66, skills: ['technique', 'reading', 'rhythm'], introduces: { pitches: ['C3', 'G3'], lengths: [4] },
    technique: { title: 'Two hands, one pulse', feel: 'Left pinky (5) on the C below Middle C, left thumb (1) on G. The left hand holds long notes while the right hand moves. Run Practice with each hand before both.' },
    theory: [{ staff: { notes: [72], lens: [4] }, q: 'Whole note', a: 'Lasts four beats, a whole bar in 4/4. An open notehead with no stem.' }, { staff: { clef: 'bass', notes: [48, 55] }, q: 'Bass clef', a: 'The lower staff, for the left hand. Its two dots sit around the F line. The C you play here is the second space from the bottom.' }],
    intro: 'A real challenge, early: the boss tune again, with your left hand holding one long bass note per bar. C under the home bars, G under the bars that lean away.' },
    'E4:1:3 E4:1:3 F4:1:4 G4:1:5 | G4:1:5 F4:1:4 E4:1:3 D4:1:2 | C4:1:1 C4:1:1 D4:1:2 E4:1:3 | E4:1:3 D4:1:2 D4:2:2 | E4:1:3 E4:1:3 F4:1:4 G4:1:5 | G4:1:5 F4:1:4 E4:1:3 D4:1:2 | C4:1:1 C4:1:1 D4:1:2 E4:1:3 | D4:1:2 C4:1:1 C4:2:1',
    'C3:4:5 | G3:4:1 | C3:4:5 | G3:4:1 | C3:4:5 | G3:4:1 | C3:4:5 | G3:2:1 C3:2:5'),
  L({ id: 'r1-09-elise-rh', title: 'SONG · Für Elise, right hand', quest: true, advanced: true, timeSig: [3, 4], tempo: 58, skills: ['technique', 'reading'], introduces: { pitches: ['E5', 'D#5', 'G#4'], lengths: [0.5, 3] },
    technique: { title: 'Rock, do not reach', feel: 'The opening rocks between fingers 5 and 4 on E and D sharp. Keep the hand loose and let it shift for the low notes instead of stretching. Fingerings here change position, so follow the numbers.' },
    theory: [{ staff: { notes: [76, 75, 76] }, q: 'Sharp (♯)', a: 'A sharp raises a note to the very next key on the right. D sharp is the black key just right of D. The famous opening simply rocks a half step: E, D sharp, E.' }, { staff: { notes: [69, 68, 69] }, q: 'A minor, and why there is a G sharp', a: 'This piece uses the white keys but treats A as home, not C. That is A minor, the darker twin of C major. The G sharp is borrowed: being only a half step below A, it pulls the ear back home.' }, { staff: { notes: [71, 71], lens: [0.5, 1] }, q: 'Eighth note', a: 'Half a beat: two to every click. It has a flag on its stem. Beethoven wrote this piece in 3/8 with even quicker-looking notes; here it is spelled in 3/4, which sounds the same and is easier to read.' }],
    intro: 'Beethoven, around 1810. Three beats in a bar. The tune starts on the last beat of an empty bar, then the famous rocking figure falls down to A.' },
    'r:2 E5:.5:5 D#5:.5:4 | E5:.5:5 D#5:.5:4 E5:.5:5 B4:.5:2 D5:.5:4 C5:.5:3 | A4:1:1 r:.5 C4:.5:1 E4:.5:2 A4:.5:4 | B4:1:5 r:.5 E4:.5:1 G#4:.5:2 B4:.5:4 | C5:1:5 r:.5 E4:.5:1 E5:.5:5 D#5:.5:4 | E5:.5:5 D#5:.5:4 E5:.5:5 B4:.5:2 D5:.5:4 C5:.5:3 | A4:1:1 r:.5 C4:.5:1 E4:.5:2 A4:.5:4 | B4:1:5 r:.5 E4:.5:1 C5:.5:4 B4:.5:3 | A4:3:2'),
  L({ id: 'r1-10-elise-both', title: 'SONG · Für Elise, two hands', quest: true, advanced: true, timeSig: [3, 4], tempo: 50, skills: ['technique', 'reading', 'rhythm'], introduces: { pitches: ['A2', 'E3', 'A3', 'E2', 'G#3'], lengths: [] },
    technique: { title: 'Hand to hand', feel: 'The left hand rolls three notes upward and hands the line to the right hand, like passing a ball. In the E bar the left second finger crosses over the thumb for G sharp. Learn the left hand alone in Practice first.' },
    theory: [{ staff: { clef: 'bass', notes: [45, 52, 57] }, q: 'Broken chord', a: 'A chord played one note at a time. A, E, A outlines A minor, home. E, E, G sharp outlines E major, the chord that most wants to return to A. The whole opening is just home, away, home.' }],
    intro: 'Both hands. The left hand only plays when the right hand lands, rolling a broken chord up to meet it. Slow is fine: the beat waits for nobody in Perform, so use Practice until the hand-offs feel easy.' },
    'r:2 E5:.5:5 D#5:.5:4 | E5:.5:5 D#5:.5:4 E5:.5:5 B4:.5:2 D5:.5:4 C5:.5:3 | A4:1:1 r:.5 C4:.5:1 E4:.5:2 A4:.5:4 | B4:1:5 r:.5 E4:.5:1 G#4:.5:2 B4:.5:4 | C5:1:5 r:.5 E4:.5:1 E5:.5:5 D#5:.5:4 | E5:.5:5 D#5:.5:4 E5:.5:5 B4:.5:2 D5:.5:4 C5:.5:3 | A4:1:1 r:.5 C4:.5:1 E4:.5:2 A4:.5:4 | B4:1:5 r:.5 E4:.5:1 C5:.5:4 B4:.5:3 | A4:3:2',
    'r:3 | r:3 | A2:.5:5 E3:.5:2 A3:.5:1 r:1.5 | E2:.5:5 E3:.5:1 G#3:.5:2 r:1.5 | A2:.5:5 E3:.5:2 A3:.5:1 r:1.5 | r:3 | A2:.5:5 E3:.5:2 A3:.5:1 r:1.5 | E2:.5:5 E3:.5:1 G#3:.5:2 r:1.5 | A2:.5:5 E3:.5:2 A3:2:1'),
];
for (const l of lessons) writeFileSync(`lessons/${l.id}.json`, JSON.stringify(l, null, 1));
writeFileSync('lessons/index.json', JSON.stringify({ version: 1, regions: [{ id: 1, name: 'Middle C Village', lessons: lessons.map(l => l.id) }] }, null, 1));
console.log('wrote', lessons.length, 'lessons');
