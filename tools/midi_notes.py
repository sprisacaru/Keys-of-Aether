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

def load_pedal(path):
    """Sustain-pedal spans [down, up] in quarter notes (controller 64), if the file has any."""
    m = mido.MidiFile(path); out = []
    for t in m.tracks:
        now = 0; down = None
        for x in t:
            now += x.time
            if x.type == 'control_change' and x.control == 64:
                if x.value >= 64 and down is None: down = now
                elif x.value < 64 and down is not None: out.append([down / m.ticks_per_beat, now / m.ticks_per_beat]); down = None
    out.sort(); return out
def load_vel(path):
    """Like load(), with the written loudness (0..1) as a fifth field."""
    m = mido.MidiFile(path); out = []
    staves = [t for t in m.tracks if any(x.type == 'note_on' for x in t)]
    for ti, t in enumerate(staves):
        hand = 'R' if ti == 0 else 'L'; now = 0; on = {}
        for x in t:
            now += x.time
            if x.type == 'note_on' and x.velocity > 0: on.setdefault(x.note, []).append((now, x.velocity))
            elif x.type in ('note_off', 'note_on') and on.get(x.note):
                s, v = on[x.note].pop(0); out.append([s / m.ticks_per_beat, (now - s) / m.ticks_per_beat, x.note, hand, v / 127])
    out.sort(key=lambda n: (n[0], n[2])); return out
