// AnormalMath — Ehtimollik bo'limi
import { ri, pick, fmt } from "../engine.js";

const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const frac = (a, b) => {
  const g = gcd(a, b) || 1;
  const num = a / g;
  const den = b / g;
  return den === 1 ? `${num}` : `${num}/${den}`;
};
const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
const comb = (n, k) => fact(n) / (fact(k) * fact(n - k));

export const probability = {
  id: "probability",
  title: "Ehtimollik",
  glyph: "P",
  accent: "#ec4899",
  blurb: "Klassik ehtimollik, qo'shish, ko'paytirish, Bayes, kombinatsiya.",
  topics: [
    {
      id: "probability.classic",
      title: "Klassik ehtimollik",
      tagline: "Qulay holat / barcha holat",
      theory: "P(A) = qulay holatlar soni / barcha teng imkoniyatli holatlar soni.",
      gen() {
        const mode = pick(["even", "odd", "gt4", "prime"]);
        const sets = {
          even: { label: "juft son", ok: 3 },
          odd: { label: "toq son", ok: 3 },
          gt4: { label: "4 dan katta son", ok: 2 },
          prime: { label: "tub son (2, 3, 5)", ok: 3 },
        };
        const s = sets[mode];
        return {
          prompt: `Kubik bir marta tashlandi. <b>${s.label}</b> tushish ehtimoli qanday?`,
          answer: frac(s.ok, 6),
          distractors: [frac(6 - s.ok, 6), frac(1, 6), frac(s.ok + 1, 6)],
          hint: "Kubikda 6 ta teng imkoniyatli natija bor.",
          steps: [
            `Barcha holatlar: 6`,
            `Qulay holatlar: ${s.ok}`,
            `P = ${s.ok}/6 = ${frac(s.ok, 6)}`,
          ],
        };
      },
    },
    {
      id: "probability.addition",
      title: "Qo'shish qoidasi",
      tagline: "P(A ∪ B)",
      theory:
        "Birgalikda bo'lmaydigan hodisalar uchun P(A ∪ B) = P(A) + P(B). Umumiy holatda P(A∪B) = P(A) + P(B) − P(A∩B).",
      gen() {
        const a = ri(1, 3);
        const b = ri(1, 3);
        const total = 10;
        const pA = a / total;
        const pB = b / total;
        const s = a + b;
        return {
          prompt: `Qutida 10 shar bor: ${a} qizil, ${b} ko'k, qolgani oq. Tasodifan <b>qizil yoki ko'k</b> shar olinishi ehtimoli qanday?`,
          answer: frac(s, total),
          distractors: [frac(a, total), frac(b, total), frac(s + 1, total)],
          hint: "Bu hodisalar birgalikda bo'lmaydi — ehtimollarni qo'shing.",
          steps: [
            `P(qizil) = ${a}/10, P(ko'k) = ${b}/10`,
            `P(qizil ∪ ko'k) = ${a}/10 + ${b}/10 = ${s}/10`,
            `Soddalashtirilgan: ${frac(s, total)}`,
          ],
        };
      },
    },
    {
      id: "probability.multiplication",
      title: "Ko'paytirish qoidasi",
      tagline: "Mustaqil hodisalar",
      theory: "Mustaqil hodisalar uchun P(A ∩ B) = P(A) · P(B).",
      gen() {
        const a = ri(1, 3);
        const b = ri(1, 3);
        return {
          prompt: `Birinchi kubikda ${a} tushish ehtimoli P₁ = ${a}/6. Ikkinchisida ${b} tushishi kerak. Ikkovi ham bir vaqtda bajarilishi ehtimoli qanday?`,
          answer: frac(a * b, 36),
          distractors: [frac(a, 6), frac(a + b, 6), frac(a * b, 12)],
          hint: "P = P₁ · P₂.",
          steps: [
            `P₁ = ${a}/6, P₂ = ${b}/6`,
            `P = ${a}/6 · ${b}/6 = ${a * b}/36`,
            `Soddalashtirilgan: ${frac(a * b, 36)}`,
          ],
        };
      },
    },
    {
      id: "probability.bayes",
      title: "Bayes",
      tagline: "Shartli ehtimollik",
      theory:
        "P(A|B) = P(A)·P(B|A) / P(B). Test aniqligi masalalarida P(B) to'la ehtimollik bilan topiladi.",
      gen() {
        const p = pick([1, 2, 3]); // 10% sick rate
        const sick = p;
        const sens = 90;
        const spec = 90;
        const totalPos = (sick * sens + (100 - sick) * (100 - spec)) / 10000;
        const bayes = ((sick / 100) * (sens / 100)) / totalPos;
        const pct = Math.round(bayes * 1000) / 10;
        return {
          prompt: `Kasallik tarqalishi ${sick}%. Test kasallarni ${sens}% aniqlaydi, sog'lomlarni ${spec}% to'g'ri rad etadi. Test musbat chiqdi — <b>haqiqatan kasal bo'lish ehtimoli</b> necha foiz?`,
          answer: `${pct}%`,
          distractors: [`${sens}%`, `${fmtSafe(sick)}%`, `${Math.round(pct / 2)}%`],
          hint: "Bayes: P(kasal|musbat) = haqiqiy kasallar orasidagi musbatlar / barcha musbat natijalar.",
          steps: [
            `Kasallarning musbat testi: ${sick}% · ${sens}% = ${Math.round(sick * sens) / 100}%`,
            `Sog'lomlarning yolg'on musbati: ${100 - sick}% · ${100 - spec}% = ${Math.round((100 - sick) * (100 - spec)) / 100}%`,
            `Barcha musbatlar: ${Math.round((sick * sens + (100 - sick) * (100 - spec))) / 100}%`,
            `P(kasal|musbat) = ${pct}%`,
          ],
        };
      },
    },
    {
      id: "probability.combination",
      title: "Kombinatorika",
      tagline: "C(n, k)",
      theory: "C(n, k) = n! / (k!·(n − k)!) — tartib muhim emas.",
      gen() {
        const n = ri(5, 9);
        const k = ri(2, 3);
        const c = comb(n, k);
        return {
          prompt: `<b>${n}</b> ta o'quvchidan <b>${k}</b> kishilik jamoani necha xil usulda tanlash mumkin?`,
          answer: `${c}`,
          distractors: [`${n * k}`, `${c + n}`, `${fact(n) / fact(k)}`],
          hint: "C(n,k) = n!/(k!(n−k)!).",
          steps: [
            `C(${n}, ${k}) = ${n}! / (${k}!·${n - k}!)`,
            `= ${c}`,
          ],
        };
      },
    },
    {
      id: "probability.complement",
      title: "Qarama-qarshi hodisa",
      tagline: "P(A̅) = 1 − P(A)",
      theory: "Qarama-qarshi hodisa ehtimoli: P(A̅) = 1 − P(A).",
      gen() {
        const ok = ri(2, 8);
        const total = 10;
        return {
          prompt: `Qutida 10 shar bor, ulardan ${ok} tasi qizil. <b>Qizil bo'lmagan</b> shar olinishi ehtimoli qanday?`,
          answer: frac(total - ok, total),
          distractors: [frac(ok, total), frac(total - ok, total + 1), frac(ok, total + 1)],
          hint: "1 − P(qizil).",
          steps: [
            `P(qizil) = ${ok}/10`,
            `P(qizil emas) = 1 − ${ok}/10 = ${total - ok}/10`,
            `Soddalashtirilgan: ${frac(total - ok, total)}`,
          ],
        };
      },
    },
    {
      id: "probability.diceSum",
      title: "Ikki kubik yig'indisi",
      tagline: "36 ta natija",
      theory: "Ikki kubik tashlanganda 36 ta teng imkoniyatli natija bor. Yig'indi jadvali yordam beradi.",
      gen() {
        const cases = [
          { s: 7, ok: 6 },
          { s: 5, ok: 4 },
          { s: 6, ok: 5 },
          { s: 8, ok: 5 },
          { s: 9, ok: 4 },
          { s: 10, ok: 3 },
        ];
        const c = pick(cases);
        return {
          prompt: `Ikki kubik tashlandi. Yig'indi <b>${c.s}</b> bo'lish ehtimoli qanday?`,
          answer: frac(c.ok, 36),
          distractors: [frac(c.ok + 1, 36), frac(c.ok, 12), frac(1, 6)],
          hint: "36 ta natijadan nechtasi kerakli yig'indini beradi?",
          steps: [
            `Barcha natijalar: 36`,
            `Yig'indi ${c.s} beradigan juftlar: ${c.ok} ta`,
            `P = ${c.ok}/36 = ${frac(c.ok, 36)}`,
          ],
        };
      },
    },
    {
      id: "probability.permutation",
      title: "O'rinlashtirish",
      tagline: "P(n, k) = n!/(n−k)!",
      theory: "Tartib muhim bo'lsa o'rinlashtirish ishlatiladi: P(n, k) = n!/(n − k)!.",
      gen() {
        const n = ri(5, 7);
        const k = ri(2, 3);
        const p = fact(n) / fact(n - k);
        return {
          prompt: `<b>${n}</b> kishidan <b>${k}</b> kishini tanlab, ularni qatorga necha xil tartibda joylash mumkin?`,
          answer: `${p}`,
          distractors: [`${comb(n, k)}`, `${p + n}`, `${fact(n)}`],
          hint: "Tartib muhim — o'rinlashtirish formulasi.",
          steps: [
            `P(${n}, ${k}) = ${n}! / (${n} − ${k})!`,
            `= ${fact(n)} / ${fact(n - k)}`,
            `= ${p}`,
          ],
        };
      },
    },
    {
      id: "probability.totalProbability",
      title: "To'la ehtimollik",
      tagline: "Ikki qutidan tasodifiy tanlov",
      theory: "P(A) = P(H₁)·P(A|H₁) + P(H₂)·P(A|H₂).",
      gen() {
        const r1 = ri(2, 5);
        const b1 = ri(2, 5);
        const r2 = ri(1, 4);
        const b2 = ri(1, 4);
        const num = r1 * (r2 + b2) + r2 * (r1 + b1);
        const den = 2 * (r1 + b1) * (r2 + b2);
        return {
          prompt: `Ikki qutidan tasodifiy biri tanlanadi. 1-qutida ${r1} qizil va ${b1} ko'k, 2-qutida ${r2} qizil va ${b2} ko'k shar bor. <b>Qizil</b> shar olinishi ehtimoli qanday?`,
          answer: frac(num, den),
          distractors: [
            frac(r1, r1 + b1),
            frac(r2, r2 + b2),
            frac(num, den + 1),
          ],
          hint: "Har quti uchun ½·ehtimol, keyin qo'shing.",
          steps: [
            `P(qizil|1) = ${r1}/${r1 + b1}, P(qizil|2) = ${r2}/${r2 + b2}`,
            `P = ½·${r1}/${r1 + b1} + ½·${r2}/${r2 + b2}`,
            `= ${frac(num, den)}`,
          ],
        };
      },
    },
    {
      id: "probability.atLeastOne",
      title: "Kamida bitta",
      tagline: "1 − P(hech qaysi)",
      theory: "«Kamida bitta» ehtimoli = 1 − «hech qaysi» ehtimoli. Bu eng qisqa yo'l.",
      gen() {
        const cases = [
          { q: "Ikki kubik tashlandi. Kamida bitta olti tushishi ehtimoli qanday?", ok: 11, den: 36, why: "1 − (5/6)² = 1 − 25/36" },
          { q: "Ikki tanga tashlandi. Kamida bitta gerb tushishi ehtimoli qanday?", ok: 3, den: 4, why: "1 − (1/2)² = 1 − 1/4" },
          { q: "Uch tanga tashlandi. Kamida bitta gerb tushishi ehtimoli qanday?", ok: 7, den: 8, why: "1 − (1/2)³ = 1 − 1/8" },
        ];
        const c = pick(cases);
        return {
          prompt: c.q,
          answer: frac(c.ok, c.den),
          distractors: [frac(1, c.den), frac(c.den - c.ok, c.den), frac(c.ok, c.den + 1)],
          hint: "Avval «hech qaysi» ehtimolini toping.",
          steps: [c.why, `= ${frac(c.ok, c.den)}`],
        };
      },
    },
    {
      id: "probability.cards",
      title: "Kartalar",
      tagline: "52 talik to'plam",
      theory: "52 ta kartada 4 ta kostyum (13 tadan), 4 ta tuz bor.",
      gen() {
        const cases = [
          { q: "Tasodifiy olingan karta **tuz** bo'lishi ehtimoli qanday?", a: frac(1, 13), w: [frac(1, 52), frac(1, 4), frac(4, 13)], why: "4 ta tuz / 52 ta karta = 1/13" },
          { q: "Tasodifiy olingan karta **qizil kostyum** (g'isht yoki tilla) bo'lishi ehtimoli qanday?", a: frac(1, 2), w: [frac(1, 4), frac(13, 52), frac(2, 13)], why: "26 ta qizil karta / 52 = 1/2" },
          { q: "Tasodifiy olingan karta **rasmli** (J, Q, K) bo'lishi ehtimoli qanday?", a: frac(3, 13), w: [frac(1, 13), frac(1, 4), frac(12, 52)], why: "12 ta rasmli karta / 52 = 3/13" },
        ];
        const c = pick(cases);
        return {
          prompt: c.q.replace(/\*\*/g, ""),
          answer: c.a,
          distractors: c.w,
          hint: "Qulay kartalar sonini 52 ga bo'ling.",
          steps: [c.why],
        };
      },
    },
    {
      id: "probability.expectedValue",
      title: "Matematik kutilma",
      tagline: "E(X) = Σ x·p",
      theory: "Kutilma = har bir natijaning qiymatini uning ehtimoliga ko'paytirib qo'shish.",
      gen() {
        const p1 = pick([0.2, 0.25, 0.4, 0.5]);
        const win = pick([10, 20, 25, 50]);
        const ev = p1 * win;
        return {
          prompt: `O'yinda <b>${p1}</b> ehtimol bilan <b>${win}</b> ball, qolgan holatda 0 ball olinadi. Kutilma nechaga teng?`,
          answer: `${Math.round(ev * 100) / 100}`,
          distractors: [`${win}`, `${Math.round((1 - p1) * win * 100) / 100}`, `${Math.round(ev * 2 * 100) / 100}`],
          hint: "E = p·x + (1−p)·0.",
          steps: [`E = ${p1} · ${win}`, `E = ${Math.round(ev * 100) / 100}`],
        };
      },
    },
    {
      id: "probability.conditional",
      title: "Shartli ehtimollik",
      tagline: "P(A|B)",
      theory: "P(A|B) = P(A ∩ B) / P(B) — B ma'lum bo'lganda A ehtimoli.",
      gen() {
        const gp = ri(12, 20);
        const gf = ri(4, 10);
        const bp = ri(8, 16);
        const bf = ri(4, 10);
        return {
          prompt: `Jadval: qizlar — ${gp} o'tdi, ${gf} yiqildi; o'g'il bolalar — ${bp} o'tdi, ${bf} yiqildi. Tasodifiy tanlangan o'quvchi <b>qiz</b> bo'lsa, uning <b>o'tgan</b> bo'lish ehtimoli qanday?`,
          answer: frac(gp, gp + gf),
          distractors: [frac(bp, bp + bf), frac(gp, gp + bf), frac(gp + bp, gp + gf + bp + bf)],
          hint: "Faqat qizlar ustuniga qarang.",
          steps: [
            `Qizlar jami: ${gp} + ${gf} = ${gp + gf}`,
            `O'tgan qizlar: ${gp}`,
            `P = ${gp}/${gp + gf} = ${frac(gp, gp + gf)}`,
          ],
        };
      },
    },
    {
      id: "probability.noReplace",
      title: "Qaytarmasdan olish",
      tagline: "Ikkinchi ehtimol o'zgaradi",
      theory:
        "Qaytarmasdan olinganda ikkinchi ehtimol yangilanadi: birinchi olingandan keyin qutida bitta shar kam.",
      gen() {
        const r = ri(3, 6);
        const b = ri(2, 5);
        const num = r * (r - 1);
        const den = (r + b) * (r + b - 1);
        return {
          prompt: `Qutida ${r} qizil va ${b} ko'k shar bor. Ikkita shar <b>qaytarmasdan</b> olinadi. Ikkisi ham qizil bo'lish ehtimoli qanday?`,
          answer: frac(num, den),
          distractors: [frac(r * r, (r + b) * (r + b)), frac(num, den + 1), frac(r, r + b)],
          hint: "P = P₁ · P₂, ikkinchisida shar soni bittaga kam.",
          steps: [
            `P₁ = ${r}/${r + b}`,
            `P₂ = ${r - 1}/${r + b - 1}`,
            `P = ${frac(num, den)}`,
          ],
        };
      },
    },
    {
      id: "probability.independentBoth",
      title: "Ikki mustaqil hodisa",
      tagline: "Ikkisi ham bajarilishi",
      theory: "Mustaqil hodisalar uchun ikkisining ham bajarilish ehtimoli: P = P₁ · P₂.",
      gen() {
        const a = ri(1, 3);
        const b = ri(1, 3);
        const num = a * b;
        const den = 36;
        return {
          prompt: `Birinchi kubikda <b>${a}</b> tushishi, ikkinchisida <b>${b}</b> tushishi ehtimoli qanday?`,
          answer: frac(num, den),
          distractors: [frac(a + b, 6), frac(num, 6), frac(a, 6)],
          hint: "P = a/6 · b/6.",
          steps: [
            `P₁ = ${a}/6, P₂ = ${b}/6`,
            `P = ${a}/6 · ${b}/6 = ${num}/36`,
            `= ${frac(num, den)}`,
          ],
        };
      },
    },
    {
      id: "probability.orRule",
      title: "Qo'shish qoidasi (umumiy)",
      tagline: "P(A∪B) = P(A)+P(B)−P(A∩B)",
      theory: "Hodisalar birgalikda bo'lishi mumkin bo'lsa, kesishmani bir marta ayirish kerak.",
      gen() {
        const total = 20;
        const a = ri(6, 10);
        const b = ri(6, 10);
        const both = ri(2, 4);
        const union = a + b - both;
        return {
          prompt: `Sinfda ${total} o'quvchi bor: ${a} tasi ingliz tilini, ${b} tasi rus tilini, ${both} tasi ikkalasini ham biladi. Tasodifiy tanlangan o'quvchi <b>kamida bitta</b> tilni bilishi ehtimoli qanday?`,
          answer: frac(union, total),
          distractors: [frac(a + b, total), frac(both, total), frac(union + 1, total)],
          hint: "P(A∪B) = P(A) + P(B) − P(A∩B).",
          steps: [
            `P(A) = ${a}/${total}, P(B) = ${b}/${total}, P(A∩B) = ${both}/${total}`,
            `P(A∪B) = ${a + b}/${total} − ${both}/${total} = ${union}/${total}`,
            `= ${frac(union, total)}`,
          ],
        };
      },
    },
    {
      id: "probability.binomial",
      title: "Ikkilik ehtimollik",
      tagline: "C(n,k)·pᵏ·qⁿ⁻ᵏ",
      theory: "n ta sinovda aynan k marta muvaffaqiyat: C(n,k)·pᵏ·(1−p)ⁿ⁻ᵏ.",
      gen() {
        const n = 3;
        const k = 2;
        return {
          prompt: `Tanga <b>${n}</b> marta tashlandi. Aynan <b>${k}</b> marta gerb tushishi ehtimoli qanday?`,
          answer: frac(comb(n, k), Math.pow(2, n)),
          distractors: [frac(1, Math.pow(2, n)), frac(k, Math.pow(2, n)), frac(comb(n, k) + 1, Math.pow(2, n))],
          hint: "C(n,k) usul, har birining ehtimoli (1/2)ⁿ.",
          steps: [
            `C(${n}, ${k}) = ${comb(n, k)}`,
            `Har bir ketma-ketlik ehtimoli = 1/${Math.pow(2, n)}`,
            `P = ${comb(n, k)}/${Math.pow(2, n)} = ${frac(comb(n, k), Math.pow(2, n))}`,
          ],
        };
      },
    },
    {
      id: "probability.balls",
      title: "Sharlar",
      tagline: "Qutidan bitta olish",
      theory: "P = kerakli sharlar soni / umumiy sharlar soni.",
      gen() {
        const r = ri(3, 8);
        const b = ri(2, 7);
        const g = ri(1, 5);
        const total = r + b + g;
        const mode = pick(["red", "notRed", "green"]);
        const ans =
          mode === "red" ? frac(r, total) : mode === "notRed" ? frac(b + g, total) : frac(g, total);
        return {
          prompt: `Qutida ${r} qizil, ${b} ko'k va ${g} yashil shar bor. Tasodifan <b>${mode === "red" ? "qizil" : mode === "notRed" ? "qizil bo'lmagan" : "yashil"}</b> shar olinishi ehtimoli qanday?`,
          answer: ans,
          distractors: [frac(r, total), frac(b, total), frac(g, total)].filter((x) => x !== ans).slice(0, 3),
          hint: "Kerakli sharlar sonini umumiy songa bo'ling.",
          steps: [
            `Umumiy sharlar = ${r} + ${b} + ${g} = ${total}`,
            `Kerakli holatlar = ${mode === "red" ? r : mode === "notRed" ? b + g : g}`,
            `P = ${ans}`,
          ],
        };
      },
    },
    {
      id: "probability.diceDiff",
      title: "Kubiklar ayirmasi",
      tagline: "|a − b| qiymati",
      theory: "Ikki kubik uchun 36 ta natija bor; ayirma bo'yicha jadval tuzish oson.",
      gen() {
        const cases = [
          { d: 0, ok: 6 },
          { d: 1, ok: 10 },
          { d: 2, ok: 8 },
          { d: 3, ok: 6 },
          { d: 4, ok: 4 },
          { d: 5, ok: 2 },
        ];
        const c = pick(cases);
        return {
          prompt: `Ikki kubik tashlandi. Tushgan sonlar orasidagi <b>ayirma ${c.d}</b> bo'lish ehtimoli qanday?`,
          answer: frac(c.ok, 36),
          distractors: [frac(c.ok + 2, 36), frac(c.ok, 12), frac(1, 6)],
          hint: "36 ta natijadan nechtasi shu ayirmani beradi?",
          steps: [`Qulay natijalar: ${c.ok} ta`, `P = ${c.ok}/36 = ${frac(c.ok, 36)}`],
        };
      },
    },
    {
      id: "probability.spinner",
      title: "Aylanma doira",
      tagline: "Sektorlar ulushi",
      theory: "Aylanma doira sektorlarining burchaklari yig'indisi 360°. Ehtimol = sektor/360°.",
      gen() {
        const red = pick([60, 90, 120, 180]);
        const blue = pick([45, 60, 90]);
        const green = 360 - red - blue;
        return {
          prompt: `Aylanma doira uchta sektorga bo'lingan: qizil ${red}°, ko'k ${blue}°, yashil ${green}°. <b>Qizil</b> tushishi ehtimoli qanday?`,
          answer: frac(red, 360),
          distractors: [frac(blue, 360), frac(green, 360), frac(red, 180)],
          hint: "P = sektor burchagi / 360°.",
          steps: [`P = ${red}/360`, `Soddalashtirilgan: ${frac(red, 360)}`],
        };
      },
    },
    {
      id: "probability.conditionalFormal",
      title: "Shartli ehtimollik (formula)",
      tagline: "P(A|B) = P(A∩B)/P(B)",
      theory: "P(A|B) = P(A∩B) / P(B), bu yerda P(B) > 0.",
      gen() {
        const total = 50;
        const both = ri(6, 15);
        const pb = ri(both + 5, 30);
        return {
          prompt: `P(A∩B) = ${both}/${total}, P(B) = ${pb}/${total}. <b>P(A|B)</b> ni toping.`,
          answer: frac(both, pb),
          distractors: [frac(pb, both), frac(both, total), frac(pb, total)],
          hint: "P(A|B) = P(A∩B)/P(B).",
          steps: [
            `P(A|B) = (${both}/${total}) / (${pb}/${total})`,
            `= ${both}/${pb}`,
            `= ${frac(both, pb)}`,
          ],
        };
      },
    },
    {
      id: "probability.expectedPrize",
      title: "Kutilma (o'yin)",
      tagline: "Chipta narxi va yutuq",
      theory: "Kutilma = Σ(yutuq · ehtimol). O'yin adolatli bo'lsa, kutilma chipta narxiga teng bo'ladi.",
      gen() {
        const prize = pick([100, 200, 500]);
        const p = pick([0.01, 0.05, 0.1]);
        const ev = prize * p;
        return {
          prompt: `Lotereyada <b>${p * 100}%</b> ehtimol bilan <b>${prize}</b> so'm yutiladi. Bitta chiptaning kutilma qiymati qancha?`,
          answer: `${Math.round(ev * 100) / 100} so'm`,
          distractors: [`${prize} so'm`, `${Math.round((1 - p) * prize)} so'm`, `${Math.round(ev * 10)} so'm`],
          hint: "E = yutuq · ehtimol.",
          steps: [`E = ${prize} · ${p}`, `E = ${Math.round(ev * 100) / 100} so'm`],
        };
      },
    },
    {
      id: "probability.chooseAtLeast",
      title: "Kamida bittasi tanlanishi",
      tagline: "C(n,k) bilan",
      theory: "«Kamida bitta» = barcha usullar − «hech qaysi» usullar.",
      gen() {
        const n = ri(5, 8);
        const bad = ri(2, 3);
        const k = 2;
        const all = comb(n, k);
        const none = comb(n - bad, k);
        return {
          prompt: `${n} ta buyumdan ${bad} tasi nuqsonli. ${k} tasi tanlanadi. <b>Kamida bittasi nuqsonli</b> bo'lish usullari nechta?`,
          answer: `${all - none}`,
          distractors: [`${all}`, `${none}`, `${all - none + 1}`],
          hint: "Jami usullardan «ikkisi ham yaxshi» usullarini ayiring.",
          steps: [
            `Jami usullar: C(${n}, ${k}) = ${all}`,
            `Nuqsonli bo'lmagan usullar: C(${n - bad}, ${k}) = ${none}`,
            `Kamida bitta = ${all} − ${none} = ${all - none}`,
          ],
        };
      },
    },
    {
      id: "probability.consecutive",
      title: "Ketma-ket olish",
      tagline: "Uch marta qaytarmasdan",
      theory: "Qaytarmasdan olinganda har safar qutidagi son kamayadi va ehtimollar ko'paytiriladi.",
      gen() {
        const total = 8;
        const red = ri(4, 6);
        const num = red * (red - 1) * (red - 2);
        const den = total * (total - 1) * (total - 2);
        return {
          prompt: `Qutida ${red} qizil va ${total - red} ko'k shar bor. Uchtasi qaytarmasdan olinadi. Uchisi ham qizil bo'lish ehtimoli qanday?`,
          answer: frac(num, den),
          distractors: [frac(red ** 3, total ** 3), frac(num, den + 1), frac(red, total)],
          hint: "P = r/n · (r−1)/(n−1) · (r−2)/(n−2).",
          steps: [
            `P₁ = ${red}/${total}`,
            `P₂ = ${red - 1}/${total - 1}, P₃ = ${red - 2}/${total - 2}`,
            `P = ${frac(num, den)}`,
          ],
        };
      },
    },
    {
      id: "probability.unionThree",
      title: "Uchta hodisa",
      tagline: "Kesishmasiz qo'shish",
      theory: "Birgalikda bo'lmaydigan hodisalar uchun P(A∪B∪C) = P(A)+P(B)+P(C).",
      gen() {
        const a = ri(2, 5);
        const b = ri(2, 5);
        const c = ri(2, 5);
        const total = 20;
        return {
          prompt: `Qutida ${total} shar bor: ${a} qizil, ${b} ko'k, ${c} yashil, qolgani oq. Tasodifan <b>rangli</b> (qizil, ko'k yoki yashil) shar olinishi ehtimoli qanday?`,
          answer: frac(a + b + c, total),
          distractors: [frac(a, total), frac(b + c, total), frac(a + b, total)],
          hint: "Uch ehtimolni qo'shing.",
          steps: [
            `P = ${a}/${total} + ${b}/${total} + ${c}/${total}`,
            `= ${a + b + c}/${total} = ${frac(a + b + c, total)}`,
          ],
        };
      },
    },
    {
      id: "probability.twoBallsDifferent",
      title: "Turli rangdagi sharlar",
      tagline: "Qaytarmasdan ikki marta",
      theory: "Turli rang ehtimoli = P(qizil keyin ko'k) + P(ko'k keyin qizil).",
      gen() {
        const r = ri(3, 6);
        const b = ri(3, 6);
        const total = r + b;
        const num = r * b * 2;
        const den = total * (total - 1);
        return {
          prompt: `Qutida ${r} qizil va ${b} ko'k shar bor. Ikkitasi qaytarmasdan olinadi. Ular <b>turli rangda</b> bo'lish ehtimoli qanday?`,
          answer: frac(num, den),
          distractors: [frac(r * (r - 1), den), frac(b * (b - 1), den), frac(num, den + 2)],
          hint: "Ikki tartibni ham hisobga oling.",
          steps: [
            `P(qizil→ko'k) = ${r}/${total} · ${b}/${total - 1}`,
            `P(ko'k→qizil) = ${b}/${total} · ${r}/${total - 1}`,
            `Yig'indi = ${frac(num, den)}`,
          ],
        };
      },
    },
    {
      id: "probability.arrangementRepetition",
      title: "Takrorlanuvchi o'rinlashtirish",
      tagline: "nᵏ",
      theory: "Har bir o'ringa n ta variantdan tanlash mumkin: nᵏ usul.",
      gen() {
        const n = pick([2, 3, 4]);
        const k = ri(2, 3);
        return {
          prompt: `${n} xil raqamdan ${k} xonali kod tuzish kerak (takrorlanish mumkin). Necha xil kod chiqadi?`,
          answer: `${Math.pow(n, k)}`,
          distractors: [`${n * k}`, `${n + k}`, `${Math.pow(k, n)}`],
          hint: "nᵏ.",
          steps: [`Har bir xonaga ${n} variant`, `Jami = ${n}^${k} = ${Math.pow(n, k)}`],
        };
      },
    },
    {
      id: "probability.diceProduct",
      title: "Kubiklar ko'paytmasi",
      tagline: "Ikki kubik",
      theory: "Ikki kubik uchun 36 ta natija; ko'paytma bo'yicha jadval tuziladi.",
      gen() {
        const cases = [
          { p: 6, ok: 4 },
          { p: 12, ok: 4 },
          { p: 4, ok: 3 },
          { p: 2, ok: 1 },
          { p: 36, ok: 1 },
        ];
        const c = pick(cases);
        return {
          prompt: `Ikki kubik tashlandi. Ko'paytma <b>${c.p}</b> bo'lish ehtimoli qanday?`,
          answer: frac(c.ok, 36),
          distractors: [frac(c.ok + 1, 36), frac(1, 6), frac(c.ok, 12)],
          hint: "36 ta natijadan nechtasi shu ko'paytmani beradi?",
          steps: [`Qulay natijalar: ${c.ok}`, `P = ${c.ok}/36 = ${frac(c.ok, 36)}`],
        };
      },
    },
    {
      id: "probability.urnMixed",
      title: "Ikki xil rang",
      tagline: "Bitta olish",
      theory: "P = kerakli sharlar / umumiy sharlar.",
      gen() {
        const r = ri(4, 8);
        const b = ri(2, 6);
        const total = r + b;
        return {
          prompt: `Qutida ${r} qizil va ${b} ko'k shar bor. Tasodifan olingan shar <b>qizil yoki ko'k</b> bo'lish ehtimoli qanday?`,
          answer: "1",
          distractors: [frac(r, total), frac(b, total), frac(1, 2)],
          hint: "Boshqa rang bormi?",
          steps: [`Barcha sharlar qizil yoki ko'k`, `P = 1`],
        };
      },
    },
    {
      id: "probability.coinStreak",
      title: "Ketma-ket gerb",
      tagline: "(1/2)ⁿ",
      theory: "n marta tanga tashlanganda hammasi gerb bo'lish ehtimoli (1/2)ⁿ.",
      gen() {
        const n = pick([3, 4, 5]);
        return {
          prompt: `Tanga ${n} marta tashlandi. Hammasi <b>gerb</b> tushishi ehtimoli qanday?`,
          answer: frac(1, Math.pow(2, n)),
          distractors: [frac(1, n), frac(n, Math.pow(2, n)), frac(1, 2)],
          hint: "(1/2)ⁿ.",
          steps: [`P = (1/2)^${n}`, `= 1/${Math.pow(2, n)}`],
        };
      },
    },
    {
      id: "probability.geometricProb",
      title: "Geometrik ehtimollik",
      tagline: "Yuza nisbati",
      theory: "Nuqta sohaga tasodifan tashlanganda P = kerakli yuza / umumiy yuza.",
      gen() {
        const side = pick([10, 20]);
        const r = pick([2, 5]);
        const P = (3.14 * r * r) / (side * side);
        const pct = Math.round(P * 1000) / 10;
        return {
          prompt: `${side} × ${side} kvadrat ichiga radiusi ${r} bo'lgan doira chizilgan. Tasodifiy nuqta <b>doira ichiga</b> tushishi ehtimoli necha foiz? (π ≈ 3,14)`,
          answer: `${fmt(pct)}%`,
          distractors: [`${fmt(Math.round((3.14 * r * r) / (side * 4) * 1000) / 10)}%`, `${fmt(Math.round(pct * 2 * 10) / 10)}%`, `${fmt(Math.round(pct / 2 * 10) / 10)}%`],
          hint: "P = doira yuzi / kvadrat yuzi.",
          steps: [
            `Doira = 3,14·${r * r} = ${fmt(Math.round(3.14 * r * r * 10) / 10)}`,
            `Kvadrat = ${side * side}`,
            `P = ${fmt(pct)}%`,
          ],
        };
      },
    },
    {
      id: "probability.conditionalTable",
      title: "Shartli ehtimollik (jadval)",
      tagline: "Ikki toifa",
      theory: "P(A|B) = B guruhidagi A soni / B guruhidagi jami.",
      gen() {
        const yes = ri(10, 25);
        const no = ri(5, 20);
        const total = yes + no;
        const pct = Math.round((yes / total) * 1000) / 10;
        return {
          prompt: `Jadval: "ha" — ${yes} kishi, "yo'q" — ${no} kishi. Tasodifiy tanlangan kishi "ha" degan bo'lsa, bu guruhdagi ulushi necha foiz?`,
          answer: `${fmt(pct)}%`,
          distractors: [`${yes}%`, `${fmt(Math.round((no / total) * 1000) / 10)}%`, `${fmt(Math.round(pct / 2 * 10) / 10)}%`],
          hint: "yes / (yes + no).",
          steps: [`Jami = ${total}`, `P = ${yes}/${total} = ${fmt(pct)}%`],
        };
      },
    },
    {
      id: "probability.expectedDice",
      title: "Kubik kutilmasi",
      tagline: "E = Σ x·p",
      theory: "Adolatli kubik uchun kutilma 1·1/6 + … + 6·1/6 = 3,5.",
      gen() {
        const n = pick([6, 8, 10]);
        const ev = (n + 1) / 2;
        return {
          prompt: `1 dan ${n} gacha raqamlangan adolatli kubik uchun kutilma qiymatini toping.`,
          answer: `${fmt(ev)}`,
          distractors: [`${n}`, `${fmt(n / 2)}`, `${fmt(ev + 1)}`],
          hint: "O'rtacha qiymat (1 + n)/2.",
          steps: [`E = (1 + ${n})/2`, `= ${fmt(ev)}`],
        };
      },
    },
    {
      id: "probability.mutuallyExclusive",
      title: "Birgalikda bo'lmaydigan hodisalar",
      tagline: "P(A∩B) = 0",
      theory: "Agar ikki hodisa bir vaqtda bajarilmasa, ular birgalikda bo'lmaydigan hodisalar deyiladi.",
      gen() {
        const cases = [
          { q: "Bitta kubik tashlandi: «3 tushdi» va «5 tushdi»", a: "ha" },
          { q: "Bitta kubik tashlandi: «juft son» va «3 dan katta»", a: "yo'q" },
          { q: "Bitta tanga: «gerb» va «raqam»", a: "ha" },
        ];
        const c = pick(cases);
        return {
          prompt: `Bu hodisalar birgalikda bo'lmaydimi? ${c.q}`,
          answer: c.a,
          distractors: [c.a === "ha" ? "yo'q" : "ha", "aniqlab bo'lmaydi", "faqat ehtimolga bog'liq"],
          hint: "Ikkisi bir vaqtda bajarilishi mumkinmi?",
          steps: [c.a === "ha" ? "Ikkisi birga bajarilmaydi" : "Ikkisi birga bajarilishi mumkin", `Javob: ${c.a}`],
        };
      },
    },
    {
      id: "probability.independentCheck",
      title: "Bog'liqlikni tekshirish",
      tagline: "P(A∩B) = P(A)·P(B)?",
      theory: "Agar P(A∩B) = P(A)·P(B) bo'lsa, hodisalar mustaqil.",
      gen() {
        const pa = pick([0.5, 0.25, 0.4]);
        const pb = pick([0.5, 0.2, 0.3]);
        const prod = Math.round(pa * pb * 1000) / 1000;
        return {
          prompt: `P(A) = ${fmt(pa)}, P(B) = ${fmt(pb)}. Agar P(A∩B) = ${fmt(prod)} bo'lsa, hodisalar mustaqilmi?`,
          answer: "ha",
          distractors: ["yo'q", "aniqlab bo'lmaydi", "faqat A ga bog'liq"],
          hint: `P(A)·P(B) = ${fmt(pa)}·${fmt(pb)}.`,
          steps: [`P(A)·P(B) = ${fmt(prod)}`, `Berilgan kesishma shunga teng → mustaqil`],
        };
      },
    },
    {
      id: "probability.circularPermutation",
      title: "Aylana stol",
      tagline: "(n − 1)!",
      theory: "n kishini aylana stol atrofida (n − 1)! usulda o'tqazish mumkin.",
      gen() {
        const n = ri(4, 6);
        const fact = (k) => (k <= 1 ? 1 : k * fact(k - 1));
        return {
          prompt: `${n} kishini aylana stol atrofida necha xil usulda o'tqazish mumkin?`,
          answer: `${fact(n - 1)}`,
          distractors: [`${fact(n)}`, `${fact(n) / 2}`, `${n}`],
          hint: "Aylana uchun (n − 1)!.",
          steps: [`(${n} − 1)! = ${n - 1}!`, `= ${fact(n - 1)}`],
        };
      },
    },
    {
      id: "probability.drawingWithoutOrder",
      title: "Tartib muhim emas",
      tagline: "C(n, k)",
      theory: "Tartib muhim bo'lmasa kombinatsiya, muhim bo'lsa o'rinlashtirish ishlatiladi.",
      gen() {
        const n = ri(5, 9);
        const k = 2;
        return {
          prompt: `${n} ta shardan ${k} tasi tanlanadi va <b>tartib hisobga olinmaydi</b>. Necha xil usul bor?`,
          answer: `${comb(n, k)}`,
          distractors: [`${n * (n - 1)}`, `${comb(n, k) * 2}`, `${n}`],
          hint: "C(n,k) = n!/(k!(n−k)!).",
          steps: [`C(${n}, ${k}) = ${comb(n, k)}`],
        };
      },
    },
    {
      id: "probability.atLeastTwo",
      title: "Kamida ikkita",
      tagline: "Tanga uch marta",
      theory: "«Kamida ikkita» = aynan ikkita + aynan uchta.",
      gen() {
        return {
          prompt: `Tanga 3 marta tashlandi. <b>Kamida ikkita</b> gerb tushishi ehtimoli qanday?`,
          answer: frac(4, 8),
          distractors: [frac(3, 8), frac(1, 8), frac(1, 2)],
          hint: "Aynan 2 va aynan 3 holatlarni qo'shing.",
          steps: [
            `Jami natijalar: 8`,
            `Aynan 2 gerb: 3 ta, aynan 3 gerb: 1 ta`,
            `P = 4/8 = 1/2`,
          ],
        };
      },
    },
    {
      id: "probability.complementDice",
      title: "Qarama-qarshi (kubik)",
      tagline: "1 − P(A)",
      theory: "P(A̅) = 1 − P(A).",
      gen() {
        const cases = [
          { q: "6 tushmasligi", p: frac(5, 6) },
          { q: "juft son tushmasligi", p: frac(1, 2) },
          { q: "4 dan katta tushmasligi", p: frac(2, 3) },
        ];
        const c = pick(cases);
        return {
          prompt: `Kubik bir marta tashlandi. <b>${c.q}</b> ehtimoli qanday?`,
          answer: c.p,
          distractors: [frac(1, 6), frac(1, 2), frac(2, 3)],
          hint: "1 − P(qarama-qarshi).",
          steps: [`P = ${c.p}`],
        };
      },
    },
  ],
};

function fmtSafe(n) {
  return String(Math.round(n * 10) / 10);
}
