# language: Python 3.13, file: tools/make_poster.py
# Pulls a still frame out of the splash video and saves it as the poster image
# so the splash never flashes black before the video decodes.
import base64
import pathlib

from playwright.sync_api import sync_playwright

OUT = pathlib.Path(r"N:\DeepSeekHarness\apk\anormalmath\assets\splash-poster.jpg")
URL = "http://127.0.0.1:8017/tools/poster.html"

with sync_playwright() as p:
    b = p.chromium.launch(args=["--autoplay-policy=no-user-gesture-required"])
    pg = b.new_page(viewport={"width": 540, "height": 960})
    pg.goto(URL, wait_until="networkidle")
    data = pg.evaluate("() => window.grab(1.2)")
    b.close()

head, b64 = data.split(",", 1)
OUT.write_bytes(base64.b64decode(b64))
print("poster:", OUT, OUT.stat().st_size, "bytes")
