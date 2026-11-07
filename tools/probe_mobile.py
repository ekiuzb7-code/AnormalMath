# language: Python 3.13, file: tools/probe_mobile.py
# Prints failed requests and the first script errors from the bundled build.
from playwright.sync_api import sync_playwright

URL = "http://127.0.0.1:8017/mobile/www/"
msgs = []

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page()
    pg.on("pageerror", lambda e: msgs.append(f"PAGEERROR: {e}"))
    pg.on("console", lambda m: msgs.append(f"{m.type.upper()}: {m.text}") if m.type == "error" else None)
    pg.on("response", lambda r: msgs.append(f"HTTP {r.status} {r.url}") if r.status >= 400 else None)
    pg.goto(URL, wait_until="domcontentloaded")
    pg.wait_for_timeout(1500)
    cards = pg.evaluate("document.querySelectorAll('.card[data-section]').length")
    b.close()

print("cards:", cards)
for m in msgs[:14]:
    print(" ", m[:200])
