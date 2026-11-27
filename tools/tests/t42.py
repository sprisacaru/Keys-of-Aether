import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--autoplay-policy=no-user-gesture-required'])
        pg = await b.new_page(viewport={'width':1112,'height':740}, has_touch=True); errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)[:300]))
        await pg.goto('file:///home/claude/koa-bundle/index.html'); await pg.click('#btnStart'); await pg.wait_for_selector('#map.on'); print('daily:', (await pg.inner_text('#daily'))[:140])
        BOT = '''async ([btn]) => { const k = window.__koa; if (btn) document.getElementById(btn).click();
          return await new Promise(r => { const iv = setInterval(() => { const g = k.game; if (!g) { clearInterval(iv); r('done'); return; }
            for (const n of g.notes) if (!n.state && !n._p && g.beat >= n.start - 0.02) { n._p = 1; const p = n.pitch === 'any' ? 60 : n.pitch; k.press(p, .7, 'midi'); setTimeout(() => k.release(p), 90); } }, 8); }); }'''
        await pg.click('#btnHub'); await pg.wait_for_selector('#hub.on'); await pg.screenshot(path='/tmp/H1.png', full_page=True)
        await pg.click('#hubTabs button[data-tab="gloss"]'); print('gloss:', (await pg.inner_text('#hubBody'))[:90].replace('\n',' | ')); await pg.screenshot(path='/tmp/H3.png')
        await pg.click('#hubTabs button[data-tab="shop"]'); print('wallet', await pg.evaluate("() => window.__koa.wallet()"), '| buy buttons enabled:', await pg.evaluate("() => [...document.querySelectorAll('[data-buy]')].filter(b => !b.disabled).length"))
        await pg.evaluate("() => { const k = window.__koa; k.save.xp = 1300; k.save.shrines['ln-r1-01'] = true; k.save.shrines['feel-r1-01-landmarks'] = true; k.openHub('map', 'shop'); }"); await pg.click('[data-buy="ice"]'); await pg.click('[data-buy="snd-epiano"]'); await pg.wait_for_timeout(400); await pg.screenshot(path='/tmp/H2.png', full_page=True)
        print('after buying: wallet', await pg.evaluate("() => window.__koa.wallet() + ' xp ' + window.__koa.save.xp + ' owned ' + JSON.stringify(window.__koa.save.owned) + ' sound ' + window.__koa.save.sound"))
        await pg.click('#hubTabs button[data-tab="gloss"]'); print('gloss after lesson 1:', (await pg.inner_text('#hubBody'))[:60].replace('\n',' | '))
        await pg.click('#hubBack'); await pg.wait_for_selector('#map.on'); await pg.evaluate("() => window.__koa.openIntro('r1-01-landmarks')"); await pg.evaluate(BOT, ['btnPerform']); await pg.wait_for_timeout(700); await pg.screenshot(path='/tmp/H4.png')
        print('result stars html:', (await pg.inner_html('#resStars'))[:160]); print('filter on canvas:', await pg.eval_on_selector('#cv', 'e => e.style.filter'))
        await pg.evaluate("() => window.__koa.openIntro('r1-01-landmarks')"); print('step bar:', (await pg.inner_text('#inSteps')).replace('\n', ' '))
        await pg.evaluate(BOT, ['btnTake']); await pg.evaluate("() => window.__koa.startArcade('ode', 0)"); await pg.evaluate(BOT, [None]); await pg.wait_for_timeout(2600); await pg.screenshot(path='/tmp/H5.png')
        print('daily state', await pg.evaluate("() => JSON.stringify(window.__koa.dailyGet())"), 'mastery', await pg.evaluate("() => JSON.stringify(window.__koa.mastery('r1-01-landmarks'))"))
        await pg.reload(); await pg.click('#btnStart'); await pg.wait_for_selector('#map.on'); print('after reload: owned', await pg.evaluate("() => JSON.stringify(window.__koa.save.owned) + ' ' + window.__koa.save.sound"), '| daily:', (await pg.inner_text('#daily'))[:60]); print('errors', errs); await b.close()
asyncio.run(main())
