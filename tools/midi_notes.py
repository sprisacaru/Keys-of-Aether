# Helper: read a two-staff piano MIDI (as written by LilyPond) into notes [start, length, pitch, hand] measured in quarter notes.
import mido
def load(path):
    m = mido.MidiFile(path); out = []
    staves = [t for t in m.tracks if any(x.type == 'note_on' for x in t)]
    for ti, t in enumerate(staves):
        hand = 'R' if ti == 0 else 'L'; now = 0; on = {}
        for x in t:
            now += x.time
            if x.type == 'note_on' and x.velocity > 0: on.setdefault(x.note, []).append(now)
            elif x.type in ('note_off', 'note_on') and on.get(x.note):
                s = on[x.note].pop(0); out.append([s / m.ticks_per_beat, (now - s) / m.ticks_per_beat, x.note, hand])
    out.sort(key=lambda n: (n[0], n[2])); return out
