# language: Python 3.13, file: tools/check_sat.py
# Confirms the SAT section renders in English (not the stale Uzbek build).
from playwright.sync_api import sync_playwright

URL = "http://127.0.0.1:8017/"

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=2)
    errors = []
    pg.on("pageerror", lambda e: errors.append(str(e)))
    pg.goto(URL + "#/s/sat", wait_until="networkidle")
    pg.wait_for_timeout(500)
    rows = pg.locator(".row[data-topic]").count()
    first = pg.locator(".row[data-topic] h4 >> nth=0").inner_text()
    pg.screenshot(path=r"N:\DeepSeekHarness\apk\anormalmath\shots\14-sat-list.png", full_page=True)

    pg.locator(".row[data-topic]").first.click()
    pg.wait_for_timeout(600)
    prompt = pg.locator(".qtext").inner_text()
    pg.screenshot(path=r"N:\DeepSeekHarness\apk\anormalmath\shots\15-sat-question.png", full_page=True)

    cyrillic = any(ch in prompt for ch in "аеиоуўқғҳ") or "uchun" in prompt or "qancha" in prompt
    print("sat topics   :", rows)
    print("first topic  :", first)
    print("prompt       :", prompt[:110].replace("\n", " "))
    print("uzbek leaked :", cyrillic)
    print("errors       :", len(errors))
    b.close()
