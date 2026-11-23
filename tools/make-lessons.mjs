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
const L = (o, str, left) => ({ region: 1, timeSig: [4, 4], key: 'C', hand: left ? 'both' : 'R', pass: { stars2: 0.7, stars3: 0.9 }, ...o, notes: (o.hand === 'L' ? notes(str, 'L') : notes(str)).concat(left ? notes(left, 'L', 0.55) : []).sort((a, b) => a.start - b.start), ...(o.hand === 'L' ? { hand: 'L' } : {}) });
const lessons = [
  L({ id: 'r1-01-landmarks', title: 'Landmarks, and the notes between', tempo: 76, skills: ['reading', 'technique'], introduces: { pitches: ['C4', 'G4', 'D4', 'E4', 'F4'], lengths: [1, 2] },
    technique: { title: 'Sit and shape', feel: 'Sit so your forearms are level with the keys. Let your hand hang, then set it on the keys with one finger per white key from C to G: the fingers stay curved, like holding a small ball.' },
    theory: [{ staff: { notes: [60] }, q: 'Middle C', a: 'The C nearest the middle of the piano. On the staff it sits on its own short line just below the five lines.' }, { staff: { notes: [67] }, q: 'Treble G', a: 'The second line from the bottom of the treble staff. The curl of the treble clef wraps around it: the clef is an old letter G.' }, { staff: { notes: [60, 62, 64, 65, 67] }, q: 'Reading from a landmark', a: 'You do not memorise every note. You know two landmarks and read everything else as steps away from them: one step above C, one step below G.' }, { staff: { notes: [71, 71], lens: [1, 2] }, q: 'Quarter and half notes', a: 'A filled notehead lasts one beat. A hollow one lasts two.' }],
    intro: 'Sixteen bars in four lines. Line 1: the two landmarks, Middle C (thumb) and Treble G (pinky). Line 2: step up from C. Line 3: step down from G. Line 4: join them. Keep your eyes on the staff, not your hand.' },
    'C4:1:1 C4:1:1 G4:2:5 | G4:1:5 C4:1:1 G4:2:5 | C4:1:1 G4:1:5 C4:1:1 G4:1:5 | C4:2:1 G4:2:5 | C4:1:1 D4:1:2 C4:2:1 | C4:1:1 D4:1:2 E4:2:3 | E4:1:3 D4:1:2 C4:1:1 D4:1:2 | E4:2:3 C4:2:1 | G4:1:5 F4:1:4 G4:2:5 | G4:1:5 F4:1:4 E4:2:3 | E4:1:3 F4:1:4 G4:1:5 F4:1:4 | E4:2:3 G4:2:5 | C4:1:1 D4:1:2 E4:1:3 F4:1:4 | G4:2:5 G4:2:5 | G4:1:5 F4:1:4 E4:1:3 D4:1:2 | C4:2:1 C4:2:1'),
  L({ id: 'r1-02-steps', title: 'Steps: C D E', tempo: 80, skills: ['reading', 'technique'], introduces: { pitches: ['D4', 'E4'], lengths: [] },
    technique: { title: 'One finger per key', feel: 'Fingers 1, 2, 3 rest on C, D, E. Press with the fingertip and keep the other fingers resting on their keys, not lifted.' },
    theory: [{ staff: { notes: [60, 62, 64] }, q: 'Step', a: 'On the staff, a step is the move from a line to the very next space, or a space to the very next line. Each line and each space is one letter, so a step is one letter: C to D, D to E. On the keys it is the next white key.' }],
    intro: 'A step on the staff is line to space or space to line. Read the direction of each move: up, down, or same. Do not name every note; follow the shape.' },
    'C4:1:1 D4:1:2 E4:2:3 | E4:1:3 D4:1:2 C4:2:1 | C4:1:1 D4:1:2 E4:1:3 D4:1:2 | C4:2:1 E4:2:3 | E4:1:3 E4:1:3 D4:1:2 D4:1:2 | C4:1:1 D4:1:2 E4:2:3 | D4:1:2 E4:1:3 D4:1:2 C4:1:1 | D4:2:2 C4:2:1'),
  L({ id: 'r1-03-five', title: 'Five fingers, C to G', tempo: 84, skills: ['technique', 'reading'], introduces: { pitches: ['F4'], lengths: [] },
    technique: { title: 'Loose wrist', feel: 'Your wrist floats level with your hand. If the forearm tightens, stop, shake the hand out and start slower.' },
    theory: [{ staff: { notes: [60, 64, 67] }, q: 'Skip', a: 'Jumping over one letter: line to the next line, or space to the next space. On the keys you skip one white key. C to E is a skip; so is E to G.' }],
    intro: 'All five fingers, C up to G, mixing steps and skips. Skips look like line-to-line or space-to-space on the staff.' },
    'C4:1:1 D4:1:2 E4:1:3 F4:1:4 | G4:2:5 E4:2:3 | F4:1:4 E4:1:3 D4:1:2 C4:1:1 | E4:2:3 C4:2:1 | C4:1:1 E4:1:3 G4:1:5 E4:1:3 | F4:1:4 D4:1:2 F4:2:4 | G4:1:5 F4:1:4 E4:1:3 D4:1:2 | C4:2:1 C4:2:1'),
  L({ id: 'r1-04-pulse', title: 'Pulse drill, with half beats', tempo: 76, skills: ['rhythm'], introduces: { pitches: [], lengths: [0.5] },
    technique: { title: 'Count out loud', feel: 'Say "1 and 2 and 3 and 4 and" with the beat. Quarter notes land on the numbers. Eighth notes land on the numbers and the "ands".' },
    theory: [{ staff: { notes: [71, 71, 71], lens: [0.5, 1, 2] }, q: 'Eighth, quarter, half', a: 'An eighth note has a flag and lasts half a beat: two fit in one beat. A quarter lasts one beat, a half note two.' }],
    intro: 'Rhythm only. Tap ANY key in time. This one mixes one-beat notes, two-beat notes and quick half-beat pairs.' },
    'x:1 x:1 x:1 x:1 | x:2 x:2 | x:1 x:.5 x:.5 x:1 x:1 | x:.5 x:.5 x:.5 x:.5 x:2 | x:1 x:1 x:.5 x:.5 x:1 | x:2 x:.5 x:.5 x:1 | x:.5 x:.5 x:1 x:.5 x:.5 x:1 | x:1 x:1 x:2'),
  L({ id: 'r1-05-g-home', title: 'Same shape, new home: G', tempo: 80, skills: ['technique', 'reading'], introduces: { pitches: ['A4', 'B4', 'C5', 'D5'], lengths: [] },
    technique: { title: 'Move the whole hand', feel: 'Slide your arm so the thumb sits on G. Finger 1 is not "C": finger numbers describe the hand, not the key.' },
    theory: [{ staff: { notes: [67, 69, 71, 72, 74] }, q: 'Five-finger pattern', a: 'Five neighbouring notes under five fingers. The same pattern can start on any key.' }],
    intro: 'The same five-finger shape with your thumb on Treble G, now with half-beat notes. Read them as steps up and down from your landmark G.' },
    'G4:1:1 A4:1:2 B4:1:3 C5:1:4 | D5:2:5 B4:2:3 | C5:.5:4 B4:.5:3 A4:1:2 B4:1:3 G4:1:1 | A4:2:2 G4:2:1 | G4:1:1 B4:1:3 D5:1:5 B4:1:3 | C5:.5:4 D5:.5:5 C5:.5:4 B4:.5:3 A4:2:2 | D5:1:5 C5:1:4 B4:1:3 A4:1:2 | G4:2:1 G4:2:1'),
  L({ id: 'r1-06-f-home', title: 'New home: F + black key', key: 'F', tempo: 80, skills: ['technique', 'theory'], introduces: { pitches: ['Bb4'], lengths: [] },
    technique: { title: 'Reach in for black keys', feel: 'Finger 4 plays the black key. Move your hand slightly toward the back of the keys instead of twisting the wrist.' },
    theory: [{ staff: { notes: [69, 70], key: 'F' }, q: 'Flat (♭)', a: 'A flat lowers a note to the very next key on the left. B flat is the black key just left of B. On the staff it sits on the B line with a ♭ sign in front, because black keys have no line or space of their own.' }],
    intro: 'Thumb on F. To keep the same sound-shape as the C and G patterns, finger 4 must play B flat. Your first black key, and your first proof that the white keys alone are not enough.' },
    'F4:1:1 G4:1:2 A4:1:3 Bb4:1:4 | C5:2:5 A4:2:3 | Bb4:.5:4 A4:.5:3 G4:1:2 A4:1:3 F4:1:1 | G4:2:2 F4:2:1 | F4:1:1 A4:1:3 C5:1:5 A4:1:3 | Bb4:.5:4 C5:.5:5 Bb4:.5:4 A4:.5:3 G4:2:2 | C5:1:5 Bb4:1:4 A4:1:3 G4:1:2 | F4:2:1 F4:2:1'),
  L({ id: 'r1-11-left-hand', title: 'The left hand', hand: 'L', tempo: 76, skills: ['technique', 'reading'], introduces: { pitches: ['C3', 'D3', 'E3', 'F3', 'G3'], lengths: [] },
    technique: { title: 'Mirror image', feel: 'Left pinky (5) on the C below Middle C, thumb (1) on G. The finger numbers run the other way: going up the keys, the left hand counts 5, 4, 3, 2, 1.' },
    theory: [{ staff: { clef: 'bass', notes: [48, 50, 52, 53, 55] }, q: 'Bass clef', a: 'The lower staff, for lower notes. Its two dots sit either side of the F line: the clef is an old letter F. The same line-space-line logic applies, but the lines have different letters than in the treble staff, so learn it by its own landmark, F.' }],
    intro: 'Left hand alone, reading the bass staff. Same steps and skips as before; only the landmark changes.' },
    'C3:1:5 D3:1:4 E3:1:3 F3:1:2 | G3:2:1 E3:2:3 | F3:1:2 E3:1:3 D3:1:4 C3:1:5 | E3:2:3 C3:2:5 | C3:1:5 E3:1:3 G3:1:1 E3:1:3 | F3:.5:2 E3:.5:3 D3:1:4 F3:2:2 | G3:1:1 F3:1:2 E3:1:3 D3:1:4 | C3:2:5 C3:2:5'),
  L({ id: 'r1-12-together', title: 'Hands together', tempo: 72, skills: ['technique', 'reading', 'rhythm'], introduces: { pitches: [], lengths: [4] },
    technique: { title: 'Two hands, one pulse', feel: 'The left hand holds one long note per bar while the right hand moves. Land both hands together on beat 1, then let the left hand simply rest on its key.' },
    theory: [{ staff: { notes: [72], lens: [4] }, q: 'Whole note', a: 'Lasts four beats, a whole bar in 4/4. An open notehead with no stem.' }, { q: 'The grand staff', a: 'Treble staff on top for the right hand, bass staff below for the left, read at the same time. Middle C sits on a short line exactly between them: the two staves are one continuous ladder of notes.' }],
    intro: 'Right hand plays a tune in C position. Left hand holds C or G underneath, one whole note per bar. Read both staves as one picture, top to bottom.' },
    'E4:1:3 D4:1:2 C4:2:1 | E4:1:3 F4:1:4 G4:2:5 | G4:.5:5 F4:.5:4 E4:1:3 D4:1:2 E4:1:3 | D4:2:2 D4:2:2 | E4:1:3 D4:1:2 C4:2:1 | E4:1:3 F4:1:4 G4:2:5 | F4:1:4 E4:.5:3 D4:.5:2 E4:1:3 D4:1:2 | C4:4:1',
    'C3:4:5 | C3:4:5 | G3:4:1 | G3:4:1 | C3:4:5 | C3:4:5 | G3:4:1 | C3:4:5'),
  L({ id: 'r1-13-three-homes', title: 'Three homes, one piece', key: 'F', tempo: 84, skills: ['technique', 'reading'], introduces: { pitches: [], lengths: [] },
    technique: { title: 'Shift in the gap', feel: 'After each long note, lift and move the whole arm to the next position: thumb to G, then thumb to F, then back to C. Look ahead at the staff during the long note.' },
    theory: [{ q: 'Position shift', a: 'Real music rarely stays under five fingers. Players move the hand during long notes or rests. The fingering numbers tell you where a new position starts: a sudden finger 1 on a higher note means "move here".' }],
    intro: 'One piece, three hand positions: C, then G, then F with its B flat, then home. The first real test of reading while moving.' },
    'C4:1:1 E4:1:3 G4:2:5 | G4:.5:5 F4:.5:4 E4:.5:3 D4:.5:2 C4:2:1 | G4:1:1 B4:1:3 D5:2:5 | D5:.5:5 C5:.5:4 B4:.5:3 A4:.5:2 G4:2:1 | F4:1:1 A4:1:3 C5:2:5 | C5:.5:5 Bb4:.5:4 A4:.5:3 G4:.5:2 F4:2:1 | C4:1:1 D4:1:2 E4:1:3 G4:1:5 | C4:4:1'),
  L({ id: 'r1-07-boss-ode', title: 'BOSS · Ode to Joy', boss: true, tempo: 92, skills: ['technique', 'reading', 'rhythm'], introduces: { pitches: [], lengths: [1.5] },
    technique: { title: 'Breathe and look ahead', feel: 'Keep your eyes one note ahead on the staff. In the third line the tune dips below your hand: the left thumb takes that one low G.' },
    theory: [{ staff: { notes: [64, 62, 62], lens: [1.5, 0.5, 2] }, q: 'Dotted note', a: 'A dot adds half the note\'s length again. A dotted quarter lasts one and a half beats; the eighth note after it fills the rest of beat two. Count "1, 2-and".' }, { q: 'Form: A A B A', a: 'Sixteen bars in four lines. Line 1 asks a question and ends on D. Line 2 answers and lands on C. Line 3 wanders off. Line 4 brings the answer back. Most tunes you know are built like this.' }],
    intro: 'Beethoven, 1824, the whole tune: sixteen bars with the true dotted rhythm. Right hand in C position, starting on finger 3 (E). One note in line 3 belongs to the left hand.' },
    'E4:1:3 E4:1:3 F4:1:4 G4:1:5 | G4:1:5 F4:1:4 E4:1:3 D4:1:2 | C4:1:1 C4:1:1 D4:1:2 E4:1:3 | E4:1.5:3 D4:.5:2 D4:2:2 | E4:1:3 E4:1:3 F4:1:4 G4:1:5 | G4:1:5 F4:1:4 E4:1:3 D4:1:2 | C4:1:1 C4:1:1 D4:1:2 E4:1:3 | D4:1.5:2 C4:.5:1 C4:2:1 | D4:1:2 D4:1:2 E4:1:3 C4:1:1 | D4:1:2 E4:.5:3 F4:.5:4 E4:1:3 C4:1:1 | D4:1:2 E4:.5:3 F4:.5:4 E4:1:3 D4:1:2 | C4:1:1 D4:1:2 r:2 | E4:1:3 E4:1:3 F4:1:4 G4:1:5 | G4:1:5 F4:1:4 E4:1:3 D4:1:2 | C4:1:1 C4:1:1 D4:1:2 E4:1:3 | D4:1.5:2 C4:.5:1 C4:2:1',
    'r:4 | r:4 | r:4 | r:4 | r:4 | r:4 | r:4 | r:4 | r:4 | r:4 | r:4 | r:2 G3:2:1 | r:4 | r:4 | r:4 | r:4'),
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
