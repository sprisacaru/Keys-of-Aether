import asyncio, json
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--autoplay-policy=no-user-gesture-required'])
        for vp in [(1112,740),(390,780)]:
            ctx = await b.new_context(viewport={'width':vp[0],'height':vp[1]}, has_touch=True); pg = await ctx.new_page(); errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)[:300]))
            await pg.goto('file:///home/claude/koa-bundle/index.html'); await pg.screenshot(path=f'/tmp/A_title_{vp[0]}.png'); await pg.click('#btnArcade'); await pg.wait_for_selector('#arcade.on'); await pg.screenshot(path=f'/tmp/A_list0_{vp[0]}.png', full_page=True)
            BOT = '''async ([id, d, skip, speed]) => { const k = window.__koa; k.startArcade(id, d); let c = 0; const g0 = k.game; g0.spb = g0.spb / speed;
              return await new Promise(r => { const iv = setInterval(() => { const g = k.game; if (!g) { clearInterval(iv); r(document.getElementById('arStars').textContent+' '+document.getElementById('arHead').textContent+' | '+document.getElementById('arScore').textContent+' | '+document.getElementById('arBody').innerText.replace(/\\n/g,' / ')); return; }
                for (const n of g.notes) if (!n.state && !n._p && g.beat >= n.start - 0.01) { n._p = 1; if (skip && (c++ % skip) < skip - 1) continue; k.press(n.pitch, .7, 'midi'); setTimeout(() => k.release(n.pitch), 40); } }, 4); }); }'''
            print(vp, 'ode easy, perfect ->', await pg.evaluate(BOT, ['ode',0,0,6]))
            await pg.screenshot(path=f'/tmp/A_res_{vp[0]}.png')
            print(' ode easy, hits 1 in 5 ->', await pg.evaluate(BOT, ['ode',0,5,6]))
            print(' frere easy ->', await pg.evaluate(BOT, ['frere',0,0,6]))
            print(' saints medium ->', await pg.evaluate(BOT, ['saints',1,0,6]))
            if vp[0] > 1000:
                for s in ['cancan','tell','king','entertainer','elise']:
                    for d in [0,1,2]: r = await pg.evaluate(BOT, [s,d,0,5]); print('  ', s, d, '->', r[:60])
            # mid-song screenshot
            await pg.evaluate("() => { window.__koa.startArcade('cancan', 2); }"); 
            await pg.evaluate('''() => new Promise(r => { const k = window.__koa; const iv = setInterval(() => { const g = k.game; if (!g || g.beat > 22) { clearInterval(iv); r(); return; } for (const n of g.notes) if (!n.state && !n._p && g.beat >= n.start - 0.01) { n._p = 1; k.press(n.pitch, .7, 'midi'); setTimeout(() => k.release(n.pitch), 40); } }, 4); })''')
            await pg.screenshot(path=f'/tmp/A_play_{vp[0]}.png'); await pg.click('#btnQuit'); await pg.wait_for_selector('#arcade.on'); await pg.screenshot(path=f'/tmp/A_list1_{vp[0]}.png', full_page=True)
            await pg.evaluate("() => document.querySelector('[data-listen=ode]').click()"); await pg.wait_for_timeout(1500); st = await pg.evaluate("() => [window.__koa.game.mode, document.getElementById('arcHud').style.display]"); await pg.click('#btnQuit')
            print(' listen:', st, '| save:', await pg.evaluate("() => JSON.stringify(window.__koa.save.arcade).slice(0,260)"), '| journey xp', await pg.evaluate("() => window.__koa.save.xp"))
            # journey still fine after arcade: filter cleared
            await pg.click('#arcBack'); await pg.click('#btnStart'); await pg.wait_for_selector('#map.on'); await pg.evaluate("() => { window.__koa.openIntro('r1-01-landmarks'); document.getElementById('btnPerform').click(); }"); await pg.wait_for_timeout(500)
            print(' journey after arcade: filter', repr(await pg.evaluate("() => document.getElementById('cv').style.filter")), 'hud', await pg.evaluate("() => document.getElementById('arcHud').style.display"), 'errors', errs); await ctx.close()
        await b.close()
asyncio.run(main())
