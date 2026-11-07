// AnormalMath — Arifmetika bo'limi
import { ri, pick, fmt } from "../engine.js";

export const arithmetic = {
  id: "arithmetic",
  title: "Arifmetika",
  glyph: "±",
  accent: "#f59e0b",
  blurb: "Amallar tartibi, kasrlar, ildiz, daraja — hisob asosi.",
  topics: [
    {
      id: "arith.order",
      title: "Amallar tartibi",
      tagline: "Avval ko'paytirish",
      theory: "Amallar tartibi: qavs → daraja/ildiz → ko'paytirish/bo'lish → qo'shish/ayirish.",
      gen() {
        const a = ri(2, 20);
        const b = ri(2, 9);
        const c = ri(2, 9);
        const val = a + b * c;
        return {
          prompt: `<b>${a} + ${b} · ${c}</b> ni hisoblang.`,
          answer: `${val}`,
          distractors: [`${(a + b) * c}`, `${a + b + c}`, `${val + b}`],
          hint: "Avval ko'paytirish, keyin qo'shish.",
          steps: [`${b} · ${c} = ${b * c}`, `${a} + ${b * c} = ${val}`],
        };
      },
    },
    {
      id: "arith.negative",
      title: "Manfiy sonlar",
      tagline: "Ishoralar bilan ishlash",
      theory: "(−a) + (−b) = −(a + b), (−a)·(−b) = ab, (−a)·b = −ab.",
      gen() {
        const a = ri(2, 20);
        const b = ri(2, 15);
        const mode = pick(["+", "−", "·"]);
        const val = mode === "+" ? -a - b : mode === "−" ? -a + b : a * b;
        const display =
          mode === "−" ? `(−${a}) − (−${b})` : `(−${a}) ${mode} (−${b})`;
        return {
          prompt: `<b>${display}</b> ni hisoblang.`,
          answer: `${val}`,
          distractors: [`${-val}`, `${a + b}`, `${val + a}`],
          hint: "Ishoralar qoidasini eslang.",
          steps: [
            mode === "+" ? `(−${a}) + (−${b}) = −(${a} + ${b})` : mode === "−" ? `(−${a}) − (−${b}) = −${a} + ${b}` : `(−${a})·(−${b}) = ${a}·${b}`,
            `= ${val}`,
          ],
        };
      },
    },
    {
      id: "arith.multiply",
      title: "Ko'paytirish",
      tagline: "Ikki xonali sonlar",
      theory: "Ikki xonali sonlarni ko'paytirishda o'nlik va birlik bo'yicha ajratish qulay.",
      gen() {
        const a = ri(11, 49);
        const b = ri(3, 12);
        return {
          prompt: `<b>${a} · ${b}</b> ni hisoblang.`,
          answer: `${a * b}`,
          distractors: [`${a * b + a}`, `${a * b - b}`, `${a + b}`],
          hint: `${a}·${b} = ${a}·${b - 1} + ${a}.`,
          steps: [`${a} · ${b - 1} = ${a * (b - 1)}`, `+ ${a} = ${a * b}`],
        };
      },
    },
    {
      id: "arith.divide",
      title: "Bo'lish",
      tagline: "Natija va qoldiq",
      theory: "Bo'lishda natija butun bo'lmasa, kasr yoki o'nlik ko'rinishda yoziladi.",
      gen() {
        const b = ri(3, 12);
        const q = ri(4, 20);
        const a = b * q;
        return {
          prompt: `<b>${a} ÷ ${b}</b> ni hisoblang.`,
          answer: `${q}`,
          distractors: [`${q + 1}`, `${a - b}`, `${b}`],
          hint: `${b} ni nechaga ko'paytirsam ${a} bo'ladi?`,
          steps: [`${b} · ${q} = ${a}`, `Demak ${a} ÷ ${b} = ${q}`],
        };
      },
    },
    {
      id: "arith.power",
      title: "Daraja",
      tagline: "aⁿ hisoblash",
      theory: "aⁿ — a sonini o'ziga n marta ko'paytirish.",
      gen() {
        const a = pick([2, 3, 4, 5]);
        const n = ri(2, 4);
        return {
          prompt: `<b>${a}^${n}</b> ni hisoblang.`,
          answer: `${Math.pow(a, n)}`,
          distractors: [`${a * n}`, `${Math.pow(a, n - 1)}`, `${Math.pow(a, n) + a}`],
          hint: `${a} ni ${n} marta ko'paytiring.`,
          steps: [`${a}^${n} = ${Array(n).fill(a).join(" · ")}`, `= ${Math.pow(a, n)}`],
        };
      },
    },
    {
      id: "arith.root",
      title: "Kvadrat ildiz",
      tagline: "√n",
      theory: "√n — kvadrati n ga teng bo'lgan nomanfiy son.",
      gen() {
        const a = ri(4, 20);
        return {
          prompt: `<b>√${a * a}</b> ni hisoblang.`,
          answer: `${a}`,
          distractors: [`${a * 2}`, `${a * a}`, `${a + 2}`],
          hint: `Qaysi sonning kvadrati ${a * a}?`,
          steps: [`${a}² = ${a * a}`, `Demak √${a * a} = ${a}`],
        };
      },
    },
    {
      id: "arith.fractionAdd",
      title: "Kasrlarni qo'shish",
      tagline: "Turli maxrajlar",
      theory: "Turli maxrajli kasrlarni qo'shishda umumiy maxraj topiladi.",
      gen() {
        const b = pick([2, 3, 4, 5]);
        const d = pick([2, 3, 4, 5].filter((x) => x !== b));
        const a = ri(1, b - 1);
        const c = ri(1, d - 1);
        const num = a * d + c * b;
        const den = b * d;
        const gcd = (x, y) => (y ? gcd(y, x % y) : x);
        const g = gcd(num, den);
        return {
          prompt: `<b>${a}/${b} + ${c}/${d}</b> ni hisoblang.`,
          answer: `${num / g}/${den / g}`,
          distractors: [`${a + c}/${b + d}`, `${num}/${den * 2}`, `${a * c}/${b * d}`],
          hint: `Umumiy maxraj ${den}.`,
          steps: [
            `${a}/${b} = ${a * d}/${den}`,
            `${c}/${d} = ${c * b}/${den}`,
            `Yig'indi = ${num}/${den} = ${num / g}/${den / g}`,
          ],
        };
      },
    },
    {
      id: "arith.decimal",
      title: "O'nlik kasrlar",
      tagline: "Ko'paytirish",
      theory: "O'nlik kasrlarni ko'paytirishda verguldan keyingi raqamlar soni yig'iladi.",
      gen() {
        const a = (ri(15, 90) / 10).toFixed(1);
        const b = (ri(2, 9) / 10).toFixed(1);
        const val = Number(a) * Number(b);
        return {
          prompt: `<b>${a} · ${b}</b> ni hisoblang.`,
          answer: `${fmt(Math.round(val * 1000) / 1000)}`,
          distractors: [`${fmt(Math.round(val * 10 * 1000) / 1000)}`, `${fmt(Math.round(val / 10 * 1000) / 1000)}`, `${fmt(Math.round((Number(a) + Number(b)) * 1000) / 1000)}`],
          hint: "Verguldan keyingi raqamlar sonini sanang.",
          steps: [
            `${a.replace(".", "")} · ${b.replace(".", "")} = ${Math.round(val * 1000) / 1000}`,
            `Vergul: 2 ta raqam → ${fmt(Math.round(val * 1000) / 1000)}`,
          ],
        };
      },
    },
    {
      id: "arith.round",
      title: "Yaxlitlash",
      tagline: "O'nlik va yuzlikkacha",
      theory: "Yaxlitlashda keyingi raqam 5 va undan katta bo'lsa, oldingi raqam bittaga oshadi.",
      gen() {
        const base = ri(1000, 9000);
        const place = pick([10, 100]);
        const rounded = Math.round(base / place) * place;
        return {
          prompt: `<b>${base}</b> sonini ${place === 10 ? "o'nlikkacha" : "yuzlikkacha"} yaxlitlang.`,
          answer: `${rounded}`,
          distractors: [`${Math.floor(base / place) * place}`, `${Math.ceil(base / place) * place}`, `${rounded + place}`],
          hint: `Keyingi raqamni tekshiring.`,
          steps: [
            `${base} ≈ ${rounded}`,
            `Yaxlitlangan qiymat: ${rounded}`,
          ],
        };
      },
    },
    {
      id: "arith.percentBase",
      title: "1% qoidasi",
      tagline: "Foizni bo'laklab hisoblash",
      theory: "Sonning 1% i = son/100. Undan har qanday foizni yasash oson.",
      gen() {
        const base = pick([200, 400, 800, 1200, 5000]);
        const p = pick([3, 7, 12, 35]);
        const val = (base * p) / 100;
        return {
          prompt: `<b>${base}</b> sonining <b>${p}%</b> ini toping.`,
          answer: `${fmt(val)}`,
          distractors: [`${fmt(base / p)}`, `${fmt(val + p)}`, `${fmt(val * 10)}`],
          hint: "1% = son/100, keyin p ga ko'paytiring.",
          steps: [
            `1% = ${base}/100 = ${fmt(base / 100)}`,
            `${p}% = ${fmt(base / 100)} · ${p} = ${fmt(val)}`,
          ],
        };
      },
    },
    {
      id: "arith.compare",
      title: "Kasrlarni taqqoslash",
      tagline: "Qaysi biri katta",
      theory: "Kasrlarni taqqoslash uchun umumiy maxrajga keltirish yoki o'nlik ko'rinishga o'tkazish mumkin.",
      gen() {
        const b = pick([3, 4, 5, 8]);
        const d = pick([3, 5, 7, 9].filter((x) => x !== b));
        const a = ri(1, b - 1);
        const c = ri(1, d - 1);
        const v1 = a / b;
        const v2 = c / d;
        const bigger = v1 > v2 ? `${a}/${b}` : `${c}/${d}`;
        return {
          prompt: `Qaysi kasr katta: <b>${a}/${b}</b> yoki <b>${c}/${d}</b>?`,
          answer: bigger,
          distractors: [v1 > v2 ? `${c}/${d}` : `${a}/${b}`, "teng", "aniqlab bo'lmaydi"],
          hint: "O'nlik ko'rinishga o'tkazing.",
          steps: [
            `${a}/${b} ≈ ${fmt(Math.round(v1 * 1000) / 1000)}`,
            `${c}/${d} ≈ ${fmt(Math.round(v2 * 1000) / 1000)}`,
            `Kattasi: ${bigger}`,
          ],
        };
      },
    },
    {
      id: "arith.estimation",
      title: "Baholash",
      tagline: "Taxminiy hisob",
      theory: "Baholashda sonlar qulay yaxlitlanadi va taxminiy natija topiladi.",
      gen() {
        const a = ri(40, 90) * 10;
        const b = ri(20, 60) * 10;
        const approx = Math.round((a + b) / 100) * 100;
        return {
          prompt: `<b>${a} + ${b}</b> yig'indini yuzlikkacha baholang.`,
          answer: `${approx}`,
          distractors: [`${a + b}`, `${approx + 100}`, `${approx - 100}`],
          hint: "Har bir sonni yuzlikkacha yaxlitlang.",
          steps: [
            `${a} ≈ ${Math.round(a / 100) * 100}, ${b} ≈ ${Math.round(b / 100) * 100}`,
            `Yig'indi ≈ ${approx}`,
          ],
        };
      },
    },
    {
      id: "arith.addLarge",
      title: "Uch xonali qo'shish",
      tagline: "Ustun usuli",
      theory: "Ko'p xonali sonlarni qo'shishda o'ngdan chapga, xona bo'yicha qo'shiladi.",
      gen() {
        const a = ri(120, 890);
        const b = ri(110, 870);
        return {
          prompt: `<b>${a} + ${b}</b> ni hisoblang.`,
          answer: `${a + b}`,
          distractors: [`${a + b + 100}`, `${a + b - 10}`, `${a - b}`],
          hint: "Birlikdan boshlab qo'shing.",
          steps: [`${a} + ${b} = ${a + b}`],
        };
      },
    },
    {
      id: "arith.subLarge",
      title: "Uch xonali ayirish",
      tagline: "Qarz olish bilan",
      theory: "Ayirishda kichik raqamdan katta raqam ayirilsa, chap xonadan qarz olinadi.",
      gen() {
        const a = ri(400, 950);
        const b = ri(120, 380);
        return {
          prompt: `<b>${a} − ${b}</b> ni hisoblang.`,
          answer: `${a - b}`,
          distractors: [`${a - b + 10}`, `${a - b - 100}`, `${a + b}`],
          hint: "O'ngdan chapga ayiring.",
          steps: [`${a} − ${b} = ${a - b}`],
        };
      },
    },
    {
      id: "arith.mulLarge",
      title: "Ko'paytirish (katta)",
      tagline: "Ustun usuli",
      theory: "Ko'p xonali sonni bir xonaliga ko'paytirishda har bir xona alohida ko'paytiriladi.",
      gen() {
        const a = ri(120, 480);
        const b = ri(3, 9);
        return {
          prompt: `<b>${a} · ${b}</b> ni hisoblang.`,
          answer: `${a * b}`,
          distractors: [`${a * b + b * 10}`, `${a * b - 100}`, `${a + b}`],
          hint: "Xona bo'yicha ko'paytiring.",
          steps: [`${a} · ${b} = ${a * b}`],
        };
      },
    },
    {
      id: "arith.divLarge",
      title: "Bo'lish (katta)",
      tagline: "To'liq bo'lish",
      theory: "Bo'lish — ko'paytirishning teskarisi. Natijani ko'paytirib tekshirish mumkin.",
      gen() {
        const b = ri(4, 9);
        const q = ri(20, 90);
        const a = b * q;
        return {
          prompt: `<b>${a} ÷ ${b}</b> ni hisoblang.`,
          answer: `${q}`,
          distractors: [`${q + 10}`, `${q - 5}`, `${a - b}`],
          hint: `${b} ni nechaga ko'paytirsam ${a} bo'ladi?`,
          steps: [`${b} · ${q} = ${a}`, `Natija: ${q}`],
        };
      },
    },
    {
      id: "arith.brackets",
      title: "Qavsli ifoda",
      tagline: "Avval qavs ichi",
      theory: "Qavs ichidagi amal birinchi bajariladi.",
      gen() {
        const a = ri(3, 15);
        const b = ri(2, 12);
        const k = ri(2, 6);
        return {
          prompt: `<b>${k} · (${a} + ${b})</b> ni hisoblang.`,
          answer: `${k * (a + b)}`,
          distractors: [`${k * a + b}`, `${k + a + b}`, `${k * (a - b)}`],
          hint: "Avval qavs ichini hisoblang.",
          steps: [`${a} + ${b} = ${a + b}`, `${k} · ${a + b} = ${k * (a + b)}`],
        };
      },
    },
    {
      id: "arith.negAdd",
      title: "Manfiy sonlarni qo'shish",
      tagline: "Sonlar o'qi",
      theory: "Manfiy songa musbat qo'shilsa, son o'ngga, manfiy qo'shilsa chapga suriladi.",
      gen() {
        const start = ri(-20, 5);
        const delta = ri(-9, 9) || 4;
        return {
          prompt: `<b>${start} + (${delta})</b> ni hisoblang.`,
          answer: `${start + delta}`,
          distractors: [`${start - delta}`, `${-start - delta}`, `${Math.abs(start) + Math.abs(delta)}`],
          hint: "Ishoraga e'tibor bering.",
          steps: [`${start} + (${delta}) = ${start + delta}`],
        };
      },
    },
    {
      id: "arith.negMul",
      title: "Ishoralar qoidasi",
      tagline: "Manfiy × manfiy",
      theory: "Ikki manfiy sonning ko'paytmasi musbat, har xil ishorali ko'paytma manfiy.",
      gen() {
        const a = ri(2, 12);
        const b = ri(2, 12);
        const s1 = pick([1, -1]);
        const s2 = pick([1, -1]);
        const val = a * b * s1 * s2;
        return {
          prompt: `<b>(${s1 < 0 ? "−" : ""}${a}) · (${s2 < 0 ? "−" : ""}${b})</b> ni hisoblang.`,
          answer: `${val}`,
          distractors: [`${-val}`, `${a + b}`, `${val + a}`],
          hint: "Ishoralarni alohida ko'paytiring.",
          steps: [
            `${a} · ${b} = ${a * b}`,
            s1 * s2 > 0 ? "Ikkala ishora bir xil → natija musbat" : "Ishoralar har xil → natija manfiy",
            `Javob: ${val}`,
          ],
        };
      },
    },
    {
      id: "arith.fracSub",
      title: "Kasrlarni ayirish",
      tagline: "Bir xil maxraj",
      theory: "Bir xil maxrajli kasrlarda suratlar ayiriladi: a/b − c/b = (a−c)/b.",
      gen() {
        const b = pick([5, 6, 8, 9, 10]);
        const a = ri(3, b - 1);
        const c = ri(1, a - 1);
        const num = a - c;
        const gcd = (x, y) => (y ? gcd(y, x % y) : x);
        const g = gcd(num, b);
        return {
          prompt: `<b>${a}/${b} − ${c}/${b}</b> ni hisoblang.`,
          answer: `${num / g}/${b / g}`,
          distractors: [`${a + c}/${b}`, `${num}/${b + b}`, `${num + 1}/${b}`],
          hint: "Suratlarni ayiring.",
          steps: [`(${a} − ${c})/${b} = ${num}/${b}`, `Qisqartirilgan: ${num / g}/${b / g}`],
        };
      },
    },
    {
      id: "arith.fracMul",
      title: "Kasrlarni ko'paytirish",
      tagline: "Surat × surat",
      theory: "a/b · c/d = (a·c)/(b·d).",
      gen() {
        const a = ri(1, 5);
        const b = ri(2, 7);
        const c = ri(1, 5);
        const d = ri(2, 7);
        const num = a * c;
        const den = b * d;
        const gcd = (x, y) => (y ? gcd(y, x % y) : x);
        const g = gcd(num, den);
        return {
          prompt: `<b>${a}/${b} · ${c}/${d}</b> ni hisoblang.`,
          answer: `${num / g}/${den / g}`,
          distractors: [`${a + c}/${b + d}`, `${num}/${den + 1}`, `${a * d}/${b * c}`],
          hint: "Suratni suratga, maxrajni maxrajga.",
          steps: [`${a}·${c} = ${num}, ${b}·${d} = ${den}`, `${num}/${den} = ${num / g}/${den / g}`],
        };
      },
    },
    {
      id: "arith.fracDiv",
      title: "Kasrlarni bo'lish",
      tagline: "Teskari kasrga ko'paytirish",
      theory: "a/b ÷ c/d = a/b · d/c.",
      gen() {
        const a = ri(1, 5);
        const b = ri(2, 7);
        const c = ri(1, 5);
        const d = ri(2, 7);
        const num = a * d;
        const den = b * c;
        const gcd = (x, y) => (y ? gcd(y, x % y) : x);
        const g = gcd(num, den);
        return {
          prompt: `<b>${a}/${b} ÷ ${c}/${d}</b> ni hisoblang.`,
          answer: `${num / g}/${den / g}`,
          distractors: [`${a * c}/${b * d}`, `${num}/${den + 1}`, `${b * c}/${a * d}`],
          hint: "Ikkinchi kasrni teskari qilib ko'paytiring.",
          steps: [`${a}/${b} · ${d}/${c} = ${num}/${den}`, `= ${num / g}/${den / g}`],
        };
      },
    },
    {
      id: "arith.decAdd",
      title: "O'nlik kasrlarni qo'shish",
      tagline: "Vergul ostida vergul",
      theory: "O'nlik kasrlarni qo'shishda vergullar bir ustunga tushiriladi.",
      gen() {
        const a = (ri(15, 90) / 10).toFixed(1);
        const b = (ri(11, 80) / 10).toFixed(1);
        const val = Number(a) + Number(b);
        return {
          prompt: `<b>${a} + ${b}</b> ni hisoblang.`,
          answer: `${fmt(Math.round(val * 100) / 100)}`,
          distractors: [`${fmt(Math.round(val * 10 * 100) / 100)}`, `${fmt(Math.round((Number(a) - Number(b)) * 100) / 100)}`, `${fmt(Math.round(val + 1))}`],
          hint: "Vergullarni bir ustunga tushiring.",
          steps: [`${a} + ${b} = ${fmt(Math.round(val * 100) / 100)}`],
        };
      },
    },
    {
      id: "arith.decSub",
      title: "O'nlik kasrlarni ayirish",
      tagline: "Vergul ostida vergul",
      theory: "Ayirishda ham vergullar bir ustunga tushiriladi.",
      gen() {
        const a = (ri(50, 95) / 10).toFixed(1);
        const b = (ri(10, 40) / 10).toFixed(1);
        const val = Number(a) - Number(b);
        return {
          prompt: `<b>${a} − ${b}</b> ni hisoblang.`,
          answer: `${fmt(Math.round(val * 100) / 100)}`,
          distractors: [`${fmt(Math.round((Number(a) + Number(b)) * 100) / 100)}`, `${fmt(Math.round(val * 10 * 100) / 100)}`, `${fmt(Math.round(val + 1))}`],
          hint: "Vergullarni bir ustunga tushiring.",
          steps: [`${a} − ${b} = ${fmt(Math.round(val * 100) / 100)}`],
        };
      },
    },
    {
      id: "arith.decDiv",
      title: "O'nlik kasrni bo'lish",
      tagline: "Vergulni surish",
      theory: "Bo'linuvchi va bo'luvchida vergul bir xil songa suriladi.",
      gen() {
        const q = ri(2, 15);
        const d = 10;
        const a = q * d;
        return {
          prompt: `<b>${a} ÷ 10</b> ni hisoblang.`,
          answer: `${fmt(Math.round((a / 10) * 10) / 10)}`,
          distractors: [`${a * 10}`, `${q + 1}`, `${fmt(Math.round(q / 10 * 100) / 100)}`],
          hint: "10 ga bo'lishda vergul bir xona chapga suriladi.",
          steps: [`${a} ÷ 10 = ${fmt(Math.round((a / 10) * 10) / 10)}`],
        };
      },
    },
    {
      id: "arith.roundTenth",
      title: "O'ndan birlikkacha yaxlitlash",
      tagline: "Birinchi raqamga qarash",
      theory: "O'ndan birlikkacha yaxlitlashda yuzdan birlik raqamiga qaraladi.",
      gen() {
        const int = ri(2, 40);
        const frac = ri(11, 99);
        const val = Number(`${int}.${frac}`);
        const rounded = Math.round(val * 10) / 10;
        return {
          prompt: `<b>${int},${frac}</b> sonini o'ndan birlikkacha yaxlitlang.`,
          answer: `${fmt(rounded)}`,
          distractors: [`${fmt(Math.floor(val * 10) / 10)}`, `${fmt(Math.ceil(val * 10) / 10)}`, `${int}`],
          hint: "Yuzdan birlik raqami 5 dan katta bo'lsa, yuqoriga.",
          steps: [`${int},${frac} ≈ ${fmt(rounded)}`],
        };
      },
    },
    {
      id: "arith.compareDec",
      title: "O'nliklarni taqqoslash",
      tagline: "Xona bo'yicha",
      theory: "O'nlik kasrlarni taqqoslashda avval butun qism, keyin o'ndan birlik, yuzdan birlik solishtiriladi.",
      gen() {
        const a = Number(`${ri(1, 9)}.${ri(10, 99)}`);
        const b = Number(`${ri(1, 9)}.${ri(10, 99)}`);
        const big = Math.max(a, b);
        return {
          prompt: `Qaysi son katta: <b>${String(a).replace(".", ",")}</b> yoki <b>${String(b).replace(".", ",")}</b>?`,
          answer: `${String(big).replace(".", ",")}`,
          distractors: [`${String(Math.min(a, b)).replace(".", ",")}`, "teng", "aniqlab bo'lmaydi"],
          hint: "Butun qismdan boshlab solishtiring.",
          steps: [`${String(a).replace(".", ",")} va ${String(b).replace(".", ",")}`, `Kattasi: ${String(big).replace(".", ",")}`],
        };
      },
    },
    {
      id: "arith.fracToPercent",
      title: "Kasrni foizga aylantirish",
      tagline: "· 100%",
      theory: "Kasrni foizga aylantirish uchun 100 ga ko'paytiriladi.",
      gen() {
        const cases = [
          { f: "1/4", p: 25 },
          { f: "1/2", p: 50 },
          { f: "3/4", p: 75 },
          { f: "1/5", p: 20 },
          { f: "2/5", p: 40 },
          { f: "1/10", p: 10 },
        ];
        const c = pick(cases);
        return {
          prompt: `<b>${c.f}</b> kasrni foizda ifodalang.`,
          answer: `${c.p}%`,
          distractors: [`${c.p / 2}%`, `${c.p + 10}%`, `${100 - c.p}%`],
          hint: "Kasrni 100 ga ko'paytiring.",
          steps: [`${c.f} · 100 = ${c.p}`, `Javob: ${c.p}%`],
        };
      },
    },
    {
      id: "arith.decToPercent",
      title: "O'nlikni foizga aylantirish",
      tagline: "· 100%",
      theory: "O'nlik kasrni foizga aylantirish uchun 100 ga ko'paytiriladi.",
      gen() {
        const d = pick([0.2, 0.25, 0.4, 0.5, 0.75, 0.8]);
        const p = Math.round(d * 100);
        return {
          prompt: `<b>${String(d).replace(".", ",")}</b> sonini foizda ifodalang.`,
          answer: `${p}%`,
          distractors: [`${p / 10}%`, `${p * 2}%`, `${100 - p}%`],
          hint: "100 ga ko'paytiring.",
          steps: [`${String(d).replace(".", ",")} · 100 = ${p}`, `Javob: ${p}%`],
        };
      },
    },
    {
      id: "arith.ratioSimplify",
      title: "Nisbatni qisqartirish",
      tagline: "EKUB ga bo'lish",
      theory: "Nisbatning ikkala hadini EKUB ga bo'lib qisqartiriladi.",
      gen() {
        const k = ri(2, 9);
        const a = ri(2, 6);
        const b = ri(2, 6);
        return {
          prompt: `<b>${a * k} : ${b * k}</b> nisbatni qisqartiring.`,
          answer: `${a} : ${b}`,
          distractors: [`${a * k} : ${b}`, `${a} : ${b * k}`, `${b} : ${a}`],
          hint: "Ikkala sonni EKUB ga bo'ling.",
          steps: [`EKUB = ${k}`, `${a * k} : ${b * k} = ${a} : ${b}`],
        };
      },
    },
    {
      id: "arith.primeCheck",
      title: "Tub son",
      tagline: "Bo'luvchilar soni",
      theory: "Tub son faqat 1 ga va o'ziga bo'linadi.",
      gen() {
        const primes = [13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
        const comps = [21, 27, 33, 35, 39, 45, 49, 51, 55, 57];
        const isPrime = pick([true, false]);
        const n = isPrime ? pick(primes) : pick(comps);
        return {
          prompt: `<b>${n}</b> soni tubmi?`,
          answer: isPrime ? "ha" : "yo'q",
          distractors: [isPrime ? "yo'q" : "ha", "aniqlab bo'lmaydi", "ikkisi ham"],
          hint: "1 va o'zidan boshqa bo'luvchisi bormi?",
          steps: [
            isPrime ? `${n} ning bo'luvchilari: 1 va ${n}` : `${n} = ${n % 7 === 0 ? `7 · ${n / 7}` : n % 5 === 0 ? `5 · ${n / 5}` : `3 · ${n / 3}`}`,
            `Javob: ${isPrime ? "tub" : "tub emas"}`,
          ],
        };
      },
    },
    {
      id: "arith.primeFactor",
      title: "Tub ko'paytuvchilar",
      tagline: "Sonni ajratish",
      theory: "Har qanday murakkab son tub ko'paytuvchilar ko'paytmasi sifatida yoziladi.",
      gen() {
        const a = pick([2, 3, 5]);
        const b = pick([2, 3, 5].filter((x) => x !== a));
        const exp = ri(2, 4);
        const n = Math.pow(a, exp) * b;
        return {
          prompt: `<b>${n}</b> ni tub ko'paytuvchilarga ajrating.`,
          answer: `${a}^${exp} · ${b}`,
          distractors: [`${a}^${exp + 1}`, `${a} · ${b}`, `${a}^${exp} + ${b}`],
          hint: `Avval ${a} ga bo'ling.`,
          steps: [
            `${n} ÷ ${a} = ${n / a}`,
            `Davom etib: ${a}^${exp} · ${b}`,
          ],
        };
      },
    },
    {
      id: "arith.square",
      title: "Kvadrat",
      tagline: "a²",
      theory: "a² = a · a. 10, 20, 30 … uchun oson qoida bor.",
      gen() {
        const a = ri(11, 30);
        return {
          prompt: `<b>${a}²</b> ni hisoblang.`,
          answer: `${a * a}`,
          distractors: [`${a * 2}`, `${a * a + a}`, `${a * a - 10}`],
          hint: `${a} · ${a}.`,
          steps: [`${a} · ${a} = ${a * a}`],
        };
      },
    },
    {
      id: "arith.cube",
      title: "Kub",
      tagline: "a³",
      theory: "a³ = a · a · a.",
      gen() {
        const a = ri(2, 8);
        return {
          prompt: `<b>${a}³</b> ni hisoblang.`,
          answer: `${a * a * a}`,
          distractors: [`${a * a}`, `${a * 3}`, `${a * a * a + a}`],
          hint: `${a} · ${a} · ${a}.`,
          steps: [`${a}² = ${a * a}`, `· ${a} = ${a * a * a}`],
        };
      },
    },
    {
      id: "arith.rootEstimate",
      title: "Ildizni baholash",
      tagline: "Qaysi sonlar orasida",
      theory: "√n ikki ketma-ket butun son orasida yotadi, agar n ularning kvadratlari orasida bo'lsa.",
      gen() {
        const a = ri(2, 9);
        const n = a * a + ri(1, a * 2);
        return {
          prompt: `<b>√${n}</b> qaysi ikki butun son orasida yotadi?`,
          answer: `${a} va ${a + 1}`,
          distractors: [`${a - 1} va ${a}`, `${a} va ${a + 2}`, `${a + 1} va ${a + 2}`],
          hint: `${a}² = ${a * a}, ${a + 1}² = ${(a + 1) * (a + 1)}.`,
          steps: [`${a * a} < ${n} < ${(a + 1) * (a + 1)}`, `Demak √${n} ∈ (${a}; ${a + 1})`],
        };
      },
    },
    {
      id: "arith.factorial",
      title: "Faktorial",
      tagline: "n!",
      theory: "n! = 1 · 2 · 3 · … · n. 0! = 1.",
      gen() {
        const n = ri(3, 6);
        const fact = (k) => (k <= 1 ? 1 : k * fact(k - 1));
        return {
          prompt: `<b>${n}!</b> ni hisoblang.`,
          answer: `${fact(n)}`,
          distractors: [`${fact(n) / n}`, `${n * n}`, `${fact(n) + n}`],
          hint: `1 dan ${n} gacha ko'paytiring.`,
          steps: [`${n}! = ${Array.from({ length: n }, (_, i) => i + 1).join(" · ")}`, `= ${fact(n)}`],
        };
      },
    },
    {
      id: "arith.sumN",
      title: "1 dan n gacha yig'indi",
      tagline: "n(n+1)/2",
      theory: "1 + 2 + … + n = n(n + 1)/2.",
      gen() {
        const n = ri(10, 60);
        const s = (n * (n + 1)) / 2;
        return {
          prompt: `<b>1 + 2 + … + ${n}</b> yig'indini toping.`,
          answer: `${s}`,
          distractors: [`${n * n}`, `${n * (n + 1)}`, `${s + n}`],
          hint: "n(n+1)/2.",
          steps: [`S = ${n}·${n + 1}/2`, `S = ${n * (n + 1)}/2 = ${s}`],
        };
      },
    },
    {
      id: "arith.evenOdd",
      title: "Juft va toq",
      tagline: "2 ga bo'linish",
      theory: "Juft son 2 ga qoldiqsiz bo'linadi; toq son bo'linmaydi.",
      gen() {
        const n = ri(20, 999);
        const even = n % 2 === 0;
        return {
          prompt: `<b>${n}</b> soni juftmi yoki toq?`,
          answer: even ? "juft" : "toq",
          distractors: [even ? "toq" : "juft", "ikkisi ham", "aniqlab bo'lmaydi"],
          hint: "Oxirgi raqamga qarang.",
          steps: [`Oxirgi raqam: ${n % 10}`, `${even ? "0, 2, 4, 6, 8 — juft" : "1, 3, 5, 7, 9 — toq"}`, `Javob: ${even ? "juft" : "toq"}`],
        };
      },
    },
    {
      id: "arith.divisible3",
      title: "3 ga bo'linish",
      tagline: "Raqamlar yig'indisi",
      theory: "Son 3 ga bo'linadi, agar raqamlari yig'indisi 3 ga bo'linsa.",
      gen() {
        const base = ri(10, 60) * 3;
        const n = base + pick([0, 0, 1]);
        const sum = String(n).split("").reduce((s, d) => s + Number(d), 0);
        const ok = n % 3 === 0;
        return {
          prompt: `<b>${n}</b> soni 3 ga bo'linadimi?`,
          answer: ok ? "ha" : "yo'q",
          distractors: [ok ? "yo'q" : "ha", "faqat 2 ga", "aniqlab bo'lmaydi"],
          hint: "Raqamlar yig'indisini 3 ga bo'lib ko'ring.",
          steps: [
            `Raqamlar yig'indisi = ${String(n).split("").join(" + ")} = ${sum}`,
            `${sum} ${ok ? "3 ga bo'linadi" : "3 ga bo'linmaydi"}`,
            `Javob: ${ok ? "ha" : "yo'q"}`,
          ],
        };
      },
    },
    {
      id: "arith.divisible9",
      title: "9 ga bo'linish",
      tagline: "Raqamlar yig'indisi",
      theory: "Son 9 ga bo'linadi, agar raqamlari yig'indisi 9 ga bo'linsa.",
      gen() {
        const base = ri(10, 70) * 9;
        const n = base + pick([0, 0, 2]);
        const sum = String(n).split("").reduce((s, d) => s + Number(d), 0);
        const ok = n % 9 === 0;
        return {
          prompt: `<b>${n}</b> soni 9 ga bo'linadimi?`,
          answer: ok ? "ha" : "yo'q",
          distractors: [ok ? "yo'q" : "ha", "faqat 3 ga", "aniqlab bo'lmaydi"],
          hint: "Raqamlar yig'indisi 9 ga bo'linishi kerak.",
          steps: [`Raqamlar yig'indisi = ${sum}`, `${sum} ${ok ? "9 ga bo'linadi" : "9 ga bo'linmaydi"}`],
        };
      },
    },
    {
      id: "arith.divisible5",
      title: "5 ga bo'linish",
      tagline: "Oxirgi raqam",
      theory: "Son 5 ga bo'linadi, agar oxirgi raqami 0 yoki 5 bo'lsa.",
      gen() {
        const n = ri(20, 999);
        const ok = n % 5 === 0;
        return {
          prompt: `<b>${n}</b> soni 5 ga bo'linadimi?`,
          answer: ok ? "ha" : "yo'q",
          distractors: [ok ? "yo'q" : "ha", "faqat 2 ga", "aniqlab bo'lmaydi"],
          hint: "Oxirgi raqamga qarang.",
          steps: [`Oxirgi raqam: ${n % 10}`, `${ok ? "0 yoki 5 — bo'linadi" : "0 yoki 5 emas — bo'linmaydi"}`],
        };
      },
    },
    {
      id: "arith.placeValue",
      title: "Xona qiymati",
      tagline: "Raqamning o'rni",
      theory: "Har bir xona o'z qiymatiga ega: birlik, o'nlik, yuzlik, minglik.",
      gen() {
        const n = ri(1000, 9999);
        const digits = String(n).split("");
        const idx = pick([1, 2, 3]);
        const names = { 1: "o'nlik", 2: "yuzlik", 3: "minglik" };
        return {
          prompt: `<b>${n}</b> sonida <b>${names[idx]}</b> xonasidagi raqam nechaga teng?`,
          answer: `${digits[4 - idx - 1]}`,
          distractors: digits.filter((d) => d !== digits[4 - idx - 1]).slice(0, 3),
          hint: "O'ngdan chapga sanang.",
          steps: [`${n} raqamlari: ${digits.join(", ")}`, `${names[idx]} xonasi: ${digits[4 - idx - 1]}`],
        };
      },
    },
    {
      id: "arith.expand",
      title: "Yoyilma ko'rinishi",
      tagline: "Xonalar yig'indisi",
      theory: "Son xonalar bo'yicha yoyiladi: 345 = 300 + 40 + 5.",
      gen() {
        const a = ri(1, 9);
        const b = ri(1, 9);
        const c = ri(1, 9);
        const n = a * 100 + b * 10 + c;
        return {
          prompt: `<b>${n}</b> sonini xonalar yig'indisi ko'rinishida yozing.`,
          answer: `${a * 100} + ${b * 10} + ${c}`,
          distractors: [`${a} + ${b} + ${c}`, `${a * 10} + ${b * 10} + ${c}`, `${a * 100} + ${b} + ${c}`],
          hint: "Har bir raqam o'z xonasiga ko'paytiriladi.",
          steps: [`Yuzlik: ${a}, o'nlik: ${b}, birlik: ${c}`, `= ${a * 100} + ${b * 10} + ${c}`],
        };
      },
    },
    {
      id: "arith.complement",
      title: "100 gacha to'ldirish",
      tagline: "Tez hisob usuli",
      theory: "a + b = 100 bo'lsa, b = 100 − a. Bu usul og'zaki hisoblashni tezlashtiradi.",
      gen() {
        const a = ri(11, 89);
        return {
          prompt: `<b>${a}</b> sonini 100 gacha to'ldiruvchi sonni toping.`,
          answer: `${100 - a}`,
          distractors: [`${a}`, `${100 + a}`, `${90 - a}`],
          hint: "100 − a.",
          steps: [`100 − ${a} = ${100 - a}`],
        };
      },
    },
    {
      id: "arith.estimateProduct",
      title: "Ko'paytmani baholash",
      tagline: "Yaxlitlab hisoblash",
      theory: "Baholashda sonlar qulay qiymatlarga yaxlitlanadi.",
      gen() {
        const a = ri(18, 52);
        const b = ri(18, 52);
        const est = Math.round((a * b) / 100) * 100;
        return {
          prompt: `<b>${a} · ${b}</b> ko'paytmani yuzlikkacha baholang.`,
          answer: `${est}`,
          distractors: [`${a * b}`, `${est + 100}`, `${est - 100}`],
          hint: "Sonlarni o'nlikkacha yaxlitlab ko'paytiring.",
          steps: [
            `${Math.round(a / 10) * 10} · ${Math.round(b / 10) * 10} = ${Math.round(a / 10) * 10 * Math.round(b / 10) * 10}`,
            `Yuzlikkacha: ${est}`,
          ],
        };
      },
    },
    {
      id: "arith.averageSmall",
      title: "Uch sonning o'rtasi",
      tagline: "Yig'indi ÷ 3",
      theory: "O'rta arifmetik = yig'indi / sonlar soni.",
      gen() {
        const arr = [ri(2, 40), ri(2, 40), ri(2, 40)];
        const sum = arr.reduce((a, b) => a + b, 0);
        const mean = Math.round((sum / 3) * 100) / 100;
        return {
          prompt: `<b>${arr.join(", ")}</b> sonlarining o'rtasini toping.`,
          answer: `${fmt(mean)}`,
          distractors: [`${sum}`, `${fmt(Math.round(mean) + 1)}`, `${arr[0]}`],
          hint: "Yig'indini 3 ga bo'ling.",
          steps: [`Yig'indi = ${sum}`, `${sum}/3 = ${fmt(mean)}`],
        };
      },
    },
    {
      id: "arith.restoreNumber",
      title: "Noma'lum bo'linuvchi",
      tagline: "q · b + r",
      theory: "N = b·q + r. Bo'linuvchini topish uchun bo'luvchi va natijani ko'paytirib, qoldiqni qo'shamiz.",
      gen() {
        const b = ri(3, 9);
        const q = ri(4, 20);
        const r = ri(0, b - 1);
        const N = b * q + r;
        return {
          prompt: `Bo'luvchi ${b}, natija ${q}, qoldiq ${r}. Bo'linuvchini toping.`,
          answer: `${N}`,
          distractors: [`${b * q}`, `${q + r}`, `${N + b}`],
          hint: "N = b·q + r.",
          steps: [`${b} · ${q} = ${b * q}`, `+ ${r} = ${N}`],
        };
      },
    },
    {
      id: "arith.repeatAdd",
      title: "Qo'shish orqali ko'paytirish",
      tagline: "Bir xil qo'shiluvchilar",
      theory: "Bir xil sonni bir necha marta qo'shish — ko'paytirish demakdir.",
      gen() {
        const a = ri(3, 12);
        const n = ri(3, 7);
        return {
          prompt: `<b>${Array(n).fill(a).join(" + ")}</b> yig'indini ko'paytma ko'rinishida yozing va hisoblang.`,
          answer: `${a * n}`,
          distractors: [`${a + n}`, `${a * n + a}`, `${a * n - n}`],
          hint: `${a} soni ${n} marta takrorlanadi.`,
          steps: [`${a} · ${n}`, `= ${a * n}`],
        };
      },
    },
    {
      id: "arith.missingAddend",
      title: "Noma'lum qo'shiluvchi",
      tagline: "a + x = c",
      theory: "a + x = c ⟹ x = c − a.",
      gen() {
        const a = ri(15, 80);
        const x = ri(12, 70);
        const c = a + x;
        return {
          prompt: `<b>${a} + x = ${c}</b>. x ni toping.`,
          answer: `${x}`,
          distractors: [`${c}`, `${c + a}`, `${a}`],
          hint: "x = c − a.",
          steps: [`x = ${c} − ${a}`, `x = ${x}`],
        };
      },
    },
  ],
};
