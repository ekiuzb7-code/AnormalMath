# language: Python 3.13, file: tools/check_breakpoints.py
# Verifies how many columns the home grid uses at the sizes that matter.
from playwright.sync_api import sync_playwright

URL = "http://127.0.0.1:8017/"
SHOTS = r"N:\DeepSeekHarness\apk\anormalmath\shots"

with sync_playwright() as p:
    b = p.chromium.launch()
    for w, name in ((360, "23-w360"), (400, "21-w400"), (401, "22-w401"), (430, "24-w430")):
        pg = b.new_page(viewport={"width": w, "height": 800}, device_scale_factor=2)
        pg.goto(URL, wait_until="networkidle")
        pg.wait_for_timeout(400)
        if pg.locator("#splashSkip").count():
            pg.click("#splashSkip")
            pg.wait_for_timeout(300)
        cols = pg.evaluate(
            "getComputedStyle(document.querySelector('.grid')).gridTemplateColumns.split(' ').length"
        )
        height = pg.evaluate("document.body.scrollHeight")
        card_h = pg.evaluate("Math.round(document.querySelector('.card').getBoundingClientRect().height)")
        pg.screenshot(path=f"{SHOTS}\\{name}.png", full_page=True)
        print(f"{w:>4}dp: columns={cols} cardHeight={card_h}px pageHeight={height}px")
        pg.close()
    b.close()
