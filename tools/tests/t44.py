import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--autoplay-policy=no-user-gesture-required'])
        pg = await b.new_page(viewport={'width':1112,'height':740}, has_touch=True); errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)[:300]))
        await pg.goto('file:///home/claude/koa-bundle/index.html'); await pg.click('#btnStart'); await pg.wait_for_selector('#map.on')
        print('map filter at start:', await pg.eval_on_selector('#sceneWrap', 'e => e.style.filter'))
        BOT = '''async ([btn, play, shot]) => { const k = window.__koa; if (btn) document.getElementById(btn).click(); 
          return await new Promise(r => { const iv = setInterval(() => { const g = k.game; if (!g) { clearInterval(iv); const a = document.getElementById('arcRes').classList.contains('on'); r(a ? document.getElementById('arHead').textContent + ' | ' + document.getElementById('arBody').textContent.slice(-120) + ' | next:' + document.getElementById('arNext').textContent : document.getElementById('resStars').textContent + ' | ' + document.getElementById('resHead').textContent + ' | ' + document.getElementById('resBody').textContent.slice(0, 90)); return; }
            if (play) for (const n of g.notes) if (!n.state && !n._p && g.beat >= n.start - 0.02) { n._p = 1; const p = n.pitch === 'any' ? 60 : n.pitch; k.press(p, .7, 'midi'); setTimeout(() => k.release(p), 90); } }, 8); }); }'''
        await pg.evaluate("() => window.__koa.openIntro('r1-08-heroic-ode')"); await pg.evaluate("() => document.getElementById('btnPerform').click()")
        await pg.evaluate('''() => new Promise(r => { const k = window.__koa; const iv = setInterval(() => { const g = k.game; for (const n of g.notes) if (!n.state && !n._p && g.beat >= n.start - 0.02) { n._p = 1; k.press(n.pitch, .7, 'midi'); setTimeout(() => k.release(n.pitch), 200); } if (g.beat > 9.4) { clearInterval(iv); r(); } }, 8); })'''); await pg.screenshot(path='/tmp/G1.png'); await pg.click('#btnQuit')
        await pg.evaluate("() => window.__koa.openIntro('r1-07-boss-ode')"); print('boss, no notes ->', await pg.evaluate(BOT, ['btnPerform', False]))
        await pg.evaluate("() => window.__koa.openIntro('r1-07-boss-ode')"); print('boss, all notes ->', await pg.evaluate(BOT, ['btnPerform', True]))
        await pg.click('#btnMap'); await pg.wait_for_timeout(1500); print('toast:', await pg.evaluate("() => (document.getElementById('toast')||{}).textContent"), '| filter mid:', await pg.eval_on_selector('#sceneWrap', 'e => e.style.filter')); await pg.wait_for_timeout(3800); print('filter after:', repr(await pg.eval_on_selector('#sceneWrap', 'e => e.style.filter'))); await pg.screenshot(path='/tmp/G2.png')
        await pg.evaluate("() => window.__koa.openHub('map', 'cards')"); await pg.screenshot(path='/tmp/G3.png'); print('cards:', (await pg.inner_text('#hubBody'))[:80].replace('\n', ' | '), '| heard buttons', await pg.evaluate("() => document.querySelectorAll('[data-heard]').length"))
        await pg.click('[data-heard]'); print('xp after heard', await pg.evaluate("() => window.__koa.save.xp"))
        await pg.evaluate("() => window.__koa.renderArcade()"); await pg.click('[data-set="0"]'); print('set ids', await pg.evaluate("() => JSON.stringify(window.__koa.setRun.ids)"))
        for i in range(4):
            print(' set song', i + 1, '->', (await pg.evaluate(BOT, [None, True]))[:230]); 
            if await pg.evaluate("() => document.getElementById('arNext').style.display === 'none'"): break
            await pg.click('#arNext')
        await pg.evaluate("() => window.__koa.startArcade('ode', 0)"); await pg.evaluate('''() => new Promise(r => { const k = window.__koa; const iv = setInterval(() => { const g = k.game; for (const n of g.notes) if (!n.state && !n._p && g.beat >= n.start - 0.02) { n._p = 1; k.press(n.pitch, .7, 'midi'); setTimeout(() => k.release(n.pitch), 90); } if (g.beat > 30) { clearInterval(iv); r(); } }, 8); })'''); await pg.screenshot(path='/tmp/G4.png'); print('ghost label:', await pg.inner_text('#arcGhost'))
        print('errors', errs); await b.close()
asyncio.run(main())
