# language: Python 3.11, file: tools/make_icon.py
# Temporary AnormalMath icon until Kai drops the real one.
import os

import numpy as np
from PIL import Image, ImageDraw, ImageFont

OUT = r"N:\DeepSeekHarness\apk\anormalmath\icons"
FONT_CANDIDATES = [
    r"N:\DeepSeekHarness\apk\out\work\assets\flutter_assets\assets\fonts\Inter-ExtraBold.otf",
    r"C:\Windows\Fonts\segoeuib.ttf",
    r"C:\Windows\Fonts\arialbd.ttf",
]
FONT = next((p for p in FONT_CANDIDATES if os.path.exists(p)), None)
if not FONT:
    raise SystemExit("no usable font found")
os.makedirs(OUT, exist_ok=True)

S = 1024
yy, xx = np.mgrid[0:S, 0:S].astype(np.float32)

# deep navy base with an indigo glow behind the mark
base = np.zeros((S, S, 3), np.float32)
base[..., 0] = 10
base[..., 1] = 11
base[..., 2] = 20

cx, cy, r = S * 0.5, S * 0.42, S * 0.85
dist = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2) / r
glow = np.clip(1 - dist, 0, 1) ** 2.2
tint = np.array([99, 108, 255], np.float32)
base = base + glow[..., None] * (tint - base) * 0.55

img = Image.fromarray(np.clip(base, 0, 255).astype(np.uint8), "RGB").convert("RGBA")

# radical mark, rendered generously then downsampled
big = Image.new("RGBA", (S * 2, S * 2), (0, 0, 0, 0))
d = ImageDraw.Draw(big)
f = ImageFont.truetype(FONT, 760)
txt = "\u221a"
bb = d.textbbox((0, 0), txt, font=f)
tx = (S * 2 - (bb[2] - bb[0])) / 2 - bb[0]
ty = S * 2 * 0.47 - (bb[3] - bb[1]) / 2 - bb[1]
d.text((tx, ty), txt, font=f, fill=(255, 255, 255, 250))
img.alpha_composite(big.resize((S, S), Image.LANCZOS))

# thin accent rule under the mark
d2 = ImageDraw.Draw(img, "RGBA")
d2.rounded_rectangle([S * 0.34, S * 0.735, S * 0.66, S * 0.752], radius=10, fill=(99, 108, 255, 255))

img.save(os.path.join(OUT, "icon-512.png"), optimize=True)
img.resize((192, 192), Image.LANCZOS).save(os.path.join(OUT, "icon-192.png"), optimize=True)
img.resize((180, 180), Image.LANCZOS).save(os.path.join(OUT, "apple-touch-icon.png"), optimize=True)
print("icons written:", os.listdir(OUT))
