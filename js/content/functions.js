// AnormalMath — Funksiyalar bo'limi
import { ri, pick, fmt } from "../engine.js";

const sgn = (n) => (n < 0 ? `− ${Math.abs(n)}` : `+ ${n}`);

export const functions = {
  id: "functions",
  title: "Funksiyalar",
  glyph: "ƒ",
  accent: "#06b6d4",
  blurb: "Qiymat, grafik, teskari va murakkab funksiya.",
  topics: [
    {
      id: "func.value",
      title: "Funksiya qiymati",
      tagline: "f(x₀)",
      theory: "f(x) ifodada x o'rniga berilgan son qo'yiladi.",
      gen() {
        const k = ri(2, 6);
        const b = ri(-9, 9);
        const x0 = ri(-3, 5);
        const val = k * x0 + b;
        return {
          prompt: `f(x) = ${k}x ${sgn(b)}. <b>f(${x0})</b> ni toping.`,
          answer: `${val}`,
          distractors: [`${k * x0}`, `${x0 + b}`, `${val + k}`],
          hint: `x o'rniga ${x0} qo'ying.`,
          steps: [`f(${x0}) = ${k}·(${x0}) ${sgn(b)}`, `= ${k * x0} ${sgn(b)} = ${val}`],
        };
      },
    },
    {
      id: "func.zero",
      title: "Funksiya nollari",
      tagline: "f(x) = 0",
      theory: "Funksiyaning nollari — grafik Ox o'qini kesib o'tadigan nuqtalar.",
      gen() {
        const a = ri(2, 9);
        return {
          prompt: `f(x) = x² − ${a * a}. Funksiyaning nollarini toping.`,
          answer: `±${a}`,
          distractors: [`${a}`, `±${a * a}`, `0`],
          hint: "x² − a² = 0 ⟹ x = ±a.",
          steps: [`x² = ${a * a}`, `x = ±${a}`],
        };
      },
    },
    {
      id: "func.domain",
      title: "Aniqlanish sohasi",
      tagline: "Maxraj nolga teng bo'lmasin",
      theory: "Kasr funksiyada maxraj noldan farqli bo'lishi kerak.",
      gen() {
        const a = ri(-5, 8);
        return {
          prompt: `f(x) = 1/(x ${sgn(-a)}). Funksiyaning aniqlanish sohasidan qaysi qiymat chiqarib tashlanadi?`,
          answer: `${a}`,
          distractors: [`${-a}`, `0`, `${a + 1}`],
          hint: "Maxrajni nolga tenglashtiring.",
          steps: [`x ${sgn(-a)} = 0`, `x = ${a}`, `Bu qiymat sohadan chiqariladi`],
        };
      },
    },
    {
      id: "func.rangeQuad",
      title: "Qiymatlar sohasi",
      tagline: "Parabola minimumi",
      theory: "f(x) = x² + c funksiyaning eng kichik qiymati c ga teng.",
      gen() {
        const c = ri(-9, 12);
        return {
          prompt: `f(x) = x² ${sgn(c)}. Funksiyaning eng kichik qiymatini toping.`,
          answer: `${c}`,
          distractors: [`${-c}`, `0`, `${c + 1}`],
          hint: "x² ≥ 0, demak minimum c da.",
          steps: [`x = 0 da x² = 0`, `f(0) = ${c}`],
        };
      },
    },
    {
      id: "func.linearGraph",
      title: "Chiziqli funksiya",
      tagline: "y = kx + b",
      theory: "y = kx + b grafigi to'g'ri chiziq; k — og'ish, b — Oy o'qi bilan kesishish.",
      gen() {
        const k = ri(2, 5) * pick([1, -1]);
        const b = ri(-8, 8);
        return {
          prompt: `y = ${k}x ${sgn(b)}. Grafik Oy o'qini qaysi nuqtada kesadi?`,
          answer: `(0; ${b})`,
          distractors: [`(${b}; 0)`, `(0; ${k})`, `(${k}; 0)`],
          hint: "Oy o'qi bilan kesishishda x = 0.",
          steps: [`x = 0 ⟹ y = ${b}`, `Nuqta: (0; ${b})`],
        };
      },
    },
    {
      id: "func.inverse",
      title: "Teskari funksiya",
      tagline: "f⁻¹(x)",
      theory: "y = kx + b dan x ni ifodalab, teskari funksiya topiladi: f⁻¹(x) = (x − b)/k.",
      gen() {
        const k = ri(2, 5);
        const b = ri(-9, 9);
        return {
          prompt: `f(x) = ${k}x ${sgn(b)}. <b>f⁻¹(x)</b> ni toping.`,
          answer: `(x ${sgn(-b)})/${k}`,
          distractors: [`(x ${sgn(b)})/${k}`, `${k}x ${sgn(-b)}`, `(x + ${k})/${b}`],
          hint: "y = kx + b ⟹ x = (y − b)/k.",
          steps: [`y = ${k}x ${sgn(b)}`, `x = (y ${sgn(-b)})/${k}`, `f⁻¹(x) = (x ${sgn(-b)})/${k}`],
        };
      },
    },
    {
      id: "func.composition",
      title: "Murakkab funksiya",
      tagline: "f(g(x))",
      theory: "f(g(x)) — avval ichki g(x), keyin tashqi f hisoblanadi.",
      gen() {
        const k = ri(2, 4);
        const c = ri(1, 6);
        const x0 = ri(1, 5);
        const g = x0 + c;
        const val = k * g;
        return {
          prompt: `f(x) = ${k}x, g(x) = x + ${c}. <b>f(g(${x0}))</b> ni toping.`,
          answer: `${val}`,
          distractors: [`${k * x0 + c}`, `${g}`, `${val + k}`],
          hint: "Avval g, keyin f.",
          steps: [`g(${x0}) = ${x0} + ${c} = ${g}`, `f(${g}) = ${k}·${g} = ${val}`],
        };
      },
    },
    {
      id: "func.evenOdd",
      title: "Juft va toq funksiya",
      tagline: "f(−x) = ±f(x)",
      theory: "f(−x) = f(x) bo'lsa funksiya juft, f(−x) = −f(x) bo'lsa toq.",
      gen() {
        const cases = [
          { f: "x²", type: "juft", why: "(−x)² = x²" },
          { f: "x³", type: "toq", why: "(−x)³ = −x³" },
          { f: "x² + 3", type: "juft", why: "(−x)² + 3 = x² + 3" },
          { f: "x³ + x", type: "toq", why: "(−x)³ + (−x) = −(x³ + x)" },
          { f: "x + 1", type: "na juft, na toq", why: "f(−x) = −x + 1 hech bir shartga mos kelmaydi" },
        ];
        const c = pick(cases);
        return {
          prompt: `f(x) = ${c.f} funksiya qanday funksiya?`,
          answer: c.type,
          distractors: ["juft", "toq", "na juft, na toq"].filter((x) => x !== c.type),
          hint: "f(−x) ni hisoblab ko'ring.",
          steps: [c.why, `Demak funksiya ${c.type}`],
        };
      },
    },
    {
      id: "func.monotonic",
      title: "O'sish va kamayish",
      tagline: "k ning ishorasi",
      theory: "y = kx + b funksiya k > 0 bo'lsa o'sadi, k < 0 bo'lsa kamayadi.",
      gen() {
        const k = ri(1, 6) * pick([1, -1]);
        return {
          prompt: `y = ${k}x + 2 funksiya qanday harakat qiladi?`,
          answer: k > 0 ? "o'sadi" : "kamayadi",
          distractors: [k > 0 ? "kamayadi" : "o'sadi", "o'zgarmaydi", "avval o'sadi, keyin kamayadi"],
          hint: "k ning ishorasiga qarang.",
          steps: [`k = ${k}`, k > 0 ? "k > 0 — funksiya o'sadi" : "k < 0 — funksiya kamayadi"],
        };
      },
    },
    {
      id: "func.exponential",
      title: "Ko'rsatkichli funksiya",
      tagline: "f(x) = aˣ",
      theory: "f(x) = aˣ da x butun bo'lsa, qiymat daraja sifatida hisoblanadi.",
      gen() {
        const a = pick([2, 3]);
        const x = ri(2, 4);
        return {
          prompt: `f(x) = ${a}ˣ. <b>f(${x})</b> ni toping.`,
          answer: `${Math.pow(a, x)}`,
          distractors: [`${a * x}`, `${Math.pow(a, x - 1)}`, `${Math.pow(a, x) + a}`],
          hint: `${a} ni ${x} marta ko'paytiring.`,
          steps: [`f(${x}) = ${a}^${x}`, `= ${Math.pow(a, x)}`],
        };
      },
    },
    {
      id: "func.logFunction",
      title: "Logarifmik funksiya",
      tagline: "f(x) = logₐ x",
      theory: "logₐ x = y ⟺ aʸ = x.",
      gen() {
        const a = pick([2, 3]);
        const y = ri(2, 4);
        return {
          prompt: `f(x) = log<sub>${a}</sub>x. <b>f(${Math.pow(a, y)})</b> ni toping.`,
          answer: `${y}`,
          distractors: [`${a * y}`, `${Math.pow(a, y)}`, `${y + 1}`],
          hint: `${a} ni necha darajaga ko'tarsak shu son bo'ladi?`,
          steps: [`log<sub>${a}</sub>${Math.pow(a, y)} = ?`, `${a}^${y} = ${Math.pow(a, y)}`, `Javob: ${y}`],
        };
      },
    },
    {
      id: "func.graphRead",
      title: "Grafikdan o'qish",
      tagline: "Nuqta koordinatalari",
      theory: "Grafikda nuqta (x; y) ko'rinishida; x — gorizontal, y — vertikal o'q.",
      gen() {
        const k = ri(2, 4);
        const x0 = ri(1, 5);
        const y0 = k * x0;
        return {
          prompt: `y = ${k}x grafigida x = ${x0} bo'lganda nuqta ordinatasi (y) nechaga teng?`,
          answer: `${y0}`,
          distractors: [`${x0}`, `${k}`, `${y0 + k}`],
          hint: "Grafik tenglamasiga x ni qo'ying.",
          steps: [`y = ${k}·${x0}`, `y = ${y0}`],
        };
      },
    },
    {
      id: "func.verticalShift",
      title: "Vertikal siljish",
      tagline: "f(x) + k",
      theory: "f(x) + k grafigi f(x) grafigini k birlik yuqoriga suradi (k < 0 bo'lsa pastga).",
      gen() {
        const k = ri(-5, 6) || 3;
        const x0 = ri(1, 4);
        const base = x0 * x0;
        return {
          prompt: `f(x) = x². g(x) = f(x) ${sgn(k)}. <b>g(${x0})</b> ni toping.`,
          answer: `${base + k}`,
          distractors: [`${base}`, `${base - k}`, `${x0 + k}`],
          hint: "g(x) = x² + k.",
          steps: [`f(${x0}) = ${base}`, `g(${x0}) = ${base} ${sgn(k)} = ${base + k}`],
        };
      },
    },
    {
      id: "func.horizontalShift",
      title: "Gorizontal siljish",
      tagline: "f(x − h)",
      theory: "f(x − h) grafigi f(x) ni h birlik o'ngga suradi — ishora teskari ishlaydi.",
      gen() {
        const h = ri(2, 6);
        const x0 = ri(1, 4);
        const inner = x0 - h;
        return {
          prompt: `f(x) = x². g(x) = f(x − ${h}). <b>g(${x0})</b> ni toping.`,
          answer: `${inner * inner}`,
          distractors: [`${x0 * x0 + h}`, `${(x0 + h) * (x0 + h)}`, `${inner}`],
          hint: `g(${x0}) = (${x0} − ${h})².`,
          steps: [`${x0} − ${h} = ${inner}`, `${inner}² = ${inner * inner}`],
        };
      },
    },
    {
      id: "func.reflection",
      title: "O'qga nisbatan akslanish",
      tagline: "−f(x)",
      theory: "−f(x) grafikni Ox o'qiga nisbatan akslantiradi; f(−x) — Oy o'qiga nisbatan.",
      gen() {
        const mode = pick(["ox", "oy"]);
        const x0 = ri(1, 4);
        const val = mode === "ox" ? -(x0 * x0) : -x0;
        return {
          prompt: `f(x) = x². <b>${mode === "ox" ? "−f(x)" : "f(−x)"}</b> funksiyaning x = ${x0} dagi qiymatini toping.`,
          answer: `${val}`,
          distractors: [`${x0 * x0}`, `${-x0 * x0 - 1}`, `${x0}`],
          hint: mode === "ox" ? "−f(x) = −x²." : "f(−x) = (−x)² = x².",
          steps: [mode === "ox" ? `−f(${x0}) = −${x0 * x0}` : `f(−${x0}) = ${x0 * x0}`, `Javob: ${val}`],
        };
      },
    },
    {
      id: "func.absFunction",
      title: "Modul funksiyasi",
      tagline: "f(x) = |x|",
      theory: "|x| — sonning noldan uzoqligi. |−a| = a, |a| = a.",
      gen() {
        const x0 = ri(-9, 9) || -3;
        return {
          prompt: `f(x) = |x|. <b>f(${x0})</b> ni toping.`,
          answer: `${Math.abs(x0)}`,
          distractors: [`${x0}`, `${-Math.abs(x0)}`, `${Math.abs(x0) + 1}`],
          hint: "Modul ishorani olib tashlaydi.",
          steps: [`|${x0}| = ${Math.abs(x0)}`],
        };
      },
    },
    {
      id: "func.sqrtDomain",
      title: "Ildiz funksiyasi sohasi",
      tagline: "√(a − x)",
      theory: "√f(x) uchun f(x) ≥ 0 bo'lishi shart.",
      gen() {
        const a = ri(3, 12);
        return {
          prompt: `f(x) = √(${a} − x). Aniqlanish sohasini toping.`,
          answer: `x ≤ ${a}`,
          distractors: [`x ≥ ${a}`, `x < ${a}`, `x ≠ ${a}`],
          hint: "Ildiz ostidagi ifoda nomanfiy.",
          steps: [`${a} − x ≥ 0`, `x ≤ ${a}`],
        };
      },
    },
    {
      id: "func.asymptote",
      title: "Asimptota",
      tagline: "1/(x − a)",
      theory: "f(x) = 1/(x − a) funksiyada x = a — vertikal asimptota.",
      gen() {
        const a = ri(-6, 8);
        return {
          prompt: `f(x) = 1/(x ${sgn(-a)}). Vertikal asimptotani toping.`,
          answer: `x = ${a}`,
          distractors: [`x = ${-a}`, `y = ${a}`, `x = 0`],
          hint: "Maxraj nolga aylanadigan nuqta.",
          steps: [`x ${sgn(-a)} = 0`, `x = ${a}`],
        };
      },
    },
    {
      id: "func.parabolaAxis",
      title: "Simmetriya o'qi",
      tagline: "x = −b/2a",
      theory: "y = ax² + bx + c parabolasining simmetriya o'qi x = −b/(2a).",
      gen() {
        const a = pick([1, 2]);
        const x0 = ri(-4, 5);
        const b = -2 * a * x0;
        const c = ri(-6, 6);
        return {
          prompt: `y = ${a}x² ${sgn(b)}x ${sgn(c)}. Simmetriya o'qini toping.`,
          answer: `x = ${x0}`,
          distractors: [`x = ${-x0}`, `x = ${b}`, `x = 0`],
          hint: "x = −b/(2a).",
          steps: [`a = ${a}, b = ${b}`, `x = −(${b})/(2·${a}) = ${x0}`],
        };
      },
    },
    {
      id: "func.vertexForm",
      title: "Uch ko'rinish",
      tagline: "y = (x − h)² + k",
      theory: "y = (x − h)² + k ko'rinishida uchi (h; k) nuqtada bo'ladi.",
      gen() {
        const h = ri(-5, 6);
        const k = ri(-6, 8);
        return {
          prompt: `y = (x ${sgn(-h)})² ${sgn(k)}. Parabolaning uchini toping.`,
          answer: `(${h}; ${k})`,
          distractors: [`(${-h}; ${k})`, `(${h}; ${-k})`, `(${k}; ${h})`],
          hint: "(x − h)² + k da uchi (h; k).",
          steps: [`h = ${h}, k = ${k}`, `Uchi: (${h}; ${k})`],
        };
      },
    },
    {
      id: "func.quadMaxMin",
      title: "Eng katta va eng kichik",
      tagline: "Parabola uchi",
      theory: "a > 0 bo'lsa parabola uchi minimum, a < 0 bo'lsa maksimum nuqtasi.",
      gen() {
        const a = pick([1, -1]);
        const h = ri(-4, 5);
        const k = ri(-8, 9);
        return {
          prompt: `y = ${a > 0 ? "" : "−"}(x ${sgn(-h)})² ${sgn(k)}. Funksiyaning ${a > 0 ? "eng kichik" : "eng katta"} qiymatini toping.`,
          answer: `${k}`,
          distractors: [`${h}`, `${-k}`, `${k + 1}`],
          hint: "Uchning ordinatasi javob.",
          steps: [`Uchi: (${h}; ${k})`, `${a > 0 ? "Minimum" : "Maksimum"} = ${k}`],
        };
      },
    },
    {
      id: "func.tableFunction",
      title: "Jadval bo'yicha funksiya",
      tagline: "f(x) ni jadvaldan",
      theory: "Jadvalda har bir x ga mos y qiymati beriladi.",
      gen() {
        const k = ri(2, 4);
        const rows = [1, 2, 3, 4].map((x) => ({ x, y: k * x + 1 }));
        const row = pick(rows);
        return {
          prompt: `Jadval: ${rows.map((r) => `f(${r.x}) = ${r.y}`).join(", ")}. Qoida chiziqli. <b>f(${row.x + 1})</b> ni toping.`,
          answer: `${k * (row.x + 1) + 1}`,
          distractors: [`${row.y}`, `${k * row.x}`, `${row.y + k + 1}`],
          hint: "Har qadamda f qiymati k ga oshadi.",
          steps: [`Qoida: f(x) = ${k}x + 1`, `f(${row.x + 1}) = ${k * (row.x + 1)} + 1 = ${k * (row.x + 1) + 1}`],
        };
      },
    },
    {
      id: "func.inverseValue",
      title: "Teskari funksiya qiymati",
      tagline: "f⁻¹(y)",
      theory: "f⁻¹(y) — f(x) = y bo'ladigan x qiymati.",
      gen() {
        const k = ri(2, 5);
        const b = ri(-6, 6);
        const x0 = ri(1, 6);
        const y0 = k * x0 + b;
        return {
          prompt: `f(x) = ${k}x ${sgn(b)}. <b>f⁻¹(${y0})</b> ni toping.`,
          answer: `${x0}`,
          distractors: [`${y0}`, `${k * y0 + b}`, `${x0 + 1}`],
          hint: "f(x) = y0 tenglamani yeching.",
          steps: [`${k}x ${sgn(b)} = ${y0}`, `${k}x = ${y0 - b}`, `x = ${x0}`],
        };
      },
    },
    {
      id: "func.functionType",
      title: "Funksiya turi",
      tagline: "Chiziqli, kvadratik, ko'rsatkichli",
      theory: "y = kx + b — chiziqli, y = ax² + bx + c — kvadratik, y = aˣ — ko'rsatkichli.",
      gen() {
        const cases = [
          { f: "y = 3x + 7", t: "chiziqli" },
          { f: "y = x² − 4x + 1", t: "kvadratik" },
          { f: "y = 2ˣ", t: "ko'rsatkichli" },
          { f: "y = 5", t: "o'zgarmas" },
          { f: "y = 1/x", t: "kasr-ratsional" },
        ];
        const c = pick(cases);
        return {
          prompt: `<b>${c.f}</b> qanday funksiya?`,
          answer: c.t,
          distractors: cases.filter((x) => x.t !== c.t).map((x) => x.t).slice(0, 3),
          hint: "Eng yuqori darajaga va o'zgaruvchining o'rniga qarang.",
          steps: [`${c.f} — ${c.t} funksiya`],
        };
      },
    },
  ],
};
