# language: Python 3.13, file: tools/check_motion.py
# Confirms the tab pill glides and that the view re-enters with one clean layer.
from playwright.sync_api import sync_playwright

URL = "http://127.0.0.1:8017/"

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=2)
    errors = []
    pg.on("pageerror", lambda e: errors.append(str(e)))
    pg.goto(URL, wait_until="networkidle")
    pg.wait_for_timeout(400)

    before = pg.evaluate("getComputedStyle(document.getElementById('tabPill')).transform")

    # sample the running animation right after the tab click
    pg.click('.tab[data-tab="stats"]')
    pg.wait_for_timeout(120)
    anim = pg.evaluate(
        "(() => { const v = document.getElementById('view'); const a = v.getAnimations(); "
        "return a.length ? { name: a[0].animationName || '', state: a[0].playState, cur: Math.round(a[0].currentTime) } : null; })()"
    )
    opacity_mid = pg.evaluate("getComputedStyle(document.getElementById('view')).opacity")

    pg.wait_for_timeout(600)
    after = pg.evaluate("getComputedStyle(document.getElementById('tabPill')).transform")
    opacity_end = pg.evaluate("getComputedStyle(document.getElementById('view')).opacity")
    cls = pg.evaluate("document.getElementById('view').className")
    on_stats = pg.locator(".stat").count()

    print("pill before   :", before)
    print("pill after    :", after)
    print("pill moved    :", before != after)
    print("view anim     :", anim)
    print("opacity mid   :", opacity_mid)
    print("opacity end   :", opacity_end, "| class:", cls)
    print("stats cards   :", on_stats)
    print("errors        :", len(errors))
    for e in errors[:5]:
        print("   ", e)
    b.close()
