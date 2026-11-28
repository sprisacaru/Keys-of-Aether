import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'])
        pg = await b.new_page(viewport={'width':1112,'height':740}); errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)[:300]))
        await pg.goto('file:///home/claude/koa-bundle/index.html'); await pg.click('#btnStart'); await pg.wait_for_selector('#map.on'); await pg.wait_for_timeout(2500); await pg.screenshot(path='/tmp/M0.png')
        await pg.evaluate("() => { const k = window.__koa; ['r1-01-landmarks','r1-02-steps','r1-03-five','r1-04-pulse','r1-05-g-home'].forEach(id => k.save.lessons[id] = {stars:2,best:.8}); k.renderMap(); }"); await pg.wait_for_timeout(3500); await pg.screenshot(path='/tmp/M1.png')
        print('filter', repr(await pg.eval_on_selector('#sceneWrap', 'e => e.style.filter')), errs); await b.close()
asyncio.run(main())
