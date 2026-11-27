import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--autoplay-policy=no-user-gesture-required'])
        pg = await b.new_page(viewport={'width':1112,'height':740}, has_touch=True); errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)[:300]))
        await pg.goto('file:///home/claude/koa-bundle/index.html'); await pg.click('#btnArcade'); await pg.wait_for_selector('#arcade.on')
        BOT = '''async ([id, d, stop, sp]) => { const k = window.__koa; k.startArcade(id, d); const g0 = k.game; g0.spb = g0.spb / sp;
          return await new Promise(r => { const iv = setInterval(() => { const g = k.game; if (!g || (stop && g.beat > stop)) { clearInterval(iv); r(g ? 'paused' : document.getElementById('arHead').textContent+' | '+document.getElementById('arScore').textContent+' | '+document.getElementById('arBody').innerText.split('\\n')[1]); return; }
            for (const n of g.notes) if (!n.state && !n._p && g.beat >= n.start - 0.01) { n._p = 1; k.press(n.pitch, .7, 'midi'); setTimeout(() => k.release(n.pitch), 30); } }, 3); }); }'''
        ids = await pg.evaluate("() => window.__koa.arcade.map(s => s.id)")
        for s in ids:
            row=[]
            for d in [0,1,2]: row.append((await pg.evaluate(BOT, [s, d, 0, 4]))[:46])
            print(s.ljust(12), ' || '.join(row))
        for s,d,stop in [('clair',2,70),('entertainer',2,10),('elise',2,12),('king',2,10),('prel',2,6)]:
            await pg.evaluate(BOT, [s, d, stop, 4]); await pg.evaluate("() => { window.__koa.game.spb = 99; }"); await pg.wait_for_timeout(250); await pg.screenshot(path=f'/tmp/R_{s}.png'); await pg.click('#btnQuit')
        await pg.screenshot(path='/tmp/R_list.png', full_page=True); print('errors', errs); await b.close()
asyncio.run(main())
