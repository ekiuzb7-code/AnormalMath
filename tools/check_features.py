# language: Python 3.13, file: tools/check_features.py
# Exercises test mode, result analysis, history, search and bookmarks end to end.
from playwright.sync_api import sync_playwright

URL = "http://127.0.0.1:8017/"
errors = []

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=2)
    pg.on("pageerror", lambda e: errors.append(str(e)))
    pg.on("console", lambda m: errors.append(f"console:{m.text}") if m.type == "error" else None)

    pg.goto(URL, wait_until="networkidle")
    pg.wait_for_timeout(400)

    # ---- test mode ----
    pg.click("#mixBtn")
    pg.wait_for_timeout(600)
    has_bar = pg.locator(".testbar").count()
    timer1 = pg.locator("#testTimer").inner_text()
    total = pg.locator(".step").inner_text()

    for _ in range(12):
        if pg.locator(".choice").count() == 0:
            break
        pg.click(".choice >> nth=0")
        pg.wait_for_timeout(560)

    pg.wait_for_timeout(700)
    pct = pg.locator(".result-hero .pct").inner_text() if pg.locator(".result-hero .pct").count() else "-"
    weak_rows = pg.locator(".weakrow").count()
    pg.screenshot(path=r"N:\DeepSeekHarness\apk\anormalmath\shots\10-result.png", full_page=True)

    # ---- history ----
    pg.goto(URL + "#/history", wait_until="networkidle")
    pg.wait_for_timeout(400)
    hist_rows = pg.locator(".hrow").count()
    pg.screenshot(path=r"N:\DeepSeekHarness\apk\anormalmath\shots\11-history.png", full_page=True)

    # ---- search ----
    pg.goto(URL + "#/search", wait_until="networkidle")
    pg.wait_for_timeout(350)
    pg.fill("#q", "logarifm")
    pg.wait_for_timeout(400)
    hits = pg.locator(".row[data-open-topic]").count()
    pg.screenshot(path=r"N:\DeepSeekHarness\apk\anormalmath\shots\12-search.png", full_page=True)

    # ---- bookmark ----
    pg.goto(URL + "#/t/algebra/logarifm", wait_until="networkidle")
    pg.wait_for_timeout(400)
    pg.click("#bmBtn")
    pg.wait_for_timeout(400)
    on = pg.locator("#bmBtn.on").count()
    pg.goto(URL + "#/bookmarks", wait_until="networkidle")
    pg.wait_for_timeout(400)
    bm_rows = pg.locator(".row[data-open-topic]").count()
    pg.screenshot(path=r"N:\DeepSeekHarness\apk\anormalmath\shots\13-bookmarks.png", full_page=True)

    print("test bar        :", has_bar, "| step:", total, "| timer:", timer1)
    print("result percent  :", pct)
    print("weak rows       :", weak_rows)
    print("history rows    :", hist_rows)
    print("search hits     :", hits)
    print("bookmark on     :", on, "| bookmarks list:", bm_rows)
    print("errors          :", len(errors))
    for e in errors[:6]:
        print("   ", e)
    b.close()
