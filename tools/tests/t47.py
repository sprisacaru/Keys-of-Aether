import asyncio, json
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--autoplay-policy=no-user-gesture-required'])
        cx = await b.new_context(viewport={'width':1112,'height':740}, has_touch=True)
        await cx.add_init_script("if (!localStorage.getItem('koa_save_v1')) localStorage.setItem('koa_save_v1', JSON.stringify({xp:50,stats:{},lessons:{},shrines:{},streak:{last:'',count:0},arcade:{xp:300,theme:'neon',songs:{ode:{0:{stars:5,score:9000},1:{stars:4,score:8000},2:{stars:3,score:7000,fc:true}}}}}))")
        pg = await cx.new_page(); errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)[:300]))
        await pg.goto('file:///home/claude/koa-bundle/index.html'); await pg.click('#btnArcade'); await pg.wait_for_selector('#arcade.on'); await pg.screenshot(path='/tmp/L1.png')
        print('migrated ode:', await pg.evaluate("() => JSON.stringify(window.__koa.save.arcade.songs.ode) + ' v' + window.__koa.save.arcade.v"))
        for d in range(4):
            await pg.evaluate(f"() => window.__koa.startArcade('elise', {d})"); await pg.wait_for_timeout(300)
            print(d, await pg.evaluate("() => { const g = window.__koa.game; return document.getElementById('hudTitle').textContent + ' | bpm ' + Math.round(60 / g.spb) + ' | notes ' + g.notes.length + ' | hands ' + [...new Set(g.notes.map(n => n.hand))].join('') }")); await pg.click('#btnQuit')
        BOT = '''async ([btn]) => { const k = window.__koa; if (btn) document.getElementById(btn).click();
          return await new Promise(r => { const iv = setInterval(() => { const g = k.game; if (!g) { clearInterval(iv); r(document.getElementById('arcRes').classList.contains('on') ? document.getElementById('arHead').textContent + ' | next: ' + document.getElementById('arNext').textContent : document.getElementById('resStars').textContent + ' | ' + document.getElementById('resBody').textContent.slice(0, 60)); return; }
            for (const n of g.notes) if (!n.state && !n._p && g.beat >= n.start - 0.02) { n._p = 1; k.press(n.pitch, .7, 'midi'); setTimeout(() => k.release(n.pitch), 90); } }, 8); }); }'''
        await pg.evaluate("() => window.__koa.startArcade('saints', 2)"); print('saints Hard ->', await pg.evaluate(BOT, [None]))
        await pg.evaluate("() => { window.__koa.renderArcade(); document.getElementById('arcToJ').click(); }"); await pg.wait_for_selector('#map.on'); await pg.wait_for_timeout(500)
        await pg.evaluate("() => window.__koa.openIntro('r1-01-landmarks')"); print('play card:', await pg.evaluate("() => document.getElementById('btnSlow').className + ' / ' + document.getElementById('btnPerform').className + ' | ' + document.getElementById('inSlowTip').textContent.slice(0, 40)"))
        print('slow run ->', await pg.evaluate(BOT, ['btnSlow'])); await pg.evaluate("() => window.__koa.openIntro('r1-01-landmarks')")
        print('after slow:', await pg.evaluate("() => document.getElementById('btnSlow').textContent + ' ' + document.getElementById('btnSlow').className + ' / ' + document.getElementById('btnPerform').className + ' | rec ' + JSON.stringify(window.__koa.save.lessons['r1-01-landmarks'])"))
        print('errors', errs); await b.close()
asyncio.run(main())
