// AnormalMath — Trigonometriya bo'limi
import { ri, pick } from "../engine.js";

const exact = [
  { deg: 0, sin: "0", cos: "1", tg: "0" },
  { deg: 30, sin: "1/2", cos: "√3/2", tg: "√3/3" },
  { deg: 45, sin: "√2/2", cos: "√2/2", tg: "1" },
  { deg: 60, sin: "√3/2", cos: "1/2", tg: "√3" },
  { deg: 90, sin: "1", cos: "0", tg: "aniqlanmagan" },
];

export const trigonometry = {
  id: "trigonometry",
  title: "Trigonometriya",
  glyph: "sin",
  accent: "#8b5cf6",
  blurb: "Asosiy qiymatlar, ayniyatlar, tenglamalar.",
  topics: [
    {
      id: "trig.values",
      title: "Asosiy burchaklar",
      tagline: "sin, cos, tg qiymatlari",
      theory:
        "sin 30° = ½, sin 45° = √2/2, sin 60° = √3/2. cos 60° = ½, cos 45° = √2/2, cos 30° = √3/2.",
      gen() {
        const row = pick(exact.slice(0, 4));
        const which = pick(["sin", "cos", "tg"]);
        const val = row[which];
        const others = exact.filter((r) => r[which] !== val).map((r) => r[which]);
        return {
          prompt: `<b>${which} ${row.deg}°</b> ni hisoblang.`,
          answer: `${val}`,
          distractors: others.slice(0, 3),
          hint: "Birlik aylana yoki 30–45–60 jadvalidan foydalaning.",
          steps: [
            `${row.deg}° — standart burchak`,
            `sin = ${row.sin}, cos = ${row.cos}, tg = ${row.tg}`,
            `Javob: ${which} ${row.deg}° = ${val}`,
          ],
        };
      },
    },
    {
      id: "trig.identity",
      title: "Asosiy ayniyat",
      tagline: "sin²α + cos²α = 1",
      theory:
        "sin²α + cos²α = 1. Bundan cos α = ±√(1 − sin²α) topiladi; burchak qaysi chorakda bo'lsa, ishora shunga qarab tanlanadi.",
      gen() {
        const triples = [
          [3, 4, 5],
          [5, 12, 13],
          [8, 15, 17],
          [7, 24, 25],
        ];
        const [s, c, h] = pick(triples);
        return {
          prompt: `Agar <b>sin α = ${s}/${h}</b> va α birinchi chorakda bo'lsa, <b>cos α</b> ni toping.`,
          answer: `${c}/${h}`,
          distractors: [`${s}/${h}`, `${h}/${c}`, `${h - c}/${h}`],
          hint: "cos²α = 1 − sin²α, birinchi chorakda cos α > 0.",
          steps: [
            `sin²α = ${s * s}/${h * h}`,
            `cos²α = 1 − ${s * s}/${h * h} = ${c * c}/${h * h}`,
            `cos α = ${c}/${h} (birinchi chorak, musbat)`,
          ],
        };
      },
    },
    {
      id: "trig.double",
      title: "Qo'sh burchak",
      tagline: "sin 2α va cos 2α",
      theory: "sin 2α = 2 sin α cos α, cos 2α = cos²α − sin²α = 1 − 2sin²α.",
      gen() {
        const triples = [
          [3, 4, 5],
          [5, 12, 13],
          [8, 15, 17],
        ];
        const [s, c, h] = pick(triples);
        const num = 2 * s * c;
        return {
          prompt: `Agar <b>sin α = ${s}/${h}</b> va <b>cos α = ${c}/${h}</b> bo'lsa, <b>sin 2α</b> ni toping.`,
          answer: `${num}/${h * h}`,
          distractors: [`${s * c}/${h * h}`, `${num}/${h}`, `${num + h}/${h * h}`],
          hint: "sin 2α = 2·sin α·cos α.",
          steps: [
            `sin 2α = 2 · ${s}/${h} · ${c}/${h}`,
            `= 2 · ${s * c} / ${h * h}`,
            `= ${num}/${h * h}`,
          ],
        };
      },
    },
    {
      id: "trig.equation",
      title: "Trigonometrik tenglama",
      tagline: "sin x = a",
      theory: "sin x = a tenglamaning yechimi: x = (−1)ⁿ arcsin a + πn, n ∈ ℤ.",
      gen() {
        const cases = [
          { a: "1/2", x: "π/6", arc: "π/6" },
          { a: "√2/2", x: "π/4", arc: "π/4" },
          { a: "√3/2", x: "π/3", arc: "π/3" },
        ];
        const k = pick(cases);
        return {
          prompt: `<b>sin x = ${k.a}</b> tenglamaning eng kichik musbat yechimini toping.`,
          answer: `${k.x}`,
          distractors: [`π − ${k.x}`, `${k.x}/2`, `π/${Number(k.x.split("/")[1]) + 1}`],
          hint: `arcsin ${k.a} = ${k.arc}.`,
          steps: [
            `x = (−1)ⁿ · arcsin(${k.a}) + πn`,
            `arcsin(${k.a}) = ${k.arc}`,
            `Eng kichik musbat yechim: ${k.x} (n = 0)`,
          ],
        };
      },
    },
    {
      id: "trig.triangle",
      title: "To'g'ri burchakli uchburchak",
      tagline: "Nisbatlar orqali tomon",
      theory:
        "sin α = qarshi katet / gipotenuza, cos α = yondosh katet / gipotenuza, tg α = qarshi / yondosh.",
      gen() {
        const [s, c, h] = pick([
          [3, 4, 5],
          [5, 12, 13],
          [8, 15, 17],
        ]);
        return {
          prompt: `Gipotenuzasi <b>${h}</b>, o'tkir burchagi α bo'lgan uchburchakda cos α = ${c}/${h}. Qarshisidagi katetni toping.`,
          answer: `${s}`,
          distractors: [`${c}`, `${h - c}`, `${s + 1}`],
          hint: "sin² + cos² = 1, keyin qarshi katet = h·sin α.",
          steps: [
            `cos α = ${c}/${h}, demak yondosh katet = ${c}`,
            `Gipotenuza ${h}, shuning uchun qarshi katet = √(${h}² − ${c}²)`,
            `= √${h * h - c * c} = ${s}`,
          ],
        };
      },
    },
    {
      id: "trig.cot",
      title: "Kotangens",
      tagline: "ctg α = cos α / sin α",
      theory: "ctg α = cos α / sin α. ctg 30° = √3, ctg 45° = 1, ctg 60° = √3/3.",
      gen() {
        const rows = [
          { d: 30, v: "√3" },
          { d: 45, v: "1" },
          { d: 60, v: "√3/3" },
        ];
        const r = pick(rows);
        const others = rows.filter((x) => x.v !== r.v).map((x) => x.v);
        return {
          prompt: `<b>ctg ${r.d}°</b> ni hisoblang.`,
          answer: `${r.v}`,
          distractors: [...others, "√2"],
          hint: "ctg = cos / sin. Qiymatlarni jadvaldan oling.",
          steps: [
            `${r.d}° uchun: sin = ${r.d === 30 ? "1/2" : r.d === 45 ? "√2/2" : "√3/2"}, cos = ${r.d === 30 ? "√3/2" : r.d === 45 ? "√2/2" : "1/2"}`,
            `ctg = cos / sin`,
            `ctg ${r.d}° = ${r.v}`,
          ],
        };
      },
    },
    {
      id: "trig.radian",
      title: "Gradus va radian",
      tagline: "180° = π",
      theory: "180° = π radian. α° ni radianga o'tkazish: α·π/180.",
      gen() {
        const map = [
          { d: 30, r: "π/6" },
          { d: 45, r: "π/4" },
          { d: 60, r: "π/3" },
          { d: 90, r: "π/2" },
          { d: 120, r: "2π/3" },
          { d: 180, r: "π" },
          { d: 270, r: "3π/2" },
        ];
        const m = pick(map);
        return {
          prompt: `<b>${m.d}°</b> ni radianda ifodalang.`,
          answer: `${m.r}`,
          distractors: map.filter((x) => x.r !== m.r).map((x) => x.r).slice(0, 3),
          hint: "α° = α·π/180.",
          steps: [
            `${m.d}° = ${m.d}·π/180`,
            `${m.d}/180 = ${m.d}/180`,
            `= ${m.r}`,
          ],
        };
      },
    },
    {
      id: "trig.reduction",
      title: "Keltirish formulasi",
      tagline: "sin(180° − α)",
      theory:
        "sin(180° − α) = sin α, cos(180° − α) = −cos α. Ikkinchi chorakda sinus musbat, kosinus manfiy.",
      gen() {
        const cases = [
          { p: "sin 150°", v: "1/2", s: "sin(180° − 30°) = sin 30°" },
          { p: "cos 120°", v: "−1/2", s: "cos(180° − 60°) = −cos 60°" },
          { p: "sin 135°", v: "√2/2", s: "sin(180° − 45°) = sin 45°" },
          { p: "cos 150°", v: "−√3/2", s: "cos(180° − 30°) = −cos 30°" },
        ];
        const c = pick(cases);
        return {
          prompt: `<b>${c.p}</b> ni hisoblang.`,
          answer: `${c.v}`,
          distractors: cases.filter((x) => x.v !== c.v).map((x) => x.v).slice(0, 3),
          hint: "Burchakni 180° − α ko'rinishida yozing.",
          steps: [c.s, `Javob: ${c.v}`],
        };
      },
    },
    {
      id: "trig.equationCos",
      title: "Kosinusli tenglama",
      tagline: "cos x = a",
      theory: "cos x = a tenglamaning yechimi x = ±arccos a + 2πk.",
      gen() {
        const cases = [
          { a: "1/2", x: "π/3" },
          { a: "√2/2", x: "π/4" },
          { a: "√3/2", x: "π/6" },
        ];
        const c = pick(cases);
        return {
          prompt: `<b>cos x = ${c.a}</b> tenglamaning eng kichik musbat yechimini toping.`,
          answer: `${c.x}`,
          distractors: [`π − ${c.x}`, `${c.x}/2`, `π/2`],
          hint: `arccos ${c.a} = ${c.x}.`,
          steps: [
            `x = ±arccos(${c.a}) + 2πk`,
            `arccos(${c.a}) = ${c.x}`,
            `Eng kichik musbat yechim: ${c.x}`,
          ],
        };
      },
    },
    {
      id: "trig.equationTg",
      title: "Tangensli tenglama",
      tagline: "tg x = a",
      theory: "tg x = a ⟹ x = arctg a + πk.",
      gen() {
        const cases = [
          { a: "1", x: "π/4" },
          { a: "√3", x: "π/3" },
          { a: "√3/3", x: "π/6" },
        ];
        const c = pick(cases);
        return {
          prompt: `<b>tg x = ${c.a}</b> tenglamaning eng kichik musbat yechimini toping.`,
          answer: `${c.x}`,
          distractors: [`π − ${c.x}`, `${c.x}/2`, `π/2`],
          hint: `arctg ${c.a} = ${c.x}.`,
          steps: [
            `x = arctg(${c.a}) + πk`,
            `arctg(${c.a}) = ${c.x}`,
            `Eng kichik musbat yechim: ${c.x}`,
          ],
        };
      },
    },
    {
      id: "trig.identityTg",
      title: "Tangens orqali kosinus",
      tagline: "1 + tg²α = 1/cos²α",
      theory: "1 + tg²α = 1/cos²α. Bundan cos²α = 1/(1 + tg²α).",
      gen() {
        const triples = [
          [3, 4, 5],
          [5, 12, 13],
          [8, 15, 17],
        ];
        const [s, c, h] = pick(triples);
        return {
          prompt: `Agar <b>tg α = ${s}/${c}</b> va α birinchi chorakda bo'lsa, <b>cos α</b> ni toping.`,
          answer: `${c}/${h}`,
          distractors: [`${s}/${h}`, `${h}/${c}`, `${c}/${s}`],
          hint: "cos²α = 1/(1 + tg²α).",
          steps: [
            `tg²α = ${s * s}/${c * c}`,
            `1 + tg²α = ${h * h}/${c * c}`,
            `cos²α = ${c * c}/${h * h}, cos α = ${c}/${h}`,
          ],
        };
      },
    },
    {
      id: "trig.arcsin",
      title: "Teskari funksiya",
      tagline: "arcsin qiymati",
      theory: "arcsin(1/2) = π/6, arcsin(√2/2) = π/4, arcsin(√3/2) = π/3.",
      gen() {
        const cases = [
          { v: "1/2", x: "π/6" },
          { v: "√2/2", x: "π/4" },
          { v: "√3/2", x: "π/3" },
        ];
        const c = pick(cases);
        return {
          prompt: `<b>arcsin(${c.v})</b> ni toping.`,
          answer: `${c.x}`,
          distractors: cases.filter((x) => x.x !== c.x).map((x) => x.x).slice(0, 3),
          hint: "Qaysi burchakning sinusi shu qiymatga teng?",
          steps: [`sin(${c.x}) = ${c.v}`, `Demak arcsin(${c.v}) = ${c.x}`],
        };
      },
    },
    {
      id: "trig.triangleArea",
      title: "Uchburchak yuzi (sinus orqali)",
      tagline: "S = ½ab·sin C",
      theory: "Ikki tomon va ular orasidagi burchak berilgan bo'lsa: S = ½·a·b·sin C.",
      gen() {
        const a = ri(4, 12);
        const b = ri(4, 12);
        const angle = pick([30, 150]);
        const sin = 0.5;
        const S = 0.5 * a * b * sin;
        return {
          prompt: `Uchburchakning ikki tomoni <b>${a} sm</b> va <b>${b} sm</b>, orasidagi burchak <b>${angle}°</b>. Yuzini toping.`,
          answer: `${S} sm²`,
          distractors: [`${a * b} sm²`, `${S * 2} sm²`, `${a + b} sm²`],
          hint: `sin ${angle}° = 1/2.`,
          steps: [
            `S = ½ · ${a} · ${b} · sin ${angle}°`,
            `sin ${angle}° = 1/2`,
            `S = ½ · ${a} · ${b} · ½ = ${S} sm²`,
          ],
        };
      },
    },
    {
      id: "trig.cosineRule",
      title: "Kosinuslar teoremasi",
      tagline: "c² = a² + b² − 2ab·cos C",
      theory: "c² = a² + b² − 2ab·cos C. C = 60° bo'lsa cos 60° = 1/2.",
      gen() {
        const a = ri(4, 9);
        const b = ri(5, 10);
        const c2 = a * a + b * b - a * b;
        const c = Math.sqrt(c2);
        return {
          prompt: `Uchburchakda a = ${a}, b = ${b}, ular orasidagi burchak C = 60°. <b>c</b> tomonni toping.`,
          answer: `${c}`,
          distractors: [`${a + b}`, `${Math.round(c * 2)}`, `${Math.round(c + 2)}`],
          hint: "c² = a² + b² − 2ab·cos 60°, cos 60° = 1/2.",
          steps: [
            `c² = ${a * a} + ${b * b} − 2·${a}·${b}·½`,
            `c² = ${a * a + b * b} − ${a * b} = ${c2}`,
            `c = √${c2} = ${c}`,
          ],
        };
      },
    },
    {
      id: "trig.sineRule",
      title: "Sinuslar teoremasi",
      tagline: "a/sin A = 2R",
      theory: "a/sin A = b/sin B = 2R, bu yerda R — tashqi chizilgan aylana radiusi.",
      gen() {
        const R = ri(3, 9);
        const cases = [
          { a: "1/2", name: "30°" },
          { a: "√2/2", name: "45°" },
          { a: "√3/2", name: "60°" },
          { a: "1", name: "90°" },
        ];
        const c = pick(cases);
        const side = 2 * R * (c.a === "1" ? 1 : c.a === "1/2" ? 0.5 : c.a === "√2/2" ? Math.SQRT1_2 : Math.sqrt(3) / 2);
        const nice = Math.round(side * 100) / 100;
        return {
          prompt: `Aylana radiusi R = ${R}. Unga ichki chizilgan uchburchakda A burchak ${c.name}, unga qarshi tomon <b>a</b>. a ni toping.`,
          answer: `${nice}`,
          distractors: [`${2 * R}`, `${R}`, `${Math.round(nice * 2 * 100) / 100}`],
          hint: "a / sin A = 2R ⟹ a = 2R·sin A.",
          steps: [
            `a = 2R · sin A = 2·${R}·sin ${c.name}`,
            `sin ${c.name} = ${c.a}`,
            `a = ${nice}`,
          ],
        };
      },
    },
    {
      id: "trig.tgValues",
      title: "Tangens qiymatlari",
      tagline: "tg 30°, 45°, 60°",
      theory: "tg 30° = √3/3, tg 45° = 1, tg 60° = √3.",
      gen() {
        const rows = [
          { d: 30, v: "√3/3" },
          { d: 45, v: "1" },
          { d: 60, v: "√3" },
        ];
        const r = pick(rows);
        return {
          prompt: `<b>tg ${r.d}°</b> ni hisoblang.`,
          answer: `${r.v}`,
          distractors: rows.filter((x) => x.v !== r.v).map((x) => x.v),
          hint: "tg = sin / cos.",
          steps: [`tg ${r.d}° = ${r.v}`],
        };
      },
    },
    {
      id: "trig.doubleCos",
      title: "Qo'sh burchak kosinusi",
      tagline: "cos 2α = 1 − 2sin²α",
      theory: "cos 2α = cos²α − sin²α = 1 − 2sin²α.",
      gen() {
        const triples = [
          [3, 4, 5],
          [5, 12, 13],
          [8, 15, 17],
        ];
        const [s, c, h] = pick(triples);
        const num = c * c - s * s;
        return {
          prompt: `Agar <b>sin α = ${s}/${h}</b> bo'lsa, <b>cos 2α</b> ni toping.`,
          answer: `${num}/${h * h}`,
          distractors: [`${s * s - c * c}/${h * h}`, `${s}/${h}`, `${num}/${h}`],
          hint: "cos 2α = 1 − 2sin²α.",
          steps: [
            `sin²α = ${s * s}/${h * h}`,
            `cos 2α = 1 − 2·${s * s}/${h * h}`,
            `= ${num}/${h * h}`,
          ],
        };
      },
    },
    {
      id: "trig.triangleSide",
      title: "Katetni topish",
      tagline: "a = c·sin α",
      theory: "To'g'ri burchakli uchburchakda qarshi katet a = c·sin α, yondosh katet b = c·cos α.",
      gen() {
        const triples = [
          [3, 4, 5],
          [5, 12, 13],
          [8, 15, 17],
        ];
        const [s, c, h] = pick(triples);
        return {
          prompt: `Gipotenuzasi <b>${h}</b> bo'lgan to'g'ri burchakli uchburchakda sin α = ${s}/${h}. Qarshi katetni toping.`,
          answer: `${s}`,
          distractors: [`${c}`, `${h}`, `${s + 1}`],
          hint: "a = c · sin α.",
          steps: [`a = ${h} · ${s}/${h}`, `a = ${s}`],
        };
      },
    },
    {
      id: "trig.elevation",
      title: "Ko'tarilish burchagi",
      tagline: "h = d·tg α",
      theory: "Balandlik burchagi α bo'lsa, h = d·tg α.",
      gen() {
        const d = ri(4, 20) * 5;
        const angle = pick([45]);
        return {
          prompt: `Yerdan <b>${d} m</b> uzoqdan minoraga qarab balandlik burchagi <b>${angle}°</b>. Minoraning balandligini toping.`,
          answer: `${d} m`,
          distractors: [`${d / 2} m`, `${d * 2} m`, `${d + 10} m`],
          hint: `tg ${angle}° = 1, demak h = d.`,
          steps: [`h = d · tg ${angle}°`, `tg ${angle}° = 1`, `h = ${d} m`],
        };
      },
    },
    {
      id: "trig.period",
      title: "Davr",
      tagline: "T = 2π/k",
      theory: "y = sin(kx) funksiyaning davri T = 2π/|k|.",
      gen() {
        const cases = [
          { k: 2, T: "π" },
          { k: 3, T: "2π/3" },
          { k: 4, T: "π/2" },
          { k: 6, T: "π/3" },
        ];
        const c = pick(cases);
        return {
          prompt: `<b>y = sin(${c.k}x)</b> funksiyaning davrini toping.`,
          answer: `${c.T}`,
          distractors: cases.filter((x) => x.T !== c.T).map((x) => x.T).slice(0, 3),
          hint: "T = 2π/|k|.",
          steps: [`T = 2π/${c.k}`, `T = ${c.T}`],
        };
      },
    },
    {
      id: "trig.amplitude",
      title: "Amplituda",
      tagline: "y = A·sin x",
      theory: "y = A·sin x uchun amplituda |A| ga teng.",
      gen() {
        const A = ri(2, 9) * pick([1, -1]);
        return {
          prompt: `<b>y = ${A}·sin x</b> funksiyaning amplitudasini toping.`,
          answer: `${Math.abs(A)}`,
          distractors: [`${A}`, `${Math.abs(A) + 1}`, `${Math.abs(A) / 2}`],
          hint: "Amplituda — |A|.",
          steps: [`|A| = |${A}|`, `= ${Math.abs(A)}`],
        };
      },
    },
    {
      id: "trig.maxMin",
      title: "Eng katta qiymat",
      tagline: "y = a + b·sin x",
      theory: "sin x ∈ [−1; 1], shuning uchun y = a + b·sin x ning eng katta qiymati a + b.",
      gen() {
        const a = ri(1, 6);
        const b = ri(1, 5);
        return {
          prompt: `<b>y = ${a} + ${b}·sin x</b> funksiyaning eng katta qiymatini toping.`,
          answer: `${a + b}`,
          distractors: [`${a - b}`, `${a}`, `${b}`],
          hint: "sin x ning eng katta qiymati 1.",
          steps: [`sin x = 1 bo'lganda y eng katta`, `y = ${a} + ${b}·1 = ${a + b}`],
        };
      },
    },
    {
      id: "trig.arccos",
      title: "Arkkosinus",
      tagline: "arccos qiymati",
      theory: "arccos(1/2) = π/3, arccos(√2/2) = π/4, arccos(0) = π/2.",
      gen() {
        const cases = [
          { v: "1/2", x: "π/3" },
          { v: "√2/2", x: "π/4" },
          { v: "0", x: "π/2" },
          { v: "√3/2", x: "π/6" },
        ];
        const c = pick(cases);
        return {
          prompt: `<b>arccos(${c.v})</b> ni toping.`,
          answer: `${c.x}`,
          distractors: cases.filter((x) => x.x !== c.x).map((x) => x.x).slice(0, 3),
          hint: "Qaysi burchakning kosinusi shu qiymatga teng?",
          steps: [`cos(${c.x}) = ${c.v}`, `Demak arccos(${c.v}) = ${c.x}`],
        };
      },
    },
    {
      id: "trig.sinNegative",
      title: "Manfiy burchak",
      tagline: "sin(−α) = −sin α",
      theory: "Sinus — toq funksiya: sin(−α) = −sin α. Kosinus — juft: cos(−α) = cos α.",
      gen() {
        const cases = [
          { p: "sin(−30°)", v: "−1/2" },
          { p: "cos(−60°)", v: "1/2" },
          { p: "sin(−45°)", v: "−√2/2" },
          { p: "cos(−120°)", v: "−1/2" },
        ];
        const c = pick(cases);
        return {
          prompt: `<b>${c.p}</b> ni hisoblang.`,
          answer: `${c.v}`,
          distractors: cases.filter((x) => x.v !== c.v).map((x) => x.v).slice(0, 3),
          hint: "Sinus toq, kosinus juft funksiya.",
          steps: [
            c.p.startsWith("sin") ? "sin(−α) = −sin α" : "cos(−α) = cos α",
            `Javob: ${c.v}`,
          ],
        };
      },
    },
    {
      id: "trig.sinCot",
      title: "Sinus va kotangens",
      tagline: "sin α · ctg α = cos α",
      theory: "ctg α = cos α / sin α, shuning uchun sin α · ctg α = cos α.",
      gen() {
        const triples = [
          [3, 4, 5],
          [5, 12, 13],
          [8, 15, 17],
        ];
        const [s, c, h] = pick(triples);
        return {
          prompt: `Agar <b>sin α = ${s}/${h}</b> va <b>cos α = ${c}/${h}</b> bo'lsa, <b>sin α · ctg α</b> ni toping.`,
          answer: `${c}/${h}`,
          distractors: [`${s}/${h}`, `${h}/${c}`, `${s * c}/${h}`],
          hint: "sin α · ctg α = cos α.",
          steps: [
            `ctg α = cos α / sin α = ${c}/${s}`,
            `sin α · ctg α = ${s}/${h} · ${c}/${s}`,
            `= ${c}/${h}`,
          ],
        };
      },
    },
    {
      id: "trig.sinFromCos",
      title: "Kosinusdan sinus",
      tagline: "Birinchi chorak",
      theory: "sin²α = 1 − cos²α. Birinchi chorakda sinus musbat.",
      gen() {
        const [s, c, h] = pick([
          [3, 4, 5],
          [5, 12, 13],
          [8, 15, 17],
        ]);
        return {
          prompt: `Agar <b>cos α = ${c}/${h}</b> va α birinchi chorakda bo'lsa, <b>sin α</b> ni toping.`,
          answer: `${s}/${h}`,
          distractors: [`${c}/${h}`, `${h}/${s}`, `${s + 1}/${h}`],
          hint: "sin²α = 1 − cos²α.",
          steps: [
            `cos²α = ${c * c}/${h * h}`,
            `sin²α = 1 − ${c * c}/${h * h} = ${s * s}/${h * h}`,
            `sin α = ${s}/${h}`,
          ],
        };
      },
    },
    {
      id: "trig.tgFromSin",
      title: "Sinusdan tangens",
      tagline: "tg = sin / cos",
      theory: "tg α = sin α / cos α.",
      gen() {
        const [s, c, h] = pick([
          [3, 4, 5],
          [5, 12, 13],
          [8, 15, 17],
        ]);
        return {
          prompt: `Agar <b>sin α = ${s}/${h}</b> va <b>cos α = ${c}/${h}</b> bo'lsa, <b>tg α</b> ni toping.`,
          answer: `${s}/${c}`,
          distractors: [`${c}/${s}`, `${s}/${h}`, `${h}/${c}`],
          hint: "tg = sin / cos.",
          steps: [`tg = (${s}/${h}) / (${c}/${h})`, `tg = ${s}/${c}`],
        };
      },
    },
    {
      id: "trig.cofunction",
      title: "Kofunksiya",
      tagline: "sin(90° − α) = cos α",
      theory: "sin(90° − α) = cos α, cos(90° − α) = sin α.",
      gen() {
        const a = ri(10, 80);
        const mode = pick(["sin", "cos"]);
        const ans = mode === "sin" ? `cos ${a}°` : `sin ${a}°`;
        return {
          prompt: `<b>${mode}(90° − ${a}°)</b> ifodani soddalashtiring.`,
          answer: ans,
          distractors: [`${mode} ${a}°`, `−${mode} ${a}°`, `tg ${a}°`],
          hint: "Kofunksiya xossasi.",
          steps: [`90° − ${a}° = ${90 - a}°`, `${mode}(90° − α) = ${mode === "sin" ? "cos" : "sin"} α`, `Javob: ${ans}`],
        };
      },
    },
    {
      id: "trig.cosDoubleFromCos",
      title: "cos 2α (kosinus orqali)",
      tagline: "2cos²α − 1",
      theory: "cos 2α = 2cos²α − 1.",
      gen() {
        const [s, c, h] = pick([
          [3, 4, 5],
          [5, 12, 13],
          [8, 15, 17],
        ]);
        const num = 2 * c * c - h * h;
        return {
          prompt: `Agar <b>cos α = ${c}/${h}</b> bo'lsa, <b>cos 2α</b> ni toping.`,
          answer: `${num}/${h * h}`,
          distractors: [`${h * h - 2 * c * c}/${h * h}`, `${c}/${h}`, `${2 * c}/${h}`],
          hint: "cos 2α = 2cos²α − 1.",
          steps: [
            `cos²α = ${c * c}/${h * h}`,
            `cos 2α = 2·${c * c}/${h * h} − 1`,
            `= ${num}/${h * h}`,
          ],
        };
      },
    },
    {
      id: "trig.radTable",
      title: "Radian jadvali",
      tagline: "sin(π/6) va boshqalar",
      theory: "sin(π/6) = 1/2, sin(π/4) = √2/2, sin(π/3) = √3/2, sin(π/2) = 1.",
      gen() {
        const cases = [
          { a: "π/6", v: "1/2" },
          { a: "π/4", v: "√2/2" },
          { a: "π/3", v: "√3/2" },
          { a: "π/2", v: "1" },
        ];
        const c = pick(cases);
        return {
          prompt: `<b>sin(${c.a})</b> ni hisoblang.`,
          answer: `${c.v}`,
          distractors: cases.filter((x) => x.v !== c.v).map((x) => x.v).slice(0, 3),
          hint: `π/6 = 30°, π/4 = 45°, π/3 = 60°.`,
          steps: [`${c.a} — standart burchak`, `sin(${c.a}) = ${c.v}`],
        };
      },
    },
    {
      id: "trig.inverseTriangle",
      title: "Burchakni topish",
      tagline: "arcsin orqali",
      theory: "To'g'ri burchakli uchburchakda sin α = qarshi/gipotenuza, α = arcsin(qarshi/gipotenuza).",
      gen() {
        const cases = [
          { s: 1, h: 2, a: "30°" },
          { s: 1, h: 1, a: "90°" },
          { s: 8, h: 16, a: "30°" },
        ];
        const c = pick(cases);
        return {
          prompt: `To'g'ri burchakli uchburchakda qarshi katet <b>${c.s}</b>, gipotenuza <b>${c.h}</b>. α burchakni toping.`,
          answer: c.a,
          distractors: ["45°", "60°", "90°"].filter((x) => x !== c.a),
          hint: `sin α = ${c.s}/${c.h}.`,
          steps: [`sin α = ${c.s}/${c.h}`, `α = ${c.a}`],
        };
      },
    },
    {
      id: "trig.identityValue",
      title: "Ayniyat qiymati",
      tagline: "sin²α + cos²α",
      theory: "Har qanday α uchun sin²α + cos²α = 1.",
      gen() {
        const a = ri(10, 80);
        const mode = pick(["sum", "plus"]);
        return {
          prompt:
            mode === "sum"
              ? `<b>sin²${a}° + cos²${a}°</b> ni hisoblang.`
              : `<b>sin²${a}° + cos²${a}° + 5</b> ni hisoblang.`,
          answer: mode === "sum" ? "1" : "6",
          distractors: mode === "sum" ? ["0", "2", `${a}`] : ["5", "7", "1"],
          hint: "sin²α + cos²α = 1.",
          steps: ["sin²α + cos²α = 1", `Javob: ${mode === "sum" ? "1" : "6"}`],
        };
      },
    },
    {
      id: "trig.periodShift",
      title: "Davriylik",
      tagline: "sin(x + 2π) = sin x",
      theory: "Sinus va kosinus 2π davrli: sin(x + 2πk) = sin x.",
      gen() {
        const k = ri(1, 3);
        return {
          prompt: `<b>sin(30° + ${k}·360°)</b> ni hisoblang.`,
          answer: "1/2",
          distractors: ["−1/2", "√3/2", "0"],
          hint: "360° to'liq aylanish — qiymat o'zgarmaydi.",
          steps: [`${k}·360° to'liq aylanish`, `sin(30°) = 1/2`],
        };
      },
    },
    {
      id: "trig.tgCot",
      title: "Tangens va kotangens",
      tagline: "tg α · ctg α = 1",
      theory: "tg α · ctg α = 1, chunki ctg α = 1/tg α.",
      gen() {
        const cases = [
          { a: 30, tg: "√3/3", ctg: "√3" },
          { a: 45, tg: "1", ctg: "1" },
          { a: 60, tg: "√3", ctg: "√3/3" },
        ];
        const c = pick(cases);
        return {
          prompt: `Agar <b>tg α = ${c.tg}</b> bo'lsa, <b>ctg α</b> ni toping.`,
          answer: c.ctg,
          distractors: cases.filter((x) => x.ctg !== c.ctg).map((x) => x.tg).slice(0, 3),
          hint: "ctg α = 1 / tg α.",
          steps: [`ctg α = 1 / (${c.tg})`, `ctg α = ${c.ctg}`],
        };
      },
    },
    {
      id: "trig.radToDegree",
      title: "Radiandan gradusga",
      tagline: "· 180/π",
      theory: "α radian = α·180/π gradus. π radian = 180°.",
      gen() {
        const cases = [
          { r: "π/6", d: 30 },
          { r: "π/4", d: 45 },
          { r: "π/3", d: 60 },
          { r: "π/2", d: 90 },
          { r: "3π/4", d: 135 },
          { r: "2π/3", d: 120 },
        ];
        const c = pick(cases);
        return {
          prompt: `<b>${c.r}</b> radianni gradusga o'giring.`,
          answer: `${c.d}°`,
          distractors: cases.filter((x) => x.d !== c.d).map((x) => `${x.d}°`).slice(0, 3),
          hint: "π = 180°.",
          steps: [`${c.r} · 180/π`, `= ${c.d}°`],
        };
      },
    },
    {
      id: "trig.sinRange",
      title: "Sinus va kosinus sohasi",
      tagline: "−1 ≤ sin x ≤ 1",
      theory: "sin x va cos x qiymatlari har doim [−1; 1] oraliqda yotadi.",
      gen() {
        const mode = pick(["sin", "cos"]);
        return {
          prompt: `<b>${mode} x</b> funksiyaning qiymatlar sohasi qanday?`,
          answer: "[−1; 1]",
          distractors: ["[0; 1]", "(−∞; +∞)", "[−2; 2]"],
          hint: "Birlik aylanada koordinatalar 1 dan oshmaydi.",
          steps: [`${mode} x ∈ [−1; 1]`],
        };
      },
    },
    {
      id: "trig.cotNegative",
      title: "Kotangensning ishorasi",
      tagline: "Choraklar bo'yicha",
      theory: "II chorakda sin musbat, cos manfiy; demak ctg manfiy.",
      gen() {
        const cases = [
          { a: 120, ctg: "manfiy", why: "cos 120° < 0, sin 120° > 0" },
          { a: 150, ctg: "manfiy", why: "cos 150° < 0, sin 150° > 0" },
          { a: 60, ctg: "musbat", why: "cos 60° > 0, sin 60° > 0" },
          { a: 240, ctg: "musbat", why: "ikkisi ham manfiy, nisbat musbat" },
          { a: 300, ctg: "manfiy", why: "cos 300° > 0, sin 300° < 0" },
        ];
        const c = pick(cases);
        return {
          prompt: `<b>ctg ${c.a}°</b> qanday ishoraga ega?`,
          answer: c.ctg,
          distractors: ["musbat", "manfiy", "nol"].filter((x) => x !== c.ctg),
          hint: "ctg = cos / sin.",
          steps: [c.why, `Demak ctg ${c.a}° ${c.ctg}`],
        };
      },
    },
    {
      id: "trig.tgPeriod",
      title: "Tangens davri",
      tagline: "T = π",
      theory: "tg x va ctg x funksiyalarining davri π ga teng.",
      gen() {
        const fn = pick(["tg", "ctg"]);
        return {
          prompt: `<b>${fn} x</b> funksiyaning davri qancha?`,
          answer: "π",
          distractors: ["2π", "π/2", "4π"],
          hint: "Sinus/kosinus 2π, tangens/kotangens π.",
          steps: [`${fn}(x + π) = ${fn} x`, `Davr: π`],
        };
      },
    },
    {
      id: "trig.signByQuadrant",
      title: "Chorak bo'yicha ishora",
      tagline: "I, II, III, IV",
      theory: "I chorakda hammasi musbat; II — sin; III — tg va ctg; IV — cos.",
      gen() {
        const cases = [
          { q: "I", fn: "cos", sign: "musbat" },
          { q: "II", fn: "cos", sign: "manfiy" },
          { q: "II", fn: "sin", sign: "musbat" },
          { q: "III", fn: "sin", sign: "manfiy" },
          { q: "III", fn: "tg", sign: "musbat" },
          { q: "IV", fn: "cos", sign: "musbat" },
          { q: "IV", fn: "sin", sign: "manfiy" },
        ];
        const c = pick(cases);
        return {
          prompt: `<b>${c.fn} α</b> qaysi chorakda ${c.sign}?`,
          answer: c.q,
          distractors: ["I", "II", "III", "IV"].filter((x) => x !== c.q).slice(0, 3),
          hint: "Choraklar bo'yicha ishoralar jadvalini eslang.",
          steps: [`${c.fn} α ${c.q} chorakda ${c.sign}`],
        };
      },
    },
    {
      id: "trig.tableFull",
      title: "To'liq qiymatlar jadvali",
      tagline: "0° dan 90° gacha",
      theory: "sin: 0, ½, √2/2, √3/2, 1 — 0°, 30°, 45°, 60°, 90° uchun.",
      gen() {
        const rows = [
          { d: 0, s: "0", c: "1" },
          { d: 30, s: "1/2", c: "√3/2" },
          { d: 45, s: "√2/2", c: "√2/2" },
          { d: 60, s: "√3/2", c: "1/2" },
          { d: 90, s: "1", c: "0" },
        ];
        const r = pick(rows);
        const fn = pick(["sin", "cos"]);
        const v = fn === "sin" ? r.s : r.c;
        return {
          prompt: `<b>${fn} ${r.d}°</b> ni hisoblang.`,
          answer: v,
          distractors: [...new Set(rows.map((x) => (fn === "sin" ? x.s : x.c)).filter((x) => x !== v))].slice(0, 3),
          hint: "Jadvalni yodga oling.",
          steps: [`${fn} ${r.d}° = ${v}`],
        };
      },
    },
  ],
};
