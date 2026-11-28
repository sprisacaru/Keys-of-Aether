# Keys of Aether: where we are (23 Nov 2026)

Plan: the "Master plan" tab of the Keys of Aether doc (eight regions, ten theory units, song roadmap).

## Built and live (main branch, GitHub Pages)
- Region 1, Middle C Village (v2, harder): 9 stops of 8 bars each incl. half beats, left hand, hands together, position shifts; boss = full 16-bar Ode to Joy; Heroic stop; 2 Für Elise song quests
- 7 theory shrines (incl. How the staff works, with read-the-note test questions): sound, letters and why C, black and white keys, pulse, why 7 white and 5 black (circle of fifths), why notes blend
- 3D synthwave path (flat-map fallback), neon highway with staff, 88-key finder, staff pictures
- Inputs: USB-MIDI (via MIDIWeb Browser on iOS), microphone (single notes, Safari), touch
- Practice / Perform / Listen, Fast and Staff-only challenge runs, free play, drum beat
- Progress: one star (Practice or Perform) opens the next stop. Save is in the browser (localStorage key koa_save_v1), with manual backup text and optional cloud save (save.json in the player's private GitHub repo via a fine-grained token; merge = best of both)

## Next, in order
2. Region 1 engine work: shrines as data files, the Forge, rune review, first Trial, hold-length judging
4. Add-to-Home-Screen polish: app icon, offline loading
5. Region 2, Bass Boulevard, when Ode to Joy is beaten
6. Song import (MusicXML/MIDI, stored privately) with region 4; All of Me comes then

## Untested on real hardware
- Cloud save against the real GitHub API (tested against a simulated one)
- USB-MIDI with the Alesis through MIDIWeb (cable and adapter not yet in hand)
- Perform mode with the microphone (tested with simulated delay only)

## Tools
- node tools/make-lessons.mjs, node tools/check-lessons.mjs, python3 tools/bundle.py OUT.html (single-file build for the Claude page)

## 23 Nov, later: more reps
- Stop 1 is now sixteen bars over all five notes C to G (was a short two-note lesson).
- Endless reps: every stop whose hand stays in one position has "∞ Reps" (waits for you / in time). Each round is a new generated sixteen-bar exercise from that lesson's notes, fingering and rhythms. Reps give XP and count rounds (`save.reps`) but never change stars. Not offered on r1-13, r1-09, r1-10 (hand moves).
- Tested in a simulated browser only (200 generated exercises per lesson pass the lesson rules). Not yet tried on the phone.

## 24 Nov: iPad
- Stefan's iPad is an A1701 (iPad Pro 10.5", 2017), currently on iOS 12; can update to iPadOS 17. The 23 Nov old-Safari fixes made the game load there.
- Tablet layouts added: 700px+ wide gets larger type and full-width map; 1000px+ wide gets a side panel with the map filling the rest. Play screen uses a taller staff and keyboard on tall screens. Rules sit at the end of the stylesheet so they win over base rules.
- Agreed direction (not built): each stop becomes Learn (about 10 min of real theory, all in one place) then Play (10 to 15 min). Rune shrines fold into the Learn part.
- 24 Nov, later: finish line set (theory, reading, Für Elise complete, All of Me full = end of region 7; Nuvole Bianche and Kygo are an encore). Master plan doc updated with a "finish line" section.
- New stop format: Part 1 Learn (10 min) then Part 2 Play. Sample built for stop 1: `ln-r1-01` "What is a note?" (10 pages, 4 try-it tasks, 8-question check, pass mark 6 first-try). Lives in SHRINES with `learn: <lesson id>`; engine gained multi-paragraph pages (`t` array), `do` tasks (span / octs / seq), exact-key answers (`midi`), `pass`, fail/retake. Old shrine `sh-sound` is `retired` (hidden from the map; save key kept). Other shrines still on the map until their stops get Learn parts. Learn is recommended, not a gate.
- Awaiting Stefan's verdict on depth/length of the sample before writing lessons 2 to 10.
- 24 Nov, later still: Stefan approved the Learn format and asked for history + deep "why". Lessons 2 (`ln-r1-02`, black keys / stacked fifths / comma / temperament / Halberstadt) and 3 (`ln-r1-03`, letters / Guido / modes / why C) written; shrines `sh-letters` and `sh-seven` retired. New task kind `pcs`. Results screen has "Next stop ▶" to chain stops into a long session. Target per stop: ~15 min Learn + ~15 min Play. Lessons 4 to 10 still to write (4 staff, 5 beat, 6 clefs, 7 major scale, 8 two notes at once, 9 melody and bass, boss: how Ode to Joy is built).
- 24 Nov: stop page simplified to two cards. Part 1 Learn (the lesson, or the old short theory notes where no lesson exists yet). Part 2 Play (idea, Listen/Practice/Perform, foldaway "Where your hands go" = finder + technique + staff, foldaway "More practice" = reps + challenge runs). "Reset progress" on the map (two taps; sets `save.resetAt`, later reset wins in `mergeSaves` so the cloud and other devices reset too; pre-reset save kept in localStorage `koa_save_before_reset`, restorable from Backup save).
- Voice (24 Nov): Stefan wants lessons in an enthusiastic, witty professor voice (he named Rory Sutherland as the flavour): asides, vivid everyday analogies, opinions, delight. Lesson 1 rewritten that way as the sample; lessons 2 and 3 still in the plainer first-draft voice pending his verdict.
- 24 Nov: at Stefan's request there is no waiting mode in the UI any more (Guitar Hero rule: miss it and it is gone). Buttons: Listen first, ▶ Play (in time), Slow run (70% speed, in time, max 1 star), and in-time reps. Wait-mode code and hidden buttons (#btnPractice, #btnRepsW) remain for tests. 40% accuracy = 1 star = next stop opens.
- 24 Nov: wide screens (1000px+): stop page puts Learn and Play side by side at full width; lesson pages put the text on the left and the picture, keys, prompt and Next button on the right so a lesson page fits one iPad screen with no scrolling. Stefan suggested plain stretching instead; side by side was kept because stretching alone leaves the keys below the fold. Revisit if he dislikes it.
- 24 Nov QC (Stefan spotted): wave picture drew the two notes with zero crossings aligned, so peaks did not coincide as the text claims. Now cosine-phased so peaks meet, with dotted gold guide lines at each meeting point (every swing for an octave, every 2nd for a fifth, etc). He likes the two-column iPad lesson layout: keep it.
- 24 Nov QC pass on lessons 1 to 3 (text vs pictures, arithmetic, task key sequences, quiz answers). Fixed: lesson 2 wrongly implied 7 stacked fifths close the loop better than 5 (gaps are ~90 and ~114 cents; 12 leaves ~23) and that 19/31/53 follow from stacking (only 53 does; 19 and 31 are real keyboards built for sweeter thirds); 'five stacked fifths' -> five notes a fifth apart; three stop intros still told the player to use Practice. Not verifiable from here: history dates against sources, iOS 12 rendering, microphone timing.
- 24 Nov: history in lessons 2 and 3 checked against sources (Wikipedia: A440, Pythagorean hammers, Equal temperament, Glarean, Guido, Ut queant laxis, Accidental; Britannica: equal temperament, notation, Ionian mode; Norton History of Western Music ch.2; Rehding on Zhu Zaiyu; Stephen Jones blog and Yamaha on key colours; Carus organ handbook on Halberstadt). Corrections made: Stevin's date softened (1585 or later, unpublished); key colours (both schemes existed; reversed was the 1700s fashion; fixed early 1800s); equal temperament adoption (Germany/France late 1700s, England 1800s). Added sourced details: Praetorius 1619, Doni, May 1939 at the BBC, German printers' h. Not individually verified: Boethius detail, neumes dating, 19/31/53-key instruments, WTC 1722.

## 24 Nov, end of day: region 1 fully built
**Structure**
- Lesson content now lives in `learn/r1.js` (`window.KOA_LEARN`), loaded by a script tag and inlined by `tools/bundle.py`. `index.html` reads it as `SHRINES` (name kept from the old shrine engine). `tools/check-learn.mjs` validates every lesson (fields, answer indexes, keys within the on-screen keyboard 60 to 84, pass mark, banned words, every stop has a lesson). Run it with `tools/check-lessons.mjs` before every push.
- 11 lessons, 107 pages, 91 questions, about 15,100 words. Stop → lesson: 01 note, 02 black keys, 03 letters/C, 04 time, 05 staff (g-home), 06 major scale (f-home), 07 clefs (left-hand), 08 intervals (together), 09 three chords (three-homes), 10 Ode (boss; `also` heroic), 11 Für Elise (elise-rh; `also` elise-both).
- Engine additions: `chords` in demos/sounds, task kind `taps`, `also` (one lesson serving two stops), `shrine.from` (return to the stop you came from).
- All seven old shrines deleted from the code. Old save keys (`sh-*`) are simply ignored.
- Voice: all lessons in the livelier professor voice Stefan asked for.

**History sources checked (24 Nov)**: Guido's coloured lines and four-line staff, five lines by 1300s (Britannica, Catholic Encyclopedia, Haines); Pope John XIX anecdote (Guido's letter, via Chalmers); Franco of Cologne c.1260 to 1280 (Wikipedia, Britannica, ND); C = broken circle (mymusictheory, Wikipedia alla breve); bar lines from 1400s tablature (Britannica); Maelzel/Winkel 1815 and Beethoven's marks (Wikipedia, Cambridge "Measure", PLOS One); Ode: Schiller 1785, premiere 7 May 1824, Umlauf, Unger, anthem 1972/1985 (Wikipedia, EU, WETA); clefs as letters G F C, nine historical positions (Britannica, Wikipedia, Uniarts); Helmholtz 1863 (Wikipedia, Britannica); Rameau 1722 (Wikipedia, Christensen); Für Elise 1810/1867/Nohl/identity unknown (Wikipedia, Henle, Beethoven-Haus).
Not individually sourced: English singers popularising thirds c.1400; Chopin on C major; "almost no other animal keeps a beat"; the early-entry detail in Ode to Joy; Roman inclusive counting as the origin of interval names.

