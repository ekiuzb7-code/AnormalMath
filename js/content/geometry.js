// AnormalMath — Geometry bo'limi
import { ri, pick, fmt } from "../engine.js";

export const geometry = {
  id: "geometry",
  title: "Geometriya",
  glyph: "△",
  accent: "#3b82f6",
  blurb: "Uchburchak, aylana, jismlar hajmi va sirt yuzi.",
  topics: [
    {
      id: "geometry.triangleArea",
      title: "Uchburchak yuzi",
      tagline: "Asos va balandlik",
      theory: "S = ½ · a · h. Asos bilan balandlik ko'paytmasining yarmi.",
      gen() {
        const a = ri(4, 18) * 2;
        const h = ri(3, 15);
        const S = (a * h) / 2;
        return {
          prompt: `Asosi <b>${a} sm</b>, balandligi <b>${h} sm</b> bo'lgan uchburchak yuzini toping.`,
          answer: `${S} sm²`,
          distractors: [`${a * h} sm²`, `${S + a} sm²`, `${(a + h) / 2} sm²`],
          hint: "S = ½ · a · h.",
          steps: [`S = ½ · ${a} · ${h}`, `S = ${a * h} / 2 = ${S} sm²`],
        };
      },
    },
    {
      id: "geometry.pythagoras",
      title: "Pifagor teoremasi",
      tagline: "Gipotenuza va katet",
      theory: "To'g'ri burchakli uchburchakda c² = a² + b², bu yerda c — gipotenuza.",
      gen() {
        const triples = [
          [3, 4, 5],
          [5, 12, 13],
          [6, 8, 10],
          [8, 15, 17],
          [9, 12, 15],
          [7, 24, 25],
        ];
        const [a, b, c] = pick(triples);
        return {
          prompt: `To'g'ri burchakli uchburchakning katetlari <b>${a}</b> va <b>${b}</b>. Gipotenuzani toping.`,
          answer: `${c}`,
          distractors: [`${c + 1}`, `${a + b}`, `${c - 2}`],
          hint: "c² = a² + b².",
          steps: [
            `c² = ${a}² + ${b}² = ${a * a} + ${b * b} = ${a * a + b * b}`,
            `c = √${a * a + b * b} = ${c}`,
          ],
        };
      },
    },
    {
      id: "geometry.circle",
      title: "Aylana va doira",
      tagline: "Uzunlik va yuza",
      theory: "Aylana uzunligi C = 2πr, doira yuzi S = πr². π ≈ 3,14.",
      gen() {
        const r = ri(2, 12);
        const area = Math.round(3.14 * r * r * 100) / 100;
        return {
          prompt: `Radiusi <b>${r} sm</b> bo'lgan doiraning yuzini toping. (π ≈ 3,14)`,
          answer: `${fmt(area)} sm²`,
          distractors: [
            `${fmt(Math.round(2 * 3.14 * r * 100) / 100)} sm²`,
            `${fmt(Math.round(3.14 * r * 100) / 100)} sm²`,
            `${fmt(Math.round(area * 2 * 100) / 100)} sm²`,
          ],
          hint: "S = πr².",
          steps: [`S = πr² = 3,14 · ${r}²`, `S = 3,14 · ${r * r} = ${fmt(area)} sm²`],
        };
      },
    },
    {
      id: "geometry.cylinder",
      title: "Silindr hajmi",
      tagline: "V = πr²h",
      theory: "Silindr hajmi V = πr²h, yon sirti S = 2πrh.",
      gen() {
        const r = ri(2, 7);
        const h = ri(3, 12);
        const V = Math.round(3.14 * r * r * h * 100) / 100;
        return {
          prompt: `Radiusi <b>${r} sm</b>, balandligi <b>${h} sm</b> bo'lgan silindr hajmini toping. (π ≈ 3,14)`,
          answer: `${fmt(V)} sm³`,
          distractors: [
            `${fmt(Math.round(3.14 * r * h * 100) / 100)} sm³`,
            `${fmt(Math.round(V * 3 * 100) / 100)} sm³`,
            `${fmt(Math.round(3.14 * r * r * 100) / 100)} sm³`,
          ],
          hint: "V = πr²h.",
          steps: [
            `r² = ${r * r}`,
            `V = 3,14 · ${r * r} · ${h}`,
            `V = ${fmt(V)} sm³`,
          ],
        };
      },
    },
    {
      id: "geometry.cone",
      title: "Konus",
      tagline: "Hajm va yon sirt",
      theory: "Konus hajmi V = ⅓πr²h, yon sirti S = πrl (l — yasovchi).",
      gen() {
        const r = ri(2, 8);
        const h = ri(3, 9) * (r === 6 ? 2 : 1);
        const V = Math.round((3.14 * r * r * h) / 3 * 100) / 100;
        return {
          prompt: `Radiusi <b>${r} sm</b>, balandligi <b>${h} sm</b> bo'lgan konus hajmini toping. (π ≈ 3,14)`,
          answer: `${fmt(V)} sm³`,
          distractors: [
            `${fmt(Math.round(3.14 * r * r * h * 100) / 100)} sm³`,
            `${fmt(Math.round(V * 2 * 100) / 100)} sm³`,
            `${fmt(Math.round((3.14 * r * h) / 3 * 100) / 100)} sm³`,
          ],
          hint: "V = ⅓πr²h.",
          steps: [
            `πr²h = 3,14 · ${r * r} · ${h} = ${fmt(Math.round(3.14 * r * r * h * 100) / 100)}`,
            `V = bu qiymatning uchdan biri = ${fmt(V)} sm³`,
          ],
        };
      },
    },
    {
      id: "geometry.polygon",
      title: "Ko'pburchak burchaklari",
      tagline: "Ichki burchaklar yig'indisi",
      theory: "n burchakli ko'pburchak ichki burchaklari yig'indisi 180°·(n − 2).",
      gen() {
        const n = ri(5, 12);
        const sum = 180 * (n - 2);
        return {
          prompt: `<b>${n}</b> burchakli ko'pburchakning ichki burchaklari yig'indisini toping.`,
          answer: `${sum}°`,
          distractors: [`${180 * n}°`, `${180 * (n - 1)}°`, `${360}°`],
          hint: "S = 180°·(n − 2).",
          steps: [`S = 180° · (${n} − 2)`, `S = 180° · ${n - 2} = ${sum}°`],
        };
      },
    },
    {
      id: "geometry.distance",
      title: "Ikki nuqta orasidagi masofa",
      tagline: "√((x₂−x₁)² + (y₂−y₁)²)",
      theory: "A(x₁; y₁) va B(x₂; y₂) orasidagi masofa: d = √((x₂ − x₁)² + (y₂ − y₁)²).",
      gen() {
        const triples = [
          [3, 4, 5],
          [6, 8, 10],
          [5, 12, 13],
          [8, 15, 17],
        ];
        const [dx, dy, d] = pick(triples);
        const x1 = ri(-4, 6);
        const y1 = ri(-4, 6);
        return {
          prompt: `A(${x1}; ${y1}) va B(${x1 + dx}; ${y1 + dy}) nuqtalar orasidagi masofani toping.`,
          answer: `${d}`,
          distractors: [`${dx + dy}`, `${d + 1}`, `${Math.round(Math.sqrt(dx * dx + dy * dy) * 2)}`],
          hint: "d = √(Δx² + Δy²).",
          steps: [
            `Δx = ${x1 + dx} − ${x1} = ${dx}`,
            `Δy = ${y1 + dy} − ${y1} = ${dy}`,
            `d = √(${dx * dx} + ${dy * dy}) = √${dx * dx + dy * dy} = ${d}`,
          ],
        };
      },
    },
    {
      id: "geometry.midpoint",
      title: "Kesma o'rtasi",
      tagline: "Koordinatalar o'rtachasi",
      theory: "AB kesmaning o'rtasi: M((x₁ + x₂)/2; (y₁ + y₂)/2).",
      gen() {
        const x1 = ri(-8, 4);
        const y1 = ri(-8, 4);
        const x2 = x1 + 2 * ri(1, 6);
        const y2 = y1 + 2 * ri(1, 6);
        return {
          prompt: `A(${x1}; ${y1}) va B(${x2}; ${y2}) kesmaning o'rtasi qaysi nuqta?`,
          answer: `(${(x1 + x2) / 2}; ${(y1 + y2) / 2})`,
          distractors: [
            `(${x1 + x2}; ${y1 + y2})`,
            `(${(x2 - x1) / 2}; ${(y2 - y1) / 2})`,
            `(${(x1 + x2) / 2 + 1}; ${(y1 + y2) / 2})`,
          ],
          hint: "Har bir koordinataning o'rtasini oling.",
          steps: [
            `x = (${x1} + ${x2})/2 = ${(x1 + x2) / 2}`,
            `y = (${y1} + ${y2})/2 = ${(y1 + y2) / 2}`,
            `M(${(x1 + x2) / 2}; ${(y1 + y2) / 2})`,
          ],
        };
      },
    },
    {
      id: "geometry.parallelogram",
      title: "Parallelogramm yuzi",
      tagline: "S = a · h",
      theory: "Parallelogramm yuzi asos va balandlik ko'paytmasiga teng: S = a·h.",
      gen() {
        const a = ri(5, 18);
        const h = ri(3, 12);
        return {
          prompt: `Asosi <b>${a} sm</b>, balandligi <b>${h} sm</b> bo'lgan parallelogramm yuzini toping.`,
          answer: `${a * h} sm²`,
          distractors: [`${(a * h) / 2} sm²`, `${2 * (a + h)} sm²`, `${a + h} sm²`],
          hint: "S = a · h (yarmi emas — bu parallelogramm).",
          steps: [`S = ${a} · ${h}`, `S = ${a * h} sm²`],
        };
      },
    },
    {
      id: "geometry.trapezoid",
      title: "Trapetsiya yuzi",
      tagline: "S = (a + b)/2 · h",
      theory: "Trapetsiya yuzi: S = (a + b)/2 · h, bu yerda a va b — asoslar.",
      gen() {
        const a = ri(4, 12);
        const b = ri(13, 22);
        const h = ri(3, 10);
        const S = ((a + b) / 2) * h;
        return {
          prompt: `Asoslari <b>${a} sm</b> va <b>${b} sm</b>, balandligi <b>${h} sm</b> bo'lgan trapetsiya yuzini toping.`,
          answer: `${S} sm²`,
          distractors: [`${(a + b) * h} sm²`, `${S + h} sm²`, `${a * b} sm²`],
          hint: "S = (a + b)/2 · h.",
          steps: [
            `O'rta chiziq = (${a} + ${b})/2 = ${(a + b) / 2}`,
            `S = ${(a + b) / 2} · ${h} = ${S} sm²`,
          ],
        };
      },
    },
    {
      id: "geometry.prism",
      title: "To'g'ri prizma",
      tagline: "V = S_asos · h",
      theory: "Prizma hajmi asos yuzini balandlikka ko'paytirish bilan topiladi: V = S_asos·h.",
      gen() {
        const a = ri(3, 9);
        const b = ri(4, 12);
        const h = ri(3, 10);
        const V = a * b * h;
        return {
          prompt: `Asosi ${a} × ${b} to'g'ri to'rtburchak, balandligi <b>${h} sm</b> bo'lgan prizma hajmini toping.`,
          answer: `${V} sm³`,
          distractors: [`${a * b} sm³`, `${2 * (a + b) * h} sm³`, `${V + h} sm³`],
          hint: "Avval asos yuzini toping, keyin balandlikka ko'paytiring.",
          steps: [
            `S_asos = ${a} · ${b} = ${a * b}`,
            `V = ${a * b} · ${h} = ${V} sm³`,
          ],
        };
      },
    },
    {
      id: "geometry.sphere",
      title: "Shar",
      tagline: "V = 4/3 πr³",
      theory: "Shar hajmi V = 4/3·πr³, sirt yuzi S = 4πr².",
      gen() {
        const r = ri(2, 6);
        const V = Math.round((4 / 3) * 3.14 * r * r * r * 10) / 10;
        return {
          prompt: `Radiusi <b>${r} sm</b> bo'lgan shar hajmini toping. (π ≈ 3,14)`,
          answer: `${fmt(V)} sm³`,
          distractors: [
            `${fmt(Math.round(4 * 3.14 * r * r * 10) / 10)} sm³`,
            `${fmt(Math.round((4 / 3) * 3.14 * r * r * 10) / 10)} sm³`,
            `${fmt(Math.round(V * 3 * 10) / 10)} sm³`,
          ],
          hint: "V = 4/3·πr³.",
          steps: [
            `r³ = ${r * r * r}`,
            `V = 4/3 · 3,14 · ${r * r * r}`,
            `V = ${fmt(V)} sm³`,
          ],
        };
      },
    },
    {
      id: "geometry.sector",
      title: "Doira sektori",
      tagline: "S = πr²·α/360",
      theory: "α burchakli sektor yuzi: S = πr²·α/360.",
      gen() {
        const r = ri(4, 12);
        const alpha = pick([30, 45, 60, 90, 120, 180]);
        const S = Math.round(((3.14 * r * r * alpha) / 360) * 100) / 100;
        return {
          prompt: `Radiusi <b>${r} sm</b> bo'lgan doirada <b>${alpha}°</b> li sektor yuzini toping. (π ≈ 3,14)`,
          answer: `${fmt(S)} sm²`,
          distractors: [
            `${fmt(Math.round(((3.14 * r * r * alpha) / 180) * 100) / 100)} sm²`,
            `${fmt(Math.round(3.14 * r * r * 100) / 100)} sm²`,
            `${fmt(Math.round(((2 * 3.14 * r * alpha) / 360) * 100) / 100)} sm²`,
          ],
          hint: "S = πr² · α/360.",
          steps: [
            `To'liq doira yuzi: 3,14 · ${r * r} = ${fmt(Math.round(3.14 * r * r * 100) / 100)}`,
            `Ulush: ${alpha}/360`,
            `S = ${fmt(S)} sm²`,
          ],
        };
      },
    },
    {
      id: "geometry.similar",
      title: "O'xshash uchburchaklar",
      tagline: "Tomonlar nisbati",
      theory: "O'xshash uchburchaklarda mos tomonlar nisbati teng: a₁/a₂ = b₁/b₂.",
      gen() {
        const k = pick([2, 3, 4]);
        const a = ri(3, 9);
        const b = ri(4, 10);
        return {
          prompt: `Ikki uchburchak o'xshash. Birinchisining tomonlari ${a} va ${b}, ikkinchisining mos tomoni ${a * k}. Ikkinchi uchburchakning ikkinchi tomoni nechaga teng?`,
          answer: `${b * k}`,
          distractors: [`${b + k}`, `${a * k}`, `${b * k + 2}`],
          hint: "Nisbat k = yangi/eski. Har bir tomonga bir xil k qo'llanadi.",
          steps: [
            `k = ${a * k} / ${a} = ${k}`,
            `Ikkinchi tomon = ${b} · ${k} = ${b * k}`,
          ],
        };
      },
    },
    {
      id: "geometry.rhombus",
      title: "Romb yuzi",
      tagline: "S = d₁·d₂/2",
      theory: "Rombning yuzi diagonallari ko'paytmasining yarmiga teng: S = d₁·d₂/2.",
      gen() {
        const d1 = ri(3, 10) * 2;
        const d2 = ri(2, 8) * 2;
        const S = (d1 * d2) / 2;
        return {
          prompt: `Diagonallari <b>${d1} sm</b> va <b>${d2} sm</b> bo'lgan rombning yuzini toping.`,
          answer: `${S} sm²`,
          distractors: [`${d1 * d2} sm²`, `${(d1 + d2) / 2} sm²`, `${S + d1} sm²`],
          hint: "S = d₁·d₂ / 2.",
          steps: [`S = ${d1} · ${d2} / 2`, `S = ${d1 * d2} / 2 = ${S} sm²`],
        };
      },
    },
    {
      id: "geometry.regularPolygon",
      title: "Muntazam ko'pburchak",
      tagline: "Ichki burchagi",
      theory: "Muntazam n burchakli ko'pburchakning bitta ichki burchagi: (n − 2)·180°/n.",
      gen() {
        const n = pick([5, 6, 8, 9, 10, 12]);
        const angle = ((n - 2) * 180) / n;
        return {
          prompt: `Muntazam <b>${n}</b> burchakli ko'pburchakning bitta ichki burchagi necha gradus?`,
          answer: `${angle}°`,
          distractors: [`${180 - angle}°`, `${360 / n}°`, `${angle + 10}°`],
          hint: "(n − 2)·180°/n.",
          steps: [
            `Yig'indi = 180° · (${n} − 2) = ${180 * (n - 2)}°`,
            `Bitta burchak = ${180 * (n - 2)} / ${n}`,
            `= ${angle}°`,
          ],
        };
      },
    },
    {
      id: "geometry.inscribedAngle",
      title: "Ichki chizilgan burchak",
      tagline: "Yoyning yarmi",
      theory: "Aylanaga ichki chizilgan burchak o'zi tiralgan yoyning yarmiga teng.",
      gen() {
        const arc = ri(2, 17) * 20;
        const angle = arc / 2;
        return {
          prompt: `Aylanada ichki chizilgan burchak <b>${arc}°</b> li yoyga tiralgan. Burchak necha gradus?`,
          answer: `${angle}°`,
          distractors: [`${arc}°`, `${arc * 2}°`, `${angle / 2}°`],
          hint: "Burchak = yoy / 2.",
          steps: [`Burchak = ${arc}° / 2`, `= ${angle}°`],
        };
      },
    },
    {
      id: "geometry.circleTangent",
      title: "Urinma kesma",
      tagline: "Pifagor bilan",
      theory: "Urinma nuqtaga o'tkazilgan radiusga perpendikulyar. Shuning uchun OP² = r² + PT².",
      gen() {
        const [r, t, op] = pick([
          [3, 4, 5],
          [6, 8, 10],
          [5, 12, 13],
          [8, 15, 17],
        ]);
        return {
          prompt: `Aylana radiusi <b>${r} sm</b>. Tashqi nuqtadan urinmagacha masofa <b>${t} sm</b>. Shu nuqtadan aylana markazigacha masofa qancha?`,
          answer: `${op} sm`,
          distractors: [`${r + t} sm`, `${t} sm`, `${op + 1} sm`],
          hint: "OP² = r² + PT² (urinma radiusga perpendikulyar).",
          steps: [
            `OP² = ${r * r} + ${t * t} = ${r * r + t * t}`,
            `OP = √${r * r + t * t} = ${op} sm`,
          ],
        };
      },
    },
    {
      id: "geometry.coneSlant",
      title: "Konus yasovchisi",
      tagline: "l = √(r² + h²)",
      theory: "Konusning yasovchisi: l = √(r² + h²).",
      gen() {
        const [r, h, l] = pick([
          [3, 4, 5],
          [6, 8, 10],
          [5, 12, 13],
          [8, 15, 17],
        ]);
        return {
          prompt: `Konusning radiusi <b>${r} sm</b>, balandligi <b>${h} sm</b>. Yasovchisini toping.`,
          answer: `${l} sm`,
          distractors: [`${r + h} sm`, `${l + 1} sm`, `${r * h} sm`],
          hint: "l = √(r² + h²).",
          steps: [`l² = ${r * r} + ${h * h} = ${r * r + h * h}`, `l = ${l} sm`],
        };
      },
    },
    {
      id: "geometry.cylinderSurface",
      title: "Silindr yon sirti",
      tagline: "S = 2πrh",
      theory: "Silindrning yon sirti S = 2πrh, to'liq sirti S = 2πr(r + h).",
      gen() {
        const r = ri(2, 8);
        const h = ri(3, 12);
        const S = Math.round(2 * 3.14 * r * h * 10) / 10;
        return {
          prompt: `Radiusi <b>${r} sm</b>, balandligi <b>${h} sm</b> bo'lgan silindrning yon sirtini toping. (π ≈ 3,14)`,
          answer: `${fmt(S)} sm²`,
          distractors: [
            `${fmt(Math.round(3.14 * r * r * h * 10) / 10)} sm²`,
            `${fmt(Math.round(3.14 * r * h * 10) / 10)} sm²`,
            `${fmt(Math.round(S * 2 * 10) / 10)} sm²`,
          ],
          hint: "S = 2πrh.",
          steps: [
            `S = 2 · 3,14 · ${r} · ${h}`,
            `S = ${fmt(S)} sm²`,
          ],
        };
      },
    },
    {
      id: "geometry.rectDiagonal",
      title: "To'g'ri to'rtburchak diagonali",
      tagline: "d = √(a² + b²)",
      theory: "To'g'ri to'rtburchakning diagonali: d = √(a² + b²).",
      gen() {
        const [a, b, d] = pick([
          [3, 4, 5],
          [6, 8, 10],
          [5, 12, 13],
          [8, 15, 17],
          [9, 12, 15],
        ]);
        return {
          prompt: `Tomonlari <b>${a} sm</b> va <b>${b} sm</b> bo'lgan to'g'ri to'rtburchakning diagonalini toping.`,
          answer: `${d} sm`,
          distractors: [`${a + b} sm`, `${(a + b) / 2} sm`, `${d + 2} sm`],
          hint: "d = √(a² + b²).",
          steps: [`d² = ${a * a} + ${b * b} = ${a * a + b * b}`, `d = ${d} sm`],
        };
      },
    },
    {
      id: "geometry.cube",
      title: "Kub",
      tagline: "Hajm va sirt",
      theory: "Kub hajmi V = a³, to'liq sirti S = 6a².",
      gen() {
        const a = ri(2, 8);
        const mode = pick(["V", "S"]);
        const V = a * a * a;
        const S = 6 * a * a;
        return {
          prompt:
            mode === "V"
              ? `Qirrasi <b>${a} sm</b> bo'lgan kubning hajmini toping.`
              : `Qirrasi <b>${a} sm</b> bo'lgan kubning to'liq sirtini toping.`,
          answer: mode === "V" ? `${V} sm³` : `${S} sm²`,
          distractors:
            mode === "V"
              ? [`${S} sm³`, `${a * a} sm³`, `${V + a} sm³`]
              : [`${V} sm²`, `${a * a} sm²`, `${S + a} sm²`],
          hint: mode === "V" ? "V = a³." : "S = 6a².",
          steps:
            mode === "V"
              ? [`V = ${a}³`, `V = ${V} sm³`]
              : [`S = 6 · ${a}²`, `S = 6 · ${a * a} = ${S} sm²`],
        };
      },
    },
    {
      id: "geometry.equilateral",
      title: "Teng tomonli uchburchak",
      tagline: "S = a²√3/4",
      theory: "Teng tomonli uchburchak yuzi: S = a²√3/4, balandligi h = a√3/2.",
      gen() {
        const a = ri(2, 8) * 2;
        return {
          prompt: `Teng tomonli uchburchakning tomoni <b>${a} sm</b>. Yuzini toping.`,
          answer: `${(a * a) / 4}√3 sm²`,
          distractors: [`${(a * a) / 2}√3 sm²`, `${a * a}√3 sm²`, `${(a * a) / 4} sm²`],
          hint: "S = a²√3/4.",
          steps: [
            `a² = ${a * a}`,
            `S = ${a * a}·√3 / 4`,
            `S = ${(a * a) / 4}√3 sm²`,
          ],
        };
      },
    },
    {
      id: "geometry.arcLength",
      title: "Yoy uzunligi",
      tagline: "l = 2πr·α/360",
      theory: "α burchakli yoyning uzunligi: l = 2πr·α/360.",
      gen() {
        const r = ri(3, 12);
        const alpha = pick([30, 45, 60, 90, 120, 180]);
        const l = Math.round(((2 * 3.14 * r * alpha) / 360) * 100) / 100;
        return {
          prompt: `Radiusi <b>${r} sm</b> bo'lgan aylanada <b>${alpha}°</b> li yoy uzunligini toping. (π ≈ 3,14)`,
          answer: `${fmt(l)} sm`,
          distractors: [
            `${fmt(Math.round(((3.14 * r * r * alpha) / 360) * 100) / 100)} sm`,
            `${fmt(Math.round(2 * 3.14 * r * 100) / 100)} sm`,
            `${fmt(Math.round(l * 2 * 100) / 100)} sm`,
          ],
          hint: "l = 2πr·α/360.",
          steps: [
            `Aylana uzunligi = 2·3,14·${r} = ${fmt(Math.round(2 * 3.14 * r * 100) / 100)} sm`,
            `Ulush: ${alpha}/360`,
            `l = ${fmt(l)} sm`,
          ],
        };
      },
    },
    {
      id: "geometry.trapezoidMidline",
      title: "Trapetsiya o'rta chizig'i",
      tagline: "m = (a + b)/2",
      theory: "Trapetsiyaning o'rta chizig'i asoslar yig'indisining yarmiga teng: m = (a + b)/2.",
      gen() {
        const a = ri(4, 14);
        const b = ri(15, 26);
        const m = (a + b) / 2;
        return {
          prompt: `Asoslari <b>${a} sm</b> va <b>${b} sm</b> bo'lgan trapetsiyaning o'rta chizig'ini toping.`,
          answer: `${fmt(m)} sm`,
          distractors: [`${a + b} sm`, `${b - a} sm`, `${fmt(m + 2)} sm`],
          hint: "m = (a + b)/2.",
          steps: [`m = (${a} + ${b})/2`, `m = ${a + b}/2 = ${fmt(m)} sm`],
        };
      },
    },
    {
      id: "geometry.parallelogramAngle",
      title: "Parallelogramm burchagi",
      tagline: "Qo'shni burchaklar yig'indisi",
      theory: "Parallelogrammning qo'shni burchaklari yig'indisi 180°, qarama-qarshi burchaklari teng.",
      gen() {
        const a = ri(35, 80);
        return {
          prompt: `Parallelogrammning bitta burchagi <b>${a}°</b>. Unga qo'shni burchak necha gradus?`,
          answer: `${180 - a}°`,
          distractors: [`${a}°`, `${90 - a}°`, `${360 - a}°`],
          hint: "Qo'shni burchaklar yig'indisi 180°.",
          steps: [`α + β = 180°`, `β = 180° − ${a}° = ${180 - a}°`],
        };
      },
    },
    {
      id: "geometry.inscribedQuad",
      title: "Aylanaga ichki chizilgan to'rtburchak",
      tagline: "Qarama-qarshi burchaklar",
      theory: "Aylanaga ichki chizilgan to'rtburchakning qarama-qarshi burchaklari yig'indisi 180°.",
      gen() {
        const a = ri(55, 125);
        return {
          prompt: `Aylanaga ichki chizilgan to'rtburchakning bitta burchagi <b>${a}°</b>. Unga qarama-qarshi burchak necha gradus?`,
          answer: `${180 - a}°`,
          distractors: [`${a}°`, `${360 - a}°`, `${90 - (a - 90)}°`],
          hint: "Qarama-qarshi burchaklar yig'indisi 180°.",
          steps: [`α + γ = 180°`, `γ = 180° − ${a}° = ${180 - a}°`],
        };
      },
    },
    {
      id: "geometry.coneSurface",
      title: "Konus to'liq sirti",
      tagline: "S = πr(r + l)",
      theory: "Konusning to'liq sirti: S = πr(r + l), bu yerda l — yasovchi.",
      gen() {
        const r = ri(2, 7);
        let l = ri(4, 12);
        while (l <= r) l += 1;
        const S = Math.round(3.14 * r * (r + l) * 10) / 10;
        return {
          prompt: `Konusning radiusi <b>${r} sm</b>, yasovchisi <b>${l} sm</b>. To'liq sirtini toping. (π ≈ 3,14)`,
          answer: `${fmt(S)} sm²`,
          distractors: [
            `${fmt(Math.round(3.14 * r * l * 10) / 10)} sm²`,
            `${fmt(Math.round(3.14 * r * r * 10) / 10)} sm²`,
            `${fmt(Math.round(S * 2 * 10) / 10)} sm²`,
          ],
          hint: "S = πr(r + l).",
          steps: [
            `r + l = ${r + l}`,
            `S = 3,14 · ${r} · ${r + l}`,
            `S = ${fmt(S)} sm²`,
          ],
        };
      },
    },
    {
      id: "geometry.sphereSurface",
      title: "Shar sirti",
      tagline: "S = 4πr²",
      theory: "Shar sirtining yuzi: S = 4πr².",
      gen() {
        const r = ri(2, 8);
        const S = Math.round(4 * 3.14 * r * r * 10) / 10;
        return {
          prompt: `Radiusi <b>${r} sm</b> bo'lgan sharning sirtini toping. (π ≈ 3,14)`,
          answer: `${fmt(S)} sm²`,
          distractors: [
            `${fmt(Math.round(3.14 * r * r * 10) / 10)} sm²`,
            `${fmt(Math.round((4 / 3) * 3.14 * r * r * r * 10) / 10)} sm²`,
            `${fmt(Math.round(S * 2 * 10) / 10)} sm²`,
          ],
          hint: "S = 4πr².",
          steps: [`S = 4 · 3,14 · ${r * r}`, `S = ${fmt(S)} sm²`],
        };
      },
    },
    {
      id: "geometry.circumference",
      title: "Aylana uzunligi",
      tagline: "C = 2πr",
      theory: "Aylana uzunligi C = 2πr, diametr bo'yicha C = πd.",
      gen() {
        const r = ri(2, 12);
        const C = Math.round(2 * 3.14 * r * 100) / 100;
        return {
          prompt: `Radiusi <b>${r} sm</b> bo'lgan aylananing uzunligini toping. (π ≈ 3,14)`,
          answer: `${fmt(C)} sm`,
          distractors: [
            `${fmt(Math.round(3.14 * r * r * 100) / 100)} sm`,
            `${fmt(Math.round(3.14 * r * 100) / 100)} sm`,
            `${fmt(Math.round(C * 2 * 100) / 100)} sm`,
          ],
          hint: "C = 2πr.",
          steps: [`C = 2 · 3,14 · ${r}`, `C = ${fmt(C)} sm`],
        };
      },
    },
    {
      id: "geometry.similarArea",
      title: "O'xshash figuralar yuzi",
      tagline: "Yuzlar nisbati = k²",
      theory: "O'xshash figuralarda yuzlar nisbati o'xshashlik koeffitsiyentining kvadratiga teng.",
      gen() {
        const k = pick([2, 3, 4]);
        const S1 = ri(4, 20);
        const S2 = S1 * k * k;
        return {
          prompt: `Ikki figura o'xshash, o'xshashlik koeffitsiyenti k = ${k}. Kichigining yuzi ${S1} sm². Kattasining yuzi qancha?`,
          answer: `${S2} sm²`,
          distractors: [`${S1 * k} sm²`, `${S1 + k} sm²`, `${S2 * 2} sm²`],
          hint: "Yuzlar nisbati k² ga teng.",
          steps: [
            `k² = ${k * k}`,
            `S₂ = ${S1} · ${k * k}`,
            `S₂ = ${S2} sm²`,
          ],
        };
      },
    },
    {
      id: "geometry.coordsArea",
      title: "Koordinatalar bo'yicha yuza",
      tagline: "Uchburchak yuzi",
      theory: "Uchburchak yuzi: S = ½|x₁(y₂−y₃) + x₂(y₃−y₁) + x₃(y₁−y₂)|.",
      gen() {
        const x1 = 0;
        const y1 = 0;
        const x2 = ri(3, 9);
        const y2 = 0;
        const x3 = ri(1, 6);
        const y3 = ri(3, 9);
        const S = 0.5 * Math.abs(x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2));
        return {
          prompt: `A(0; 0), B(${x2}; 0), C(${x3}; ${y3}) nuqtalar berilgan. Uchburchak yuzini toping.`,
          answer: `${fmt(S)}`,
          distractors: [`${fmt(S * 2)}`, `${fmt(x2 * y3)}`, `${fmt(S + x2)}`],
          hint: "AB — asos, C dan tushirilgan balandlik y₃.",
          steps: [
            `Asos AB = ${x2}`,
            `Balandlik = ${y3}`,
            `S = ½ · ${x2} · ${y3} = ${fmt(S)}`,
          ],
        };
      },
    },
    {
      id: "geometry.cubeDiagonal",
      title: "Kub diagonali",
      tagline: "d = a√3",
      theory: "Qirrasi a bo'lgan kubning fazoviy diagonali d = a√3.",
      gen() {
        const a = ri(2, 9);
        return {
          prompt: `Qirrasi <b>${a} sm</b> bo'lgan kubning fazoviy diagonalini toping.`,
          answer: `${a}√3 sm`,
          distractors: [`${a}√2 sm`, `${a * 3} sm`, `${a}√3/2 sm`],
          hint: "d = a√3.",
          steps: [`d = ${a}·√3`, `d = ${a}√3 sm`],
        };
      },
    },
    {
      id: "geometry.rhombusSide",
      title: "Romb tomoni",
      tagline: "Diagonallardan",
      theory: "Romb diagonallari o'zaro perpendikulyar va kesishish nuqtasida teng ikkiga bo'linadi.",
      gen() {
        const triples = [
          [6, 8, 5],
          [10, 24, 13],
          [12, 16, 10],
          [16, 30, 17],
        ];
        const [d1, d2, a] = pick(triples);
        return {
          prompt: `Rombning diagonallari <b>${d1} sm</b> va <b>${d2} sm</b>. Tomonini toping.`,
          answer: `${a} sm`,
          distractors: [`${d1 + d2} sm`, `${a + 1} sm`, `${Math.round((d1 + d2) / 2)} sm`],
          hint: "a = √((d₁/2)² + (d₂/2)²).",
          steps: [
            `Yarim diagonallar: ${d1 / 2} va ${d2 / 2}`,
            `a² = ${(d1 / 2) ** 2} + ${(d2 / 2) ** 2} = ${a * a}`,
            `a = ${a} sm`,
          ],
        };
      },
    },
    {
      id: "geometry.exteriorAngle",
      title: "Tashqi burchak",
      tagline: "360°/n",
      theory: "Muntazam n burchakli ko'pburchakning bitta tashqi burchagi 360°/n ga teng.",
      gen() {
        const n = pick([5, 6, 8, 9, 10, 12]);
        const ext = 360 / n;
        return {
          prompt: `Muntazam <b>${n}</b> burchakli ko'pburchakning bitta tashqi burchagi necha gradus?`,
          answer: `${ext}°`,
          distractors: [`${180 - ext}°`, `${ext * 2}°`, `${n}°`],
          hint: "Tashqi burchaklar yig'indisi 360°.",
          steps: [`Tashqi burchak = 360°/${n}`, `= ${ext}°`],
        };
      },
    },
    {
      id: "geometry.rectanglePerimeter",
      title: "To'g'ri to'rtburchak perimetri",
      tagline: "P = 2(a + b)",
      theory: "To'g'ri to'rtburchak perimetri P = 2(a + b), yuzi S = a·b.",
      gen() {
        const a = ri(4, 15);
        const b = ri(4, 15);
        const P = 2 * (a + b);
        return {
          prompt: `Tomonlari <b>${a} sm</b> va <b>${b} sm</b> bo'lgan to'g'ri to'rtburchakning perimetrini toping.`,
          answer: `${P} sm`,
          distractors: [`${a + b} sm`, `${a * b} sm`, `${P + 2} sm`],
          hint: "P = 2(a + b).",
          steps: [`P = 2(${a} + ${b})`, `P = 2 · ${a + b} = ${P} sm`],
        };
      },
    },
    {
      id: "geometry.squareArea",
      title: "Kvadrat",
      tagline: "S = a², P = 4a",
      theory: "Kvadratning yuzi S = a², perimetri P = 4a, diagonali d = a√2.",
      gen() {
        const a = ri(3, 15);
        const mode = pick(["S", "P", "d"]);
        const ans = mode === "S" ? `${a * a} sm²` : mode === "P" ? `${4 * a} sm` : `${a}√2 sm`;
        const w =
          mode === "S"
            ? [`${4 * a} sm²`, `${a * 2} sm²`, `${a * a + a} sm²`]
            : mode === "P"
              ? [`${a * a} sm`, `${2 * a} sm`, `${4 * a + 4} sm`]
              : [`${a}√3 sm`, `${2 * a} sm`, `${a * a} sm`];
        return {
          prompt: `Kvadratning tomoni <b>${a} sm</b>. Uning ${mode === "S" ? "yuzini" : mode === "P" ? "perimetrini" : "diagonalini"} toping.`,
          answer: ans,
          distractors: w,
          hint: "S = a², P = 4a, d = a√2.",
          steps: [
            mode === "S" ? `S = ${a}² = ${a * a}` : mode === "P" ? `P = 4·${a} = ${4 * a}` : `d = ${a}√2`,
            `Javob: ${ans}`,
          ],
        };
      },
    },
    {
      id: "geometry.triangleHeight",
      title: "Uchburchak balandligi",
      tagline: "h = 2S/a",
      theory: "S = ½·a·h dan h = 2S/a kelib chiqadi.",
      gen() {
        const a = ri(4, 16);
        const h = ri(3, 12);
        const S = (a * h) / 2;
        return {
          prompt: `Uchburchak yuzi <b>${S} sm²</b>, asosi <b>${a} sm</b>. Shu asosga tushirilgan balandlikni toping.`,
          answer: `${h} sm`,
          distractors: [`${S / a} sm`, `${2 * a} sm`, `${h + 2} sm`],
          hint: "h = 2S/a.",
          steps: [`h = 2·${S} / ${a}`, `h = ${2 * S} / ${a} = ${h} sm`],
        };
      },
    },
    {
      id: "geometry.circleChord",
      title: "Vatar uzunligi",
      tagline: "Pifagor bilan",
      theory: "Markazdan vatargacha masofa d bo'lsa, vatar yarmi √(r² − d²), to'liq vatar 2√(r² − d²).",
      gen() {
        const triples = [
          [5, 3, 4],
          [13, 5, 12],
          [10, 6, 8],
          [17, 8, 15],
        ];
        const [r, d, half] = pick(triples);
        return {
          prompt: `Radiusi <b>${r} sm</b> bo'lgan aylanada markazdan vatargacha masofa <b>${d} sm</b>. Vatar uzunligini toping.`,
          answer: `${2 * half} sm`,
          distractors: [`${half} sm`, `${r + d} sm`, `${2 * half + 2} sm`],
          hint: "Yarim vatar = √(r² − d²).",
          steps: [
            `Yarim vatar² = ${r * r} − ${d * d} = ${r * r - d * d}`,
            `Yarim vatar = ${half}, to'liq vatar = ${2 * half} sm`,
          ],
        };
      },
    },
    {
      id: "geometry.triangleExterior",
      title: "Tashqi burchak",
      tagline: "Ikki ichki burchak yig'indisi",
      theory: "Uchburchakning tashqi burchagi unga qo'shni bo'lmagan ikki ichki burchak yig'indisiga teng.",
      gen() {
        const a = ri(30, 80);
        const b = ri(25, 70);
        return {
          prompt: `Uchburchakning ikki ichki burchagi <b>${a}°</b> va <b>${b}°</b>. Uchinchi uchdagi tashqi burchak necha gradus?`,
          answer: `${a + b}°`,
          distractors: [`${180 - a - b}°`, `${a}°`, `${180 - a}°`],
          hint: "Tashqi burchak = qo'shni bo'lmagan ikki ichki burchak yig'indisi.",
          steps: [
            `Uchinchi ichki burchak = 180° − ${a}° − ${b}° = ${180 - a - b}°`,
            `Tashqi burchak = 180° − ${180 - a - b}° = ${a + b}° yoki ${a}° + ${b}°`,
          ],
        };
      },
    },
    {
      id: "geometry.similarPerimeter",
      title: "O'xshashlik perimetri",
      tagline: "Perimetrlar nisbati k",
      theory: "O'xshash figuralarda perimetrlar nisbati k ga, yuzlar nisbati k² ga teng.",
      gen() {
        const k = pick([2, 3, 4]);
        const P1 = ri(8, 24);
        const P2 = P1 * k;
        return {
          prompt: `Ikki uchburchak o'xshash, kichigining perimetri ${P1} sm. O'xshashlik koeffitsiyenti k = ${k}. Kattasining perimetri qancha?`,
          answer: `${P2} sm`,
          distractors: [`${P1 * k * k} sm`, `${P1 + k} sm`, `${P2 + 4} sm`],
          hint: "Perimetrlar nisbati k ga teng (yuzlar k²).",
          steps: [`P₂ = ${P1} · ${k}`, `P₂ = ${P2} sm`],
        };
      },
    },
    {
      id: "geometry.prismSurface",
      title: "Prizma to'liq sirti",
      tagline: "S = 2S₀ + P·h",
      theory: "To'g'ri prizma to'liq sirti: S = 2·S_asos + P_asos·h.",
      gen() {
        const a = ri(3, 8);
        const b = ri(4, 9);
        const h = ri(3, 10);
        const Sb = a * b;
        const P = 2 * (a + b);
        const S = 2 * Sb + P * h;
        return {
          prompt: `To'g'ri to'rtburchakli prizma asosi ${a} × ${b}, balandligi ${h} sm. To'liq sirtini toping.`,
          answer: `${S} sm²`,
          distractors: [`${Sb * h} sm²`, `${P * h} sm²`, `${S + Sb} sm²`],
          hint: "S = 2·S_asos + P_asos·h.",
          steps: [
            `S_asos = ${a}·${b} = ${Sb}`,
            `P_asos = 2(${a}+${b}) = ${P}`,
            `S = 2·${Sb} + ${P}·${h} = ${S} sm²`,
          ],
        };
      },
    },
    {
      id: "geometry.cubeEdge",
      title: "Kubdan qirra",
      tagline: "a = ∛V",
      theory: "Kub hajmi V = a³, demak qirra a = ∛V.",
      gen() {
        const a = ri(2, 8);
        const V = a * a * a;
        return {
          prompt: `Kubning hajmi <b>${V} sm³</b>. Qirrasini toping.`,
          answer: `${a} sm`,
          distractors: [`${V / 3} sm`, `${a + 1} sm`, `${a * 3} sm`],
          hint: "a = ∛V.",
          steps: [`a³ = ${V}`, `a = ${a} sm`],
        };
      },
    },
    {
      id: "geometry.cylinderDiameter",
      title: "Silindr hajmi (diametr)",
      tagline: "r = d/2",
      theory: "Diametr berilgan bo'lsa avval radiusni toping: r = d/2, keyin V = πr²h.",
      gen() {
        const d = ri(2, 8) * 2;
        const h = ri(3, 10);
        const r = d / 2;
        const V = Math.round(3.14 * r * r * h * 10) / 10;
        return {
          prompt: `Silindr diametri <b>${d} sm</b>, balandligi <b>${h} sm</b>. Hajmini toping. (π ≈ 3,14)`,
          answer: `${fmt(V)} sm³`,
          distractors: [`${fmt(Math.round(3.14 * d * d * h * 10) / 10)} sm³`, `${fmt(Math.round(3.14 * r * h * 10) / 10)} sm³`, `${fmt(Math.round(V * 2 * 10) / 10)} sm³`],
          hint: "r = d/2, V = πr²h.",
          steps: [
            `r = ${d}/2 = ${r}`,
            `V = 3,14 · ${r * r} · ${h}`,
            `V = ${fmt(V)} sm³`,
          ],
        };
      },
    },
    {
      id: "geometry.angleSum",
      title: "Uchburchak burchaklari",
      tagline: "Yig'indi 180°",
      theory: "Uchburchak ichki burchaklari yig'indisi 180°.",
      gen() {
        const a = ri(25, 80);
        const b = ri(25, 80);
        const c = 180 - a - b;
        if (c <= 0) return { prompt: `Uchburchak burchaklari ${a}° va ${b}°. Uchinchisini toping.`, answer: `${Math.abs(c)}°`, distractors: [`${180 - a}°`, `${a + b}°`, `${90}°`], hint: "Yig'indi 180°.", steps: [`180° − ${a}° − ${b}° = ${Math.abs(c)}°`] };
        return {
          prompt: `Uchburchakning ikki burchagi <b>${a}°</b> va <b>${b}°</b>. Uchinchi burchak necha gradus?`,
          answer: `${c}°`,
          distractors: [`${a + b}°`, `${180 + a - b}°`, `${c + 10}°`],
          hint: "Ichki burchaklar yig'indisi 180°.",
          steps: [`c = 180° − ${a}° − ${b}°`, `c = ${c}°`],
        };
      },
    },
    {
      id: "geometry.isoscelesAngle",
      title: "Teng yonli uchburchak",
      tagline: "Asosdagi burchaklar",
      theory: "Teng yonli uchburchakda asosdagi burchaklar teng. Tepalik burchagi α bo'lsa, asosdagisi (180° − α)/2.",
      gen() {
        const apex = ri(20, 140);
        const base = (180 - apex) / 2;
        return {
          prompt: `Teng yonli uchburchakning tepalik burchagi <b>${apex}°</b>. Asosdagi burchak necha gradus?`,
          answer: `${fmt(base)}°`,
          distractors: [`${apex}°`, `${fmt(180 - apex)}°`, `${fmt(base + 10)}°`],
          hint: "(180° − α)/2.",
          steps: [
            `Asosdagi ikki burchak yig'indisi = 180° − ${apex}° = ${180 - apex}°`,
            `Har biri = ${180 - apex}/2 = ${fmt(base)}°`,
          ],
        };
      },
    },
    {
      id: "geometry.trapezoidHeight",
      title: "Trapetsiya balandligi",
      tagline: "h = 2S/(a+b)",
      theory: "S = (a + b)/2 · h dan h = 2S/(a + b).",
      gen() {
        const a = ri(4, 10);
        const b = ri(12, 20);
        const h = ri(3, 9);
        const S = ((a + b) / 2) * h;
        return {
          prompt: `Trapetsiya yuzi <b>${S} sm²</b>, asoslari <b>${a} sm</b> va <b>${b} sm</b>. Balandligini toping.`,
          answer: `${h} sm`,
          distractors: [`${S / (a + b)} sm`, `${a + b} sm`, `${h + 2} sm`],
          hint: "h = 2S/(a + b).",
          steps: [
            `a + b = ${a + b}`,
            `h = 2·${S}/${a + b} = ${h} sm`,
          ],
        };
      },
    },
    {
      id: "geometry.equilateralHeight",
      title: "Teng tomonli balandlik",
      tagline: "h = a√3/2",
      theory: "Teng tomonli uchburchakning balandligi h = a√3/2.",
      gen() {
        const a = ri(2, 10) * 2;
        return {
          prompt: `Teng tomonli uchburchakning tomoni <b>${a} sm</b>. Balandligini toping.`,
          answer: `${a / 2}√3 sm`,
          distractors: [`${a}√3 sm`, `${a / 2}√2 sm`, `${a} sm`],
          hint: "h = a√3/2.",
          steps: [`h = ${a}·√3/2`, `h = ${a / 2}√3 sm`],
        };
      },
    },
    {
      id: "geometry.sectorFromArc",
      title: "Sektor yuzi (yoy orqali)",
      tagline: "S = ½ · l · r",
      theory: "Sektor yuzi yoy uzunligi va radius orqali: S = ½·l·r.",
      gen() {
        const r = ri(4, 12);
        const l = ri(4, 20);
        const S = 0.5 * l * r;
        return {
          prompt: `Radiusi <b>${r} sm</b>, yoy uzunligi <b>${l} sm</b> bo'lgan sektorning yuzini toping.`,
          answer: `${fmt(S)} sm²`,
          distractors: [`${l * r} sm²`, `${fmt(l + r)} sm²`, `${fmt(S * 2)} sm²`],
          hint: "S = ½·l·r.",
          steps: [`S = ½ · ${l} · ${r}`, `S = ${fmt(S)} sm²`],
        };
      },
    },
    {
      id: "geometry.squarePerimeter",
      title: "Kvadrat perimetridan tomon",
      tagline: "a = P/4",
      theory: "Kvadrat perimetri P = 4a, demak a = P/4, yuzi S = (P/4)².",
      gen() {
        const a = ri(3, 15);
        const P = 4 * a;
        return {
          prompt: `Kvadratning perimetri <b>${P} sm</b>. Yuzini toping.`,
          answer: `${a * a} sm²`,
          distractors: [`${P} sm²`, `${a * 2} sm²`, `${a * a + a} sm²`],
          hint: "a = P/4, keyin S = a².",
          steps: [`a = ${P}/4 = ${a} sm`, `S = ${a}² = ${a * a} sm²`],
        };
      },
    },
    {
      id: "geometry.heron",
      title: "Geron formulasi",
      tagline: "Uch tomon bo'yicha yuza",
      theory: "S = √(p(p−a)(p−b)(p−c)), bu yerda p = (a+b+c)/2.",
      gen() {
        const triples = [
          [3, 4, 5],
          [6, 8, 10],
          [5, 12, 13],
          [8, 15, 17],
        ];
        const [a, b, c] = pick(triples);
        const p = (a + b + c) / 2;
        const S = Math.round(Math.sqrt(p * (p - a) * (p - b) * (p - c)) * 10) / 10;
        return {
          prompt: `Tomonlari ${a}, ${b} va ${c} sm bo'lgan uchburchak yuzini toping.`,
          answer: `${fmt(S)} sm²`,
          distractors: [`${fmt(S * 2)} sm²`, `${a + b + c} sm²`, `${fmt(p)} sm²`],
          hint: "Geron: p = yarim perimetr.",
          steps: [
            `p = (${a} + ${b} + ${c})/2 = ${p}`,
            `S = √(${p}·${p - a}·${p - b}·${p - c})`,
            `S = ${fmt(S)} sm²`,
          ],
        };
      },
    },
    {
      id: "geometry.rightTriangleAngle",
      title: "Burchakni topish",
      tagline: "To'g'ri burchakli uchburchak",
      theory: "sin α = qarshi/gipotenuza, cos α = yondosh/gipotenuza.",
      gen() {
        const cases = [
          { s: 1, h: 2, a: "30°" },
          { s: 8, h: 16, a: "30°" },
          { s: 8, h: 8, a: "90°" },
        ];
        const c = pick(cases);
        return {
          prompt: `To'g'ri burchakli uchburchakda qarshi katet ${c.s}, gipotenuza ${c.h}. α burchakni toping.`,
          answer: c.a,
          distractors: ["45°", "60°", "90°"].filter((x) => x !== c.a),
          hint: `sin α = ${c.s}/${c.h}.`,
          steps: [`sin α = ${c.s}/${c.h}`, `α = ${c.a}`],
        };
      },
    },
    {
      id: "geometry.polygonDiagonals",
      title: "Diagonallar soni",
      tagline: "n(n − 3)/2",
      theory: "n burchakli ko'pburchakda diagonallar soni n(n − 3)/2.",
      gen() {
        const n = ri(5, 12);
        const d = (n * (n - 3)) / 2;
        return {
          prompt: `<b>${n}</b> burchakli ko'pburchakda nechta diagonal bor?`,
          answer: `${d}`,
          distractors: [`${n * (n - 1)}`, `${n}`, `${d + n}`],
          hint: "n(n − 3)/2.",
          steps: [`${n}·(${n} − 3)/2`, `= ${n * (n - 3)}/2 = ${d}`],
        };
      },
    },
    {
      id: "geometry.sectorPerimeter",
      title: "Sektor perimetri",
      tagline: "2r + l",
      theory: "Sektor perimetri ikki radius va yoy uzunligidan iborat: P = 2r + l.",
      gen() {
        const r = ri(3, 10);
        const alpha = pick([60, 90, 120]);
        const l = Math.round(((2 * 3.14 * r * alpha) / 360) * 10) / 10;
        const P = Math.round((2 * r + l) * 10) / 10;
        return {
          prompt: `Radiusi ${r} sm, burchagi ${alpha}° bo'lgan sektorning perimetrini toping. (π ≈ 3,14)`,
          answer: `${fmt(P)} sm`,
          distractors: [`${fmt(l)} sm`, `${2 * r} sm`, `${fmt(P + 2)} sm`],
          hint: "P = 2r + yoy.",
          steps: [
            `Yoy = 2·3,14·${r}·${alpha}/360 = ${fmt(l)}`,
            `P = ${2 * r} + ${fmt(l)} = ${fmt(P)} sm`,
          ],
        };
      },
    },
    {
      id: "geometry.cubeSurface",
      title: "Kub sirti",
      tagline: "S = 6a²",
      theory: "Kubning to'liq sirti S = 6a².",
      gen() {
        const a = ri(2, 9);
        return {
          prompt: `Qirrasi ${a} sm bo'lgan kubning to'liq sirtini toping.`,
          answer: `${6 * a * a} sm²`,
          distractors: [`${a * a} sm²`, `${a * a * a} sm²`, `${4 * a * a} sm²`],
          hint: "6 ta yoq, har biri a².",
          steps: [`Bir yoq = ${a * a}`, `S = 6·${a * a} = ${6 * a * a} sm²`],
        };
      },
    },
    {
      id: "geometry.pyramidVolume",
      title: "Piramida hajmi",
      tagline: "V = ⅓·S·h",
      theory: "Piramida hajmi asos yuzining uchdan bir qismi balandlikka ko'paytiriladi.",
      gen() {
        const a = ri(3, 8);
        const b = ri(3, 8);
        const h = ri(3, 9);
        const V = (a * b * h) / 3;
        return {
          prompt: `Asosi ${a} × ${b} to'g'ri to'rtburchak, balandligi ${h} sm bo'lgan piramida hajmini toping.`,
          answer: `${fmt(V)} sm³`,
          distractors: [`${a * b * h} sm³`, `${fmt(V * 3)} sm³`, `${fmt(V + 1)} sm³`],
          hint: "V = ⅓·S_asos·h.",
          steps: [
            `S_asos = ${a * b}`,
            `V = ${a * b}·${h}/3 = ${fmt(V)} sm³`,
          ],
        };
      },
    },
    {
      id: "geometry.cylinderFullSurface",
      title: "Silindr to'liq sirti",
      tagline: "S = 2πr(r + h)",
      theory: "Silindrning to'liq sirti S = 2πr² + 2πrh = 2πr(r + h).",
      gen() {
        const r = ri(2, 7);
        const h = ri(3, 10);
        const S = Math.round(2 * 3.14 * r * (r + h) * 10) / 10;
        return {
          prompt: `Radiusi ${r} sm, balandligi ${h} sm bo'lgan silindrning to'liq sirtini toping. (π ≈ 3,14)`,
          answer: `${fmt(S)} sm²`,
          distractors: [
            `${fmt(Math.round(2 * 3.14 * r * h * 10) / 10)} sm²`,
            `${fmt(Math.round(3.14 * r * r * 10) / 10)} sm²`,
            `${fmt(Math.round(S * 2 * 10) / 10)} sm²`,
          ],
          hint: "S = 2πr(r + h).",
          steps: [`r + h = ${r + h}`, `S = 2·3,14·${r}·${r + h} = ${fmt(S)} sm²`],
        };
      },
    },
    {
      id: "geometry.circleRing",
      title: "Halqa yuzi",
      tagline: "π(R² − r²)",
      theory: "Ikki konsentrik aylana orasidagi halqa yuzi S = π(R² − r²).",
      gen() {
        const r = ri(2, 6);
        const R = r + ri(2, 6);
        const S = Math.round(3.14 * (R * R - r * r) * 10) / 10;
        return {
          prompt: `Tashqi radiusi ${R} sm, ichki radiusi ${r} sm bo'lgan halqaning yuzini toping. (π ≈ 3,14)`,
          answer: `${fmt(S)} sm²`,
          distractors: [
            `${fmt(Math.round(3.14 * R * R * 10) / 10)} sm²`,
            `${fmt(Math.round(3.14 * (R - r) * (R - r) * 10) / 10)} sm²`,
            `${fmt(Math.round(S * 2 * 10) / 10)} sm²`,
          ],
          hint: "S = π(R² − r²).",
          steps: [
            `R² = ${R * R}, r² = ${r * r}`,
            `S = 3,14·${R * R - r * r} = ${fmt(S)} sm²`,
          ],
        };
      },
    },
    {
      id: "geometry.trapezoidPerimeter",
      title: "Trapetsiya perimetri",
      tagline: "Tomonlar yig'indisi",
      theory: "Perimetr — barcha tomonlar uzunliklari yig'indisi.",
      gen() {
        const a = ri(4, 10);
        const b = ri(12, 20);
        const c = ri(4, 9);
        const d = ri(4, 9);
        return {
          prompt: `Trapetsiyaning asoslari ${a} va ${b}, yon tomonlari ${c} va ${d} sm. Perimetrini toping.`,
          answer: `${a + b + c + d} sm`,
          distractors: [`${a + b} sm`, `${(a + b) * 2} sm`, `${a + b + c + d + 2} sm`],
          hint: "Barcha tomonlarni qo'shing.",
          steps: [`P = ${a} + ${b} + ${c} + ${d}`, `P = ${a + b + c + d} sm`],
        };
      },
    },
    {
      id: "geometry.parallelogramPerimeter",
      title: "Parallelogramm perimetri",
      tagline: "P = 2(a + b)",
      theory: "Parallelogramm qarama-qarshi tomonlari teng: P = 2(a + b).",
      gen() {
        const a = ri(4, 14);
        const b = ri(3, 12);
        return {
          prompt: `Parallelogrammning tomonlari ${a} va ${b} sm. Perimetrini toping.`,
          answer: `${2 * (a + b)} sm`,
          distractors: [`${a + b} sm`, `${a * b} sm`, `${2 * a + b} sm`],
          hint: "P = 2(a + b).",
          steps: [`P = 2(${a} + ${b})`, `P = ${2 * (a + b)} sm`],
        };
      },
    },
    {
      id: "geometry.rhombusPerimeter",
      title: "Romb perimetri",
      tagline: "P = 4a",
      theory: "Rombning barcha tomonlari teng: P = 4a.",
      gen() {
        const a = ri(3, 15);
        return {
          prompt: `Rombning tomoni ${a} sm. Perimetrini toping.`,
          answer: `${4 * a} sm`,
          distractors: [`${a * a} sm`, `${2 * a} sm`, `${4 * a + 4} sm`],
          hint: "P = 4a.",
          steps: [`P = 4·${a} = ${4 * a} sm`],
        };
      },
    },
    {
      id: "geometry.similarSides",
      title: "O'xshashlik tomonlari",
      tagline: "Mos tomonlar nisbati",
      theory: "O'xshash uchburchaklarda mos tomonlar nisbati bir xil.",
      gen() {
        const k = pick([2, 3]);
        const a = ri(3, 9);
        const c = ri(4, 10);
        return {
          prompt: `Ikki uchburchak o'xshash, k = ${k}. Kichigining tomonlari ${a} va ${c}. Kattasining mos tomonlari yig'indisi qancha?`,
          answer: `${(a + c) * k}`,
          distractors: [`${a + c}`, `${(a + c) * k * k}`, `${a * k + c}`],
          hint: "Har bir tomon k ga ko'payadi.",
          steps: [`${a}·${k} = ${a * k}, ${c}·${k} = ${c * k}`, `Yig'indi = ${(a + c) * k}`],
        };
      },
    },
    {
      id: "geometry.regularHexagon",
      title: "Muntazam oltiburchak",
      tagline: "S = 3√3/2 · a²",
      theory: "Muntazam oltiburchak yuzi S = (3√3/2)a².",
      gen() {
        const a = ri(2, 8) * 2;
        const coef = (3 * a * a) / 2;
        return {
          prompt: `Muntazam oltiburchakning tomoni ${a} sm. Yuzini toping.`,
          answer: `${coef}√3 sm²`,
          distractors: [`${a * a}√3 sm²`, `${coef} sm²`, `${coef * 2}√3 sm²`],
          hint: "S = (3√3/2)a².",
          steps: [`a² = ${a * a}`, `S = 3√3/2 · ${a * a} = ${coef}√3 sm²`],
        };
      },
    },
    {
      id: "geometry.prismDiagonal",
      title: "Prizma diagonali",
      tagline: "√(a² + b² + h²)",
      theory: "To'g'ri to'rtburchakli prizmaning fazoviy diagonali d = √(a² + b² + h²).",
      gen() {
        const a = ri(2, 5);
        const b = ri(2, 5);
        const h = ri(2, 5);
        const d2 = a * a + b * b + h * h;
        return {
          prompt: `Prizma o'lchamlari ${a}, ${b} va ${h} sm. Fazoviy diagonalini toping.`,
          answer: `√${d2} sm`,
          distractors: [`${a + b + h} sm`, `√${a * a + b * b} sm`, `${d2} sm`],
          hint: "d² = a² + b² + h².",
          steps: [`d² = ${a * a} + ${b * b} + ${h * h} = ${d2}`, `d = √${d2} sm`],
        };
      },
    },
    {
      id: "geometry.centralAngle",
      title: "Markaziy burchak",
      tagline: "Yoy bilan teng",
      theory: "Markaziy burchak o'zi tiralgan yoyga teng.",
      gen() {
        const arc = ri(3, 35) * 10;
        return {
          prompt: `${arc}° li yoyga tiralgan markaziy burchak necha gradus?`,
          answer: `${arc}°`,
          distractors: [`${arc / 2}°`, `${arc * 2}°`, `${180 - arc}°`],
          hint: "Markaziy burchak = yoy.",
          steps: [`Markaziy burchak = ${arc}°`],
        };
      },
    },
    {
      id: "geometry.chordDistance",
      title: "Vatargacha masofa",
      tagline: "√(r² − (l/2)²)",
      theory: "Markazdan vatargacha masofa d = √(r² − (l/2)²).",
      gen() {
        const triples = [
          [5, 6, 4],
          [13, 10, 12],
          [10, 12, 8],
        ];
        const [r, l, d] = pick(triples);
        return {
          prompt: `Radiusi ${r} sm bo'lgan aylanada vatar uzunligi ${l} sm. Markazdan vatargacha masofani toping.`,
          answer: `${d} sm`,
          distractors: [`${r - l / 2} sm`, `${r} sm`, `${d + 1} sm`],
          hint: "d = √(r² − (l/2)²).",
          steps: [
            `l/2 = ${l / 2}`,
            `d = √(${r * r} − ${(l / 2) ** 2}) = ${d} sm`,
          ],
        };
      },
    },
    {
      id: "geometry.tangentLength",
      title: "Urinma uzunligi",
      tagline: "√(OP² − r²)",
      theory: "Tashqi nuqtadan urinmagacha masofa: √(OP² − r²).",
      gen() {
        const triples = [
          [3, 4, 5],
          [6, 8, 10],
          [5, 12, 13],
        ];
        const [r, t, op] = pick(triples);
        return {
          prompt: `Aylana radiusi ${r} sm, markazdan tashqi nuqtagacha masofa ${op} sm. Urinma uzunligini toping.`,
          answer: `${t} sm`,
          distractors: [`${op} sm`, `${r} sm`, `${t + 2} sm`],
          hint: "t = √(OP² − r²).",
          steps: [`t² = ${op * op} − ${r * r} = ${op * op - r * r}`, `t = ${t} sm`],
        };
      },
    },
    {
      id: "geometry.scaleMap",
      title: "Masshtab",
      tagline: "1 : n",
      theory: "Masshtab xaritadagi uzunlikning haqiqiy uzunlikka nisbati.",
      gen() {
        const k = pick([1000, 5000, 10000]);
        const cm = ri(2, 15);
        return {
          prompt: `Xarita masshtabi 1:${k}. Xaritada ${cm} sm — haqiqatda necha metr?`,
          answer: `${(cm * k) / 100} m`,
          distractors: [`${cm * k} m`, `${(cm * k) / 10} m`, `${cm * 10} m`],
          hint: "Haqiqiy uzunlik = cm · k, keyin metrga o'giring.",
          steps: [
            `Haqiqiy = ${cm} · ${k} = ${cm * k} sm`,
            `= ${(cm * k) / 100} m`,
          ],
        };
      },
    },
    {
      id: "geometry.areaUnits",
      title: "Yuza birliklari",
      tagline: "m² → sm²",
      theory: "1 m = 100 sm, demak 1 m² = 10 000 sm².",
      gen() {
        const m = ri(2, 9);
        return {
          prompt: `${m} m² necha sm² ga teng?`,
          answer: `${m * 10000} sm²`,
          distractors: [`${m * 100} sm²`, `${m * 1000} sm²`, `${m * 10} sm²`],
          hint: "1 m² = 10 000 sm².",
          steps: [`${m} · 10 000 = ${m * 10000} sm²`],
        };
      },
    },
    {
      id: "geometry.triangleInequality",
      title: "Uchburchak tengsizligi",
      tagline: "a + b > c",
      theory: "Uchburchak mavjud bo'lishi uchun har bir tomon qolgan ikkisining yig'indisidan kichik bo'lishi kerak.",
      gen() {
        const a = ri(3, 9);
        const b = ri(3, 9);
        const ok = pick([true, false]);
        const c = ok ? Math.abs(a - b) + ri(1, Math.min(a, b) - 1) : a + b + ri(1, 5);
        return {
          prompt: `Tomonlari ${a}, ${b} va ${c} bo'lgan uchburchak mavjudmi?`,
          answer: ok ? "ha" : "yo'q",
          distractors: [ok ? "yo'q" : "ha", "faqat to'g'ri burchakli", "aniqlab bo'lmaydi"],
          hint: "Eng katta tomon qolgan ikkisining yig'indisidan kichik bo'lsin.",
          steps: [
            `a + b = ${a + b}, c = ${c}`,
            `${a + b} ${ok ? ">" : "≤"} ${c}`,
            `Javob: ${ok ? "mavjud" : "mavjud emas"}`,
          ],
        };
      },
    },
    {
      id: "geometry.rectScale",
      title: "O'lchamlar k marta oshsa",
      tagline: "Yuza k² marta",
      theory: "To'g'ri to'rtburchakning har bir tomoni k marta oshsa, yuzi k² marta oshadi.",
      gen() {
        const k = pick([2, 3, 4]);
        const S = ri(5, 20);
        return {
          prompt: `To'g'ri to'rtburchakning tomonlari ${k} marta oshirildi. Yuzi necha marta oshadi?`,
          answer: `${k * k}`,
          distractors: [`${k}`, `${k * 2}`, `${k * k * 2}`],
          hint: "Yuza ikki o'lchamga bog'liq.",
          steps: [`Yangi yuza = k² · eski yuza`, `k² = ${k * k}`],
        };
      },
    },
    {
      id: "geometry.cubeEdgeFromSurface",
      title: "Sirtdan qirra",
      tagline: "a = √(S/6)",
      theory: "Kub sirti S = 6a², demak a = √(S/6).",
      gen() {
        const a = ri(2, 9);
        const S = 6 * a * a;
        return {
          prompt: `Kubning to'liq sirti ${S} sm². Qirrasini toping.`,
          answer: `${a} sm`,
          distractors: [`${a * 6} sm`, `${a + 1} sm`, `${S / 6} sm`],
          hint: "a = √(S/6).",
          steps: [`a² = ${S}/6 = ${a * a}`, `a = ${a} sm`],
        };
      },
    },
    {
      id: "geometry.parallelogramHeight",
      title: "Parallelogramm balandligi",
      tagline: "h = S/a",
      theory: "S = a·h ⟹ h = S/a.",
      gen() {
        const a = ri(4, 12);
        const h = ri(3, 9);
        const S = a * h;
        return {
          prompt: `Parallelogramm yuzi ${S} sm², asosi ${a} sm. Balandligini toping.`,
          answer: `${h} sm`,
          distractors: [`${S - a} sm`, `${S} sm`, `${h + 2} sm`],
          hint: "h = S/a.",
          steps: [`h = ${S}/${a} = ${h} sm`],
        };
      },
    },
  ],
};
