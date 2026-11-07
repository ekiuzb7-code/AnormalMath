# language: Python 3.11, file: tools/make_icon_from_art.py
# Turns the supplied emblem into the full icon set (standard, maskable, apple).
import os

from PIL import Image

SRC = r"N:\DeepSeekHarness\apk\Neon Purple Math App Emblem.png"
OUT = r"N:\DeepSeekHarness\apk\anormalmath\icons"
BG = (7, 0, 13)  # same near-black used by the splash

os.makedirs(OUT, exist_ok=True)
art = Image.open(SRC).convert("RGB")

# square crop from the centre, in case the source is not exactly square
side = min(art.size)
left = (art.width - side) // 2
top = (art.height - side) // 2
art = art.crop((left, top, left + side, top + side))


def save(img, name, size):
    img.resize((size, size), Image.LANCZOS).save(os.path.join(OUT, name), optimize=True)


save(art, "icon-512.png", 512)
save(art, "icon-192.png", 192)
save(art, "icon-1024.png", 1024)
save(art, "apple-touch-icon.png", 180)
save(art, "favicon-32.png", 32)

# maskable: the artwork sits inside the 80% safe circle on a solid backdrop
for size, name in ((512, "icon-maskable-512.png"), (192, "icon-maskable-192.png")):
    canvas = Image.new("RGB", (size, size), BG)
    inner = int(size * 0.78)
    scaled = art.resize((inner, inner), Image.LANCZOS)
    off = (size - inner) // 2
    canvas.paste(scaled, (off, off))
    canvas.save(os.path.join(OUT, name), optimize=True)

print("icons:", sorted(os.listdir(OUT)))
for f in sorted(os.listdir(OUT)):
    print(f"  {f:26s} {os.path.getsize(os.path.join(OUT, f)):>7d} bytes")