**Tests run**: /tmp scripts (not in repo): every lesson walked end to end at 1112x740 and 390x780 with an old save loaded, every demo and task pressed; reps generator; reset/undo; in-time play, slow run, Next stop. All pass, no page errors. Lesson pages fit one iPad-landscape screen except one page of lesson 4 (39px over).

**Known debt / not done**
- Map still contains the code that drew shrine pedestals (now never used). Wait-mode code and two hidden buttons remain for tests.
- Test scripts live in /tmp only; should be moved into `tools/` as a real test suite.
- Nothing has been verified on iOS 12 Safari, with the microphone, or with a MIDI cable.
- Fonts load from Google Fonts; the game needs internet.
- Adaptive difficulty, Forge, Trial, expression scoring, song import: not built.

## 25 Nov: Arcade, phase 1
Stefan asked for a parallel Guitar-Hero-style mode: no lessons, just songs, scores, levelling. Decisions he made: names "Journey" and "Arcade"; the song ends if the crowd meter empties; Arcade has its own XP (separate from Journey XP); public-domain songs only for now.
- `tools/make-arcade.mjs` → `arcade/songs.js` (`window.KOA_ARCADE`), inlined by `tools/bundle.py`. Each song is written once (melody + one chord root per bar) and arranged three ways: Easy = tune only at 70% tempo; Medium = tune + one bass note a bar at 85%; Hard = tune + root/fifth left hand at full tempo (Für Elise Hard uses its real left hand).
- Setlist: Opening act (Ode to Joy, Frère Jacques, When the Saints); Headliners, 8 stars (Can-Can, William Tell gallop, Hall of the Mountain King); Encore, 20 stars (The Entertainer, Für Elise theme). Tunes were written from memory, not checked against scores: William Tell bars 3 to 4 and The Entertainer's second phrase are the least certain.
- Finger numbers only where certain: right hand on the three Opening-act songs (C position), and the generated left hand (5 on the root, 1 on the fifth). Elsewhere none.
- Engine (index.html, "ARCADE" block): `startArcade(id, d, listen)`, `arcSetup/arcHit/arcMiss/arcFrame/arcFinish`, `renderArcade`. Score 100 perfect / 70 good × streak multiplier (×2 at 10, ×3 at 20, ×4 at 30) × 2 in overdrive. Gold phrases (bars 3, 4 and 7 of every 8) hit cleanly add 25% overdrive; it switches on by itself at a bar line once ≥ 50% and lasts 8 beats per 50%. Crowd meter starts at 60%, +2.5% a hit, −5/7/9% a miss by difficulty (half for a wrong key); empty = fail. Stars from score ÷ perfect-run score: 95/80/60/40%.
- Save: `save.arcade = { xp, songs: { id: { 0|1|2: { stars, score, fc } } }, theme }`, merged in `mergeArc`. Ranks at 0/400/1500/4500/12000 XP. Themes (CSS filter on the play canvas): Neon, Ember (10 stars), Emerald (25), Gold (first full combo). Reset progress clears Arcade too.
- Tested with a bot only: every song × difficulty plays to a full combo, a failing run fails, preview works, Journey is unaffected. Not tested on devices. With the microphone, Medium and Hard will drop left-hand notes; the setlist says so when the mic is on.
- Not built: copyrighted songs and import, manual overdrive trigger, leaderboards, finger numbers for the harder songs.
- 25 Nov, later: Clair de Lune added to the Arcade Encore tier (`clair`): bars 1 to 8, transposed from D flat to C, in 9/8 with one game beat per eighth (duplets = 1.5 beats; ties are re-struck). Unlike the other tunes this one was checked note by note against the Mutopia Project LilyPond source (public domain, from the 1905 Fromont edition; github.com/MutopiaProject/MutopiaProject, ftp/DebussyC/L75). Easy = top voice; Medium = top voice + bass line; Hard = right-hand thirds in bars 1 to 4 + two-note left hand. Generator gained chords in a melody token (`E5+G5:4`), `melHard`, `leftMed`. Bars of nine get a soft click on the three main pulses instead of the drum kit. Staff shows eighths as quarter-note shapes (one beat each) - cosmetic. Full piece is a Journey goal beyond region 7 (noted in the master plan), not scheduled.

