import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--autoplay-policy=no-user-gesture-required'])
        pg = await b.new_page(viewport={'width':390,'height':780}, device_scale_factor=2, has_touch=True); errs=[]; pg.on('pageerror', lambda e: errs.append(str(e.stack)[:300]))
        await pg.goto('file:///home/claude/koa-bundle/index.html'); await pg.click('#btnStart'); await pg.wait_for_selector('#map.on')
        # generated exercises must obey the same rules as authored lessons: bars add up, fingering consistent, only the lesson's notes
        chk = await pg.evaluate('''() => { const k = window.__koa, out = {}; for (const id in k.lessons) { const L = k.lessons[id]; let ok = 0, bad = []; const allowed = new Set(L.notes.map(n => n.pitch)), lens = new Set(L.notes.map(n => n.len));
            for (let t = 0; t < 200; t++) { const R = k.makeReps(L); if (!R) { ok = null; break; } const end = Math.max(...R.notes.map(n => n.start + n.len)); if (end !== 64) bad.push('end ' + end);
              for (const n of R.notes) { if (!allowed.has(n.pitch)) bad.push('pitch'); if (!lens.has(n.len) && n.len !== 2) bad.push('len ' + n.len); if (Math.floor(n.start / 4) !== Math.floor((n.start + n.len - 1e-9) / 4)) bad.push('barline'); if (n.pitch !== 'any' && !(n.finger >= 1 && n.finger <= 5)) bad.push('finger'); }
              for (const hnd of ['R', 'L']) { const ns = R.notes.filter(n => n.hand === hnd); for (let i = 1; i < ns.length; i++) if (ns[i].start < ns[i - 1].start + ns[i - 1].len - 1e-9) bad.push('overlap'); }
              const lastR = R.notes.filter(n => n.hand === (R.notes.some(x => x.hand === 'R') ? 'R' : 'L')).pop(); ok++; }
            out[id] = ok === null ? 'no reps (hand moves position)' : bad.length ? 'BAD ' + [...new Set(bad)].join(',') : 'ok x' + ok; } return out; }''')
        for k,v in chk.items(): print(' ', k, '->', v)
        BOT = '''async (btn) => { const k = window.__koa; document.getElementById(btn).click();
          return await new Promise(r => { const iv = setInterval(() => { const g = k.game; if (!g) { clearInterval(iv); r(document.getElementById('resHead').textContent+' | '+document.getElementById('resBody').textContent.slice(0,70)); return; }
            for (const n of g.notes) if (!n.state && !n._p && g.beat >= n.start - 0.02) { n._p = 1; const p = n.pitch === 'any' ? 60 : n.pitch; k.press(p, .7, 'midi'); setTimeout(() => k.release(p), 90); } }, 8); }); }'''
        await pg.evaluate("() => window.__koa.openIntro('r1-01-landmarks')"); await pg.screenshot(path='/tmp/r0.png', full_page=True)
        print('reps in time ->', await pg.evaluate(BOT, 'btnRepsP')); print('another round ->', await pg.evaluate(BOT, 'btnMore'))
        await pg.evaluate("() => window.__koa.openIntro('r1-12-together')"); print('two-hand reps, waits ->', await pg.evaluate(BOT, 'btnRepsW'))
        await pg.evaluate("() => { const k=window.__koa; k.openIntro('r1-12-together'); document.getElementById('btnRepsP').click(); k.game.mode='listen'; }"); await pg.wait_for_timeout(9000); await pg.screenshot(path='/tmp/r1.png'); await pg.click('#btnQuit')
        print('stars untouched by reps:', await pg.evaluate("() => JSON.stringify(window.__koa.save.lessons)"), '| rounds:', await pg.evaluate("() => window.__koa.save.reps"))
        print('13 has no reps card:', await pg.evaluate("() => { window.__koa.openIntro('r1-13-three-homes'); return document.getElementById('inReps').style.display; }"))
        print('errors', errs); await b.close()
asyncio.run(main())
