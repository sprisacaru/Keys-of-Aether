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
