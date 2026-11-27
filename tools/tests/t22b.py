import asyncio, json
from playwright.async_api import async_playwright
OLD = json.dumps({"xp":310,"stats":{"technique":6,"reading":6,"ear":1,"theory":3,"rhythm":1},"lessons":{"r1-01-landmarks":{"stars":3,"best":0.97},"r1-02-steps":{"stars":2,"best":0.8}},"shrines":{"sh-sound":True,"sh-letters":True,"ln-r1-01":True},"streak":{"last":"2026-11-23","count":2},"reps":3})
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--autoplay-policy=no-user-gesture-required'])
        for vp in [(1112,740)]:
            ctx = await b.new_context(viewport={'width':vp[0],'height':vp[1]}, has_touch=True); pg = await ctx.new_page(); errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)[:300]))
            await pg.add_init_script(f"if(!sessionStorage.getItem('s')) {{ sessionStorage.setItem('s',1); localStorage.setItem('koa_save_v1', {json.dumps(OLD)}); }}")
            await pg.goto('file:///home/claude/koa-bundle/index.html'); await pg.click('#btnStart'); await pg.wait_for_selector('#map.on'); await pg.wait_for_timeout(1200); await pg.screenshot(path=f'/tmp/Z_map_{vp[0]}.png')
            print(vp, 'old save kept:', await pg.evaluate("() => JSON.stringify([window.__koa.save.xp, Object.keys(window.__koa.save.lessons).length, window.__koa.save.reps])"))
            K = "async (ms) => { for (const m of ms) { window.__koa.press(m,.7,'touch'); await new Promise(r=>setTimeout(r,25)); window.__koa.release(m); await new Promise(r=>setTimeout(r,15)); } }"
            LS = await pg.evaluate("() => window.KOA_LEARN.map(L => [L.id, L.learn, L.pages.length, L.quiz.length, L.pass])")
            for lid, les, np, nq, ps in [x for x in LS if x[0] in ('ln-r1-12','ln-r1-10')]:
                await pg.evaluate(f"() => window.__koa.openIntro('{les}')"); await pg.click('#btnLearn'); n=0; maxh=0
                while True:
                    S = await pg.evaluate("() => window.__koa.shrineState()")
                    if S['quiz']: break
                    maxh = max(maxh, await pg.evaluate("() => document.documentElement.scrollHeight"))
                    if S['do']:
                        d=S['do']; k=d['kind']; keys = d.get('seq') if k=='seq' else [60+x for x in d['pcs']] if k=='pcs' else [60,72,84] if k=='octs' else [60]*d['n'] if k=='taps' else [60,76]
                        assert await pg.evaluate("() => document.getElementById('shNext').disabled"), (lid,n,'not locked'); await pg.evaluate(K, keys)
                    assert not await pg.evaluate("() => document.getElementById('shNext').disabled"), (lid, n, 'still locked')
                    # press every demo button once
                    await pg.evaluate("() => [...document.getElementById('shDemo').children].forEach(b => b.click())")
                    if (lid, n) in [('ln-r1-04',4),('ln-r1-05',4),('ln-r1-07',5),('ln-r1-09',2),('ln-r1-10',3),('ln-r1-06',4)]: await pg.wait_for_timeout(250); await pg.screenshot(path=f'/tmp/Z_{lid}_{n}_{vp[0]}.png')
                    await pg.click('#shNext'); n+=1
                Q = await pg.evaluate("() => window.__koa.shrineState().quizAll")
                for qi,q in enumerate(Q):
                    await pg.wait_for_function(f"() => document.getElementById('shDots').textContent.startsWith('Check {qi+1} ')", timeout=6000)
                    await pg.evaluate("() => [...document.getElementById('shDemo').children].forEach(b => b.click())")
                    if q['type']=='choice': await pg.evaluate(f"() => document.getElementById('shNav').children[{q['a']}].click()")
                    else: await pg.evaluate(K, [q['midi'][0] if q.get('midi') else 60+q['pcs'][0]])
                await pg.wait_for_function("() => /Passed/.test(document.getElementById('shH').textContent)", timeout=8000)
                await pg.evaluate("() => [...document.getElementById('shNav').children].find(b=>/Now play/.test(b.textContent)).click()")
                print(' ', lid, f'{n}/{np} pages, {nq} q ->', await pg.inner_text('#inTitle'), '| tallest page', maxh, 'px')
            for les in ['r1-08-heroic-ode','r1-10-elise-both']:
                await pg.evaluate(f"() => window.__koa.openIntro('{les}')"); print('  shared lesson on', les, '->', await pg.inner_text('#inLearnT'))
            print('  theory stat', await pg.evaluate("() => window.__koa.save.stats.theory"), 'errors', errs); await ctx.close()
        await b.close()
asyncio.run(main())
