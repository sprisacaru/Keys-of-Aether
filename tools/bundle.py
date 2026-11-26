# Builds a single-file version with lessons embedded. Run: python3 tools/bundle.py OUT.html
import json, sys
s = open('index.html').read()
idx = json.load(open('lessons/index.json'))
ls = {i: json.load(open(f'lessons/{i}.json')) for r in idx['regions'] for i in r['lessons']}
marker = "<script>\n(() => {\n  'use strict';"
assert marker in s
three = open('vendor/three.min.js').read()
tag = '<script src="vendor/three.min.js"></script>\n'
assert tag in s
s = s.replace(tag, '<script>' + three.replace('</script', '<\\/script') + '</script>\n', 1)
tagL = '<script src="learn/r1.js"></script>\n'
assert tagL in s
s = s.replace(tagL, '<script>' + open('learn/r1.js').read().replace('</script', '<\\/script') + '</script>\n', 1)
tagA = '<script src="arcade/songs.js"></script>\n'
assert tagA in s
s = s.replace(tagA, '<script>' + open('arcade/songs.js').read().replace('</script', '<\\/script') + '</script>\n', 1)
tag2 = '<script src="vendor/three-post.js"></script>\n'
assert tag2 in s
s = s.replace(tag2, '<script>' + open('vendor/three-post.js').read().replace('</script', '<\\/script') + '</script>\n', 1)
open(sys.argv[1], 'w').write(s.replace(marker, "<script>window.KOA_BUNDLE=" + json.dumps({'index': idx, 'lessons': ls}) + ";</script>\n" + marker, 1))
