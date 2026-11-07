# language: Python 3.13, file: tools/smoke.py
# Headless walk-through: home -> section -> question -> answer -> dark -> settings.
from playwright.sync_api import sync_playwright

OUT = r"N:\DeepSeekHarness\apk\anormalmath\shots"
URL = "http://127.0.0.1:8017/"
errors = []

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=2)
    pg.on("console", lambda m: errors.append(f"{m.type}: {m.text}") if m.type == "error" else None)
    pg.on("pageerror", lambda e: errors.append(f"pageerror: {e}"))

    pg.goto(URL, wait_until="networkidle")
    pg.wait_for_timeout(500)
    cards = pg.locator(".card[data-section]").count()
    back_hidden = pg.locator("#backBtn").is_hidden()
    pg.screenshot(path=OUT + r"\01-home.png", full_page=True)

    pg.click('[data-section="algebra"]')
    pg.wait_for_timeout(450)
    rows = pg.locator(".row[data-topic]").count()
    pg.screenshot(path=OUT + r"\02-section.png", full_page=True)

    pg.click(".row[data-topic] >> nth=0")
    pg.wait_for_timeout(450)
    choices = pg.locator(".choice").count()
    pg.screenshot(path=OUT + r"\03-question.png", full_page=True)

    pg.click(".choice >> nth=0")
    pg.wait_for_timeout(700)
    has_solution = pg.locator("#solBox ol li").count()
    pg.screenshot(path=OUT + r"\04-answer.png", full_page=True)

    pg.click("#themeBtn")
    pg.wait_for_timeout(500)
    theme = pg.evaluate("document.documentElement.dataset.theme")
    pg.screenshot(path=OUT + r"\05-dark-question.png", full_page=True)

    pg.goto(URL + "#/settings", wait_until="networkidle")
    pg.wait_for_timeout(350)
    pg.screenshot(path=OUT + r"\06-settings-dark.png", full_page=True)

    pg.goto(URL + "#/stats", wait_until="networkidle")
    pg.wait_for_timeout(350)
    pg.screenshot(path=OUT + r"\07-stats-dark.png", full_page=True)

    print(f"title           : {pg.title()}")
    print(f"home cards      : {cards} (expected 10)")
    print(f"back hidden home: {back_hidden}")
    print(f"algebra topics  : {rows}")
    print(f"choices         : {choices} (expected 4)")
    print(f"solution steps  : {has_solution}")
    print(f"theme after tap : {theme}")
    b.close()

print(f"console errors  : {len(errors)}")
for e in errors[:10]:
    print("   ", e)
