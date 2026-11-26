#!/usr/bin/env python3
"""Turns real piano scores into Arcade songs. Dev tool; needs `pip install mido`.
Input: MIDI files compiled by LilyPond from the Mutopia Project's public-domain engravings (see SOURCES below).
Output: arcade/real.json, which tools/make-arcade.mjs merges into arcade/songs.js.
  Hard   = the score as written: every note, both hands, original key, real tempo.
  Medium = the top line of the right hand + the bass line of the left, at 80% tempo.
  Easy   = the top line alone, at 60% tempo, moved to an easier key where that helps.
Usage: python3 tools/real2arcade.py /path/to/midi/dir"""
import json, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from midi_notes import load

SOURCES = 'github.com/MutopiaProject/MutopiaProject (all marked Public Domain)'
# unit = quarter notes per game beat; bar = game beats per bar; keep = [from, to) ranges in quarter notes, joined end to end.
SONGS = [
  dict(id='arab', midi='arab', tier=1, title="L'Arabesque", by='Burgmüller', year=1852, key='C', unit=1, bar=2, tempo=126, keep=[[0, 66]], pulses=2,
       blurb='Op. 100 no. 2, complete. A real study: fast five-finger runs over left-hand chords.', src='ftp/BurgmullerJFF/O100/25EF-02'),
  dict(id='prel', midi='prel', tier=1, title='Prelude in C', by='J. S. Bach', year=1722, key='C', unit=1, bar=4, tempo=72, keep=[[0, 140]], pulses=2, easyBeats=44, medBeats=76,
       blurb='Well-Tempered Clavier, book 1, complete. One broken-chord pattern, 35 bars, no tune at all.', src='ftp/BachJS/BWV846/wtk1-prelude1'),
  dict(id='king', midi='king', tier=1, title='In the Hall of the Mountain King', by='Grieg', year=1875, key='C', unit=1, bar=4, tempo=112, keep=[[2, 70]], rshift=-0.125, easy=22, pulses=2,
       blurb="Grieg's own piano version, the first statement. It starts in the cellar of the keyboard.", src='ftp/GriegE/O46/Dans_l_antre_du_roi_de_la_montagne'),
  dict(id='entertainer', midi='ent', tier=2, title='The Entertainer', by='Scott Joplin', year=1902, key='C', unit=1, bar=2, tempo=84, keep=[[0, 39.25]], pulses=2,
       blurb='Introduction and first strain from the 1902 edition. Octaves in the right hand, stride in the left.', src='ftp/JoplinS/entertainer'),
  dict(id='elise', midi='elise', tier=2, title='Für Elise', by='Beethoven', year=1810, key='C', unit=.5, bar=3, pickup=1, tempo=126, keep=[[0, 11], [12, 33], [34.5, 35.25]], pulses=1,
       blurb='The whole first section as Beethoven wrote it, from the 1888 Breitkopf edition.', src='ftp/BeethovenLv/WoO59/fur_Elise_WoO59'),
  dict(id='gym', midi='gym', tier=2, title='Gymnopédie No. 1', by='Satie', year=1888, key='C', unit=1, bar=3, tempo=72, keep=[[0, 117]], easy=-2, pulses=1, easyBeats=63,
       blurb='The first half, as written. Slow, bare, and harder to play evenly than it looks.', src='ftp/SatieE/gymnopedie_1'),
  dict(id='clair', midi='clair', tier=2, title='Clair de Lune', by='Debussy', year=1905, key='Db', unit=.5, bar=9, tempo=132, keep=[[0, 117]], easy=-1, pulses=1, easyBeats=72, medBeats=126,
       blurb='The opening section, bars 1 to 26, in D flat as written, from the 1905 first edition.', src='ftp/DebussyC/L75/debussy_Ste_Bergamesq_Clair'),
]

def build(s, d):
    raw = load(os.path.join(d, s['midi'] + '.midi'))
    for n in raw:
        if n[3] == 'R': n[0] += s.get('rshift', 0)
    notes, off = [], 0.0
    for a, b in s['keep']:                      # join the kept ranges end to end
        for st, ln, p, h in raw:
            if a - 1e-6 <= st < b - 1e-6: notes.append([st - a + off, min(ln, b - st), p, h])
        off += b - a
    u, bar, pk = s['unit'], s['bar'], s.get('pickup', 0)
    # game beats; a pickup is padded so that bar lines fall on multiples of `bar`
    pad = (bar - pk) % bar if pk else 0
    ns = [dict(start=round(st / u + pad, 4), len=round(max(ln / u, .05), 4), pitch=p, hand=h) for st, ln, p, h in notes]
    ns.sort(key=lambda n: (n['start'], n['pitch']))
    def tidy(lst, shift=0):
        out = []
        for n in lst:
            b = int(n['start'] // bar); o = dict(pitch=n['pitch'] + shift, start=n['start'], len=n['len'], hand=n['hand'], finger=0, vel=.7 if n['hand'] == 'R' else .5)
            if b % 8 in (2, 3, 6): o['sp'] = (b // 8) * 2 + (1 if b % 8 == 6 else 0)
            out.append(o)
        return out
    R = [n for n in ns if n['hand'] == 'R']; L = [n for n in ns if n['hand'] == 'L']
    top = {}
    for n in R:
        if n['start'] not in top or n['pitch'] > top[n['start']]['pitch']: top[n['start']] = n
    top = [top[k] for k in sorted(top)]
    win = bar / s.get('pulses', 1); bass = {}
    for n in L:                                  # lowest left-hand note in each pulse window
        k = int(n['start'] // win)
        if k not in bass or n['pitch'] < bass[k]['pitch'] or (n['pitch'] == bass[k]['pitch'] and n['start'] < bass[k]['start']): bass[k] = n
    bass = [dict(bass[k]) for k in sorted(bass)]
    for i, n in enumerate(bass): n['len'] = round(min((bass[i + 1]['start'] - n['start']) if i + 1 < len(bass) else win, win * 2), 4)
    tempo = s['tempo']; cap = lambda lst, k: [n for n in lst if n['start'] < s.get(k, 1e9) - 1e-6]
    return dict(id=s['id'], title=s['title'], by=s['by'], year=s['year'], tier=s['tier'], timeSig=[bar, 4 if u == 1 else 8], key=s['key'], blurb=s['blurb'], real=True, src=s['src'],
                levels=[dict(tempo=round(tempo * .6), notes=tidy(cap(top, 'easyBeats'), s.get('easy', 0)), key='C' if s.get('easy') else s['key'], part=bool(s.get('easyBeats'))), dict(tempo=round(tempo * .8), notes=tidy(cap(sorted(top + bass, key=lambda n: (n['start'], n['pitch'])), 'medBeats')), part=bool(s.get('medBeats'))), dict(tempo=tempo, notes=tidy(ns))])

if __name__ == '__main__':
    d = sys.argv[1]; built = [build(s, d) for s in SONGS]
    json.dump(dict(sources=SOURCES, songs=built), open(os.path.join(os.path.dirname(__file__), '..', 'arcade', 'real.json'), 'w'), separators=(',', ':'))
    for b in built: print(b['id'].ljust(12), ' | '.join(f"{nm} {len(l['notes'])} notes @{l['tempo']}" for nm, l in zip(['easy', 'medium', 'hard'], b['levels'])), '| beats', max(n['start'] + n['len'] for n in b['levels'][2]['notes']), '| range', min(n['pitch'] for n in b['levels'][2]['notes']), max(n['pitch'] for n in b['levels'][2]['notes']))
