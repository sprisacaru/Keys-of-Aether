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
