# language: Python 3.11, file: tools/fix_sat_decimals.py
# SAT answers must print English decimals (1.5) instead of the Uzbek comma (1,5).
P = r"N:\DeepSeekHarness\apk\anormalmath\js\content\sat.js"

t = open(P, encoding="utf-8").read()
t = t.replace("fmt(", "en(")

old = 'import { ri, pick, en } from "../engine.js";'
if old not in t:
    old = 'import { ri, pick, fmt } from "../engine.js";'

new = (
    'import { ri, pick } from "../engine.js";\n\n'
    "/** English decimal formatting: SAT answers use a dot, not the Uzbek comma. */\n"
    'const en = (n) => (typeof n === "number" && isFinite(n) ? String(Math.round(n * 1000) / 1000) : String(n));'
)

t = t.replace(old, new)
open(P, "w", encoding="utf-8").write(t)

print("fmt( left:", t.count("fmt("))
print(t.splitlines()[0])
print(t.splitlines()[1])
print(t.splitlines()[2])