## 26 Nov: Arcade made true to the piano
Stefan asked for realism: Hard should be the real thing, Easy a simplification.
- Pipeline: Mutopia Project LilyPond sources (all marked Public Domain; github.com/MutopiaProject/MutopiaProject) → compiled to MIDI with LilyPond (pip package `lilypond`) → `tools/real2arcade.py` (needs `mido`; reads via `tools/midi_notes.py`) → `arcade/real.json` (committed) → merged by `tools/make-arcade.mjs` into `arcade/songs.js`. The .ly and .midi files are not in the repo; to rebuild, download the `src` paths listed in real2arcade.py, compile each with `lilypond -dno-print-pages -dbackend=null`, and run the script on the output folder.
- Real scores (flag `real: true`): L'Arabesque (Burgmüller, complete), Prelude in C BWV 846 (complete), Mountain King (Grieg's piano version, first statement), The Entertainer (intro + first strain, 1902 ed.), Für Elise (whole first section, 1888 Breitkopf; first-ending bars removed so it plays straight through), Gymnopédie No. 1 (first half), Clair de Lune (bars 1 to 26, in D flat). These replace my from-memory versions of king/entertainer/elise/clair (same ids, so saved scores carry over even though the charts changed).
- Levels for real scores: Hard = every note as written, original key, real tempo, hand = staff. Medium = top line of the right hand + lowest left-hand note per pulse, 80% tempo. Easy = top line only, 60% tempo; transposed to an easier key for king (+22), gym (−2), clair (−1); Easy/Medium are shortened for prel, gym (easy) and clair.
- Still arrangements (no piano original): Ode to Joy, Frère Jacques, When the Saints, Can-Can, William Tell. The last two are still from memory.
- Setlist cards are labelled "Real piano score" or "Arrangement", and each difficulty says what it contains.
- x/8 pieces (Für Elise, Clair de Lune) get a soft click on the main pulses instead of drums.
- Limits that remain (engine, not content): hold length, loud/soft and pedal are not scored; rolled chords and grace notes are played as plain notes; no finger numbers on real scores; the on-screen staff shows black keys with an accidental on every note (no key signature) and draws short notes with approximate shapes; "hand = staff", so a passage the composer wrote across staves may be shown for the other hand; the microphone cannot score chords.

