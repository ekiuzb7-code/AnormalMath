# language: Python 3.13, file: tools/check_compact.py
# Renders the home screen at a 360 dp phone width to check the compact layout.
from playwright.sync_api import sync_playwright

URL = "http://127.0.0.1:8017/"
SHOTS = r"N:\DeepSeekHarness\apk\anormalmath\shots"

with sync_playwright() as p:
    b = p.chromium.launch()
    for w, h, name in ((360, 740, "19-compact-360"), (390, 844, "20-compact-390")):
        pg = b.new_page(viewport={"width": w, "height": h}, device_scale_factor=2)
        pg.goto(URL, wait_until="networkidle")
        pg.wait_for_timeout(500)
        pg.click("#splashSkip") if pg.locator("#splashSkip").count() else None
        pg.wait_for_timeout(400)
        cards = pg.locator(".card[data-section]").count()
        height = pg.evaluate("document.body.scrollHeight")
        first_row = pg.evaluate("Math.round(document.querySelectorAll('.card')[1].getBoundingClientRect().top)")
        pg.screenshot(path=f"{SHOTS}\\{name}.png", full_page=True)
        print(f"{w}x{h}: cards={cards} pageHeight={height}px secondCardTop={first_row}px")
        pg.close()
    b.close()
