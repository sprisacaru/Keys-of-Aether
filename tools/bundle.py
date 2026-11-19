# Builds a single-file version with lessons embedded. Run: python3 tools/bundle.py OUT.html
import json, sys
s = open('index.html').read()
idx = json.load(open('lessons/index.json'))
ls = {i: json.load(open(f'lessons/{i}.json')) for r in idx['regions'] for i in r['lessons']}
marker = "<script>\n(() => {\n  'use strict';"
assert marker in s
open(sys.argv[1], 'w').write(s.replace(marker, "<script>window.KOA_BUNDLE=" + json.dumps({'index': idx, 'lessons': ls}) + ";</script>\n" + marker, 1))
