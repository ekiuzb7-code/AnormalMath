# AnormalMath

O'zbekcha matematika mashqi. 10 bo'lim, 419 mavzu, cheksiz savol — har birida maslahat,
qadam-baqadam yechim va nazariya. Test rejimi taymer bilan, natija tahlili, tarix,
qidiruv va xatcho'plar. Tarmoqsiz ishlaydi, progress brauzerda saqlanadi.

## Ishga tushirish

```powershell
python -m http.server 8017 --directory N:\DeepSeekHarness\apk\anormalmath
```

So'ng brauzerda: `http://127.0.0.1:8017/`

Telefonda: shu manzilni ochib, "Bosh ekranga qo'shish" — mustaqil ilova sifatida o'rnatiladi
(PWA: `manifest.json` + ikonkalar).

## Tekshirish

```powershell
node test/run.mjs          # 8 bo'lim, 47 mavzu, 2820 savol generatsiya qilinadi
python tools/smoke.py      # headless brauzer: ekranlar, tanlovlar, tema
```

## Tuzilish

```
index.html            qobiq: topbar, tabbar, toast
css/style.css         liquid-glass dizayn tizimi, yorug'/tungi tokenlar
js/app.js             router, ekranlar, progress (localStorage)
js/engine.js          generator dvigateli: variantlar, javob, yechim
js/content/*.js       8 bo'lim + SAT, har bir mavzu o'z generatori bilan
test/run.mjs          generatorlarni 60 martadan yugurtiradi
tools/make_icon.py    vaqtinchalik ikonka
tools/smoke.py        headless E2E
```

## Mavzu qo'shish

`js/content/<bo'lim>.js` ichida yangi obyekt:

```js
{
  id: "algebra.yangiMavzu",
  title: "Nomi",
  tagline: "Bir qatorli izoh",
  theory: "Qoida matni",
  gen() {
    const a = ri(1, 9);
    return {
      prompt: `... ${a} ...`,
      answer: `${a * 2}`,
      distractors: [`${a}`, `${a + 1}`, `${a * 3}`],
      hint: "Maslahat",
      steps: ["1-qadam", "2-qadam"],
    };
  },
}
```

Dvigatel o'zi 4 ta noyob variant yasaydi va javobni aralashtiradi.

## Keyingi qadamlar

- Kai tashlaydigan ikonka va splash bilan `icons/` ni almashtirish
- Capacitor bilan APK'ga o'rash (`@capacitor/core` + `@capacitor/android`)
- Har bo'lim uchun mavzular sonini kengaytirish (hozir 5–6 dan)
