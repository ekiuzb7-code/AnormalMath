// AnormalMath — Calculus bo'limi (asl ilovada deyarli yo'q — biz to'ldiramiz)
import { ri, pick } from "../engine.js";

export const calculus = {
  id: "calculus",
  title: "Hosila va integral",
  glyph: "∫",
  accent: "#f97316",
  blurb: "Hosila, ekstremum, integral — matematik analiz asoslari.",
  topics: [
    {
      id: "calculus.derivative",
      title: "Hosila",
      tagline: "Daraja funksiyasi",
      theory: "(xⁿ)′ = n·xⁿ⁻¹. O'zgarmas ko'paytuvchi hosila oldiga chiqadi: (c·xⁿ)′ = c·n·xⁿ⁻¹.",
      gen() {
        const a = ri(2, 6);
        const k = ri(2, 4);
        const x0 = ri(1, 4);
        const val = a * k * Math.pow(x0, k - 1);
        return {
          prompt: `f(x) = ${a}x^${k}. <b>f′(${x0})</b> ni toping.`,
          answer: `${val}`,
          distractors: [`${a * Math.pow(x0, k)}`, `${k * Math.pow(x0, k - 1)}`, `${val + a}`],
          hint: "(xⁿ)′ = n·xⁿ⁻¹.",
          steps: [
            `f′(x) = ${a} · ${k} · x^${k - 1} = ${a * k}x^${k - 1}`,
            `f′(${x0}) = ${a * k} · ${x0}^${k - 1}`,
            `= ${a * k} · ${Math.pow(x0, k - 1)} = ${val}`,
          ],
        };
      },
    },
    {
      id: "calculus.product",
      title: "Ko'paytma qoidasi",
      tagline: "(uv)′ = u′v + uv′",
      theory: "Ko'paytmaning hosilasi: (u·v)′ = u′v + u·v′.",
      gen() {
        const b = ri(2, 5);
        const c = ri(1, 5);
        const x0 = ri(1, 3);
        const u = x0 * x0 + b;
        const du = 2 * x0;
        const v = x0 + c;
        const dv = 1;
        const val = du * v + u * dv;
        return {
          prompt: `f(x) = (x² + ${b})(x + ${c}). <b>f′(${x0})</b> ni toping.`,
          answer: `${val}`,
          distractors: [`${u * v}`, `${du * v}`, `${val + 2}`],
          hint: "u = x² + b, v = x + c. (uv)′ = u′v + uv′.",
          steps: [
            `u′ = 2x, v′ = 1`,
            `f′(x) = 2x(x + ${c}) + (x² + ${b})·1`,
            `f′(${x0}) = ${du}·${v} + ${u}·1 = ${val}`,
          ],
        };
      },
    },
    {
      id: "calculus.extremum",
      title: "Ekstremum nuqtasi",
      tagline: "f′(x) = 0",
      theory: "Ekstremumda f′(x) = 0. f(x) = x² + bx + c uchun x = −b/2.",
      gen() {
        const b = ri(-8, 8) || 4;
        const x = -b / 2;
        return {
          prompt: `f(x) = x² ${b < 0 ? "−" : "+"} ${Math.abs(b)}x + 5. Funksiyaning ekstremum nuqtasi (x) ni toping.`,
          answer: `${x}`,
          distractors: [`${b}`, `${-b}`, `${x + 1}`],
          hint: "f′(x) = 2x + b = 0.",
          steps: [
            `f′(x) = 2x ${b < 0 ? "−" : "+"} ${Math.abs(b)}`,
            `2x ${b < 0 ? "−" : "+"} ${Math.abs(b)} = 0`,
            `x = ${x}`,
          ],
        };
      },
    },
    {
      id: "calculus.integral",
      title: "Aniqmas integral",
      tagline: "∫xⁿ dx",
      theory: "∫xⁿ dx = xⁿ⁺¹/(n + 1) + C, n ≠ −1. O'zgarmas C yoziladi.",
      gen() {
        const a = ri(2, 5);
        const k = ri(2, 4);
        const denom = k + 1;
        return {
          prompt: `<b>∫ ${a}x^${k} dx</b> ni hisoblang.`,
          answer: `${a}/${denom} x^${denom} + C`,
          distractors: [
            `${a * k} x^${k - 1} + C`,
            `${a}/${k} x^${denom} + C`,
            `${a} x^${denom} + C`,
          ],
          hint: "∫xⁿ dx = xⁿ⁺¹/(n+1) + C.",
          steps: [
            `∫ x^${k} dx = x^${denom}/${denom}`,
            `Koeffitsiyent ${a} tashqarida qoladi`,
            `Javob: ${a}/${denom} x^${denom} + C`,
          ],
        };
      },
    },
    {
      id: "calculus.definite",
      title: "Aniq integral",
      tagline: "Nyuton–Leybnits",
      theory: "∫ₐᵇ f(x)dx = F(b) − F(a), bu yerda F — f ning boshlang'ich funksiyasi.",
      gen() {
        const k = ri(1, 2) * 2;
        const a = 0;
        const b = ri(1, 3);
        const F = (x) => (k * Math.pow(x, 2)) / 2;
        const val = F(b) - F(a);
        return {
          prompt: `<b>∫<sub>${a}</sub><sup>${b}</sup> ${k}x dx</b> ni hisoblang.`,
          answer: `${val}`,
          distractors: [`${val * 2}`, `${k * b}`, `${val + k}`],
          hint: "∫kx dx = kx²/2, keyin chegaralarni qo'ying.",
          steps: [
            `Boshlang'ich funksiya: ${k}x²/2 = ${k / 2}x²`,
            `F(${b}) − F(${a}) = ${k / 2}·${b * b} − 0`,
            `= ${val}`,
          ],
        };
      },
    },
    {
      id: "calculus.limit",
      title: "Limit",
      tagline: "Ko'phadning limiti",
      theory: "Ko'phad uzluksiz, shuning uchun limit nuqtani o'rniga qo'yish bilan topiladi: lim f(x) = f(a).",
      gen() {
        const a = ri(1, 4);
        const b = ri(-5, 5);
        const c = ri(-9, 9);
        const x0 = ri(-3, 3);
        const val = a * x0 * x0 + b * x0 + c;
        return {
          prompt: `<b>lim<sub>x→${x0}</sub> (${a}x² ${b < 0 ? "−" : "+"} ${Math.abs(b)}x ${c < 0 ? "−" : "+"} ${Math.abs(c)})</b> ni hisoblang.`,
          answer: `${val}`,
          distractors: [`${a * x0 + b}`, `${val + c}`, `${a * x0 * x0}`],
          hint: "Ko'phad uzluksiz — x o'rniga limit nuqtasini qo'ying.",
          steps: [
            `f(${x0}) = ${a}·${x0 * x0} ${b < 0 ? "−" : "+"} ${Math.abs(b * x0)} ${c < 0 ? "−" : "+"} ${Math.abs(c)}`,
            `= ${val}`,
          ],
        };
      },
    },
    {
      id: "calculus.chain",
      title: "Murakkab funksiya hosilasi",
      tagline: "((ax + b)ⁿ)′",
      theory: "Zanjir qoidasi: (f(g(x)))′ = f′(g(x))·g′(x). ((ax+b)ⁿ)′ = n·a·(ax+b)ⁿ⁻¹.",
      gen() {
        const a = ri(2, 4);
        const b = ri(-4, 4);
        const n = ri(2, 4);
        const x0 = ri(0, 2);
        const inner = a * x0 + b;
        const val = n * a * Math.pow(inner, n - 1);
        return {
          prompt: `f(x) = (${a}x ${b < 0 ? "−" : "+"} ${Math.abs(b)})^${n}. <b>f′(${x0})</b> ni toping.`,
          answer: `${val}`,
          distractors: [`${n * Math.pow(inner, n - 1)}`, `${Math.pow(inner, n)}`, `${val + a}`],
          hint: "n·a·(ax+b)ⁿ⁻¹.",
          steps: [
            `Ichki funksiya: ${a}x ${b < 0 ? "−" : "+"} ${Math.abs(b)}; uning hosilasi ${a}`,
            `f′(x) = ${n}·${a}·(${a}x ${b < 0 ? "−" : "+"} ${Math.abs(b)})^${n - 1}`,
            `f′(${x0}) = ${n * a}·${inner}^${n - 1} = ${val}`,
          ],
        };
      },
    },
    {
      id: "calculus.tangent",
      title: "Urinma",
      tagline: "Urinmaning burchak koeffitsiyenti",
      theory: "Urinmaning burchak koeffitsiyenti tegish nuqtasidagi hosilaga teng: k = f′(x₀).",
      gen() {
        const a = ri(1, 3);
        const k = ri(2, 5);
        const x0 = ri(1, 3);
        const slope = 2 * a * x0;
        return {
          prompt: `f(x) = ${a}x² + ${k}x. x₀ = ${x0} nuqtadagi <b>urinmaning burchak koeffitsiyentini</b> toping.`,
          answer: `${slope + k}`,
          distractors: [`${2 * a * x0}`, `${a * x0 * x0 + k * x0}`, `${slope + k + 1}`],
          hint: "k = f′(x₀).",
          steps: [
            `f′(x) = ${2 * a}x + ${k}`,
            `f′(${x0}) = ${slope} + ${k} = ${slope + k}`,
          ],
        };
      },
    },
    {
      id: "calculus.monotonic",
      title: "O'sish oralig'i",
      tagline: "f′(x) > 0",
      theory: "Funksiya f′(x) > 0 bo'lgan oraliqda o'sadi, f′(x) < 0 bo'lgan oraliqda kamayadi.",
      gen() {
        const b = ri(-8, 8) || 4;
        const x0 = -b / 2;
        return {
          prompt: `f(x) = x² ${b < 0 ? "−" : "+"} ${Math.abs(b)}x funksiyasi qaysi oraliqda o'sadi?`,
          answer: `x > ${x0}`,
          distractors: [`x < ${x0}`, `x > ${b}`, `x < ${-b}`],
          hint: "f′(x) = 2x + b > 0.",
          steps: [
            `f′(x) = 2x ${b < 0 ? "−" : "+"} ${Math.abs(b)}`,
            `2x ${b < 0 ? "−" : "+"} ${Math.abs(b)} > 0`,
            `x > ${x0}`,
          ],
        };
      },
    },
    {
      id: "calculus.derivTrig",
      title: "Trigonometrik hosila",
      tagline: "(sin x)′ = cos x",
      theory: "(sin x)′ = cos x, (cos x)′ = −sin x.",
      gen() {
        const cases = [
          { f: "sin x", p: "0", v: "1", why: "cos 0 = 1" },
          { f: "sin x", p: "π/2", v: "0", why: "cos(π/2) = 0" },
          { f: "cos x", p: "0", v: "0", why: "−sin 0 = 0" },
          { f: "cos x", p: "π/2", v: "−1", why: "−sin(π/2) = −1" },
        ];
        const c = pick(cases);
        return {
          prompt: `f(x) = ${c.f}. <b>f′(${c.p})</b> ni toping.`,
          answer: `${c.v}`,
          distractors: cases.filter((x) => x.v !== c.v).map((x) => x.v).slice(0, 3),
          hint: "(sin x)′ = cos x, (cos x)′ = −sin x.",
          steps: [`f′(x) = ${c.f === "sin x" ? "cos x" : "−sin x"}`, `${c.why}`, `Javob: ${c.v}`],
        };
      },
    },
    {
      id: "calculus.derivPoly",
      title: "Ko'phad hosilasi",
      tagline: "ax² + bx + c",
      theory: "(ax² + bx + c)′ = 2ax + b. Ozod had hosilada yo'qoladi.",
      gen() {
        const a = ri(1, 4);
        const b = ri(-6, 6);
        const c = ri(-9, 9);
        return {
          prompt: `f(x) = ${a}x² ${b < 0 ? "−" : "+"} ${Math.abs(b)}x ${c < 0 ? "−" : "+"} ${Math.abs(c)}. <b>f′(x)</b> ni toping.`,
          answer: `${2 * a}x ${b < 0 ? "−" : "+"} ${Math.abs(b)}`,
          distractors: [
            `${2 * a}x ${b < 0 ? "−" : "+"} ${Math.abs(b)} ${c < 0 ? "−" : "+"} ${Math.abs(c)}`,
            `${a}x ${b < 0 ? "−" : "+"} ${Math.abs(b)}`,
            `${2 * a}x² ${b < 0 ? "−" : "+"} ${Math.abs(b)}x`,
          ],
          hint: "(xⁿ)′ = n·xⁿ⁻¹, ozod had yo'qoladi.",
          steps: [
            `(${a}x²)′ = ${2 * a}x`,
            `(${b}x)′ = ${b}`,
            `f′(x) = ${2 * a}x ${b < 0 ? "−" : "+"} ${Math.abs(b)}`,
          ],
        };
      },
    },
    {
      id: "calculus.secondDeriv",
      title: "Ikkinchi tartibli hosila",
      tagline: "f″(x)",
      theory: "Ikkinchi hosila — birinchi hosilaning hosilasi. (ax³)′ = 3ax², (ax³)″ = 6ax.",
      gen() {
        const a = ri(1, 3);
        const b = ri(-4, 4);
        const x0 = ri(1, 3);
        const val = 6 * a * x0 + 2 * b;
        return {
          prompt: `f(x) = ${a}x³ ${b < 0 ? "−" : "+"} ${Math.abs(b)}x². <b>f″(${x0})</b> ni toping.`,
          answer: `${val}`,
          distractors: [`${3 * a * x0 * x0 + 2 * b * x0}`, `${6 * a * x0}`, `${val + 6}`],
          hint: "Avval f′, keyin uning hosilasi.",
          steps: [
            `f′(x) = ${3 * a}x² ${b < 0 ? "−" : "+"} ${Math.abs(2 * b)}x`,
            `f″(x) = ${6 * a}x ${b < 0 ? "−" : "+"} ${Math.abs(2 * b)}`,
            `f″(${x0}) = ${val}`,
          ],
        };
      },
    },
    {
      id: "calculus.definiteQuad",
      title: "Aniq integral (kvadrat)",
      tagline: "∫₀ᵃ x² dx = a³/3",
      theory: "∫₀ᵃ x² dx = a³/3.",
      gen() {
        const a = pick([3, 6]);
        const val = Math.round((a * a * a) / 3 * 100) / 100;
        return {
          prompt: `<b>∫<sub>0</sub><sup>${a}</sup> x² dx</b> ni hisoblang.`,
          answer: `${val}`,
          distractors: [`${a * a}`, `${a * a * a}`, `${Math.round((a * a) / 2 * 100) / 100}`],
          hint: "Boshlang'ich funksiya x³/3.",
          steps: [
            `∫x² dx = x³/3`,
            `F(${a}) − F(0) = ${a * a * a}/3`,
            `= ${val}`,
          ],
        };
      },
    },
    {
      id: "calculus.areaUnder",
      title: "Egri chiziq ostidagi yuza",
      tagline: "Aniq integral sifatida",
      theory: "y = f(x) egri chiziq, Ox o'qi va x = a, x = b chiziqlar orasidagi yuza ∫ₐᵇ f(x)dx.",
      gen() {
        const k = ri(1, 3);
        const b = pick([2, 3]);
        const val = Math.round(k * (b * b) / 2 * 100) / 100;
        return {
          prompt: `y = ${k}x to'g'ri chiziq, Ox o'qi va x = ${b} chiziq bilan chegaralangan yuza qancha?`,
          answer: `${val}`,
          distractors: [`${k * b}`, `${k * b * b}`, `${Math.round(val * 2 * 100) / 100}`],
          hint: "S = ∫₀ᵇ kx dx = k·b²/2.",
          steps: [
            `S = ∫₀^${b} ${k}x dx`,
            `= ${k}x²/2 |₀^${b}`,
            `= ${val}`,
          ],
        };
      },
    },
    {
      id: "calculus.limitInfinity",
      title: "Cheksizlikdagi limit",
      tagline: "Eng yuqori daraja nisbati",
      theory: "lim x→∞ (ax² + …)/(cx² + …) = a/c — eng yuqori darajalar nisbati.",
      gen() {
        const a = ri(1, 6);
        const c = ri(1, 6);
        const b = ri(-8, 8);
        return {
          prompt: `<b>lim<sub>x→∞</sub> (${a}x² ${b < 0 ? "−" : "+"} ${Math.abs(b)}x) / (${c}x² + 5)</b> ni hisoblang.`,
          answer: `${a}/${c}`,
          distractors: [`${b}/5`, `0`, `${a * c}`],
          hint: "Eng yuqori darajali hadlar nisbatini oling.",
          steps: [
            `Eng yuqori daraja: x²`,
            `Nisbat: ${a}x² / ${c}x² = ${a}/${c}`,
          ],
        };
      },
    },
    {
      id: "calculus.averageRate",
      title: "O'rtacha o'zgarish tezligi",
      tagline: "(f(b) − f(a))/(b − a)",
      theory: "O'rtacha o'zgarish tezligi = (f(b) − f(a))/(b − a).",
      gen() {
        const a = ri(1, 4);
        const b = a + ri(2, 4);
        const val = a + b;
        return {
          prompt: `f(x) = x². [${a}; ${b}] oraliqdagi o'rtacha o'zgarish tezligini toping.`,
          answer: `${val}`,
          distractors: [`${b - a}`, `${a * b}`, `${val + 1}`],
          hint: "(f(b) − f(a))/(b − a).",
          steps: [
            `f(${b}) = ${b * b}, f(${a}) = ${a * a}`,
            `(${b * b} − ${a * a}) / (${b} − ${a}) = ${b * b - a * a}/${b - a}`,
            `= ${val}`,
          ],
        };
      },
    },
    {
      id: "calculus.criticalCount",
      title: "Kritik nuqtalar soni",
      tagline: "f′(x) = 0",
      theory: "Kritik nuqtalar f′(x) = 0 tenglamaning ildizlari soniga teng.",
      gen() {
        const k = ri(2, 6);
        return {
          prompt: `f(x) = x³ − ${3 * k}x. Funksiyaning nechta kritik nuqtasi bor?`,
          answer: `2`,
          distractors: [`1`, `3`, `0`],
          hint: "f′(x) = 3x² − 3k = 0 ni yeching.",
          steps: [
            `f′(x) = 3x² − ${3 * k}`,
            `3x² = ${3 * k} ⟹ x² = ${k}`,
            `x = ±√${k} — ikkita nuqta`,
          ],
        };
      },
    },
    {
      id: "calculus.derivConstant",
      title: "O'zgarmas va yig'indi",
      tagline: "(c)′ = 0",
      theory: "O'zgarmasning hosilasi 0; yig'indining hosilasi hosilalar yig'indisiga teng.",
      gen() {
        const c = ri(2, 20);
        const k = ri(2, 9);
        const x0 = ri(1, 4);
        const val = 2 * k * x0;
        return {
          prompt: `f(x) = ${k}x² + ${c}. <b>f′(${x0})</b> ni toping.`,
          answer: `${val}`,
          distractors: [`${val + c}`, `${k * x0 * x0 + c}`, `${val + 2}`],
          hint: "O'zgarmasning hosilasi nolga teng.",
          steps: [
            `f′(x) = ${2 * k}x + 0`,
            `f′(${x0}) = ${2 * k}·${x0} = ${val}`,
          ],
        };
      },
    },
  ],
};
