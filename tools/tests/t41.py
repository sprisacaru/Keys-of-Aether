import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--autoplay-policy=no-user-gesture-required'])
        pg = await b.new_page(viewport={'width':1112,'height':740}, has_touch=True); errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)[:300]))
        await pg.goto('file:///home/claude/koa-bundle/index.html'); await pg.click('#btnStart'); await pg.wait_for_selector('#map.on'); await pg.screenshot(path='/tmp/N0.png')
        await pg.click('#btnToArc'); await pg.wait_for_selector('#arcade.on'); await pg.screenshot(path='/tmp/N1.png'); await pg.click('#arcToJ'); await pg.wait_for_selector('#map.on'); await pg.click('#btnMenu'); await pg.wait_for_selector('#title.on'); await pg.click('#btnStart'); await pg.wait_for_selector('#map.on'); print('nav ok; free play present:', await pg.query_selector('#btnFree') is not None)
        st = "() => [...document.querySelectorAll('#inSteps button')].map(b => b.textContent.replace(/\\s+/g,' ') + (b.disabled?' [locked]':'') + (b.className.includes('on')?' [showing]':'')).join(' || ') + ' ## visible: ' + ['inLearn','inFeel','inPlay'].filter(i => document.getElementById(i).style.display !== 'none')"
        await pg.evaluate("() => window.__koa.openIntro('r1-01-landmarks')"); print(await pg.evaluate(st)); await pg.screenshot(path='/tmp/N2.png')
        await pg.evaluate("() => { const k = window.__koa; k.save.shrines['ln-r1-01'] = true; k.openIntro('r1-01-landmarks'); }"); print(await pg.evaluate(st))
        await pg.click('#inSteps button[data-step=\"2\"]', force=True); print(' after clicking locked Play:', await pg.evaluate(st))
        await pg.click('#feelPB'); print(await pg.evaluate(st)); await pg.screenshot(path='/tmp/N3.png', full_page=True); await pg.click('#feelNext'); print(await pg.evaluate(st)); await pg.screenshot(path='/tmp/N4.png', full_page=True)
        print('xp', await pg.evaluate("() => window.__koa.save.xp")); print('errors', errs); await b.close()
asyncio.run(main())
