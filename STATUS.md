# Keys of Aether: where we are (22 Nov 2026)

Plan: the "Master plan" tab of the Keys of Aether doc (eight regions, ten theory units, song roadmap).

## Built and live (main branch, GitHub Pages)
- Region 1, Middle C Village: 7 stops, boss (Ode to Joy), Heroic two-hand stop, 2 Für Elise song quests
- 4 theory shrines: sound, black and white keys, pulse, why notes blend
- 3D synthwave path (flat-map fallback), neon highway with staff, 88-key finder, staff pictures
- Inputs: USB-MIDI (via MIDIWeb Browser on iOS), microphone (single notes, Safari), touch
- Practice / Perform / Listen, Fast and Staff-only challenge runs, free play, drum beat
- Progress: one star (Practice or Perform) opens the next stop. Save is in the browser (localStorage key koa_save_v1), with manual backup text

## Drafted, not released
- drafts/shrines-unit1.js: "Why letters, why C" and "Why 7 white, 5 black" (needs circle-of-fifths picture, keep-highlight demos, two-octave shrine keyboard)

## Next, in order
1. Cloud save: sync the save to a private GitHub repo with a personal access token (owner creates repo + token)
2. Region 1 engine work: shrines as data files, the Forge, rune review, first Trial, hold-length judging
3. Release the two drafted shrines
4. Add-to-Home-Screen polish: app icon, offline loading
5. Region 2, Bass Boulevard, when Ode to Joy is beaten
6. Song import (MusicXML/MIDI, stored privately) with region 4; All of Me comes then

## Untested on real hardware
- USB-MIDI with the Alesis through MIDIWeb (cable and adapter not yet in hand)
- Perform mode with the microphone (tested with simulated delay only)

## Tools
- node tools/make-lessons.mjs, node tools/check-lessons.mjs, python3 tools/bundle.py OUT.html (single-file build for the Claude page)
