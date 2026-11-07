# language: Python 3.13, file: tools/check_fileproto.py
# Runs the packaged build from file:// exactly as the WebView will, with no server.
from playwright.sync_api import sync_playwright

URL = "file:///N:/DeepSeekHarness/apk/anormalmath/mobile/www/index.html"
errors = []

with sync_playwright() as p:
    b = p.chromium.launch(args=[
        "--allow-file-access-from-files",
        "--autoplay-policy=no-user-gesture-required",
    ])
    pg = b.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=2)
    pg.on("pageerror", lambda e: errors.append(str(e)))
    pg.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)

    pg.goto(URL, wait_until="domcontentloaded")
    pg.wait_for_timeout(1600)

    splash = pg.locator("#splash").count()
    video = pg.evaluate("(() => { const v = document.getElementById('splashVideo'); return v ? { paused: v.paused, t: Math.round(v.currentTime*10)/10 } : null; })()")
    if splash:
        pg.click("#splashSkip")
        pg.wait_for_timeout(800)

    cards = pg.locator(".card[data-section]").count()
    pg.click('.card[data-section="sat"]')
    pg.wait_for_timeout(600)
    rows = pg.locator(".row[data-topic]").count()
    pg.evaluate("localStorage.setItem('probe','ok')")
    storage = pg.evaluate("localStorage.getItem('probe')")
    pg.screenshot(path=r"N:\DeepSeekHarness\apk\anormalmath\shots\18-fileproto-sat.png", full_page=True)

    print("splash   :", splash, "| video:", video)
    print("cards    :", cards)
    print("sat rows :", rows)
    print("storage  :", storage)
    print("errors   :", len(errors))
    for e in errors[:6]:
        print("   ", e[:180])
    b.close()