## 26 Nov, later: expression (holding, loud/soft, pedal)
Stefan asked for the sustain pedal, loudness and realism, in the Arcade and in the Journey.
- Engine (both modes): `press` records `game.cur = {src, vel}`; `release` calls `game.onRelease`; MIDI controller 64 → `setPedal`. Per game: `live` (keys still down on a hit note), `sus` (released while pedal down), `ped` (pedal spans to judge), `ex` counters. Hold: a note of ≥ 0.45 s counts as held if released at ≥ 70% of its length (pedal down counts as holding). Not judged on microphone hits. Touch: only with MIDI input and only on charts with `dyn`; within ±0.2 of the mark's target velocity (pp .3, p .42, mp .55, mf .66, f .8, ff .92). Pedal: pedal pressed within ±0.75 beat of a span's start; misses only counted once a pedal has been seen this session. None of this changes stars or accuracy in the Journey; it is reported on the results screen ("Expression: held … · touch … · pedal …"). In the Arcade each is a point bonus (30 / 20 / 50 × multiplier).
- Display: one loudness mark per bar under the staff (level of the tune, when it changes); pedal brackets along the bottom of the staff strip with "Ped", green when caught, red when missed; "● PEDAL" indicator once a pedal has been seen.
- Data (tools/real2arcade.py): loudness from the source where it varies (Arabesque, Gymnopédie); opening mark pp for Clair de Lune, Für Elise, Mountain King (`dynAll`); none for Prelude in C and The Entertainer (their sources carry no usable dynamics). Pedal: suggested one-change-per-bar pedalling for Gymnopédie, Clair de Lune, Für Elise (`pedal='bar'`); the sources' own pedal marks did not survive conversion. Journey pieces have no marks yet.
- New Learn lesson 12 "Loud, soft, long, and the pedal" on the Heroic stop (Cristofori 1700 / Maffei 1711 / three surviving pianos / Broadwood's 1783 pedal patent checked against the Met Museum essay, Wikipedia, Britannica and a Chopin Institute paper).
- Tested only with simulated MIDI and pedal events. Needs the cable and a sustain pedal to try for real; velocity thresholds are guesses until then.
- Next for expression: loud/soft and pedal marks written into Journey pieces from region 2; crescendo/diminuendo hairpins; real pedal and dynamic marks parsed from the LilyPond sources; half-pedal.

## 27 Nov: Feel, three-step stops, reading trial, navigation

- Every stop is now three steps, shown one at a time behind a step bar: Learn (+120 XP) unlocks Feel (+20 XP) unlocks Play. A stop already cleared has all three open.
- Feel (`learn/feel-r1.js`, `window.KOA_FEEL`): the opening of the piece played level and played shaped (`feelPhrase`), pick one, the teacher explains; "Record my take" is an unscored run (tier `take`); every Journey run is recorded and can be heard back from the results screen; one real piece to listen to per stop; link to the real score in the Arcade.
- Teacher's line before the piece (Play card) and after it (results).
- Reading trial: button on the map once the boss is cleared. Fresh generated piece, staff only, no finger numbers. Saved as `save.lessons['trial-r1']`. Pass at 65%.
- Arcade cards name the Journey lesson that explains the piece. Difficulty buttons share one style.
- Map has Menu and Arcade buttons; Arcade has Menu and Journey. Free play button removed (the `free` game mode code is still there, unused).
- `tools/check-learn.mjs` also checks the Feel data. Browser tests now live in `tools/tests/` (Playwright + Chrome, run against the bundle).
- Not verified on a device. The shaped performance is rule-based (swell to the phrase peak, softer left hand, slight slowing and a late soft last note).
- Master plan doc rewritten as one document with regions 2 to 7 sketched.

## 27 Nov, later: Backstage, shop, glossary, celebration

- Backstage screen (`#hub`, from the map and the Arcade): player card (level, rank, XP to spend, streak, the four goals as bars, badges, mastery per stop), shop, glossary.
- Shop: spendable XP = Journey XP + Arcade XP minus the price of what is owned (`save.owned`), so level and rank never drop and merging two devices is safe. Sells three highway themes (Ice, Sunset, Noir; applied in Journey and Arcade) and three piano sounds (`SND`, `save.sound`). Song slots (All of Me, Firestone, Nuvole Bianche) are listed but locked until song import exists.
- Glossary (`learn/glossary.js`, `window.KOA_GLOSS`): game terms always shown; music terms unlock when their lesson is passed.
- Daily setlist (`save.daily`): Read, Feel, Arcade; +150 XP for all three. Streak forgives one missed day a week.
- Mastery per stop (derived, not stored): Bronze cleared, Silver three stars, Gold fast + staff only, Crown with Learn and Feel done.
- Badges are derived from the save, not stored.
- Results screens: stars pop in one at a time with a rising chime, confetti on a good result.
- Removed the free-play starter. Still not built from the list: boss with stakes and map recolouring, collectible cards, ghost run, Arcade setlists.

## 27 Nov, evening: Guitar Hero look, boss stakes, map colour, cards, ghost, setlists

- Highway redrawn: dark fretboard with chrome rails, white fret lines per beat (thick at bar lines), round gems with a white centre and a thin sustain tail for long notes, star-shaped gems in gold phrases, ring targets on the strike line for every key the piece uses, flame on each hit, "25 NOTE STREAK!" callouts, highway turns blue with glowing rails in overdrive.
- Boss and heroic stops (normal run only): three lives and a meter (`game.stakes`, `stakeMiss`). Empty meter costs a life; no lives ends the run with no stars. Slow run and challenge runs have no stakes.
- Map starts grey and regains colour as stops are cleared (`mapColour`, CSS filter on `#sceneWrap`); beating the boss restores full colour with a toast, the Ode motif and confetti, once (`save.shrines['colour-r1']`). After that the map plays the motif quietly, at most every two minutes.
- Backstage > Cards: one idea card per lesson passed (the lesson's takeaway), and a listening log (tick a piece for 10 XP, `save.shrines['heard-<stop>']`).
- Arcade ghost: best run's score every 4 beats is stored (`ghost` on the song record, merged with the higher score); HUD shows "vs your best".
- Arcade setlists: "Play a set" picks three unlocked songs; crowd meter carries over; encore if the meter ends at 80% and a fourth song is unlocked; bonus XP for finishing.

## 27 Nov, night: map colours in as you go

- Removed the whole-map grey filter. The 3D map's own lit/dark split now shows: ground grid, path and trees are coloured up to the stop you are on and dark beyond it. Sky and sun brighten with progress. The boss moment (toast, Ode motif, confetti, brief fade-in) is kept.

## 27 Nov, late: black-and-white map with a moving colour edge; Ravel as the summit

- Map: everything ahead of you is greyscale (grid, path, trees, locked stops, neutral fog). Colour is a second layer (grid, path ribbon, tree wireframes) cut off by a clipping plane (`M3.clip`) that follows the traveller in `loop3D`, so the colour edge travels with the walk animation. Sky, sun and mountains are grey with a coloured layer fading in with progress (`prog`, full at the boss).
- Ravel, Une barque sur l'océan: added as "The summit" in the shop (locked) and on the player card. No Mutopia source found; needs a public-domain engraving to become an Arcade score.

## 27 Nov, cleanup pass

- Removed the hidden wait-mode buttons and their handlers, old "rune" wording, and the always-zero Ear stat on the map panel.
- Known leftovers, harmless: internal `wait` and `free` branches in the game engine, and two no-op loops that used to draw shrines on the map.
- Game layer status: built = player card, shop (themes, sounds), glossary, daily setlist, mastery, badges, celebration, boss stakes, map colour, idea cards, listening log, ghost run, setlists, Guitar Hero highway. Not built = needle crowd meter and multiplier dial, composer/instrument story cards, map skins, song slots (need import), adaptive difficulty.

## 28 Nov: slow-then-fast ladder

- Arcade has four rungs per song, built in the game from the existing easy and full charts (`arcLv`): Easy = right hand, slow (the old Easy); Medium = right hand at full tempo; Hard = both hands at 65% tempo; Expert = both hands, full tempo (the old Hard). The old "tune plus bass" middle chart is no longer used.
- Arcade save is version 2 (`arcMig`): old Hard records move to Expert; old Easy and Medium records stay where they were. Merging migrates both sides first.
- Journey Play card leads with "① Slow run (70%)" until it has been passed once (`slow` flag on the lesson record), then "② Full speed" becomes the highlighted button.
- Glossary: Slow practice; Easy, Medium, Hard, Expert.

## 28 Nov: setlists removed

- "Play a set" removed from the Arcade at Stefan's request (buttons, `setStart`, `setAfter`, `setRun`).
