import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--autoplay-policy=no-user-gesture-required'])
        pg = await b.new_page(viewport={'width':1112,'height':740}, has_touch=True); errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)[:300]))
        await pg.goto('file:///home/claude/koa-bundle/index.html'); await pg.click('#btnStart'); await pg.wait_for_selector('#map.on')
        BOT = '''async ([btn, skip]) => { const k = window.__koa; document.getElementById(btn).click(); let c = 0;
          return await new Promise(r => { const iv = setInterval(() => { const g = k.game; if (!g) { clearInterval(iv); r(document.getElementById('resStars').textContent+' | '+document.getElementById('resHead').textContent+' | next:'+document.getElementById('btnNextStop').style.display+' | '+document.getElementById('resBody').textContent.slice(0,60)); return; }
            for (const n of g.notes) if (!n.state && !n._p && g.beat >= n.start - 0.02) { n._p = 1; if (skip && (c++ % skip)) continue; const p = n.pitch === 'any' ? 60 : n.pitch; k.press(p, .7, 'midi'); setTimeout(() => k.release(p), 90); } }, 8); }); }'''
        await pg.evaluate("() => window.__koa.openIntro('r1-01-landmarks')"); await pg.screenshot(path='/tmp/P1.png', full_page=True)
        print('play, hitting 1 in 4 ->', await pg.evaluate(BOT, ['btnPerform', 4])); print(' stars', await pg.evaluate("() => JSON.stringify(window.__koa.save.lessons)"))
        await pg.evaluate("() => window.__koa.openIntro('r1-01-landmarks')"); print('slow, all ->', await pg.evaluate(BOT, ['btnSlow', 0])); print(' stars', await pg.evaluate("() => JSON.stringify(window.__koa.save.lessons)"))
        await pg.evaluate("() => window.__koa.openIntro('r1-01-landmarks')"); print('play, all ->', await pg.evaluate(BOT, ['btnPerform', 0])); print(' stars', await pg.evaluate("() => JSON.stringify(window.__koa.save.lessons)"))
        await pg.click('#btnNextStop'); print('next stop ->', await pg.inner_text('#inTitle'), errs); await b.close()
asyncio.run(main())
