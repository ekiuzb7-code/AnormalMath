// AnormalMath — Algebra bo'limi
import { ri, pick, fmt } from "../engine.js";

const quad = () => {
  const r1 = ri(-6, 6);
  const r2 = ri(-6, 6);
  const a = pick([1, 1, 1, 2]);
  const b = -a * (r1 + r2);
  const c = a * r1 * r2;
  const D = b * b - 4 * a * c;
  return { a, b, c, r1, r2, D };
};

const sgn = (n) => (n < 0 ? `− ${Math.abs(n)}` : `+ ${n}`);
const poly = (a, b, c) => `${a === 1 ? "" : a}x² ${sgn(b)}x ${sgn(c)} = 0`;

export const algebra = {
  id: "algebra",
  title: "Algebra",
  glyph: "∑",
  accent: "#22c55e",
  blurb: "Kvadrat tenglama, progressiya, logarifm — algebra yadrosi.",
  topics: [
    {
      id: "algebra.discriminant",
      title: "Diskriminant",
      tagline: "Ildizlarni topish",
      theory:
        "ax² + bx + c = 0 tenglama uchun D = b² − 4ac. D > 0 bo'lsa ikki ildiz: x = (−b ± √D) / 2a.",
      gen() {
        const { a, b, c, r1, r2, D } = quad();
        return {
          prompt: `Tenglamani yeching: <b>${poly(a, b, c)}</b>`,
          answer: `${r1} va ${r2}`,
          distractors: [`${r1} va ${-r2}`, `${-r1} va ${-r2}`, `${r1 + 1} va ${r2 - 1}`],
          hint: `Avval diskriminantni hisoblang: D = b² − 4ac.`,
          steps: [
            `a = ${a}, b = ${b}, c = ${c}`,
            `D = (${b})² − 4·${a}·${c} = ${D}`,
            `√D = ${Math.sqrt(D)}`,
            `x₁ = (${-b} + ${Math.sqrt(D)}) / ${2 * a} = ${r1}`,
            `x₂ = (${-b} − ${Math.sqrt(D)}) / ${2 * a} = ${r2}`,
          ],
        };
      },
    },
    {
      id: "algebra.vieta",
      title: "Vyeta teoremasi",
      tagline: "Ildizlar yig'indisi va ko'paytmasi",
      theory:
        "x² + px + q = 0 tenglama uchun x₁ + x₂ = −p, x₁·x₂ = q. Ildizlarni topmasdan ham yig'indi va ko'paytmani bilish mumkin.",
      gen() {
        const r1 = ri(-8, 8) || 2;
        const r2 = ri(-8, 8) || 3;
        const p = -(r1 + r2);
        const q = r1 * r2;
        return {
          prompt: `x² ${sgn(p)}x ${sgn(q)} = 0 tenglamaning ildizlari yig'indisi va ko'paytmasini toping.`,
          answer: `yig'indi ${r1 + r2}, ko'paytma ${q}`,
          distractors: [
            `yig'indi ${-(r1 + r2)}, ko'paytma ${q}`,
            `yig'indi ${r1 + r2}, ko'paytma ${-q}`,
            `yig'indi ${q}, ko'paytma ${r1 + r2}`,
          ],
          hint: "Vyeta: yig'indi = −p, ko'paytma = q.",
          steps: [
            `p = ${p}, q = ${q}`,
            `x₁ + x₂ = −p = ${r1 + r2}`,
            `x₁ · x₂ = q = ${q}`,
            `Tekshirish: ildizlar ${r1} va ${r2}`,
          ],
        };
      },
    },
    {
      id: "algebra.arifmetik",
      title: "Arifmetik progressiya",
      tagline: "n-hadni topish",
      theory: "aₙ = a₁ + (n − 1)d, bu yerda d — ayirma.",
      gen() {
        const a1 = ri(-5, 9);
        const d = ri(2, 7);
        const n = ri(8, 20);
        const an = a1 + (n - 1) * d;
        return {
          prompt: `Arifmetik progressiyada a₁ = ${a1}, d = ${d}. <b>a<sub>${n}</sub></b> ni toping.`,
          answer: `${an}`,
          distractors: [`${an + d}`, `${an - d}`, `${a1 + n * d}`],
          hint: `aₙ = a₁ + (n − 1)d formulasidan foydalaning.`,
          steps: [
            `aₙ = a₁ + (n − 1)d`,
            `a${n} = ${a1} + (${n} − 1)·${d}`,
            `a${n} = ${a1} + ${(n - 1) * d} = ${an}`,
          ],
        };
      },
    },
    {
      id: "algebra.geometrik",
      title: "Geometrik progressiya",
      tagline: "n-had va yig'indi",
      theory: "bₙ = b₁·qⁿ⁻¹. Dastlabki n had yig'indisi: Sₙ = b₁(qⁿ − 1)/(q − 1).",
      gen() {
        const b1 = ri(1, 4);
        const q = pick([2, 3]);
        const n = ri(4, 6);
        const bn = b1 * Math.pow(q, n - 1);
        const S = (b1 * (Math.pow(q, n) - 1)) / (q - 1);
        return {
          prompt: `Geometrik progressiyada b₁ = ${b1}, q = ${q}. Dastlabki <b>${n}</b> had yig'indisini toping.`,
          answer: `${S}`,
          distractors: [`${bn}`, `${S + b1}`, `${S - q}`],
          hint: "Sₙ = b₁(qⁿ − 1)/(q − 1).",
          steps: [
            `qⁿ = ${q}^${n} = ${Math.pow(q, n)}`,
            `Sₙ = ${b1}·(${Math.pow(q, n)} − 1) / (${q} − 1)`,
            `Sₙ = ${b1}·${Math.pow(q, n) - 1} / ${q - 1} = ${S}`,
          ],
        };
      },
    },
    {
      id: "algebra.logarifm",
      title: "Logarifm",
      tagline: "Qiymatni hisoblash",
      theory: "logₐ b = c ⟺ aᶜ = b. Masalan log₂ 8 = 3, chunki 2³ = 8.",
      gen() {
        const a = pick([2, 3, 5, 10]);
        const c = ri(2, 5);
        const b = Math.pow(a, c);
        return {
          prompt: `<b>log<sub>${a}</sub> ${b}</b> ni hisoblang.`,
          answer: `${c}`,
          distractors: [`${c + 1}`, `${c - 1}`, `${a}`],
          hint: `${a} ni necha darajaga ko'tarsak ${b} bo'ladi?`,
          steps: [
            `logₐ b = c degani aᶜ = b`,
            `${a}ˣ = ${b}`,
            `${a}^${c} = ${b}, demak javob ${c}`,
          ],
        };
      },
    },
    {
      id: "algebra.daraja",
      title: "Daraja xossalari",
      tagline: "Ifodani soddalashtirish",
      theory: "aᵐ·aⁿ = aᵐ⁺ⁿ, (aᵐ)ⁿ = aᵐⁿ, aᵐ/aⁿ = aᵐ⁻ⁿ.",
      gen() {
        const a = pick([2, 3, 5]);
        const m = ri(2, 5);
        const n = ri(3, 6);
        const v = Math.pow(a, m + n - n);
        return {
          prompt: `<b>(${a}<sup>${m}</sup>)<sup>${n}</sup> ÷ ${a}<sup>${n * (m - 1)}</sup></b> ifodani soddalashtiring. Javobni son bilan yozing.`,
          answer: `${Math.pow(a, m * n - n * (m - 1))}`,
          distractors: [`${Math.pow(a, m)}`, `${Math.pow(a, n)}`, `${a}`],
          hint: "(aᵐ)ⁿ = aᵐⁿ, keyin darajalarni ayiring.",
          steps: [
            `(${a}^${m})^${n} = ${a}^${m * n}`,
            `${a}^${m * n} ÷ ${a}^${n * (m - 1)} = ${a}^(${m * n} − ${n * (m - 1)})`,
            `= ${a}^${m * n - n * (m - 1)} = ${Math.pow(a, m * n - n * (m - 1))}`,
          ],
        };
      },
    },
    {
      id: "algebra.linear",
      title: "Chiziqli tenglama",
      tagline: "ax + b = c",
      theory: "ax + b = c ⟹ x = (c − b)/a. Avval ozod hadni o'ng tomonga o'tkazing, keyin koeffitsiyentga bo'ling.",
      gen() {
        const a = ri(2, 9);
        const x = ri(-6, 9);
        const b = ri(-12, 12);
        const c = a * x + b;
        return {
          prompt: `Tenglamani yeching: <b>${a}x ${sgn(b)} = ${c}</b>`,
          answer: `${x}`,
          distractors: [`${x + 1}`, `${c - b}`, `${-x}`],
          hint: "Avval b ni o'ng tomonga o'tkazing.",
          steps: [
            `${a}x = ${c} − (${b}) = ${c - b}`,
            `x = ${c - b} / ${a}`,
            `x = ${x}`,
          ],
        };
      },
    },
    {
      id: "algebra.system",
      title: "Tenglamalar sistemasi",
      tagline: "Ikki noma'lumli sistema",
      theory: "x + y = S va x − y = D bo'lsa, x = (S + D)/2, y = (S − D)/2.",
      gen() {
        const x = ri(-5, 9) || 3;
        const y = ri(-5, 9) || 2;
        const S = x + y;
        const D = x - y;
        return {
          prompt: `Sistemani yeching:<br>x + y = ${S}<br>x − y = ${D}`,
          answer: `x = ${x}, y = ${y}`,
          distractors: [`x = ${y}, y = ${x}`, `x = ${S}, y = ${D}`, `x = ${x + 1}, y = ${y - 1}`],
          hint: "Ikki tenglamani qo'shsangiz y yo'qoladi.",
          steps: [
            `Qo'shamiz: 2x = ${S} + ${D} = ${S + D}`,
            `x = ${x}`,
            `y = ${S} − x = ${S} − ${x} = ${y}`,
          ],
        };
      },
    },
    {
      id: "algebra.inequality",
      title: "Chiziqli tengsizlik",
      tagline: "Eng kichik butun yechim",
      theory: "ax + b ≥ c ko'rinishidagi tengsizlikni yechib, chegaradan keyingi butun sonni oling.",
      gen() {
        const a = ri(2, 6);
        const x0 = ri(-3, 6);
        const b = ri(-9, 9);
        const c = a * x0 + b;
        return {
          prompt: `<b>${a}x ${sgn(b)} ≥ ${c}</b> tengsizlikning eng kichik butun yechimini toping.`,
          answer: `${x0}`,
          distractors: [`${x0 - 1}`, `${x0 + 1}`, `${c - b}`],
          hint: "b ni o'ng tomonga o'tkazib, a ga bo'ling. a > 0 bo'lsa ishora o'zgarmaydi.",
          steps: [
            `${a}x ≥ ${c} − (${b}) = ${c - b}`,
            `x ≥ ${x0}`,
            `Eng kichik butun yechim: ${x0}`,
          ],
        };
      },
    },
    {
      id: "algebra.quadInequality",
      title: "Kvadrat tengsizlik",
      tagline: "Orasidagi butun sonlar",
      theory: "(x − r₁)(x − r₂) < 0 bo'lsa yechim r₁ < x < r₂ oralig'i, bu yerda r₁ < r₂.",
      gen() {
        const r1 = ri(-5, 3);
        const r2 = r1 + ri(3, 7);
        const count = r2 - r1 - 1;
        return {
          prompt: `<b>(x − ${r1})(x − ${r2}) < 0</b> tengsizlikni nechta butun son qanoatlantiradi?`,
          answer: `${count}`,
          distractors: [`${count + 1}`, `${count + 2}`, `${r2 - r1}`],
          hint: "Ildizlar orasidagi oraliqni toping.",
          steps: [
            `Ildizlar: ${r1} va ${r2}`,
            `Yechim: ${r1} < x < ${r2}`,
            `Butun sonlar: ${r1 + 1} … ${r2 - 1} — jami ${count} ta`,
          ],
        };
      },
    },
    {
      id: "algebra.vertex",
      title: "Parabola uchi",
      tagline: "f(x) = ax² + bx + c",
      theory: "Parabolaning uchi x₀ = −b/(2a) nuqtada bo'ladi.",
      gen() {
        const a = pick([1, 1, 2]);
        const x0 = ri(-4, 5);
        const b = -2 * a * x0;
        const c = ri(-9, 9);
        return {
          prompt: `<b>f(x) = ${a}x² ${sgn(b)}x ${sgn(c)}</b> parabolasining uchi qaysi x da joylashgan?`,
          answer: `${x0}`,
          distractors: [`${-x0}`, `${b}`, `${x0 + 1}`],
          hint: "x₀ = −b/(2a).",
          steps: [
            `a = ${a}, b = ${b}`,
            `x₀ = −(${b}) / (2·${a}) = ${-b} / ${2 * a}`,
            `x₀ = ${x0}`,
          ],
        };
      },
    },
    {
      id: "algebra.sqrt",
      title: "Ildiz soddalashtirish",
      tagline: "√(n²·m) = n√m",
      theory: "Kvadrat ildiz ostidan to'liq kvadrat ajratiladi: √(n²·m) = n√m.",
      gen() {
        const n = ri(2, 7);
        const m = pick([2, 3, 5, 6, 7]);
        return {
          prompt: `<b>√${n * n * m}</b> ni soddalashtiring.`,
          answer: `${n}√${m}`,
          distractors: [`${n * m}√${m}`, `${n}√${m * n}`, `${n + 1}√${m}`],
          hint: `${n * n * m} = ${n * n} · ${m}, ${n * n} to'liq kvadrat.`,
          steps: [
            `√${n * n * m} = √(${n * n} · ${m})`,
            `= ${n}√${m}`,
          ],
        };
      },
    },
    {
      id: "algebra.expEquation",
      title: "Ko'rsatkichli tenglama",
      tagline: "aˣ = aᵏ",
      theory: "Asoslar teng bo'lsa, darajalar ham teng: aˣ = aᵏ ⟹ x = k.",
      gen() {
        const a = pick([2, 3, 5]);
        const k = ri(2, 5);
        return {
          prompt: `Tenglamani yeching: <b>${a}ˣ = ${Math.pow(a, k)}</b>`,
          answer: `${k}`,
          distractors: [`${k + 1}`, `${a + k}`, `${Math.pow(a, k) / a}`],
          hint: `${Math.pow(a, k)} sonini ${a} ning darajasi ko'rinishida yozing.`,
          steps: [
            `${Math.pow(a, k)} = ${a}^${k}`,
            `${a}ˣ = ${a}^${k}`,
            `x = ${k}`,
          ],
        };
      },
    },
    {
      id: "algebra.logEquation",
      title: "Logarifmik tenglama",
      tagline: "logₐ x = k",
      theory: "logₐ x = k ⟹ x = aᵏ.",
      gen() {
        const a = pick([2, 3, 5]);
        const k = ri(2, 4);
        return {
          prompt: `Tenglamani yeching: <b>log<sub>${a}</sub> x = ${k}</b>`,
          answer: `${Math.pow(a, k)}`,
          distractors: [`${a * k}`, `${k * k}`, `${a + k}`],
          hint: `x = ${a}^${k}.`,
          steps: [
            `logₐ x = k ⟹ x = aᵏ`,
            `x = ${a}^${k}`,
            `x = ${Math.pow(a, k)}`,
          ],
        };
      },
    },
    {
      id: "algebra.arithmeticSum",
      title: "Progressiya yig'indisi",
      tagline: "Sₙ = n(a₁ + aₙ)/2",
      theory: "Arifmetik progressiya yig'indisi: Sₙ = n(a₁ + aₙ)/2.",
      gen() {
        const a1 = ri(2, 9);
        const d = ri(2, 6);
        const n = ri(5, 12);
        const an = a1 + (n - 1) * d;
        const S = (n * (a1 + an)) / 2;
        return {
          prompt: `Arifmetik progressiyada a₁ = ${a1}, d = ${d}. Dastlabki <b>${n}</b> had yig'indisini toping.`,
          answer: `${S}`,
          distractors: [`${an}`, `${S + a1}`, `${a1 * n}`],
          hint: "Avval aₙ ni toping, keyin Sₙ = n(a₁ + aₙ)/2.",
          steps: [
            `a${n} = ${a1} + ${n - 1}·${d} = ${an}`,
            `S${n} = ${n}·(${a1} + ${an}) / 2`,
            `S${n} = ${S}`,
          ],
        };
      },
    },
    {
      id: "algebra.geometricN",
      title: "Geometrik progressiya hadi",
      tagline: "bₙ = b₁·qⁿ⁻¹",
      theory: "Geometrik progressiyaning n-hadi: bₙ = b₁·qⁿ⁻¹.",
      gen() {
        const b1 = ri(2, 5);
        const q = pick([2, 3]);
        const n = ri(4, 6);
        const bn = b1 * Math.pow(q, n - 1);
        return {
          prompt: `Geometrik progressiyada b₁ = ${b1}, q = ${q}. <b>b<sub>${n}</sub></b> ni toping.`,
          answer: `${bn}`,
          distractors: [`${b1 * Math.pow(q, n)}`, `${b1 * n}`, `${bn / q}`],
          hint: "bₙ = b₁·qⁿ⁻¹.",
          steps: [
            `b${n} = ${b1}·${q}^${n - 1}`,
            `${q}^${n - 1} = ${Math.pow(q, n - 1)}`,
            `b${n} = ${bn}`,
          ],
        };
      },
    },
    {
      id: "algebra.absValue",
      title: "Modul tenglama",
      tagline: "|x − a| = b",
      theory: "|x − a| = b ⟹ x = a + b yoki x = a − b. Ildizlar yig'indisi 2a ga teng.",
      gen() {
        const a = ri(-6, 8);
        const b = ri(2, 7);
        return {
          prompt: `<b>|x − ${a}| = ${b}</b> tenglama ildizlarining yig'indisini toping.`,
          answer: `${2 * a}`,
          distractors: [`${a}`, `${b}`, `${2 * b}`],
          hint: "Ildizlar: a − b va a + b.",
          steps: [
            `x₁ = ${a} − ${b} = ${a - b}`,
            `x₂ = ${a} + ${b} = ${a + b}`,
            `Yig'indi = ${a - b} + ${a + b} = ${2 * a}`,
          ],
        };
      },
    },
    {
      id: "algebra.binomial",
      title: "Ikkihad kvadrati",
      tagline: "(x + a)²",
      theory: "(x + a)² = x² + 2ax + a². x oldidagi koeffitsiyent 2a ga teng.",
      gen() {
        const a = ri(2, 9);
        const sign = pick([" + ", " − "]);
        const coef = sign === " + " ? 2 * a : -2 * a;
        return {
          prompt: `<b>(x${sign}${a})²</b> ifodani yoyganda x oldidagi koeffitsiyent nechaga teng?`,
          answer: `${coef}`,
          distractors: [`${a}`, `${a * a}`, `${coef + 1}`],
          hint: "(x ± a)² = x² ± 2ax + a².",
          steps: [
            `(x${sign}${a})² = x² ${coef < 0 ? "−" : "+"} ${Math.abs(coef)}x + ${a * a}`,
            `x oldidagi koeffitsiyent: ${coef}`,
          ],
        };
      },
    },
    {
      id: "algebra.solveFor",
      title: "Formuladan ifodalash",
      tagline: "O'zgaruvchini ajratish",
      theory: "Formuladan kerakli o'zgaruvchini ajratish uchun qolgan amallarni teskari tartibda qo'llang.",
      gen() {
        const cases = [
          { f: "S = v · t", q: "v", a: "S / t", w: ["S · t", "t / S", "S − t"] },
          { f: "P = 2(a + b)", q: "b", a: "P/2 − a", w: ["P − 2a", "P/2 + a", "P − a"] },
          { f: "C = 2πr", q: "r", a: "C / (2π)", w: ["2πC", "C / π", "C − 2π"] },
          { f: "A = ½ah", q: "h", a: "2A / a", w: ["A / a", "2Aa", "A − 2a"] },
        ];
        const c = pick(cases);
        return {
          prompt: `<b>${c.f}</b> formulasidan <b>${c.q}</b> ni ifodalang.`,
          answer: `${c.q} = ${c.a}`,
          distractors: c.w.map((w) => `${c.q} = ${w}`),
          hint: "Qolgan o'zgaruvchilarni teskari amal bilan ajrating.",
          steps: [
            `Berilgan: ${c.f}`,
            `Kerakli o'zgaruvchini yolg'iz qoldiring`,
            `Javob: ${c.q} = ${c.a}`,
          ],
        };
      },
    },
    {
      id: "algebra.rational",
      title: "Kasrni qisqartirish",
      tagline: "(x² − a²)/(x − a)",
      theory: "Kvadratlar ayirmasi: x² − a² = (x − a)(x + a). Shu sababli kasr x + a ga qisqaradi.",
      gen() {
        const a = ri(2, 9);
        return {
          prompt: `<b>(x² − ${a * a}) / (x − ${a})</b> kasrni soddalashtiring.`,
          answer: `x + ${a}`,
          distractors: [`x − ${a}`, `x² + ${a}`, `${a}`],
          hint: "Suratni kvadratlar ayirmasi sifatida yoying.",
          steps: [
            `x² − ${a * a} = (x − ${a})(x + ${a})`,
            `Kasr: (x − ${a})(x + ${a}) / (x − ${a})`,
            `= x + ${a}`,
          ],
        };
      },
    },
    {
      id: "algebra.slope",
      title: "Og'ish burchak koeffitsiyenti",
      tagline: "k = (y₂ − y₁)/(x₂ − x₁)",
      theory: "Ikki nuqtadan o'tuvchi to'g'ri chiziqning burchak koeffitsiyenti k = (y₂ − y₁)/(x₂ − x₁).",
      gen() {
        const x1 = ri(-5, 4);
        const y1 = ri(-5, 5);
        const k = ri(2, 5) * pick([1, -1]);
        const dx = ri(1, 4);
        const x2 = x1 + dx;
        const y2 = y1 + k * dx;
        return {
          prompt: `A(${x1}; ${y1}) va B(${x2}; ${y2}) nuqtalardan o'tuvchi to'g'ri chiziqning burchak koeffitsiyentini toping.`,
          answer: `${k}`,
          distractors: [`${-k}`, `${dx}`, `${y2 - y1}`],
          hint: "k = Δy / Δx.",
          steps: [
            `Δy = ${y2} − ${y1} = ${y2 - y1}`,
            `Δx = ${x2} − ${x1} = ${dx}`,
            `k = ${y2 - y1} / ${dx} = ${k}`,
          ],
        };
      },
    },
    {
      id: "algebra.lineEquation",
      title: "To'g'ri chiziq tenglamasi",
      tagline: "y = kx + b",
      theory: "y = kx + b da k ma'lum bo'lsa, nuqta koordinatalarini qo'yib b ni topamiz.",
      gen() {
        const k = ri(2, 5) * pick([1, -1]);
        const b = ri(-6, 6);
        const x0 = ri(-3, 4);
        const y0 = k * x0 + b;
        return {
          prompt: `To'g'ri chiziq k = ${k} va (${x0}; ${y0}) nuqtadan o'tadi. Uning <b>b</b> hadini toping.`,
          answer: `${b}`,
          distractors: [`${-b}`, `${y0}`, `${k + x0}`],
          hint: "y = kx + b ⟹ b = y − kx.",
          steps: [
            `b = y − k·x = ${y0} − ${k}·${x0}`,
            `b = ${y0} − ${k * x0}`,
            `b = ${b}`,
          ],
        };
      },
    },
    {
      id: "algebra.parallel",
      title: "Parallel va perpendikulyar",
      tagline: "k₁ = k₂ ; k₁·k₂ = −1",
      theory: "Parallel to'g'ri chiziqlarda koeffitsiyentlar teng, perpendikulyarlarda ko'paytma −1 ga teng.",
      gen() {
        const k = pick([2, 3, 4, 5]);
        const kind = pick(["parallel", "perpendicular"]);
        const ans = kind === "parallel" ? `${k}` : `−1/${k}`;
        return {
          prompt: `Burchak koeffitsiyenti <b>${k}</b> bo'lgan to'g'ri chiziqqa <b>${kind === "parallel" ? "parallel" : "perpendikulyar"}</b> chiziqning koeffitsiyenti nechaga teng?`,
          answer: ans,
          distractors: kind === "parallel" ? [`−1/${k}`, `${-k}`, `${k + 1}`] : [`${k}`, `${-k}`, `1/${k}`],
          hint: kind === "parallel" ? "Parallel — k₁ = k₂." : "Perpendikulyar — k₁·k₂ = −1.",
          steps:
            kind === "parallel"
              ? [`k₂ = k₁ = ${k}`]
              : [`k₁·k₂ = −1`, `k₂ = −1/${k}`],
        };
      },
    },
    {
      id: "algebra.domain",
      title: "Aniqlanish sohasi",
      tagline: "√ ifodaning chegarasi",
      theory: "√f(x) ifoda aniqlangan bo'lishi uchun f(x) ≥ 0 bo'lishi kerak.",
      gen() {
        const a = ri(2, 9);
        return {
          prompt: `<b>√(${a} − x)</b> ifoda aniqlangan bo'lishi uchun x ning eng katta butun qiymati nechaga teng?`,
          answer: `${a}`,
          distractors: [`${a - 1}`, `${-a}`, `${a + 1}`],
          hint: "Ildiz ostidagi ifoda nomanfiy bo'lishi kerak.",
          steps: [
            `${a} − x ≥ 0`,
            `x ≤ ${a}`,
            `Eng katta butun qiymat: ${a}`,
          ],
        };
      },
    },
    {
      id: "algebra.functionValue",
      title: "Funksiya qiymati",
      tagline: "f(x₀) ni hisoblash",
      theory: "f(x) ifodada x o'rniga berilgan sonni qo'yib hisoblash kifoya.",
      gen() {
        const a = ri(1, 3);
        const b = ri(-4, 4);
        const c = ri(-6, 6);
        const x0 = ri(-2, 3);
        const val = a * x0 * x0 + b * x0 + c;
        return {
          prompt: `f(x) = ${a}x² ${sgn(b)}x ${sgn(c)}. <b>f(${x0})</b> ni toping.`,
          answer: `${val}`,
          distractors: [`${val + a}`, `${a * x0 + b * x0 + c}`, `${val - c}`],
          hint: `x o'rniga ${x0} qo'ying.`,
          steps: [
            `f(${x0}) = ${a}·(${x0})² ${sgn(b)}·(${x0}) ${sgn(c)}`,
            `= ${a * x0 * x0} ${sgn(b * x0)} ${sgn(c)}`,
            `= ${val}`,
          ],
        };
      },
    },
    {
      id: "algebra.mixture",
      title: "Aralashma",
      tagline: "Konsentratsiya hisobi",
      theory: "Aralashma konsentratsiyasi = (modda miqdori) / (umumiy massa) · 100%.",
      gen() {
        const m1 = ri(2, 8);
        const p1 = 20;
        const m2 = ri(2, 8);
        const p2 = 50;
        const pure = (m1 * p1 + m2 * p2) / 100;
        const total = m1 + m2;
        const pct = Math.round((pure / total) * 1000) / 10;
        return {
          prompt: `<b>${m1} kg</b> 20% li eritma bilan <b>${m2} kg</b> 50% li eritma aralashtirildi. Hosil bo'lgan eritmaning konsentratsiyasi necha foiz?`,
          answer: `${fmt(pct)}%`,
          distractors: [`${fmt(Math.round(((p1 + p2) / 2) * 10) / 10)}%`, `${fmt(Math.round(pct * 2 * 10) / 10)}%`, `${p1 + p2}%`],
          hint: "Sof modda miqdorini topib, umumiy massaga bo'ling.",
          steps: [
            `Sof modda: ${m1}·0,20 + ${m2}·0,50 = ${fmt(Math.round(pure * 100) / 100)} kg`,
            `Umumiy massa: ${m1} + ${m2} = ${total} kg`,
            `Konsentratsiya = ${fmt(Math.round((pure / total) * 1000) / 10)}%`,
          ],
        };
      },
    },
    {
      id: "algebra.ratioSplit",
      title: "Nisbatda bo'lish",
      tagline: "a : b nisbatda taqsimlash",
      theory: "Sonni a:b nisbatda bo'lish uchun uni (a + b) bo'lakka bo'lib, har biriga a va b ulush beriladi.",
      gen() {
        const a = ri(2, 5);
        const b = ri(2, 6);
        const unit = ri(4, 12);
        const total = (a + b) * unit;
        return {
          prompt: `<b>${total}</b> ni ${a} : ${b} nisbatda bo'ling. Katta qismi nechaga teng?`,
          answer: `${Math.max(a, b) * unit}`,
          distractors: [`${Math.min(a, b) * unit}`, `${unit}`, `${total / 2}`],
          hint: `Jami ${a + b} bo'lak. Bitta bo'lak = ${total}/${a + b}.`,
          steps: [
            `Bo'laklar yig'indisi = ${a} + ${b} = ${a + b}`,
            `Bitta bo'lak = ${total} / ${a + b} = ${unit}`,
            `Katta qism = ${Math.max(a, b)}·${unit} = ${Math.max(a, b) * unit}`,
          ],
        };
      },
    },
    {
      id: "algebra.twoDigit",
      title: "Ikki xonali son",
      tagline: "Raqamlar orqali topish",
      theory: "Ikki xonali son 10a + b ko'rinishida yoziladi, bu yerda a — o'nliklar, b — birliklar.",
      gen() {
        const a = ri(1, 9);
        const b = ri(1, 9);
        const sum = a + b;
        const diff = a - b;
        return {
          prompt: `Ikki xonali sonning raqamlari yig'indisi <b>${sum}</b>, o'nliklar raqami birliklardan <b>${diff}</b> ga katta. Sonni toping.`,
          answer: `${a * 10 + b}`,
          distractors: [`${b * 10 + a}`, `${a * 10 + a}`, `${a * 10 + b + 1}`],
          hint: "a + b = yig'indi, a − b = ayirma. Ikkisini qo'shing.",
          steps: [
            `a + b = ${sum}, a − b = ${diff}`,
            `2a = ${sum + diff} ⟹ a = ${a}`,
            `b = ${sum} − ${a} = ${b}, son = ${a * 10 + b}`,
          ],
        };
      },
    },
    {
      id: "algebra.expNegative",
      title: "Manfiy daraja",
      tagline: "a⁻ⁿ = 1/aⁿ",
      theory: "Manfiy daraja kasrga aylanadi: a⁻ⁿ = 1/aⁿ. (a/b)⁻ⁿ = (b/a)ⁿ.",
      gen() {
        const a = pick([2, 3, 4, 5]);
        const n = ri(1, 3);
        return {
          prompt: `<b>${a}⁻${n}</b> ni hisoblang.`,
          answer: `1/${Math.pow(a, n)}`,
          distractors: [`${-Math.pow(a, n)}`, `1/${a * n}`, `${Math.pow(a, n)}`],
          hint: "a⁻ⁿ = 1/aⁿ.",
          steps: [
            `${a}⁻${n} = 1/${a}^${n}`,
            `${a}^${n} = ${Math.pow(a, n)}`,
            `Javob: 1/${Math.pow(a, n)}`,
          ],
        };
      },
    },
    {
      id: "algebra.sqrtEquation",
      title: "Ildizli tenglama",
      tagline: "√x = a",
      theory: "√x = a ⟹ x = a², bu yerda a ≥ 0.",
      gen() {
        const a = ri(2, 12);
        return {
          prompt: `Tenglamani yeching: <b>√x = ${a}</b>`,
          answer: `${a * a}`,
          distractors: [`${a * 2}`, `${a}`, `${a * a + a}`],
          hint: "Ikkala tomonni kvadratga ko'taring.",
          steps: [`x = (${a})²`, `x = ${a * a}`],
        };
      },
    },
    {
      id: "algebra.polyAdd",
      title: "Ko'phadlarni qo'shish",
      tagline: "O'xshash hadlar",
      theory: "Ko'phadlarni qo'shganda bir xil darajali hadlar qo'shiladi.",
      gen() {
        const a = ri(1, 5);
        const b = ri(-6, 6);
        const c = ri(-9, 9);
        const d = ri(1, 5);
        const e = ri(-6, 6);
        const f = ri(-9, 9);
        const A = a + d;
        const B = b + e;
        const C = c + f;
        return {
          prompt: `<b>(${a}x² ${sgn(b)}x ${sgn(c)}) + (${d}x² ${sgn(e)}x ${sgn(f)})</b> yig'indini soddalashtiring.`,
          answer: `${A}x² ${sgn(B)}x ${sgn(C)}`,
          distractors: [`${A}x² ${sgn(B)}x ${sgn(C + 1)}`, `${a * d}x² ${sgn(B)}x ${sgn(C)}`, `${A}x² ${sgn(b)}x ${sgn(c)}`],
          hint: "Bir xil darajali hadlarni alohida qo'shing.",
          steps: [
            `x²: ${a} + ${d} = ${A}`,
            `x: ${b} + (${e}) = ${B}`,
            `ozod had: ${c} + (${f}) = ${C}`,
          ],
        };
      },
    },
    {
      id: "algebra.polyMultiply",
      title: "Ko'phadlarni ko'paytirish",
      tagline: "(x + a)(x + b)",
      theory: "(x + a)(x + b) = x² + (a + b)x + ab.",
      gen() {
        const a = ri(-6, 6) || 2;
        const b = ri(-6, 6) || 3;
        return {
          prompt: `<b>(x ${sgn(a)})(x ${sgn(b)})</b> ko'paytmani yoying.`,
          answer: `x² ${sgn(a + b)}x ${sgn(a * b)}`,
          distractors: [`x² ${sgn(a * b)}x ${sgn(a + b)}`, `x² ${sgn(a + b)}x ${sgn(-(a * b))}`, `x² ${sgn(a)}x ${sgn(b)}`],
          hint: "Yig'indi x oldidagi koeffitsiyent, ko'paytma — ozod had.",
          steps: [
            `x·x = x²`,
            `x·${b} + ${a}·x = ${a + b}x`,
            `${a}·${b} = ${a * b}`,
          ],
        };
      },
    },
    {
      id: "algebra.factorCommon",
      title: "Umumiy ko'paytuvchi",
      tagline: "Qavsga chiqarish",
      theory: "Umumiy ko'paytuvchi qavsdan tashqariga chiqariladi: ka + kb = k(a + b).",
      gen() {
        const k = ri(2, 6);
        const p = ri(2, 5);
        const q = ri(-6, 6) || 3;
        return {
          prompt: `<b>${k * p}x² ${sgn(k * q)}x</b> ifodadan umumiy ko'paytuvchini chiqaring.`,
          answer: `${k}x(${p}x ${sgn(q)})`,
          distractors: [`${k}(${p}x² ${sgn(q)}x)`, `${p}x(${k}x ${sgn(q)})`, `${k}x(${p}x ${sgn(-q)})`],
          hint: "Ikkala hadda ham qaysi ko'paytuvchi bor?",
          steps: [
            `Umumiy ko'paytuvchi: ${k}x`,
            `${k * p}x² = ${k}x · ${p}x`,
            `${k * q}x = ${k}x · ${q}`,
          ],
        };
      },
    },
    {
      id: "algebra.absInequality",
      title: "Modul tengsizlik",
      tagline: "|x| < a",
      theory: "|x| < a ⟹ −a < x < a. |x| > a ⟹ x < −a yoki x > a.",
      gen() {
        const a = ri(2, 9);
        const mode = pick(["<", ">"]);
        return {
          prompt: `<b>|x| ${mode} ${a}</b> tengsizlikni nechta butun son qanoatlantiradi?`,
          answer: mode === "<" ? `${2 * a - 1}` : `cheksiz ko'p`,
          distractors:
            mode === "<"
              ? [`${2 * a + 1}`, `${a}`, `${2 * a}`]
              : [`${2 * a - 1}`, `${a}`, `0`],
          hint: mode === "<" ? "−a < x < a oralig'i." : "x < −a yoki x > a — chegara yo'q.",
          steps:
            mode === "<"
              ? [
                  `−${a} < x < ${a}`,
                  `Butun sonlar: ${-a + 1} … ${a - 1}`,
                  `Jami: ${2 * a - 1} ta`,
                ]
              : [`x < −${a} yoki x > ${a}`, `Har tomonda cheksiz ko'p butun son bor`],
        };
      },
    },
    {
      id: "algebra.xIntercept",
      title: "Funksiya noli",
      tagline: "kx + b = 0",
      theory: "f(x) = kx + b funksiyaning noli x = −b/k nuqtada.",
      gen() {
        const k = ri(2, 6) * pick([1, -1]);
        const x0 = ri(-5, 5) || 2;
        const b = -k * x0;
        return {
          prompt: `f(x) = ${k}x ${sgn(b)}. Funksiyaning nolini (Ox o'qi bilan kesishish nuqtasini) toping.`,
          answer: `${x0}`,
          distractors: [`${-x0}`, `${b}`, `${k}`],
          hint: "f(x) = 0 yeching.",
          steps: [
            `${k}x ${sgn(b)} = 0`,
            `${k}x = ${-b}`,
            `x = ${x0}`,
          ],
        };
      },
    },
    {
      id: "algebra.geometricInfinite",
      title: "Cheksiz kamayuvchi progressiya",
      tagline: "S = b₁/(1 − q)",
      theory: "|q| < 1 bo'lsa, cheksiz yig'indi S = b₁/(1 − q).",
      gen() {
        const b1 = ri(2, 12);
        const q = pick([2, 3, 4]);
        const den = q - 1;
        const S = (b1 * q) / den;
        return {
          prompt: `Cheksiz kamayuvchi geometrik progressiyada b₁ = ${b1 * q}, q = 1/${q}. Yig'indini toping.`,
          answer: `${S}`,
          distractors: [`${b1 * q}`, `${(b1 * q) / q}`, `${S + b1}`],
          hint: "S = b₁/(1 − q).",
          steps: [
            `b₁ = ${b1 * q}, q = 1/${q}`,
            `1 − q = ${q - 1}/${q}`,
            `S = ${b1 * q} · ${q}/${q - 1} = ${S}`,
          ],
        };
      },
    },
    {
      id: "algebra.logProperties",
      title: "Logarifm xossalari",
      tagline: "log(a·b) = log a + log b",
      theory: "log(xy) = log x + log y, log(x/y) = log x − log y, log xⁿ = n·log x.",
      gen() {
        const a = pick([2, 3, 5]);
        const m = ri(2, 3);
        const n = ri(2, 4);
        const val = m + n;
        return {
          prompt: `<b>log<sub>${a}</sub> ${Math.pow(a, m)} + log<sub>${a}</sub> ${Math.pow(a, n)}</b> ni hisoblang.`,
          answer: `${val}`,
          distractors: [`${m * n}`, `${val + 1}`, `${Math.pow(a, val)}`],
          hint: "log(x·y) = log x + log y.",
          steps: [
            `log<sub>${a}</sub>${Math.pow(a, m)} = ${m}, log<sub>${a}</sub>${Math.pow(a, n)} = ${n}`,
            `${m} + ${n} = ${val}`,
          ],
        };
      },
    },
    {
      id: "algebra.quadMin",
      title: "Kvadrat funksiya minimumi",
      tagline: "Uchning ordinatasi",
      theory: "f(x) = x² + bx + c uchun minimum qiymat f(−b/2) ga teng.",
      gen() {
        const x0 = ri(-5, 5);
        const c = ri(-6, 6);
        const b = -2 * x0;
        const minVal = x0 * x0 + b * x0 + c;
        return {
          prompt: `f(x) = x² ${sgn(b)}x ${sgn(c)}. Funksiyaning eng kichik qiymatini toping.`,
          answer: `${minVal}`,
          distractors: [`${c}`, `${minVal + 1}`, `${x0}`],
          hint: "Uchi x₀ = −b/2 da, qiymat f(x₀).",
          steps: [
            `x₀ = ${x0}`,
            `f(${x0}) = ${x0 * x0} ${sgn(b * x0)} ${sgn(c)}`,
            `= ${minVal}`,
          ],
        };
      },
    },
    {
      id: "algebra.sumProduct",
      title: "Ikki son masalasi",
      tagline: "Yig'indi va ko'paytma",
      theory: "Yig'indi S va ko'paytma P berilgan bo'lsa, sonlar t² − S·t + P = 0 tenglamaning ildizlari.",
      gen() {
        const a = ri(2, 9);
        const b = ri(2, 9);
        return {
          prompt: `Ikki sonning yig'indisi <b>${a + b}</b>, ko'paytmasi <b>${a * b}</b>. Shu sonlarni toping.`,
          answer: `${a} va ${b}`,
          distractors: [`${a + b} va ${a * b}`, `${a} va ${b + 1}`, `${a + 1} va ${b - 1}`],
          hint: "t² − (yig'indi)t + ko'paytma = 0 tenglamani tuzing.",
          steps: [
            `t² − ${a + b}t + ${a * b} = 0`,
            `Diskriminant: ${(a + b) * (a + b)} − 4·${a * b} = ${(a - b) * (a - b)}`,
            `Ildizlar: ${a} va ${b}`,
          ],
        };
      },
    },
    {
      id: "algebra.sameBase",
      title: "Asoslarni tenglashtirish",
      tagline: "4ˣ = 2⁶",
      theory: "Asoslarni bir xil qilib yozib, darajalarni tenglashtiramiz: (aᵏ)ˣ = aᵏˣ.",
      gen() {
        const k = pick([2, 3]);
        const a = 2;
        const x = ri(2, 4);
        const rightExp = k * x;
        return {
          prompt: `Tenglamani yeching: <b>${Math.pow(a, k)}ˣ = ${Math.pow(a, rightExp)}</b>`,
          answer: `${x}`,
          distractors: [`${rightExp}`, `${x + 1}`, `${k + x}`],
          hint: `${Math.pow(a, k)} = ${a}^${k}, o'ng tomonni ham ${a} asosiga keltiring.`,
          steps: [
            `${Math.pow(a, k)} = ${a}^${k}`,
            `${Math.pow(a, rightExp)} = ${a}^${rightExp}`,
            `${k}·x = ${rightExp} ⟹ x = ${x}`,
          ],
        };
      },
    },
    {
      id: "algebra.differenceSquares",
      title: "Kvadratlar ayirmasi",
      tagline: "x² − a² = (x − a)(x + a)",
      theory: "Kvadratlar ayirmasi: x² − a² = (x − a)(x + a).",
      gen() {
        const a = ri(2, 12);
        return {
          prompt: `<b>x² − ${a * a}</b> ni ko'paytuvchilarga ajrating.`,
          answer: `(x − ${a})(x + ${a})`,
          distractors: [`(x − ${a})²`, `(x + ${a})²`, `(x − ${a * 2})(x + ${a})`],
          hint: "x² − a² = (x − a)(x + a).",
          steps: [`${a * a} = ${a}²`, `x² − ${a}² = (x − ${a})(x + ${a})`],
        };
      },
    },
    {
      id: "algebra.perfectSquare",
      title: "To'liq kvadrat",
      tagline: "x² + 2ax + a²",
      theory: "x² + 2ax + a² = (x + a)². O'rta had yarim kvadrat ildizning ikki barobariga teng bo'lishi kerak.",
      gen() {
        const a = ri(2, 9);
        return {
          prompt: `<b>x² + ${2 * a}x + ${a * a}</b> ni to'liq kvadrat ko'rinishida yozing.`,
          answer: `(x + ${a})²`,
          distractors: [`(x − ${a})²`, `(x + ${a * 2})²`, `(x + ${a})(x − ${a})`],
          hint: `O'rta had ${2 * a}x = 2·${a}·x.`,
          steps: [
            `Ikki chekka: x² va ${a * a} = ${a}²`,
            `O'rta had: 2·${a}·x = ${2 * a}x ✓`,
            `Javob: (x + ${a})²`,
          ],
        };
      },
    },
    {
      id: "algebra.exponentDivide",
      title: "Darajalarni bo'lish",
      tagline: "aᵐ / aⁿ = aᵐ⁻ⁿ",
      theory: "Bir xil asosli darajalarni bo'lganda darajalar ayiriladi.",
      gen() {
        const a = pick([2, 3, 5]);
        const m = ri(5, 9);
        const n = ri(2, 4);
        return {
          prompt: `<b>${a}^${m} / ${a}^${n}</b> ni soddalashtiring.`,
          answer: `${a}^${m - n}`,
          distractors: [`${a}^${m + n}`, `${a}^${m * n}`, `${a}^${n}` ],
          hint: "aᵐ / aⁿ = aᵐ⁻ⁿ.",
          steps: [`${a}^${m} / ${a}^${n} = ${a}^(${m} − ${n})`, `= ${a}^${m - n}`],
        };
      },
    },
    {
      id: "algebra.quadFromRoots",
      title: "Ildizlardan tenglama",
      tagline: "x² − Sx + P = 0",
      theory: "Ildizlari x₁ va x₂ bo'lgan tenglama: x² − (x₁ + x₂)x + x₁x₂ = 0.",
      gen() {
        const r1 = ri(-6, 6) || 2;
        const r2 = ri(-6, 6) || 3;
        const S = r1 + r2;
        const P = r1 * r2;
        return {
          prompt: `Ildizlari <b>${r1}</b> va <b>${r2}</b> bo'lgan kvadrat tenglamani tuzing.`,
          answer: `x² ${sgn(-S)}x ${sgn(P)} = 0`,
          distractors: [`x² ${sgn(S)}x ${sgn(P)} = 0`, `x² ${sgn(-S)}x ${sgn(-P)} = 0`, `x² ${sgn(-P)}x ${sgn(S)} = 0`],
          hint: "x² − (x₁+x₂)x + x₁x₂ = 0.",
          steps: [
            `x₁ + x₂ = ${S}`,
            `x₁·x₂ = ${P}`,
            `Tenglama: x² ${sgn(-S)}x ${sgn(P)} = 0`,
          ],
        };
      },
    },
    {
      id: "algebra.linearWord",
      title: "Ikki son",
      tagline: "Yig'indi va farq",
      theory: "Ikki sonning yig'indisi S, farqi D bo'lsa: kattasi (S + D)/2, kichigi (S − D)/2.",
      gen() {
        const big = ri(10, 30);
        const small = ri(2, 9);
        const S = big + small;
        const D = big - small;
        return {
          prompt: `Ikki sonning yig'indisi <b>${S}</b>, farqi <b>${D}</b>. Katta sonni toping.`,
          answer: `${big}`,
          distractors: [`${small}`, `${S}`, `${D}`],
          hint: "(S + D)/2.",
          steps: [`Katta = (${S} + ${D})/2`, `= ${big}`],
        };
      },
    },
    {
      id: "algebra.systemSub",
      title: "O'rniga qo'yish usuli",
      tagline: "y = kx",
      theory: "y ni ifoda bilan almashtirib, bitta noma'lumli tenglama hosil qilinadi.",
      gen() {
        const k = ri(2, 4);
        const x = ri(2, 8);
        const y = k * x;
        const S = x + y;
        return {
          prompt: `Sistema:<br>y = ${k}x<br>x + y = ${S}<br><b>x</b> ni toping.`,
          answer: `${x}`,
          distractors: [`${y}`, `${S}`, `${x + 1}`],
          hint: "y o'rniga kx qo'ying.",
          steps: [
            `x + ${k}x = ${S}`,
            `${k + 1}x = ${S}`,
            `x = ${x}`,
          ],
        };
      },
    },
    {
      id: "algebra.absIneqTwo",
      title: "Modul tengsizlik (siljish)",
      tagline: "|x − a| ≤ b",
      theory: "|x − a| ≤ b ⟹ a − b ≤ x ≤ a + b.",
      gen() {
        const a = ri(-5, 8);
        const b = ri(2, 7);
        return {
          prompt: `<b>|x − ${a}| ≤ ${b}</b> tengsizlikni nechta butun son qanoatlantiradi?`,
          answer: `${2 * b + 1}`,
          distractors: [`${2 * b}`, `${2 * b - 1}`, `${b}`],
          hint: "a − b ≤ x ≤ a + b.",
          steps: [
            `${a - b} ≤ x ≤ ${a + b}`,
            `Butun sonlar: ${a - b} … ${a + b}`,
            `Jami: ${2 * b + 1} ta`,
          ],
        };
      },
    },
    {
      id: "algebra.logBaseValue",
      title: "Logarifm asosi",
      tagline: "logₐ b = c",
      theory: "logₐ b = c ⟺ aᶜ = b. Asosni topish uchun b ni qanday darajaga ko'tarish kerakligini qidiramiz.",
      gen() {
        const a = pick([2, 3, 4, 5]);
        const c = ri(2, 4);
        const b = Math.pow(a, c);
        return {
          prompt: `<b>log<sub>x</sub> ${b} = ${c}</b>. x ni toping.`,
          answer: `${a}`,
          distractors: [`${b / c}`, `${c}`, `${b}`],
          hint: "xᶜ = b.",
          steps: [`x^${c} = ${b}`, `x = ${a}`],
        };
      },
    },
    {
      id: "algebra.proportionEq",
      title: "Proporsiya tenglamasi",
      tagline: "a/b = x/d",
      theory: "Proporsiyada ichkaridagilar ko'paytmasi tashqaridagilarga teng: a·d = b·x.",
      gen() {
        const a = ri(2, 9);
        const b = ri(2, 9);
        const k = ri(2, 6);
        const c = a * k;
        const d = b * k;
        return {
          prompt: `<b>${a}/${b} = ${c}/x</b>. x ni toping.`,
          answer: `${d}`,
          distractors: [`${c}`, `${b * c}`, `${d + b}`],
          hint: "a·x = b·c.",
          steps: [
            `${a}·x = ${b}·${c}`,
            `${a}x = ${b * c}`,
            `x = ${d}`,
          ],
        };
      },
    },
    {
      id: "algebra.directProp",
      title: "To'g'ri proporsional bog'lanish",
      tagline: "y = kx",
      theory: "To'g'ri proporsional bog'lanishda y/x nisbati o'zgarmas (k).",
      gen() {
        const k = ri(2, 9);
        const x1 = ri(2, 8);
        const y1 = k * x1;
        const x2 = x1 + ri(1, 6);
        const y2 = k * x2;
        return {
          prompt: `y soni x ga to'g'ri proporsional. x = ${x1} bo'lganda y = ${y1}. x = ${x2} bo'lganda y nechaga teng?`,
          answer: `${y2}`,
          distractors: [`${y1}`, `${x2}`, `${y2 + k}`],
          hint: "k = y/x, keyin y = kx.",
          steps: [
            `k = ${y1}/${x1} = ${k}`,
            `y = ${k} · ${x2} = ${y2}`,
          ],
        };
      },
    },
    {
      id: "algebra.trinomialFactor",
      title: "Uchhadni ko'paytuvchilarga ajratish",
      tagline: "x² + bx + c",
      theory: "x² + bx + c = (x + p)(x + q), bu yerda p + q = b va p·q = c.",
      gen() {
        const p = ri(-7, 7) || 2;
        const q = ri(-7, 7) || 3;
        return {
          prompt: `<b>x² ${sgn(p + q)}x ${sgn(p * q)}</b> ni ko'paytuvchilarga ajrating.`,
          answer: `(x ${sgn(p)})(x ${sgn(q)})`,
          distractors: [`(x ${sgn(p + 1)})(x ${sgn(q - 1)})`, `(x ${sgn(-p)})(x ${sgn(-q)})`, `(x ${sgn(p)})(x ${sgn(-q)})`],
          hint: "Yig'indisi b, ko'paytmasi c bo'lgan ikki sonni toping.",
          steps: [`${p} + (${q}) = ${p + q}`, `${p}·(${q}) = ${p * q}`, `Javob: (x ${sgn(p)})(x ${sgn(q)})`],
        };
      },
    },
    {
      id: "algebra.quadSumRecip",
      title: "Ildizlarning teskari yig'indisi",
      tagline: "1/x₁ + 1/x₂",
      theory: "x² + px + q = 0 uchun x₁ + x₂ = −p, x₁x₂ = q, demak 1/x₁ + 1/x₂ = −p/q.",
      gen() {
        const x1 = ri(2, 8);
        const x2 = ri(2, 8);
        const p = -(x1 + x2);
        const q = x1 * x2;
        const val = (x1 + x2) / (x1 * x2);
        return {
          prompt: `x² ${sgn(p)}x ${sgn(q)} = 0 tenglama uchun <b>1/x₁ + 1/x₂</b> ni toping.`,
          answer: `${fmt(Math.round(val * 100) / 100)}`,
          distractors: [`${fmt(Math.round((x1 * x2) / (x1 + x2) * 100) / 100)}`, `${p}`, `${q}`],
          hint: "(x₁ + x₂)/(x₁x₂).",
          steps: [
            `x₁ + x₂ = ${x1 + x2}, x₁x₂ = ${q}`,
            `1/x₁ + 1/x₂ = ${x1 + x2}/${q}`,
            `= ${fmt(Math.round(val * 100) / 100)}`,
          ],
        };
      },
    },
    {
      id: "algebra.arithmeticNth",
      title: "Progressiya raqami",
      tagline: "n ni topish",
      theory: "aₙ = a₁ + (n − 1)d ⟹ n = (aₙ − a₁)/d + 1.",
      gen() {
        const a1 = ri(2, 9);
        const d = ri(2, 6);
        const n = ri(6, 15);
        const an = a1 + (n - 1) * d;
        return {
          prompt: `Arifmetik progressiyada a₁ = ${a1}, d = ${d}. <b>${an}</b> soni nechanchi had?`,
          answer: `${n}`,
          distractors: [`${n + 1}`, `${n - 2}`, `${an}`],
          hint: "aₙ = a₁ + (n − 1)d.",
          steps: [`${an} = ${a1} + (n − 1)·${d}`, `n − 1 = ${(an - a1) / d}`, `n = ${n}`],
        };
      },
    },
    {
      id: "algebra.geometricQ",
      title: "Progressiya maxraji",
      tagline: "b₃ = b₁·q²",
      theory: "bₙ = b₁·qⁿ⁻¹. b₃ = b₁q² bo'lsa, q = √(b₃/b₁).",
      gen() {
        const b1 = pick([1, 2, 3]);
        const q = pick([2, 3]);
        const b3 = b1 * q * q;
        return {
          prompt: `Geometrik progressiyada b₁ = ${b1}, b₃ = ${b3}. Musbat <b>q</b> ni toping.`,
          answer: `${q}`,
          distractors: [`${q * q}`, `${b3 / b1}`, `${b1}`],
          hint: "b₃ = b₁·q².",
          steps: [`q² = ${b3}/${b1} = ${q * q}`, `q = ${q}`],
        };
      },
    },
    {
      id: "algebra.logPower",
      title: "Daraja logarifmi",
      tagline: "log aⁿ = n·log a",
      theory: "log(xⁿ) = n·log x.",
      gen() {
        const a = pick([2, 3, 5]);
        const k = ri(2, 4);
        const n = ri(2, 3);
        return {
          prompt: `<b>log<sub>${a}</sub>(${Math.pow(a, k)})<sup>${n}</sup></b> ni hisoblang.`,
          answer: `${k * n}`,
          distractors: [`${k + n}`, `${Math.pow(k, n)}`, `${k}`],
          hint: "log(aⁿ) = n·log a.",
          steps: [
            `(${a}^${k})^${n} = ${a}^${k * n}`,
            `log₍${a}₎ ${a}^${k * n} = ${k * n}`,
          ],
        };
      },
    },
    {
      id: "algebra.expInequality",
      title: "Ko'rsatkichli tengsizlik",
      tagline: "2ˣ > 8",
      theory: "a > 1 bo'lsa, aˣ > aᵏ ⟹ x > k.",
      gen() {
        const a = pick([2, 3]);
        const k = ri(2, 4);
        return {
          prompt: `<b>${a}ˣ > ${Math.pow(a, k)}</b> tengsizlikning eng kichik butun yechimini toping.`,
          answer: `${k + 1}`,
          distractors: [`${k}`, `${k - 1}`, `${Math.pow(a, k)}`],
          hint: `${Math.pow(a, k)} = ${a}^${k}.`,
          steps: [`${a}ˣ > ${a}^${k}`, `x > ${k}`, `Eng kichik butun: ${k + 1}`],
        };
      },
    },
    {
      id: "algebra.linearRange",
      title: "Chiziqli funksiya qiymatlari",
      tagline: "oraliqda eng katta/kichik",
      theory: "Monoton chiziqli funksiya oraliqning chetlarida eng katta va eng kichik qiymat oladi.",
      gen() {
        const k = ri(2, 5);
        const b = ri(-6, 6);
        const x1 = ri(-4, 0);
        const x2 = x1 + ri(2, 5);
        const maxV = k * x2 + b;
        return {
          prompt: `f(x) = ${k}x ${sgn(b)}. [${x1}; ${x2}] oraliqda funksiyaning eng katta qiymatini toping.`,
          answer: `${maxV}`,
          distractors: [`${k * x1 + b}`, `${b}`, `${maxV + k}`],
          hint: "k > 0, shuning uchun eng katta qiymat o'ng chetda.",
          steps: [`f(${x2}) = ${k}·${x2} ${sgn(b)}`, `= ${maxV}`],
        };
      },
    },
    {
      id: "algebra.twoPointEquation",
      title: "Ikki nuqtadan tenglama",
      tagline: "y = kx + b",
      theory: "Ikki nuqta orqali: k = Δy/Δx, keyin b = y − kx.",
      gen() {
        const x1 = 0;
        const b = ri(-6, 8);
        const k = ri(2, 5);
        const x2 = ri(1, 4);
        const y2 = k * x2 + b;
        return {
          prompt: `To'g'ri chiziq (0; ${b}) va (${x2}; ${y2}) nuqtalardan o'tadi. Tenglamasini tuzing.`,
          answer: `y = ${k}x ${sgn(b)}`,
          distractors: [`y = ${k}x ${sgn(-b)}`, `y = ${b}x ${sgn(k)}`, `y = ${x2}x ${sgn(b)}`],
          hint: "k = (y₂ − y₁)/(x₂ − x₁).",
          steps: [
            `k = (${y2} − ${b})/(${x2} − 0) = ${k}`,
            `b = ${b}`,
            `y = ${k}x ${sgn(b)}`,
          ],
        };
      },
    },
    {
      id: "algebra.systemIntersection",
      title: "Grafiklarning kesishishi",
      tagline: "Sistema yechimi",
      theory: "Ikki to'g'ri chiziqning kesishish nuqtasi — sistemaning yechimi.",
      gen() {
        const x = ri(-4, 5);
        const k1 = ri(1, 4);
        const k2 = k1 + ri(1, 3);
        const b1 = ri(-5, 5);
        const b2 = b1 + (k1 - k2) * x;
        return {
          prompt: `y = ${k1}x ${sgn(b1)} va y = ${k2}x ${sgn(b2)} chiziqlar qaysi x da kesishadi?`,
          answer: `${x}`,
          distractors: [`${-x}`, `${b1}`, `${k1}`],
          hint: "Tenglamalarni tenglashtiring.",
          steps: [
            `${k1}x ${sgn(b1)} = ${k2}x ${sgn(b2)}`,
            `${k1 - k2}x = ${b2 - b1}`,
            `x = ${x}`,
          ],
        };
      },
    },
    {
      id: "algebra.discriminantSign",
      title: "Ildizlar soni",
      tagline: "D ishorasi",
      theory: "D > 0 — ikki ildiz, D = 0 — bitta ildiz, D < 0 — haqiqiy ildiz yo'q.",
      gen() {
        const a = 1;
        const b = ri(-8, 8);
        const c = ri(-10, 10);
        const D = b * b - 4 * a * c;
        const ans = D > 0 ? "2" : D === 0 ? "1" : "0";
        return {
          prompt: `x² ${sgn(b)}x ${sgn(c)} = 0 tenglama nechta haqiqiy ildizga ega?`,
          answer: ans,
          distractors: ["0", "1", "2"].filter((x) => x !== ans),
          hint: "D = b² − 4ac.",
          steps: [`D = ${b}² − 4·1·${c} = ${D}`, `D ${D > 0 ? "> 0" : D === 0 ? "= 0" : "< 0"} → ${ans} ildiz`],
        };
      },
    },
    {
      id: "algebra.absSumMin",
      title: "Modullar yig'indisi minimumi",
      tagline: "|x − a| + |x − b|",
      theory: "|x − a| + |x − b| ning eng kichik qiymati |a − b| ga teng va u x ∈ [a; b] da olinadi.",
      gen() {
        const a = ri(-6, 2);
        const b = a + ri(3, 9);
        return {
          prompt: `<b>|x − ${a}| + |x − ${b}|</b> ifodaning eng kichik qiymatini toping.`,
          answer: `${b - a}`,
          distractors: [`${a + b}`, `${b}`, `${b - a + 1}`],
          hint: "Minimum a va b orasidagi masofaga teng.",
          steps: [`Masofa = ${b} − ${a}`, `Min = ${b - a}`],
        };
      },
    },
    {
      id: "algebra.inequalityInterval",
      title: "Tengsizlik yechimi",
      tagline: "Interval ko'rinishi",
      theory: "ax + b < c yechimi interval ko'rinishida yoziladi.",
      gen() {
        const a = ri(2, 6);
        const c = ri(4, 20);
        const b = ri(1, 9);
        const bound = (c - b) / a;
        return {
          prompt: `<b>${a}x + ${b} < ${c}</b> tengsizlikning yechimini toping.`,
          answer: `x < ${fmt(Math.round(bound * 100) / 100)}`,
          distractors: [`x > ${fmt(Math.round(bound * 100) / 100)}`, `x < ${b}`, `x > ${c}`],
          hint: "b ni o'ng tomonga o'tkazing, a ga bo'ling.",
          steps: [`${a}x < ${c - b}`, `x < ${c - b}/${a}`, `x < ${fmt(Math.round(bound * 100) / 100)}`],
        };
      },
    },
    {
      id: "algebra.radicalSimplify",
      title: "Ildizni soddalashtirish",
      tagline: "√(a²b)",
      theory: "√(a²b) = a√b.",
      gen() {
        const a = ri(2, 7);
        const b = pick([2, 3, 5]);
        return {
          prompt: `<b>√${a * a * b}</b> ni soddalashtiring.`,
          answer: `${a}√${b}`,
          distractors: [`${a * b}`, `${a}√${a}`, `${b}√${a}`],
          hint: `Ajrating: ${a * a} · ${b}.`,
          steps: [`√${a * a * b} = √${a * a} · √${b}`, `= ${a}√${b}`],
        };
      },
    },
    {
      id: "algebra.rationalEquation",
      title: "Kasrli tenglama",
      tagline: "1/x + 1/a = 1/b",
      theory: "Kasrli tenglamada umumiy maxrajga keltiriladi va maxraj noldan farqli bo'lishi shart.",
      gen() {
        const a = pick([6, 8, 12]);
        const b = pick([3, 4]);
        const x = (a * b) / (a - b);
        if (!Number.isInteger(x)) return { prompt: "1/x + 1/6 = 1/3. x ni toping.", answer: "6", distractors: ["3", "2", "9"], hint: "Umumiy maxraj.", steps: ["1/x = 1/3 − 1/6 = 1/6", "x = 6"] };
        return {
          prompt: `<b>1/x + 1/${a} = 1/${b}</b>. x ni toping.`,
          answer: `${x}`,
          distractors: [`${a + b}`, `${a - b}`, `${x + 2}`],
          hint: "1/x = 1/b − 1/a.",
          steps: [`1/x = ${a - b}/${a * b}`, `x = ${x}`],
        };
      },
    },
    {
      id: "algebra.powerOfProduct",
      title: "Ko'paytma darajasi",
      tagline: "(ab)ⁿ = aⁿbⁿ",
      theory: "(ab)ⁿ = aⁿ·bⁿ.",
      gen() {
        const a = pick([2, 3]);
        const b = pick([2, 5]);
        const n = ri(2, 3);
        return {
          prompt: `<b>(${a}·${b})<sup>${n}</sup></b> ni hisoblang.`,
          answer: `${Math.pow(a * b, n)}`,
          distractors: [`${a * b * n}`, `${Math.pow(a, n) * b}`, `${Math.pow(a, n) + Math.pow(b, n)}`],
          hint: "Avval ko'paytirib, keyin darajaga ko'taring.",
          steps: [`${a}·${b} = ${a * b}`, `${a * b}^${n} = ${Math.pow(a * b, n)}`],
        };
      },
    },
    {
      id: "algebra.zeroExponent",
      title: "Nolinchi daraja",
      tagline: "a⁰ = 1",
      theory: "Noldan farqli har qanday sonning nolinchi darajasi 1 ga teng: a⁰ = 1.",
      gen() {
        const a = ri(2, 20);
        const expr = pick([`${a}⁰`, `(${a}²)⁰`, `${a}⁰ + 5`, `3·${a}⁰`]);
        const val = expr.includes("+") ? 6 : expr.startsWith("3·") ? 3 : 1;
        return {
          prompt: `<b>${expr}</b> ni hisoblang.`,
          answer: `${val}`,
          distractors: [`${val + 1}`, `0`, `${a}`],
          hint: "a⁰ = 1.",
          steps: [`${a}⁰ = 1`, `Javob: ${val}`],
        };
      },
    },
    {
      id: "algebra.doubleInequality",
      title: "Qo'sh tengsizlik",
      tagline: "a < x < b",
      theory: "Qo'sh tengsizlikni yechishda barcha qismlarga bir xil amal qo'llanadi.",
      gen() {
        const a = ri(2, 5);
        const lo = ri(-4, 2);
        const hi = lo + ri(3, 8);
        return {
          prompt: `<b>${a} < 2x + ${a} < ${2 * hi + a}</b> tengsizlikni yeching.`,
          answer: `${lo} < x < ${hi}`,
          distractors: [`${lo + 1} < x < ${hi}`, `${lo} < x < ${hi + 1}`, `${lo} ≤ x ≤ ${hi}`],
          hint: `${a} ni hamma qismdan ayiring.`,
          steps: [`0 < 2x < ${2 * hi}`, `0 < x < ${hi}`, `Qo'shimcha siljish bilan: ${lo} < x < ${hi}`],
        };
      },
    },
    {
      id: "algebra.quadWordArea",
      title: "Yuza masalasi",
      tagline: "Kvadrat tenglama orqali",
      theory: "To'g'ri to'rtburchak yuzi S = a·b, perimetri P = 2(a + b).",
      gen() {
        const a = ri(4, 12);
        const b = ri(3, 10);
        return {
          prompt: `To'g'ri to'rtburchakning perimetri ${2 * (a + b)} sm, yuzi ${a * b} sm². Tomonlarini toping.`,
          answer: `${a} va ${b}`,
          distractors: [`${a + 1} va ${b - 1}`, `${a * b} va ${a + b}`, `${a} va ${b + 2}`],
          hint: "Tomonlar x² − (P/2)x + S = 0 tenglamaning ildizlari.",
          steps: [
            `a + b = ${a + b}, ab = ${a * b}`,
            `x² − ${a + b}x + ${a * b} = 0`,
            `Ildizlar: ${a} va ${b}`,
          ],
        };
      },
    },
    {
      id: "algebra.consecutiveOdd",
      title: "Ketma-ket toq sonlar",
      tagline: "n, n+2, n+4",
      theory: "Ketma-ket toq sonlar 2 ga farq qiladi: n, n+2, n+4.",
      gen() {
        const n = ri(3, 25) * 2 + 1;
        const sum = n + (n + 2) + (n + 4);
        return {
          prompt: `Ketma-ket uchta toq sonning yig'indisi <b>${sum}</b>. Eng kichigini toping.`,
          answer: `${n}`,
          distractors: [`${n + 2}`, `${n - 2}`, `${Math.round(sum / 3)}`],
          hint: "O'rtadagisi yig'indining uchdan bir qismi.",
          steps: [`O'rtadagi = ${sum}/3 = ${n + 2}`, `Eng kichigi = ${n}`],
        };
      },
    },
    {
      id: "algebra.percentEquation",
      title: "Foizli tenglama",
      tagline: "x% · a = b",
      theory: "a sonining p% i b bo'lsa, a·p/100 = b.",
      gen() {
        const a = pick([80, 120, 200, 250, 400]);
        const p = pick([10, 15, 20, 25, 40]);
        const b = (a * p) / 100;
        return {
          prompt: `Sonning <b>${p}%</b> i <b>${fmt(b)}</b> ga teng. Sonni toping.`,
          answer: `${a}`,
          distractors: [`${fmt(b * 2)}`, `${b + p}`, `${a + 50}`],
          hint: "a·p/100 = b.",
          steps: [`a · ${p}/100 = ${fmt(b)}`, `a = ${fmt(b)} · 100/${p} = ${a}`],
        };
      },
    },
    {
      id: "algebra.ageSystem",
      title: "Yosh sistemasi",
      tagline: "Ikki noma'lum",
      theory: "Yosh masalalarida hozirgi yosh x, k yildan keyin x + k.",
      gen() {
        const son = ri(8, 16);
        const father = son + ri(22, 30);
        const k = ri(5, 10);
        return {
          prompt: `Ota va o'g'il yoshlari yig'indisi hozir ${father + son}. ${k} yil oldin yig'indi ${father + son - 2 * k} edi. O'g'il hozir necha yoshda?`,
          answer: `${son}`,
          distractors: [`${son + 2}`, `${son - 2}`, `${k}`],
          hint: "Ikkinchi shart birinchisidan kelib chiqadi — qo'shimcha ma'lumot.",
          steps: [
            `Yig'indi hozir ${father + son}`,
            `${k} yil oldin: ${father + son - 2 * k} — mos keladi`,
            `Yosh farqi ${father - son} o'zgarmaydi, demak o'g'il ${son}`,
          ],
        };
      },
    },
    {
      id: "algebra.coinProblem",
      title: "Tanga masalasi",
      tagline: "Ikki xil qiymat",
      theory: "Tanga masalasida sonlar yig'indisi va qiymatlar yig'indisi ikkita tenglama beradi.",
      gen() {
        const small = ri(4, 12);
        const big = ri(3, 10);
        const total = small + big;
        const value = small * 100 + big * 500;
        return {
          prompt: `${total} ta tanga bor: 100 so'mlik va 500 so'mlik. Jami qiymati ${value} so'm. <b>500 so'mliklar</b> nechta?`,
          answer: `${big}`,
          distractors: [`${small}`, `${total}`, `${big + 2}`],
          hint: "x + y = son, 100x + 500y = qiymat.",
          steps: [
            `x + y = ${total}, 100x + 500y = ${value}`,
            `400y = ${value - 100 * total}`,
            `y = ${big}`,
          ],
        };
      },
    },
    {
      id: "algebra.digitSum",
      title: "Raqamlar yig'indisi",
      tagline: "Sonning raqamlari",
      theory: "Ikki xonali son 10a + b, raqamlar yig'indisi a + b.",
      gen() {
        const a = ri(1, 9);
        const b = ri(1, 9);
        return {
          prompt: `<b>${a * 10 + b}</b> sonining raqamlari yig'indisini toping.`,
          answer: `${a + b}`,
          distractors: [`${a * 10 + b}`, `${a * b}`, `${a + b + 1}`],
          hint: "O'nlik va birlik raqamlarini qo'shing.",
          steps: [`Raqamlar: ${a} va ${b}`, `Yig'indi = ${a + b}`],
        };
      },
    },
    {
      id: "algebra.geometricMean",
      title: "O'rta geometrik",
      tagline: "√(a·b)",
      theory: "Ikki sonning o'rta geometrigi √(a·b).",
      gen() {
        const a = pick([2, 4, 8]);
        const b = pick([8, 18, 32]);
        const m = Math.sqrt(a * b);
        const nice = Number.isInteger(m) ? `${m}` : `√${a * b}`;
        return {
          prompt: `<b>${a}</b> va <b>${b}</b> sonlarining o'rta geometrigini toping.`,
          answer: nice,
          distractors: [`${(a + b) / 2}`, `${a * b}`, `√${a + b}`],
          hint: "√(a·b).",
          steps: [`${a}·${b} = ${a * b}`, `√${a * b} = ${nice}`],
        };
      },
    },
    {
      id: "algebra.exponentFraction",
      title: "Kasr daraja",
      tagline: "a^(m/n)",
      theory: "a^(m/n) = ⁿ√(aᵐ).",
      gen() {
        const a = pick([4, 8, 9, 16]);
        const n = pick([2, 3]);
        const m = n;
        const val = Math.pow(a, m / n);
        if (!Number.isInteger(val)) return { prompt: "16^(1/2) ni hisoblang.", answer: "4", distractors: ["8", "2", "16"], hint: "Kvadrat ildiz.", steps: ["16^(1/2) = √16 = 4"] };
        return {
          prompt: `<b>${a}<sup>${m}/${n}</sup></b> ni hisoblang.`,
          answer: `${val}`,
          distractors: [`${a}`, `${val + 1}`, `${a / n}`],
          hint: "a^(m/n) = ⁿ√(aᵐ).",
          steps: [`${a}^${m} = ${Math.pow(a, m)}`, `${n}-darajali ildiz = ${val}`],
        };
      },
    },
    {
      id: "algebra.sumCubesSimple",
      title: "Kublar yig'indisi",
      tagline: "(a+b)(a²−ab+b²)",
      theory: "a³ + b³ = (a + b)(a² − ab + b²).",
      gen() {
        const a = ri(2, 5);
        const b = ri(2, 5);
        return {
          prompt: `<b>${a}³ + ${b}³</b> ni hisoblang.`,
          answer: `${a * a * a + b * b * b}`,
          distractors: [`${(a + b) ** 3}`, `${a * a * a - b * b * b}`, `${a * b * 3}`],
          hint: "Har birini alohida kubga ko'taring.",
          steps: [`${a}³ = ${a * a * a}`, `${b}³ = ${b * b * b}`, `Yig'indi = ${a * a * a + b * b * b}`],
        };
      },
    },
    {
      id: "algebra.completeSquareB",
      title: "To'liq kvadratga keltirish",
      tagline: "noma'lum koeffitsiyent",
      theory: "x² + bx + c to'liq kvadrat bo'lishi uchun c = (b/2)² bo'lishi kerak.",
      gen() {
        const b = ri(2, 10) * 2;
        const c = (b / 2) ** 2;
        return {
          prompt: `x² + ${b}x + c ifoda to'liq kvadrat bo'lishi uchun <b>c</b> nechaga teng bo'lishi kerak?`,
          answer: `${c}`,
          distractors: [`${b}`, `${b * 2}`, `${b * b}`],
          hint: "c = (b/2)².",
          steps: [`b/2 = ${b / 2}`, `c = ${b / 2}² = ${c}`],
        };
      },
    },
    {
      id: "algebra.linearSystemWord",
      title: "Mahsulot masalasi",
      tagline: "Ikki xil narx",
      theory: "Ikki noma'lumli sistema: sonlar va qiymatlar bo'yicha ikki tenglama tuziladi.",
      gen() {
        const x = ri(3, 9);
        const y = ri(2, 8);
        const p1 = ri(2, 6) * 1000;
        const p2 = ri(3, 8) * 1000;
        const total = x + y;
        const sum = x * p1 + y * p2;
        return {
          prompt: `${x} ta daftar va ${y} ta qalam jami ${total} dona, qiymati ${sum} so'm. Daftar ${p1}, qalam ${p2} so'm. <b>Daftarlar</b> nechta?`,
          answer: `${x}`,
          distractors: [`${y}`, `${total}`, `${x + 1}`],
          hint: "Sonlar yig'indisi va qiymatlar yig'indisi bilan sistema tuzing.",
          steps: [
            `x + y = ${total}, ${p1}x + ${p2}y = ${sum}`,
            `x = ${x}`,
          ],
        };
      },
    },
    {
      id: "algebra.exponentSameBase2",
      title: "Asoslarni keltirish",
      tagline: "9ˣ = 3⁴",
      theory: "9 = 3², shuning uchun 9ˣ = 3²ˣ.",
      gen() {
        const k = pick([2, 3]);
        const x = ri(2, 4);
        const right = k * x;
        return {
          prompt: `Tenglamani yeching: <b>${Math.pow(3, k)}ˣ = ${Math.pow(3, right)}</b>`,
          answer: `${x}`,
          distractors: [`${right}`, `${x + 1}`, `${k}`],
          hint: `${Math.pow(3, k)} = 3^${k}.`,
          steps: [`${Math.pow(3, k)}ˣ = 3^${k}x`, `3^${k}x = 3^${right}`, `x = ${x}`],
        };
      },
    },
    {
      id: "algebra.logarithmSum",
      title: "Logarifmlar yig'indisi",
      tagline: "log a + log b = log(ab)",
      theory: "Bir xil asosli logarifmlar yig'indisi ko'paytmaning logarifmiga teng.",
      gen() {
        const a = pick([2, 3]);
        const m = ri(2, 3);
        const n = ri(2, 3);
        return {
          prompt: `<b>log<sub>${a}</sub>${Math.pow(a, m)} + log<sub>${a}</sub>${Math.pow(a, n)}</b> ni hisoblang.`,
          answer: `${m + n}`,
          distractors: [`${m * n}`, `${m}`, `${n}`],
          hint: "log x + log y = log(xy).",
          steps: [
            `log₍${a}₎${Math.pow(a, m)} = ${m}, log₍${a}₎${Math.pow(a, n)} = ${n}`,
            `${m} + ${n} = ${m + n}`,
          ],
        };
      },
    },
  ],
};
