# language: Python 3.13, file: tools/check_splash.py
# Confirms the video splash shows, plays, and can be dismissed.
from playwright.sync_api import sync_playwright

URL = "http://127.0.0.1:8017/"
SHOTS = r"N:\DeepSeekHarness\apk\anormalmath\shots"

with sync_playwright() as p:
    b = p.chromium.launch(args=["--autoplay-policy=no-user-gesture-required"])
    pg = b.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=2)
    errors = []
    pg.on("pageerror", lambda e: errors.append(str(e)))

    pg.goto(URL, wait_until="domcontentloaded")
    pg.wait_for_timeout(1400)

    visible = pg.locator("#splash").count()
    state = pg.evaluate("(() => { const v = document.getElementById('splashVideo'); return v ? { paused: v.paused, t: Math.round(v.currentTime*10)/10, dur: Math.round(v.duration*10)/10, ready: v.readyState } : null; })()")
    pg.screenshot(path=SHOTS + r"\16-splash.png")

    # dismiss with the skip button
    pg.click("#splashSkip")
    pg.wait_for_timeout(900)
    gone = pg.locator("#splash").count()
    app_visible = pg.locator(".card[data-section]").count()

    # second load in the same session must not replay it
    pg.reload(wait_until="domcontentloaded")
    pg.wait_for_timeout(600)
    again = pg.locator("#splash").count()

    print("splash nodes :", visible)
    print("video state  :", state)
    print("after skip   :", gone, "| app cards:", app_visible)
    print("second load  :", again)
    print("errors       :", len(errors))
    b.close()
