# language: Python 3.11, file: tools/make_android_res.py
# Builds the launcher icons the APK needs, one per density.
import os

from PIL import Image

SRC = r"N:\DeepSeekHarness\apk\anormalmath\icons\icon-512.png"
RES = r"N:\DeepSeekHarness\apk\anormalmath\mobile\android\res"

DENSITIES = {
    "mdpi": 48,
    "hdpi": 72,
    "xhdpi": 96,
    "xxhdpi": 144,
    "xxxhdpi": 192,
}

art = Image.open(SRC).convert("RGB")

for name, size in DENSITIES.items():
    d = os.path.join(RES, f"mipmap-{name}")
    os.makedirs(d, exist_ok=True)
    art.resize((size, size), Image.LANCZOS).save(os.path.join(d, "ic_launcher.png"), optimize=True)

# a plain drawable for the splash window background
d = os.path.join(RES, "drawable")
os.makedirs(d, exist_ok=True)
with open(os.path.join(d, "splash_bg.xml"), "w", encoding="utf-8") as f:
    f.write(
        '<?xml version="1.0" encoding="utf-8"?>\n'
        '<shape xmlns:android="http://schemas.android.com/apk/res/android" android:shape="rectangle">\n'
        '    <solid android:color="#07000D" />\n'
        "</shape>\n"
    )

print("res generated:", sorted(os.listdir(RES)))
