// AnormalMath — Umumiy matematika bo'limi
import { ri, pick, fmt } from "../engine.js";

export const math = {
  id: "math",
  title: "Matematika",
  glyph: "√",
  accent: "#6366f1",
  blurb: "Foiz, nisbat, tezlik, ish — kundalik hisob-kitob.",
  topics: [
    {
      id: "math.percent",
      title: "Foiz",
      tagline: "Sonning foizini topish",
      theory: "Sonning p foizi = son · p / 100.",
      gen() {
        const n = ri(8, 40) * 5;
        const p = pick([5, 10, 15, 20, 25, 40]);
        const v = (n * p) / 100;
        return {
          prompt: `<b>${n}</b> sonining <b>${p}%</b> ini toping.`,
          answer: `${fmt(v)}`,
          distractors: [`${fmt(n / p)}`, `${fmt(v + p)}`, `${fmt(v * 2)}`],
          hint: "n · p / 100.",
          steps: [`${n} · ${p} / 100`, `= ${n * p} / 100 = ${fmt(v)}`],
        };
      },
    },
    {
      id: "math.proportion",
      title: "Proporsiya",
      tagline: "Nisbat orqali qiymat",
      theory: "a/b = c/x ⟹ x = b·c/a. Proporsiyada ichkaridagilar ko'paytmasi tashqaridagilarga teng.",
      gen() {
        const a = ri(2, 6);
        const b = ri(3, 9);
        const k = a * b;
        const c = ri(2, 8) * a;
        const x = (b * c) / a;
        return {
          prompt: `Agar <b>${a}</b> kg mahsulot <b>${b}</b> kg xomashyodan chiqsa, <b>${c}</b> kg mahsulot uchun qancha xomashyo kerak?`,
          answer: `${fmt(x)} kg`,
          distractors: [`${fmt(c + b)} kg`, `${fmt(x - b)} kg`, `${fmt(x * 2)} kg`],
          hint: "a/b = c/x proporsiyasini tuzing.",
          steps: [
            `Proporsiya: ${a}/${b} = ${c}/x`,
            `x = ${b} · ${c} / ${a}`,
            `x = ${fmt(x)} kg`,
          ],
        };
      },
    },
    {
      id: "math.speed",
      title: "O'rta tezlik",
      tagline: "Masofa va vaqt",
      theory: "v = S / t. O'rta tezlik = umumiy masofa / umumiy vaqt.",
      gen() {
        const v1 = pick([40, 50, 60, 80]);
        const t1 = ri(2, 4);
        const dist = v1 * t1;
        const t2 = ri(1, 3);
        const vt = Math.round(((2 * dist) / (t1 + t2)) * 10) / 10;
        return {
          prompt: `Avtomobil <b>${v1} km/soat</b> bilan <b>${t1} soat</b>, so'ng shu masofani qaytishda <b>${t2} soat</b> yurdi. Butun yo'l uchun o'rta tezlik qanday?`,
          answer: `${fmt(vt)} km/soat`,
          distractors: [`${v1} km/soat`, `${fmt(Math.round((v1 + v1 / 2) * 10) / 10)} km/soat`, `${fmt(Math.round((dist / t1) * 10) / 10)} km/soat`],
          hint: "Umumiy masofa = 2·S, umumiy vaqt = t₁ + t₂.",
          steps: [
            `Bir tomon masofasi S = ${v1} · ${t1} = ${dist} km`,
            `Umumiy masofa = ${dist * 2} km, vaqt = ${t1 + t2} soat`,
            `v = ${dist * 2} / ${t1 + t2} = ${fmt(vt)} km/soat`,
          ],
        };
      },
    },
    {
      id: "math.work",
      title: "Ish masalasi",
      tagline: "Birgalikda bajarish",
      theory: "Bir ishni A kun, B kun bajarса, birgalikda 1/(1/A + 1/B) kunda bajariladi.",
      gen() {
        const a = pick([6, 8, 10, 12]);
        const b = pick([12, 15, 20, 24]);
        const t = (a * b) / (a + b);
        return {
          prompt: `Usta ishni <b>${a} kunda</b>, shogird <b>${b} kunda</b> bajaradi. Birgalikda necha kunda bajaradilar?`,
          answer: `${fmt(Math.round(t * 100) / 100)} kun`,
          distractors: [`${a + b} kun`, `${fmt((a + b) / 2)} kun`, `${fmt(a)} kun`],
          hint: "1/A + 1/B = 1/t.",
          steps: [
            `1/${a} + 1/${b} = ${b}/${a * b} + ${a}/${a * b} = ${a + b}/${a * b}`,
            `t = ${a * b} / ${a + b} = ${fmt(Math.round(t * 100) / 100)} kun`,
          ],
        };
      },
    },
    {
      id: "math.divisibility",
      title: "Bo'linuvchanlik",
      tagline: "Qoldiq va bo'linish",
      theory: "Son 3 ga bo'linadi, agar raqamlari yig'indisi 3 ga bo'linsa. 9 ga ham shu qoida.",
      gen() {
        const base = ri(12, 40) * 9;
        const add = ri(1, 8);
        const n = base + add;
        const rem = n % 9;
        return {
          prompt: `<b>${n}</b> sonini 9 ga bo'lganda qanday qoldiq qoladi?`,
          answer: `${rem}`,
          distractors: [`${(rem + 1) % 9}`, `${rem === 0 ? 9 : 0}`, `${(rem + 3) % 9}`],
          hint: "Raqamlar yig'indisini 9 ga bo'lib ko'ring.",
          steps: [
            `Raqamlar yig'indisi: ${String(n).split("").join(" + ")} = ${String(n).split("").reduce((s, d) => s + Number(d), 0)}`,
            `${String(n).split("").reduce((s, d) => s + Number(d), 0)} ni 9 ga bo'lamiz`,
            `Qoldiq = ${rem}`,
          ],
        };
      },
    },
    {
      id: "math.word",
      title: "Matnli masala",
      tagline: "Tenglama tuzish",
      theory: "Noma'lumni x deb belgilang, shartni tenglamaga aylantiring va yeching.",
      gen() {
        const x = ri(4, 15);
        const k = pick([2, 3, 4]);
        const add = ri(3, 12);
        const total = k * x + add;
        return {
          prompt: `Bir sondan <b>${add}</b> ayirib, natijani <b>${k}</b> ga ko'paytirsa <b>${total}</b> chiqadi. Sonni toping.`,
          answer: `${x}`,
          distractors: [`${x + k}`, `${total / k}`, `${x - 1}`],
          hint: `(${k})(x − ${add}) = ${total}.`,
          steps: [
            `Tenglama: ${k}(x − ${add}) = ${total}`,
            `x − ${add} = ${total / k}`,
            `x = ${total / k} + ${add} = ${x}`,
          ],
        };
      },
    },
    {
      id: "math.discount",
      title: "Chegirma",
      tagline: "Narxdan foiz ayirish",
      theory: "Chegirmadan keyingi narx = narx · (1 − p/100).",
      gen() {
        const price = pick([80, 120, 200, 300, 450, 600]);
        const p = pick([10, 15, 20, 25, 40]);
        const final = price * (1 - p / 100);
        return {
          prompt: `<b>${price} ming so'm</b> turgan buyumga <b>${p}%</b> chegirma qilindi. Yangi narx qancha?`,
          answer: `${fmt(final)} ming`,
          distractors: [`${fmt(price - p)} ming`, `${fmt(price * (p / 100))} ming`, `${fmt(final + 10)} ming`],
          hint: "Narx · (1 − p/100).",
          steps: [
            `Chegirma = ${price} · ${p}/100 = ${fmt((price * p) / 100)} ming`,
            `Yangi narx = ${price} − ${fmt((price * p) / 100)} = ${fmt(final)} ming`,
          ],
        };
      },
    },
    {
      id: "math.profit",
      title: "Foyda foizi",
      tagline: "(sotish − tannarx)/tannarx",
      theory: "Foyda foizi = (sotish narxi − tannarx) / tannarx · 100%.",
      gen() {
        const cost = pick([40, 50, 80, 100, 200]);
        const p = pick([10, 20, 25, 50]);
        const sell = (cost * (100 + p)) / 100;
        return {
          prompt: `Buyum <b>${cost} ming</b> ga olindi va <b>${fmt(sell)} ming</b> ga sotildi. Foyda necha foiz?`,
          answer: `${p}%`,
          distractors: [`${fmt(Math.round((sell / cost) * 100))}%`, `${fmt(sell - cost)}%`, `${p + 5}%`],
          hint: "(sotish − tannarx)/tannarx · 100%.",
          steps: [
            `Foyda = ${fmt(sell)} − ${cost} = ${fmt(sell - cost)} ming`,
            `Nisbat = ${fmt(sell - cost)}/${cost}`,
            `Foizda = ${p}%`,
          ],
        };
      },
    },
    {
      id: "math.gcd",
      title: "EKUB",
      tagline: "Eng katta umumiy bo'luvchi",
      theory: "EKUB — ikkala sonni ham bo'luvchi eng katta son. Evklid algoritmi bilan topiladi.",
      gen() {
        const k = ri(3, 12);
        const m = pick([2, 3, 5, 7]);
        const n = pick([3, 5, 7, 11]);
        const a = k * m;
        const b = k * n;
        const gcd = (x, y) => (y ? gcd(y, x % y) : x);
        const g = gcd(a, b);
        return {
          prompt: `<b>${a}</b> va <b>${b}</b> sonlarining EKUBini toping.`,
          answer: `${g}`,
          distractors: [`${k * m * n}`, `${g * 2}`, `${Math.min(a, b)}`],
          hint: "Ikkala sonni ham bo'luvchi eng katta sonni qidiring.",
          steps: [
            `${a} = ${k} · ${m}`,
            `${b} = ${k} · ${n}`,
            `Umumiy ko'paytuvchi ${k}, demak EKUB = ${g}`,
          ],
        };
      },
    },
    {
      id: "math.lcm",
      title: "EKUK",
      tagline: "Eng kichik umumiy karra",
      theory: "EKUK(a, b) = a·b / EKUB(a, b).",
      gen() {
        const k = ri(2, 8);
        const m = pick([2, 3, 5]);
        const n = pick([3, 5, 7]);
        const a = k * m;
        const b = k * n;
        const gcd = (x, y) => (y ? gcd(y, x % y) : x);
        const l = (a * b) / gcd(a, b);
        return {
          prompt: `<b>${a}</b> va <b>${b}</b> sonlarining EKUKini toping.`,
          answer: `${l}`,
          distractors: [`${a * b}`, `${gcd(a, b)}`, `${l / 2}`],
          hint: "EKUK = a·b / EKUB.",
          steps: [
            `EKUB(${a}, ${b}) = ${gcd(a, b)}`,
            `EKUK = ${a} · ${b} / ${gcd(a, b)}`,
            `= ${l}`,
          ],
        };
      },
    },
    {
      id: "math.fractions",
      title: "Kasrlar",
      tagline: "Bir xil maxrajli qo'shish",
      theory: "Maxrajlar bir xil bo'lsa, suratlar qo'shiladi, maxraj o'zgarmaydi: a/b + c/b = (a+c)/b.",
      gen() {
        const b = pick([5, 6, 7, 8, 9, 10]);
        const a = ri(1, b - 2);
        const c = ri(1, b - a - 1) || 1;
        const num = a + c;
        const gcd = (x, y) => (y ? gcd(y, x % y) : x);
        const g = gcd(num, b);
        const ans = (num / g === 1 && b / g === 1) ? "1" : `${num / g}/${b / g}`;
        return {
          prompt: `<b>${a}/${b} + ${c}/${b}</b> ni hisoblang va qisqartiring.`,
          answer: ans,
          distractors: [`${num}/${b * 2}`, `${a + c}/${b + b}`, `${num}/${b - 1}`],
          hint: "Suratlarni qo'shing, keyin qisqartiring.",
          steps: [
            `Suratlar: ${a} + ${c} = ${num}`,
            `Natija: ${num}/${b}`,
            `Qisqartirilgan: ${ans}`,
          ],
        };
      },
    },
    {
      id: "math.percentOfTotal",
      title: "Necha foiz",
      tagline: "qism / butun",
      theory: "Qism butunning necha foizini tashkil qilishi: qism/butun · 100%.",
      gen() {
        const part = ri(3, 9) * 10;
        const total = part * ri(2, 5);
        const p = Math.round((part / total) * 1000) / 10;
        return {
          prompt: `<b>${total}</b> ta o'quvchidan <b>${part}</b> tasi a'lochi. A'lochilar necha foizni tashkil qiladi?`,
          answer: `${fmt(p)}%`,
          distractors: [`${part}%`, `${fmt(Math.round((total / part) * 10) / 10)}%`, `${fmt(p + 5)}%`],
          hint: "part / total · 100%.",
          steps: [
            `Nisbat = ${part}/${total}`,
            `Foizda = ${fmt(p)}%`,
          ],
        };
      },
    },
    {
      id: "math.money",
      title: "Pul masalasi",
      tagline: "Qaytim hisobi",
      theory: "Jami xarid = son · narx. Qaytim = berilgan pul − jami xarid.",
      gen() {
        const n = ri(2, 6);
        const price = ri(3, 15) * 1000;
        const paid = (n * price) + ri(1, 9) * 1000;
        const change = paid - n * price;
        return {
          prompt: `<b>${n}</b> ta daftar, har biri <b>${price}</b> so'm. Xaridor <b>${paid}</b> so'm berdi. Qaytim qancha?`,
          answer: `${change} so'm`,
          distractors: [`${n * price} so'm`, `${paid} so'm`, `${change + price} so'm`],
          hint: "Jami xarid = son × narx; qaytim = berilgan − jami.",
          steps: [
            `Jami = ${n} · ${price} = ${n * price} so'm`,
            `Qaytim = ${paid} − ${n * price} = ${change} so'm`,
          ],
        };
      },
    },
    {
      id: "math.distance",
      title: "Masofa",
      tagline: "S = v · t",
      theory: "Masofa = tezlik × vaqt. Tezlik = masofa/vaqt, vaqt = masofa/tezlik.",
      gen() {
        const v = pick([40, 50, 60, 70, 80, 90]);
        const t = ri(2, 6);
        const S = v * t;
        return {
          prompt: `Avtomobil <b>${v} km/soat</b> tezlik bilan <b>${t} soat</b> yurdi. Qancha masofa bosdi?`,
          answer: `${S} km`,
          distractors: [`${v + t} km`, `${Math.round(v / t)} km`, `${S + v} km`],
          hint: "S = v · t.",
          steps: [`S = ${v} · ${t}`, `S = ${S} km`],
        };
      },
    },
    {
      id: "math.inversePercent",
      title: "Sonni topish",
      tagline: "Foizdan asl son",
      theory: "Agar sonning p% i = y bo'lsa, son = y · 100/p.",
      gen() {
        const base = ri(4, 20) * 10;
        const p = pick([5, 10, 20, 25, 50]);
        const y = (base * p) / 100;
        return {
          prompt: `Sonning <b>${p}%</b> i <b>${fmt(y)}</b> ga teng. Sonning o'zini toping.`,
          answer: `${base}`,
          distractors: [`${fmt(y * 2)}`, `${fmt(base * 2)}`, `${fmt(y + p)}`],
          hint: "son = y · 100 / p.",
          steps: [
            `son = ${fmt(y)} · 100 / ${p}`,
            `son = ${base}`,
          ],
        };
      },
    },
    {
      id: "math.unitPrice",
      title: "Narxni taqqoslash",
      tagline: "1 kg narxi",
      theory: "Qaysi biri arzon ekanini bilish uchun 1 birlik narxini taqqoslang: narx / miqdor.",
      gen() {
        const p1 = ri(3, 12) * 1000;
        const m1 = ri(2, 5);
        const p2 = ri(3, 12) * 1000;
        const m2 = ri(2, 5);
        const u1 = p1 / m1;
        const u2 = p2 / m2;
        return {
          prompt: `Birinchi do'konda ${m1} kg — ${p1} so'm. Ikkinchisida ${m2} kg — ${p2} so'm. Qaysi biri 1 kg hisobida arzon?`,
          answer: u1 < u2 ? `birinchi (${fmt(Math.round(u1))} so'm/kg)` : `ikkinchi (${fmt(Math.round(u2))} so'm/kg)`,
          distractors: [
            u1 < u2 ? `ikkinchi (${fmt(Math.round(u2))} so'm/kg)` : `birinchi (${fmt(Math.round(u1))} so'm/kg)`,
            "ikkisi teng",
            "aniqlab bo'lmaydi",
          ],
          hint: "Har birida narxni miqdorga bo'ling.",
          steps: [
            `Birinchi: ${p1}/${m1} = ${fmt(Math.round(u1))} so'm/kg`,
            `Ikkinchi: ${p2}/${m2} = ${fmt(Math.round(u2))} so'm/kg`,
            `Arzoni: ${u1 < u2 ? "birinchi" : "ikkinchi"}`,
          ],
        };
      },
    },
    {
      id: "math.age",
      title: "Yosh masalasi",
      tagline: "Tenglama tuzish",
      theory: "Yosh masalalarida hozirgi yosh x, k yildan keyin x + k bo'ladi.",
      gen() {
        const k = pick([6, 8, 10, 12]);
        return {
          prompt: `Ota hozir o'g'lidan <b>3 marta</b> katta. <b>${k} yildan</b> keyin esa 2 marta katta bo'ladi. O'g'il hozir necha yoshda?`,
          answer: `${k}`,
          distractors: [`${k * 2}`, `${k + 4}`, `${k - 2}`],
          hint: "3x + k = 2(x + k).",
          steps: [
            `Hozir: o'g'il x, ota 3x`,
            `${k} yildan keyin: 3x + ${k} = 2(x + ${k})`,
            `3x + ${k} = 2x + ${2 * k} ⟹ x = ${k}`,
          ],
        };
      },
    },
    {
      id: "math.percentStack",
      title: "Ketma-ket foizlar",
      tagline: "O'sish, keyin kamayish",
      theory: "p% o'sish va q% kamayish ketma-ket bo'lsa, umumiy koeffitsiyent (1+p/100)(1−q/100).",
      gen() {
        const base = pick([100, 200, 400, 500]);
        const up = pick([10, 20, 25, 50]);
        const down = pick([10, 20, 25]);
        const A = base * (1 + up / 100);
        const B = A * (1 - down / 100);
        return {
          prompt: `Son <b>${base}</b>. Avval <b>${up}%</b> ga oshirildi, keyin <b>${down}%</b> ga kamaytirildi. Oxirgi qiymat qancha?`,
          answer: `${fmt(Math.round(B * 100) / 100)}`,
          distractors: [`${base}`, `${fmt(Math.round(A * 100) / 100)}`, `${fmt(Math.round(B * 2 * 100) / 100)}`],
          hint: "Har bir foiz oldingi natijaga qo'llanadi.",
          steps: [
            `Birinchi qadam: ${base} · (1 + ${up}/100) = ${fmt(Math.round(A * 100) / 100)}`,
            `Ikkinchi qadam: ${fmt(Math.round(A * 100) / 100)} · (1 − ${down}/100)`,
            `= ${fmt(Math.round(B * 100) / 100)}`,
          ],
        };
      },
    },
    {
      id: "math.areaRect",
      title: "To'g'ri to'rtburchak yuzi",
      tagline: "S = a · b",
      theory: "To'g'ri to'rtburchak yuzi tomonlar ko'paytmasiga teng: S = a·b.",
      gen() {
        const a = ri(4, 18);
        const b = ri(3, 15);
        return {
          prompt: `To'g'ri to'rtburchakning tomonlari <b>${a} m</b> va <b>${b} m</b>. Yuzini toping.`,
          answer: `${a * b} m²`,
          distractors: [`${2 * (a + b)} m²`, `${a + b} m²`, `${a * b + a} m²`],
          hint: "S = a · b.",
          steps: [`S = ${a} · ${b}`, `S = ${a * b} m²`],
        };
      },
    },
    {
      id: "math.clockAngle",
      title: "Soat millari",
      tagline: "Soat millari orasidagi burchak",
      theory: "Soat mili 1 soatda 30° yuradi, daqiqa mili 1 daqiqada 6°.",
      gen() {
        const h = pick([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
        const angle = Math.min(30 * h, 360 - 30 * h);
        return {
          prompt: `Soat <b>${h}:00</b> ni ko'rsatganda soat va daqiqa millari orasidagi eng kichik burchak necha gradus?`,
          answer: `${angle}°`,
          distractors: [`${360 - 30 * h}°`, `${6 * h}°`, `${30}°`],
          hint: "Da minuti 12 da, soat mili 30°·h da.",
          steps: [
            `Soat mili: ${h} · 30° = ${30 * h}°`,
            `Daqiqa mili: 0°`,
            `Eng kichik burchak = ${angle}°`,
          ],
        };
      },
    },
    {
      id: "math.remainder",
      title: "Qoldiqli bo'lish",
      tagline: "N % m",
      theory: "N = m·q + r, bu yerda 0 ≤ r < m. Qoldiq — bo'linmadan keyin qolgan son.",
      gen() {
        const m = ri(4, 9);
        const q = ri(3, 12);
        const r = ri(1, m - 1);
        const N = m * q + r;
        return {
          prompt: `<b>${N}</b> ni <b>${m}</b> ga bo'lganda qanday qoldiq qoladi?`,
          answer: `${r}`,
          distractors: [`${q}`, `${m - r}`, `0`],
          hint: "N = m·q + r.",
          steps: [
            `${N} = ${m} · ${q} + ${r}`,
            `Qoldiq = ${r}`,
          ],
        };
      },
    },
    {
      id: "math.temperature",
      title: "Harorat",
      tagline: "C ↔ F",
      theory: "F = C·9/5 + 32, C = (F − 32)·5/9.",
      gen() {
        const C = ri(-10, 35);
        const F = (C * 9) / 5 + 32;
        return {
          prompt: `<b>${C}°C</b> ni Farengeytga o'giring.`,
          answer: `${fmt(F)}°F`,
          distractors: [`${fmt(C + 32)}°F`, `${fmt(C * 2)}°F`, `${fmt(F + 9)}°F`],
          hint: "F = C·9/5 + 32.",
          steps: [
            `${C} · 9/5 = ${fmt((C * 9) / 5)}`,
            `+ 32 = ${fmt(F)}°F`,
          ],
        };
      },
    },
    {
      id: "math.consecutive",
      title: "Ketma-ket sonlar",
      tagline: "n, n+1, n+2",
      theory: "Ketma-ket uchta butun son: n, n+1, n+2. Ularning yig'indisi 3n + 3.",
      gen() {
        const n = ri(5, 30);
        const S = n + (n + 1) + (n + 2);
        return {
          prompt: `Ketma-ket uchta butun sonning yig'indisi <b>${S}</b>. Eng kichigini toping.`,
          answer: `${n}`,
          distractors: [`${n + 1}`, `${n + 2}`, `${Math.round(S / 3)}`],
          hint: "O'rtadagisi S/3 ga teng.",
          steps: [
            `O'rtadagi son = ${S}/3 = ${n + 1}`,
            `Eng kichigi = ${n}`,
          ],
        };
      },
    },
    {
      id: "math.simpleInterest",
      title: "Oddiy foiz",
      tagline: "I = P·r·t",
      theory: "Oddiy foiz: I = P·r·t, bu yerda r — yillik stavka (kasrda), t — yil.",
      gen() {
        const P = pick([1000, 2000, 5000, 8000]);
        const r = pick([5, 10, 12, 20]);
        const t = ri(2, 4);
        const I = (P * r * t) / 100;
        return {
          prompt: `<b>${P}</b> so'm <b>${r}%</b> yillik oddiy foiz bilan <b>${t} yilga</b> qo'yildi. Foiz daromadi qancha?`,
          answer: `${fmt(I)} so'm`,
          distractors: [`${P + I} so'm`, `${fmt(I / t)} so'm`, `${fmt(P * r)} so'm`],
          hint: "I = P·r·t/100.",
          steps: [
            `I = ${P} · ${r}/100 · ${t}`,
            `= ${fmt(I)} so'm`,
          ],
        };
      },
    },
  ],
};
