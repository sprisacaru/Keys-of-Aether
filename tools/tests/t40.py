import asyncio, json
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--autoplay-policy=no-user-gesture-required'])
        pg = await b.new_page(viewport={'width':1112,'height':740}, has_touch=True); errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)[:300]))
        await pg.goto('file:///home/claude/koa-bundle/index.html'); await pg.click('#btnStart'); await pg.wait_for_selector('#map.on')
        BOT = '''async ([btn, skip]) => { const k = window.__koa; if (btn) document.getElementById(btn).click(); let c = 0;
          return await new Promise(r => { const iv = setInterval(() => { const g = k.game; if (!g) { clearInterval(iv); r(document.getElementById('resStars').textContent+' | '+document.getElementById('resHead').textContent+' | hear:'+document.getElementById('btnHear').style.display+' | coach:'+document.getElementById('resCoach').textContent.slice(0,50)+' | '+document.getElementById('resBody').textContent.slice(0,70)); return; }
            for (const n of g.notes) if (!n.state && !n._p && g.beat >= n.start - 0.02) { n._p = 1; if (skip && (c++ % skip)) continue; const p = n.pitch === 'any' ? 60 : n.pitch; k.press(p, .7, 'midi'); setTimeout(() => k.release(p), 90); } }, 8); }); }'''
        # every stop: feel phrases sane
        print(await pg.evaluate('''() => { const k = window.__koa, out = []; for (const id of Object.keys(k.lessons)) { const L = k.lessons[id]; const a = k.feelPhrase(L, false), s = k.feelPhrase(L, true); const bad = s.filter(e => !(e.vel > .15 && e.vel < .95) || !(e.dur > 0) || !(e.at >= 0) || typeof e.m !== 'number').length; out.push(id.slice(3, 12) + ' n=' + a.length + ' len=' + a[a.length-1].at.toFixed(1) + '/' + s[s.length-1].at.toFixed(1) + ' vel ' + Math.min(...s.map(e=>e.vel)).toFixed(2) + '-' + Math.max(...s.map(e=>e.vel)).toFixed(2) + (bad ? ' BAD' + bad : '') + (window.KOA_FEEL[id] ? '' : ' NOFEEL')); } return out.join('\\n'); }'''))
        await pg.evaluate("() => window.__koa.openIntro('r1-01-landmarks')"); await pg.screenshot(path='/tmp/F1.png', full_page=True)
        print('feel hidden-after:', await pg.eval_on_selector('#feelAfter', 'e => e.style.display'), '| coach:', await pg.inner_text('#inCoach'))
        await pg.click('#feelA'); await pg.wait_for_timeout(600); print('A label while playing:', await pg.inner_text('#feelA')); await pg.click('#feelA'); print('after stop:', await pg.inner_text('#feelA'))
        await pg.click('#feelPA'); print('verdict:', await pg.inner_text('#feelVerdict')); await pg.screenshot(path='/tmp/F2.png', full_page=True)
        print('xp/stats', await pg.evaluate("() => JSON.stringify([window.__koa.save.xp, window.__koa.save.stats, window.__koa.save.shrines])"))
        print('take ->', await pg.evaluate(BOT, ['btnTake', 0])); print(' lessons after take', await pg.evaluate("() => JSON.stringify(window.__koa.save.lessons) + ' take events ' + (window.__koa.take||[]).length"))
        await pg.click('#btnHear'); await pg.wait_for_timeout(500); print('hear label:', await pg.inner_text('#btnHear')); await pg.screenshot(path='/tmp/F3.png'); await pg.click('#btnHear')
        await pg.click('#btnAgain'); print('play ->', await pg.evaluate(BOT, ['btnPerform', 0]))
        # arcade link + arcade cards
        await pg.evaluate("() => window.__koa.openIntro('r1-07-boss-ode')"); print('arc link:', await pg.inner_text('#feelArc')); print('boss play ->', await pg.evaluate(BOT, ['btnPerform', 0]))
        await pg.click('#btnMap'); await pg.wait_for_selector('#map.on'); print('trial btn:', await pg.eval_on_selector('#btnTrial', 'e => e.style.display + "|" + e.textContent'))
        await pg.click('#btnTrial'); await pg.wait_for_timeout(1500); await pg.screenshot(path='/tmp/F4.png'); print('trial ->', await pg.evaluate(BOT, [None, 0])); print(' ', await pg.evaluate("() => JSON.stringify(window.__koa.save.lessons['trial-r1'])"))
        await pg.click('#btnMore'); await pg.wait_for_timeout(800); print('again starts trial:', await pg.evaluate("() => window.__koa.game && window.__koa.game.L.id")); await pg.click('#btnQuit')
        await pg.evaluate("() => window.__koa.renderArcade()"); print('arcade why:', await pg.evaluate("() => [...document.querySelectorAll('#arcList .song')].map(c => c.querySelector('.t').textContent + ' => ' + ((c.textContent.match(/Why it works[^.]*\\./)||['-'])[0])).join('\\n')"))
        await pg.screenshot(path='/tmp/F5.png'); print('errors', errs); await b.close()
asyncio.run(main())
