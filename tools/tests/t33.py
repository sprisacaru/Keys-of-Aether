import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--autoplay-policy=no-user-gesture-required'])
        pg = await b.new_page(viewport={'width':1112,'height':740}, has_touch=True); errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)[:300]))
        await pg.goto('file:///home/claude/koa-bundle/index.html'); await pg.click('#btnArcade'); await pg.wait_for_selector('#arcade.on'); await pg.screenshot(path='/tmp/E_list.png', full_page=True)
        # expressive bot: right loudness, holds each note for its length (or short), pedals each span (or not)
        BOT = '''async ([id, d, good, stop]) => { const k = window.__koa, V = [.3,.42,.55,.66,.8,.92]; k.startArcade(id, d); const g0 = k.game; g0.spb = g0.spb / 3;
          return await new Promise(r => { const iv = setInterval(() => { const g = k.game; if (!g || (stop && g.beat > stop)) { clearInterval(iv); r(g ? 'paused' : document.getElementById('arHead').textContent+' | '+document.getElementById('arScore').textContent+' | '+document.getElementById('arBody').innerText.replace(/\\n/g,' / ')); return; }
            if (good) for (const s of g.ped) { if (!s._d && g.beat >= s.a - .05) { s._d = 1; k.setPedal(true); } if (s._d && !s._u && g.beat >= s.b) { s._u = 1; k.setPedal(false); } }
            for (const n of g.notes) if (!n.state && !n._p && g.beat >= n.start - 0.01) { n._p = 1; k.press(n.pitch, good ? (n.dyn != null ? V[n.dyn] : .7) : 1, 'midi'); const ms = (good ? n.len * .9 : .05) * g.spb * 1000; setTimeout(() => k.release(n.pitch), Math.max(20, ms)); } }, 3); }); }'''
        print('gym hard, expressive ->', await pg.evaluate(BOT, ['gym', 2, True, 0]))
        print('gym hard, careless   ->', await pg.evaluate(BOT, ['gym', 2, False, 0]))
        print('clair medium, expr   ->', await pg.evaluate(BOT, ['clair', 1, True, 0]))
        print('arab hard, expr      ->', await pg.evaluate(BOT, ['arab', 2, True, 0]))
        print('ode easy (no marks)  ->', await pg.evaluate(BOT, ['ode', 0, True, 0]))
        await pg.evaluate(BOT, ['gym', 2, True, 19]); await pg.evaluate("() => { window.__koa.game.spb = 99; }"); await pg.wait_for_timeout(250); await pg.screenshot(path='/tmp/E_gym.png'); await pg.click('#btnQuit')
        await pg.evaluate(BOT, ['arab', 2, True, 9]); await pg.evaluate("() => { window.__koa.game.spb = 99; }"); await pg.wait_for_timeout(250); await pg.screenshot(path='/tmp/E_arab.png'); await pg.click('#btnQuit'); await pg.evaluate("() => window.__koa.setPedal(false)")
        # journey: holds reported, stars unchanged logic
        await pg.click('#arcBack'); await pg.click('#btnStart'); await pg.wait_for_selector('#map.on')
        r = await pg.evaluate('''async () => { const k = window.__koa; k.openIntro('r1-01-landmarks'); document.getElementById('btnPerform').click(); const g0 = k.game; g0.spb = g0.spb / 3;
          return await new Promise(r => { const iv = setInterval(() => { const g = k.game; if (!g) { clearInterval(iv); r(document.getElementById('resStars').textContent + ' | ' + document.getElementById('resBody').innerText.replace(/\\n/g,' / ')); return; }
            for (const n of g.notes) if (!n.state && !n._p && g.beat >= n.start - 0.01) { n._p = 1; k.press(n.pitch, .7, 'touch'); setTimeout(() => k.release(n.pitch), n.len * .9 * g.spb * 1000); } }, 3); }); }''')
        print('journey stop 1 ->', r, errs); await b.close()
asyncio.run(main())
