# language: Python 3.13, file: tools/check_mobile.py
# Loads the bundled (module-free) build the way the WebView will and verifies it boots.
from playwright.sync_api import sync_playwright

URL = "http://127.0.0.1:8017/mobile/www/"

with sync_playwright() as p:
    b = p.chromium.launch(args=["--autoplay-policy=no-user-gesture-required"])
    pg = b.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=2)
    errors = []
    pg.on("pageerror", lambda e: errors.append(str(e)))
    pg.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)

    pg.goto(URL, wait_until="domcontentloaded")
    pg.wait_for_timeout(1200)
    pg.click("#splashSkip")
    pg.wait_for_timeout(700)

    cards = pg.locator(".card[data-section]").count()
    pg.click('.card[data-section="algebra"]')
    pg.wait_for_timeout(600)
    rows = pg.locator(".row[data-topic]").count()
    pg.click(".row[data-topic] >> nth=0")
    pg.wait_for_timeout(600)
    choices = pg.locator(".choice").count()

    # localStorage must work in the WebView too
    pg.evaluate("localStorage.setItem('probe','1')")
    probe = pg.evaluate("localStorage.getItem('probe')")

    pg.screenshot(path=r"N:\DeepSeekHarness\apk\anormalmath\shots\17-mobile-bundle.png", full_page=True)

    print("cards    :", cards)
    print("topics   :", rows)
    print("choices  :", choices)
    print("storage  :", probe)
    print("errors   :", len(errors))
    for e in errors[:6]:
        print("   ", e)
    b.close()
