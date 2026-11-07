// AnormalMath — Statistika bo'limi
import { ri, pick, fmt } from "../engine.js";

const sorted = (a) => a.slice().sort((x, y) => x - y);

export const statistics = {
  id: "statistics",
  title: "Statistika",
  glyph: "x̄",
  accent: "#14b8a6",
  blurb: "O'rta qiymat, mediana, moda, dispersiya, jadval.",
  topics: [
    {
      id: "statistics.mean",
      title: "O'rta arifmetik",
      tagline: "Yig'indi ÷ son",
      theory: "O'rta arifmetik = barcha qiymatlar yig'indisi / qiymatlar soni.",
      gen() {
        const n = 5;
        const arr = Array.from({ length: n }, () => ri(2, 20));
        const sum = arr.reduce((a, b) => a + b, 0);
        const mean = Math.round((sum / n) * 100) / 100;
        return {
          prompt: `Sonlar: <b>${arr.join(", ")}</b>. O'rta arifmetikni toping.`,
          answer: `${fmt(mean)}`,
          distractors: [`${fmt(Math.round(mean) + 1)}`, `${fmt(sum)}`, `${fmt(Math.round(mean * 2 * 100) / 100)}`],
          hint: "Hammasini qo'shib, sonlar soniga bo'ling.",
          steps: [
            `Yig'indi = ${arr.join(" + ")} = ${sum}`,
            `Sonlar soni = ${n}`,
            `O'rta = ${sum} / ${n} = ${fmt(mean)}`,
          ],
        };
      },
    },
    {
      id: "statistics.median",
      title: "Mediana",
      tagline: "O'rtadagi qiymat",
      theory:
        "Mediana — tartiblangan qatorning o'rtasidagi qiymat. Sonlar toq bo'lsa o'rta element, juft bo'lsa ikki o'rta elementning o'rtachasi.",
      gen() {
        const arr = [ri(1, 15), ri(16, 30), ri(31, 45), ri(46, 60), ri(61, 80)];
        const s = sorted(arr);
        const med = s[2];
        return {
          prompt: `Sonlar: <b>${arr.join(", ")}</b>. Medianani toping.`,
          answer: `${med}`,
          distractors: [`${s[1]}`, `${s[3]}`, `${s[4]}`],
          hint: "Avval sonlarni o'sish tartibida tering.",
          steps: [
            `Tartiblangan: ${s.join(", ")}`,
            `5 ta son — o'rtadagisi uchinchisi`,
            `Mediana = ${med}`,
          ],
        };
      },
    },
    {
      id: "statistics.mode",
      title: "Moda",
      tagline: "Eng ko'p uchraydigan qiymat",
      theory: "Moda — to'plamda eng ko'p uchraydigan qiymat.",
      gen() {
        const mode = ri(3, 15);
        const others = [ri(1, 20), ri(21, 40), ri(41, 60)];
        const arr = [mode, mode, mode, ...others];
        const mixed = arr.sort(() => Math.random() - 0.5);
        return {
          prompt: `Sonlar: <b>${mixed.join(", ")}</b>. Modani toping.`,
          answer: `${mode}`,
          distractors: [`${others[0]}`, `${others[1]}`, `${others[2]}`],
          hint: "Qaysi son eng ko'p takrorlangan?",
          steps: [
            `Har bir sonni sanaymiz`,
            `${mode} — uch marta uchraydi, boshqalar bir marta`,
            `Moda = ${mode}`,
          ],
        };
      },
    },
    {
      id: "statistics.variance",
      title: "Dispersiya",
      tagline: "Chetlanish kvadratlarining o'rtachasi",
      theory:
        "Dispersiya D = Σ(xᵢ − x̄)² / n. Avval o'rtani toping, so'ng har bir chetlanishni kvadratga ko'taring.",
      gen() {
        const arr = Array.from({ length: 5 }, () => ri(2, 20));
        const sum = arr.reduce((a, b) => a + b, 0);
        const mean = sum / arr.length;
        const devs = arr.map((v) => v - mean);
        const squares = devs.map((d) => Math.round(d * d * 100) / 100);
        const variance = Math.round((squares.reduce((a, b) => a + b, 0) / arr.length) * 100) / 100;
        return {
          prompt: `Sonlar: <b>${arr.join(", ")}</b>. Dispersiyani toping.`,
          answer: `${fmt(variance)}`,
          distractors: [`${fmt(variance + 1)}`, `${fmt(Math.round(variance * 0.5 * 100) / 100)}`, `${fmt(Math.round(mean * 100) / 100)}`],
          hint: "D = Σ(xᵢ − x̄)² / n. Avval o'rtani toping.",
          steps: [
            `Yig'indi = ${sum}, o'rta x̄ = ${fmt(Math.round(mean * 100) / 100)}`,
            `Chetlanishlar: ${arr.map((v, i) => fmt(Math.round((v - mean) * 100) / 100)).join(", ")}`,
            `Kvadratlar yig'indisi = ${fmt(Math.round(squares.reduce((a, b) => a + b, 0) * 100) / 100)}`,
            `D = ${fmt(Math.round(squares.reduce((a, b) => a + b, 0) * 100) / 100)} / 5 = ${fmt(variance)}`,
          ],
        };
      },
    },
    {
      id: "statistics.table",
      title: "Jadval bilan ishlash",
      tagline: "Ulush va foiz",
      theory: "Jadvaldagi qiymatni umumiy yig'indiga bo'lib, 100 ga ko'paytirsangiz foiz chiqadi.",
      gen() {
        const a = ri(20, 60);
        const b = ri(15, 40);
        const c = ri(10, 30);
        const total = a + b + c;
        const pct = Math.round((a / total) * 1000) / 10;
        return {
          prompt: `Jadval: A = ${a}, B = ${b}, C = ${c}. <b>A</b> ning umumiy yig'indidagi ulushi necha foiz?`,
          answer: `${fmt(pct)}%`,
          distractors: [`${fmt(Math.round((b / total) * 1000) / 10)}%`, `${a}%`, `${fmt(Math.round(pct) + 7)}%`],
          hint: "A / (A + B + C) · 100%.",
          steps: [
            `Umumiy yig'indi = ${a} + ${b} + ${c} = ${total}`,
            `Ulush = ${a} / ${total} = ${fmt(Math.round((a / total) * 1000) / 1000)}`,
            `Foizda = ${fmt(pct)}%`,
          ],
        };
      },
    },
    {
      id: "statistics.range",
      title: "Qamrov",
      tagline: "Eng katta − eng kichik",
      theory: "Qamrov (range) = eng katta qiymat − eng kichik qiymat.",
      gen() {
        const arr = Array.from({ length: 6 }, () => ri(2, 45));
        const mx = Math.max(...arr);
        const mn = Math.min(...arr);
        return {
          prompt: `Sonlar: <b>${arr.join(", ")}</b>. Qamrovni toping.`,
          answer: `${mx - mn}`,
          distractors: [`${mx}`, `${mn}`, `${mx + mn}`],
          hint: "Eng kattasidan eng kichigini ayiring.",
          steps: [`Eng katta = ${mx}, eng kichik = ${mn}`, `Qamrov = ${mx} − ${mn} = ${mx - mn}`],
        };
      },
    },
    {
      id: "statistics.medianEven",
      title: "Mediana (juft son)",
      tagline: "Ikki o'rta elementning o'rtachasi",
      theory: "Sonlar soni juft bo'lsa, mediana ikki o'rta elementning o'rtacha qiymati bo'ladi.",
      gen() {
        const arr = Array.from({ length: 6 }, () => ri(1, 40));
        const s = sorted(arr);
        const med = (s[2] + s[3]) / 2;
        return {
          prompt: `Sonlar: <b>${arr.join(", ")}</b>. Medianani toping.`,
          answer: `${fmt(med)}`,
          distractors: [`${s[2]}`, `${s[3]}`, `${fmt(Math.round(arr.reduce((a, b) => a + b, 0) / 6))}`],
          hint: "Tartiblang, keyin 3- va 4-elementning o'rtasini oling.",
          steps: [
            `Tartiblangan: ${s.join(", ")}`,
            `O'rta elementlar: ${s[2]} va ${s[3]}`,
            `Mediana = (${s[2]} + ${s[3]})/2 = ${fmt(med)}`,
          ],
        };
      },
    },
    {
      id: "statistics.weightedMean",
      title: "Vaznli o'rta",
      tagline: "Har xil og'irlikdagi qiymatlar",
      theory: "Vaznli o'rta = Σ(qiymat · vazn) / Σ(vazn).",
      gen() {
        const v1 = ri(3, 5);
        const c1 = ri(2, 5);
        const v2 = ri(3, 5);
        const c2 = ri(2, 5);
        const mean = (v1 * c1 + v2 * c2) / (c1 + c2);
        return {
          prompt: `<b>${v1}</b> baho ${c1} marta, <b>${v2}</b> baho ${c2} marta olindi. O'rtacha bahoni toping.`,
          answer: `${fmt(Math.round(mean * 100) / 100)}`,
          distractors: [`${fmt(Math.round((v1 + v2) / 2 * 100) / 100)}`, `${v1 + v2}`, `${fmt(Math.round(mean * 2 * 100) / 100)}`],
          hint: "Σ(qiymat·vazn) / Σ(vazn).",
          steps: [
            `Yig'indi = ${v1}·${c1} + ${v2}·${c2} = ${v1 * c1 + v2 * c2}`,
            `Jami son = ${c1} + ${c2} = ${c1 + c2}`,
            `O'rta = ${fmt(Math.round(mean * 100) / 100)}`,
          ],
        };
      },
    },
    {
      id: "statistics.stddev",
      title: "Standart chetlanish",
      tagline: "σ = √D",
      theory: "Standart chetlanish — dispersiyaning kvadrat ildizi: σ = √D.",
      gen() {
        const m = ri(6, 14);
        const k = pick([1, 2]);
        const arr = [m - k, m - k, m + k, m + k];
        const sigma = k;
        return {
          prompt: `Sonlar: <b>${arr.join(", ")}</b>. Standart chetlanishni toping.`,
          answer: `${sigma}`,
          distractors: [`${sigma * 2}`, `${m}`, `${fmt(Math.round(sigma / 2 * 100) / 100)}`],
          hint: "Avval dispersiyani, keyin ildizini oling.",
          steps: [
            `O'rta = ${m}`,
            `Chetlanishlar: ±${k}, kvadratlar: ${k * k} (to'rttasi)`,
            `D = ${k * k}, σ = √${k * k} = ${sigma}`,
          ],
        };
      },
    },
    {
      id: "statistics.freqTable",
      title: "Chastota jadvali",
      tagline: "Jadvaldan o'rta qiymat",
      theory: "Chastota jadvalida o'rta = Σ(qiymat·chastota) / Σ(chastota).",
      gen() {
        const v = [1, 2, 3, 4, 5];
        const c = v.map(() => ri(1, 6));
        const total = c.reduce((a, b) => a + b, 0);
        const sum = v.reduce((s, x, i) => s + x * c[i], 0);
        const mean = sum / total;
        return {
          prompt: `Jadval: qiymat ${v.join(", ")}; chastota ${c.join(", ")}. O'rta qiymatni toping.`,
          answer: `${fmt(Math.round(mean * 100) / 100)}`,
          distractors: [`${fmt(Math.round((total / 5) * 100) / 100)}`, `${sum}`, `${fmt(Math.round(mean * 2 * 100) / 100)}`],
          hint: "Har qiymatni chastotasiga ko'paytirib qo'shing.",
          steps: [
            `Yig'indi = ${v.map((x, i) => `${x}·${c[i]}`).join(" + ")} = ${sum}`,
            `Jami chastota = ${total}`,
            `O'rta = ${fmt(Math.round(mean * 100) / 100)}`,
          ],
        };
      },
    },
    {
      id: "statistics.histogram",
      title: "Diagramma",
      tagline: "Ustunlarni o'qish",
      theory: "Ustunli diagrammada har ustunning balandligi o'sha toifadagi sonni ko'rsatadi.",
      gen() {
        const a = ri(8, 30);
        const b = ri(8, 30);
        const c = ri(8, 30);
        const total = a + b + c;
        return {
          prompt: `Diagrammada uchta ustun bor: A = ${a}, B = ${b}, C = ${c}. B ustuni umumiy yig'indining necha foizini tashkil qiladi?`,
          answer: `${fmt(Math.round((b / total) * 1000) / 10)}%`,
          distractors: [`${b}%`, `${fmt(Math.round((a / total) * 1000) / 10)}%`, `${fmt(Math.round((c / total) * 1000) / 10)}%`],
          hint: "b / (a + b + c) · 100%.",
          steps: [
            `Umumiy = ${a} + ${b} + ${c} = ${total}`,
            `Ulush = ${b}/${total}`,
            `Foizda = ${fmt(Math.round((b / total) * 1000) / 10)}%`,
          ],
        };
      },
    },
    {
      id: "statistics.zscore",
      title: "Z-ball",
      tagline: "z = (x − μ)/σ",
      theory: "z = (x − μ)/σ — qiymat o'rtadan necha standart chetlanish uzoqda ekanini ko'rsatadi.",
      gen() {
        const mu = ri(40, 80);
        const sigma = pick([4, 5, 8, 10]);
        const z = pick([1, 2, -1, 1.5, -2]);
        const x = mu + z * sigma;
        return {
          prompt: `O'rtacha μ = ${mu}, standart chetlanish σ = ${sigma}. x = ${x} qiymatning z-bali nechaga teng?`,
          answer: `${fmt(z)}`,
          distractors: [`${fmt(-z)}`, `${fmt(z + 1)}`, `${fmt(Math.round(z * 2 * 100) / 100)}`],
          hint: "z = (x − μ)/σ.",
          steps: [
            `x − μ = ${x} − ${mu} = ${x - mu}`,
            `z = ${x - mu} / ${sigma}`,
            `z = ${fmt(z)}`,
          ],
        };
      },
    },
    {
      id: "statistics.percentIncrease",
      title: "O'sish foizi",
      tagline: "(yangi − eski)/eski",
      theory: "Foiz o'zgarish = (yangi − eski) / eski · 100%.",
      gen() {
        const old = pick([40, 50, 80, 120, 200]);
        const p = pick([10, 20, 25, 50]);
        const now = (old * (100 + p)) / 100;
        return {
          prompt: `Ko'rsatkich <b>${old}</b> dan <b>${fmt(now)}</b> ga oshdi. O'sish necha foiz?`,
          answer: `${p}%`,
          distractors: [`${fmt(Math.round((now / old) * 100))}%`, `${fmt(now - old)}%`, `${p + 5}%`],
          hint: "(yangi − eski)/eski · 100%.",
          steps: [
            `O'zgarish = ${fmt(now)} − ${old} = ${fmt(now - old)}`,
            `Nisbat = ${fmt(now - old)}/${old}`,
            `Foizda = ${p}%`,
          ],
        };
      },
    },
    {
      id: "statistics.iqr",
      title: "Kvartillar orasidagi oraliq",
      tagline: "IQR = Q₃ − Q₁",
      theory:
        "Tartiblangan 8 ta sonni ikkiga bo'lamiz: Q₁ — pastki to'rttaning medianasi, Q₃ — yuqori to'rttaning medianasi. IQR = Q₃ − Q₁.",
      gen() {
        const arr = Array.from({ length: 8 }, () => ri(1, 30)).sort((a, b) => a - b);
        const q1 = (arr[1] + arr[2]) / 2;
        const q3 = (arr[5] + arr[6]) / 2;
        const iqr = q3 - q1;
        return {
          prompt: `Sonlar: <b>${arr.join(", ")}</b>. Kvartillar orasidagi oraliqni (IQR) toping.`,
          answer: `${fmt(iqr)}`,
          distractors: [`${fmt(q3)}`, `${fmt(iqr * 2)}`, `${fmt(q3 + q1)}`],
          hint: "8 ta sonni ikki yarimga bo'ling, har yarimning medianasini oling.",
          steps: [
            `Pastki yarim: ${arr.slice(0, 4).join(", ")} → Q₁ = ${fmt(q1)}`,
            `Yuqori yarim: ${arr.slice(4).join(", ")} → Q₃ = ${fmt(q3)}`,
            `IQR = ${fmt(q3)} − ${fmt(q1)} = ${fmt(iqr)}`,
          ],
        };
      },
    },
    {
      id: "statistics.modeTable",
      title: "Moda (jadvaldan)",
      tagline: "Eng katta chastota",
      theory: "Chastota jadvalida eng katta chastotaga ega qiymat — moda.",
      gen() {
        const v = [1, 2, 3, 4];
        const c = [ri(1, 4), ri(1, 4), ri(1, 4), 6];
        const shuffled = v.map((x, i) => ({ v: x, c: c[i] })).sort(() => Math.random() - 0.5);
        const modeRow = shuffled.find((r) => r.c === 6);
        return {
          prompt: `Jadval: qiymat ${shuffled.map((r) => r.v).join(", ")}; chastota ${shuffled.map((r) => r.c).join(", ")}. Modani toping.`,
          answer: `${modeRow.v}`,
          distractors: shuffled.filter((r) => r.c !== 6).map((r) => `${r.v}`),
          hint: "Eng katta chastotani qidiring.",
          steps: [
            `Eng katta chastota: 6`,
            `U ${modeRow.v} qiymatiga tegishli`,
            `Moda = ${modeRow.v}`,
          ],
        };
      },
    },
    {
      id: "statistics.sumFromMean",
      title: "Yig'indini tiklash",
      tagline: "Σx = n · x̄",
      theory: "O'rta arifmetik x̄ = Σx/n, demak yig'indi Σx = n·x̄.",
      gen() {
        const n = ri(4, 12);
        const mean = ri(6, 25);
        const sum = n * mean;
        return {
          prompt: `<b>${n}</b> ta sonning o'rta arifmetigi <b>${mean}</b>. Ularning yig'indisi nechaga teng?`,
          answer: `${sum}`,
          distractors: [`${mean}`, `${n + mean}`, `${sum + n}`],
          hint: "Σx = n · x̄.",
          steps: [`Σx = ${n} · ${mean}`, `Σx = ${sum}`],
        };
      },
    },
    {
      id: "statistics.newMean",
      title: "Yangi o'rta",
      tagline: "Qiymat qo'shilganda",
      theory: "n ta sonning o'rtasi m bo'lsa, yangi x qo'shilganda o'rta = (n·m + x)/(n + 1).",
      gen() {
        const n = ri(4, 8);
        const mean = ri(5, 20);
        const x = ri(1, 40);
        const newMean = (n * mean + x) / (n + 1);
        return {
          prompt: `<b>${n}</b> ta sonning o'rta arifmetigi <b>${mean}</b>. Unga <b>${x}</b> soni qo'shildi. Yangi o'rta arifmetik nechaga teng?`,
          answer: `${fmt(Math.round(newMean * 100) / 100)}`,
          distractors: [`${mean}`, `${fmt(Math.round(((n * mean + x) / n) * 100) / 100)}`, `${fmt(Math.round(((mean + x) / 2) * 100) / 100)}`],
          hint: "Yig'indi = n·m, keyin (yig'indi + x)/(n+1).",
          steps: [
            `Yig'indi = ${n} · ${mean} = ${n * mean}`,
            `Yangi yig'indi = ${n * mean + x}, sonlar soni = ${n + 1}`,
            `Yangi o'rta = ${fmt(Math.round(newMean * 100) / 100)}`,
          ],
        };
      },
    },
    {
      id: "statistics.normalRule",
      title: "Normal taqsimot qoidasi",
      tagline: "68 — 95 — 99,7",
      theory:
        "Normal taqsimotda qiymatlarning ≈68% i μ ± σ ichida, ≈95% i μ ± 2σ ichida yotadi.",
      gen() {
        const mode = pick(["outside1", "inside2"]);
        return {
          prompt:
            mode === "outside1"
              ? `Normal taqsimotda qiymatlarning taxminan necha foizi o'rtachadan <b>1 standart chetlanishdan uzoqda</b> yotadi?`
              : `Normal taqsimotda qiymatlarning taxminan necha foizi o'rtachadan <b>2 standart chetlanish ichida</b> yotadi?`,
          answer: mode === "outside1" ? "32%" : "95%",
          distractors: mode === "outside1" ? ["68%", "5%", "16%"] : ["68%", "99,7%", "50%"],
          hint: "68–95–99,7 qoidasi.",
          steps:
            mode === "outside1"
              ? ["μ ± σ ichida ≈68%", "Tashqarida = 100% − 68% = 32%"]
              : ["μ ± 2σ ichida ≈95%"],
        };
      },
    },
    {
      id: "statistics.outlier",
      title: "Chetlanish (outlier)",
      tagline: "1,5 · IQR qoidasi",
      theory:
        "Qiymat Q₁ − 1,5·IQR dan kichik yoki Q₃ + 1,5·IQR dan katta bo'lsa — outlier hisoblanadi.",
      gen() {
        const q1 = ri(10, 30);
        const iqr = ri(4, 12);
        const q3 = q1 + iqr;
        const highFence = q3 + 1.5 * iqr;
        const val = Math.ceil(highFence) + ri(1, 8);
        return {
          prompt: `Q₁ = ${q1}, Q₃ = ${q3}. Qaysi qiymat <b>outlier</b> hisoblanadi?`,
          answer: `${val}`,
          distractors: [`${q3}`, `${q1}`, `${q3 + iqr}`],
          hint: "Yuqori chegara = Q₃ + 1,5·IQR.",
          steps: [
            `IQR = ${q3} − ${q1} = ${iqr}`,
            `Yuqori chegara = ${q3} + 1,5·${iqr} = ${highFence}`,
            `${val} > ${highFence}, demak outlier`,
          ],
        };
      },
    },
    {
      id: "statistics.meanShift",
      title: "O'rta qanday o'zgaradi",
      tagline: "Har bir qiymatga k qo'shilsa",
      theory: "Har bir qiymatga k qo'shilsa, o'rta ham k ga oshadi; ko'paytirilsa, o'rta ham shuncha marta oshadi.",
      gen() {
        const mean = ri(10, 40);
        const k = ri(3, 15);
        return {
          prompt: `To'plamning o'rta arifmetigi <b>${mean}</b>. Har bir qiymatga <b>${k}</b> qo'shildi. Yangi o'rta nechaga teng?`,
          answer: `${mean + k}`,
          distractors: [`${mean}`, `${mean * k}`, `${mean - k}`],
          hint: "Siljish o'rtaga ham bir xil ta'sir qiladi.",
          steps: [`Yangi o'rta = ${mean} + ${k}`, `= ${mean + k}`],
        };
      },
    },
    {
      id: "statistics.barTotal",
      title: "Diagramma yig'indisi",
      tagline: "Ustunlar yig'indisi",
      theory: "Ustunli diagrammadagi barcha ustunlarning balandligi yig'indisi — umumiy son.",
      gen() {
        const bars = Array.from({ length: 4 }, () => ri(5, 30));
        const total = bars.reduce((a, b) => a + b, 0);
        return {
          prompt: `Diagrammada to'rt ustun bor: ${bars.join(", ")}. Umumiy yig'indi qancha?`,
          answer: `${total}`,
          distractors: [`${Math.max(...bars)}`, `${Math.round(total / 4)}`, `${total - Math.min(...bars)}`],
          hint: "Barcha ustunlarni qo'shing.",
          steps: [`${bars.join(" + ")} = ${total}`],
        };
      },
    },
    {
      id: "statistics.varianceTable",
      title: "Dispersiya (jadvaldan)",
      tagline: "Chastotalar bilan",
      theory: "D = Σ cᵢ(xᵢ − x̄)² / Σ cᵢ, bu yerda cᵢ — chastota.",
      gen() {
        const vals = [2, 4, 6];
        const counts = [ri(1, 3), ri(1, 3), ri(1, 3)];
        const totalN = counts.reduce((a, b) => a + b, 0);
        const sum = vals.reduce((s, v, i) => s + v * counts[i], 0);
        const mean = sum / totalN;
        const variance =
          vals.reduce((s, v, i) => s + counts[i] * (v - mean) ** 2, 0) / totalN;
        return {
          prompt: `Jadval: qiymat 2, 4, 6; chastota ${counts.join(", ")}. Dispersiyani toping.`,
          answer: `${fmt(Math.round(variance * 100) / 100)}`,
          distractors: [`${fmt(Math.round(mean * 100) / 100)}`, `${fmt(Math.round(variance * 2 * 100) / 100)}`, `${fmt(Math.round(variance / 2 * 100) / 100)}`],
          hint: "Avval o'rtani, keyin chetlanish kvadratlarini toping.",
          steps: [
            `O'rta = ${sum}/${totalN} = ${fmt(Math.round(mean * 100) / 100)}`,
            `Chetlanish kvadratlari: ${vals.map((v) => fmt(Math.round((v - mean) ** 2 * 100) / 100)).join("; ")}`,
            `D = ${fmt(Math.round(variance * 100) / 100)}`,
          ],
        };
      },
    },
    {
      id: "statistics.medianTable",
      title: "Mediana (jadvaldan)",
      tagline: "Yig'ilgan chastota",
      theory:
        "Jadvalda medianani topish uchun yig'ilgan chastota hisoblanadi va o'rtadagi o'rin egallagan qiymat olinadi.",
      gen() {
        const vals = [1, 2, 3, 4, 5];
        const counts = [ri(1, 2), ri(1, 2), ri(3, 5), ri(1, 2), ri(1, 2)];
        const total = counts.reduce((a, b) => a + b, 0);
        const mid = Math.floor((total + 1) / 2);
        let acc = 0;
        let med = vals[0];
        for (let i = 0; i < vals.length; i++) {
          acc += counts[i];
          if (acc >= mid) {
            med = vals[i];
            break;
          }
        }
        return {
          prompt: `Jadval: qiymat ${vals.join(", ")}; chastota ${counts.join(", ")}. Medianani toping.`,
          answer: `${med}`,
          distractors: vals.filter((v) => v !== med).slice(0, 3).map(String),
          hint: "Yig'ilgan chastotani hisoblab, o'rtadagi o'ringa yeting.",
          steps: [
            `Jami son = ${total}, o'rtadagi o'rin = ${mid}`,
            `Yig'ilgan chastota shu o'ringa ${med} qiymatida yetadi`,
            `Mediana = ${med}`,
          ],
        };
      },
    },
    {
      id: "statistics.sampleShare",
      title: "Tanlanma ulushi",
      tagline: "k / n · 100%",
      theory: "Tanlanmadagi ulush: k/n · 100%.",
      gen() {
        const n = pick([200, 400, 500, 800, 1000]);
        const p = pick([12, 15, 20, 25, 30]);
        const k = (n * p) / 100;
        return {
          prompt: `<b>${n}</b> kishilik tanlanmada <b>${fmt(k)}</b> kishi "ha" dedi. Bu necha foiz?`,
          answer: `${p}%`,
          distractors: [`${fmt(k)}%`, `${fmt(Math.round((n / k) * 10) / 10)}%`, `${p + 5}%`],
          hint: "k / n · 100%.",
          steps: [`${fmt(k)}/${n} = ${fmt(p / 100)}`, `Foizda = ${p}%`],
        };
      },
    },
    {
      id: "statistics.rangeChange",
      title: "Qamrov qanday o'zgaradi",
      tagline: "Yangi qiymat qo'shilsa",
      theory: "Oradagi qiymat qo'shilsa qamrov o'zgarmaydi; chegaradan tashqari qiymat qo'shilsa kengayadi.",
      gen() {
        const mn = ri(2, 10);
        const mx = mn + ri(10, 20);
        const inside = ri(mn + 1, mx - 1);
        return {
          prompt: `To'plamda eng kichik qiymat <b>${mn}</b>, eng katta <b>${mx}</b>. Oraliqdan <b>${inside}</b> qo'shildi. Qamrov qanday o'zgaradi?`,
          answer: `o'zgarmaydi (${mx - mn})`,
          distractors: [`${mx - mn + 1}`, `${mx - mn - 1}`, `${mx - mn + inside}`],
          hint: "Yangi qiymat chegaralar ichidami?",
          steps: [
            `Avvalgi qamrov = ${mx} − ${mn} = ${mx - mn}`,
            `${inside} soni ${mn} va ${mx} orasida`,
            `Qamrov o'zgarmaydi: ${mx - mn}`,
          ],
        };
      },
    },
    {
      id: "statistics.combinedMean",
      title: "Umumiy o'rta",
      tagline: "Ikki guruh birga",
      theory: "Umumiy o'rta = (n₁x̄₁ + n₂x̄₂)/(n₁ + n₂).",
      gen() {
        const n1 = ri(4, 10);
        const m1 = ri(10, 30);
        const n2 = ri(4, 10);
        const m2 = ri(10, 30);
        const mean = (n1 * m1 + n2 * m2) / (n1 + n2);
        return {
          prompt: `${n1} kishilik guruhning o'rtasi ${m1}, ${n2} kishilik guruhning o'rtasi ${m2}. Birgalikdagi o'rtani toping.`,
          answer: `${fmt(Math.round(mean * 100) / 100)}`,
          distractors: [`${fmt(Math.round((m1 + m2) / 2 * 100) / 100)}`, `${m1 + m2}`, `${fmt(Math.round(mean * 2 * 100) / 100)}`],
          hint: "(n₁x̄₁ + n₂x̄₂)/(n₁+n₂).",
          steps: [
            `Yig'indi = ${n1}·${m1} + ${n2}·${m2} = ${n1 * m1 + n2 * m2}`,
            `Jami odam = ${n1 + n2}`,
            `O'rta = ${fmt(Math.round(mean * 100) / 100)}`,
          ],
        };
      },
    },
    {
      id: "statistics.meanVsMedian",
      title: "O'rta va mediana",
      tagline: "Chetlanish ta'siri",
      theory: "Katta chetlanma o'rtachani kuchli o'zgartiradi, medianaga deyarli ta'sir qilmaydi.",
      gen() {
        const arr = [10, 12, 14, 16, 18];
        return {
          prompt: `To'plam: ${arr.join(", ")}. Unga 200 soni qo'shildi. Qaysi ko'rsatkich kamroq o'zgaradi?`,
          answer: "mediana",
          distractors: ["o'rta arifmetik", "qamrov", "ikkisi bir xil"],
          hint: "Mediana faqat o'rtadagi o'ringa qaraydi.",
          steps: [
            `Avvalgi o'rta = ${arr.reduce((a, b) => a + b, 0) / 5}, yangi o'rta ancha katta`,
            `Mediana 14 atrofida qoladi`,
            `Javob: mediana`,
          ],
        };
      },
    },
    {
      id: "statistics.fiveNumber",
      title: "Besh son xulosasi",
      tagline: "Min, Q₁, Me, Q₃, Max",
      theory: "Besh son xulosasi: minimum, birinchi kvartil, mediana, uchinchi kvartil, maksimum.",
      gen() {
        const arr = [2, 4, 6, 8, 10, 12, 14];
        const med = arr[3];
        return {
          prompt: `To'plam: ${arr.join(", ")}. Besh son xulosasidagi medianani toping.`,
          answer: `${med}`,
          distractors: [`${arr[1]}`, `${arr[5]}`, `${arr[0]}`],
          hint: "7 ta son — o'rtadagisi 4-chi.",
          steps: [`Elementlar soni 7`, `O'rtadagi (4-chi) element: ${med}`],
        };
      },
    },
    {
      id: "statistics.quartile1",
      title: "Birinchi kvartil",
      tagline: "Q₁",
      theory: "Q₁ — tartiblangan qatorning pastki yarmidagi mediana.",
      gen() {
        const arr = [1, 3, 5, 7, 9, 11, 13, 15].map((x) => x + (ri(0, 1) === 0 ? 0 : 2));
        const s = arr.slice().sort((a, b) => a - b);
        const q1 = (s[1] + s[2]) / 2;
        return {
          prompt: `To'plam: ${s.join(", ")}. Birinchi kvartilni (Q₁) toping.`,
          answer: `${fmt(q1)}`,
          distractors: [`${s[2]}`, `${fmt((s[5] + s[6]) / 2)}`, `${s[0]}`],
          hint: "Pastki 4 ta elementning medianasi.",
          steps: [`Pastki yarim: ${s.slice(0, 4).join(", ")}`, `Q₁ = (${s[1]} + ${s[2]})/2 = ${fmt(q1)}`],
        };
      },
    },
    {
      id: "statistics.confidenceInterval",
      title: "Ishonch oralig'i",
      tagline: "p ± MOE",
      theory: "Tanlanma ulushi p va xatolik chegarasi MOE bo'lsa, interval p ± MOE.",
      gen() {
        const p = pick([40, 45, 50, 55, 60]);
        const moe = pick([2, 3, 4, 5]);
        return {
          prompt: `Tanlanmada ${p}% "ha" dedi, xatolik chegarasi ±${moe}%. Ishonch oralig'ining pastki chegarasi necha foiz?`,
          answer: `${p - moe}%`,
          distractors: [`${p + moe}%`, `${p}%`, `${p - moe * 2}%`],
          hint: "p − MOE.",
          steps: [`${p}% − ${moe}% = ${p - moe}%`],
        };
      },
    },
    {
      id: "statistics.sampleBias",
      title: "Tanlanma xatosi",
      tagline: "Tasodifiylik",
      theory: "Xulosa faqat tasodifiy tanlanmadan chiqariladi; noqulay tanlanma xato beradi.",
      gen() {
        const cases = [
          { q: "Futbol stadionida o'tkazilgan so'rov — shahar aholisining sportga qiziqishi haqida", a: "xato (noqulay tanlanma)" },
          { q: "Tasodifiy 500 ta telefon raqamiga qo'ng'iroq", a: "to'g'ri (tasodifiy tanlanma)" },
          { q: "Faqat do'stlaringizdan so'rash", a: "xato (noqulay tanlanma)" },
        ];
        const c = pick(cases);
        return {
          prompt: `Quyidagi usul ishonchli xulosa beradimi: «${c.q}»?`,
          answer: c.a,
          distractors: ["to'g'ri (tasodifiy tanlanma)", "xato (noqulay tanlanma)"].filter((x) => x !== c.a),
          hint: "Har bir a'zo teng imkoniyatga egami?",
          steps: [`Javob: ${c.a}`],
        };
      },
    },
    {
      id: "statistics.percentileRank",
      title: "Foizil o'rni",
      tagline: "Necha foiz pastda",
      theory: "p-foizil — qiymatlarning p% i shu sondan kichik yoki teng.",
      gen() {
        const p = pick([10, 25, 50, 75, 90]);
        return {
          prompt: `Natijangiz 80-foizilda. Bu nimani bildiradi?`,
          answer: "natijalarning 80% i sizdan past",
          distractors: ["80% savolga to'g'ri javob berdingiz", "natijalarning 20% i sizdan past", "siz eng yaxshi 80% dasiz"],
          hint: "p-foizil — pastdagi ulush.",
          steps: [`80-foizil: qiymatlarning 80% i shu natijadan kichik yoki teng`],
        };
      },
    },
    {
      id: "statistics.histogramMax",
      title: "Eng baland ustun",
      tagline: "Diagrammadan o'qish",
      theory: "Ustunli diagrammada eng baland ustun eng katta chastotani ko'rsatadi.",
      gen() {
        const v = [ri(5, 20), ri(5, 20), ri(25, 40)];
        const maxVal = Math.max(...v);
        const idx = v.indexOf(maxVal);
        return {
          prompt: `Diagrammada ustunlar: A = ${v[0]}, B = ${v[1]}, C = ${v[2]}. Qaysi ustun eng baland?`,
          answer: ["A", "B", "C"][idx],
          distractors: ["A", "B", "C"].filter((x) => x !== ["A", "B", "C"][idx]),
          hint: "Eng katta qiymatni qidiring.",
          steps: [`Eng katta: ${maxVal}`, `Bu ${["A", "B", "C"][idx]} ustuni`],
        };
      },
    },
    {
      id: "statistics.modeMulti",
      title: "Bir nechta moda",
      tagline: "Bimodal to'plam",
      theory: "Agar ikki qiymat bir xil eng katta chastotaga ega bo'lsa, to'plam bimodal.",
      gen() {
        const a = ri(2, 9);
        const b = a + ri(2, 6);
        const arr = [a, a, b, b, a + b + 1, a + b + 3];
        return {
          prompt: `To'plam: ${arr.join(", ")}. Nechta moda bor?`,
          answer: "2",
          distractors: ["1", "3", "0"],
          hint: "Qaysi qiymatlar eng ko'p takrorlangan?",
          steps: [`${a} va ${b} ikki martadan uchraydi`, `Demak 2 ta moda`],
        };
      },
    },
    {
      id: "statistics.sumFromTable",
      title: "Jadval yig'indisi",
      tagline: "Chastotalar yig'indisi",
      theory: "Chastota jadvalidagi barcha chastotalar yig'indisi — kuzatuvlar soni.",
      gen() {
        const c = [ri(2, 8), ri(2, 8), ri(2, 8), ri(2, 8)];
        return {
          prompt: `Jadvaldagi chastotalar: ${c.join(", ")}. Kuzatuvlar soni nechta?`,
          answer: `${c.reduce((a, b) => a + b, 0)}`,
          distractors: [`${Math.max(...c)}`, `${Math.round(c.reduce((a, b) => a + b, 0) / 4)}`, `${c.length}`],
          hint: "Chastotalarni qo'shing.",
          steps: [`${c.join(" + ")} = ${c.reduce((a, b) => a + b, 0)}`],
        };
      },
    },
    {
      id: "statistics.meanFormulaN",
      title: "Kuzatuvlar soni",
      tagline: "n = Σx / x̄",
      theory: "x̄ = Σx/n ⟹ n = Σx/x̄.",
      gen() {
        const n = ri(4, 12);
        const mean = ri(5, 25);
        const sum = n * mean;
        return {
          prompt: `To'plam yig'indisi ${sum}, o'rtasi ${mean}. Nechta son bor?`,
          answer: `${n}`,
          distractors: [`${mean}`, `${sum}`, `${n + 2}`],
          hint: "n = Σx / x̄.",
          steps: [`n = ${sum}/${mean}`, `n = ${n}`],
        };
      },
    },
    {
      id: "statistics.rangeDouble",
      title: "Qamrov va masshtab",
      tagline: "Qiymatlar k marta oshsa",
      theory: "Barcha qiymatlar k marta oshirilsa, qamrov ham k marta oshadi.",
      gen() {
        const k = pick([2, 3, 4]);
        const r = ri(5, 25);
        return {
          prompt: `To'plamdagi barcha qiymatlar ${k} ga ko'paytirildi. Qamrov ${r} edi — yangi qamrov nechaga teng?`,
          answer: `${r * k}`,
          distractors: [`${r}`, `${r + k}`, `${r * k * k}`],
          hint: "Masshtab qamrovni ham shu marta oshiradi.",
          steps: [`Yangi qamrov = ${r} · ${k}`, `= ${r * k}`],
        };
      },
    },
    {
      id: "statistics.stddevDouble",
      title: "Standart chetlanish va masshtab",
      tagline: "σ · k",
      theory: "Barcha qiymatlar k marta oshirilsa, standart chetlanish ham k marta oshadi; siljitish esa σ ni o'zgartirmaydi.",
      gen() {
        const k = pick([2, 3]);
        const s = ri(2, 9);
        return {
          prompt: `Standart chetlanish ${s}. Barcha qiymatlar ${k} ga ko'paytirildi. Yangi standart chetlanish nechaga teng?`,
          answer: `${s * k}`,
          distractors: [`${s}`, `${s + k}`, `${s * k * k}`],
          hint: "σ masshtab bilan birga ko'payadi.",
          steps: [`Yangi σ = ${s}·${k} = ${s * k}`],
        };
      },
    },
    {
      id: "statistics.medianShift",
      title: "Siljish va mediana",
      tagline: "Mediana + k",
      theory: "Barcha qiymatlarga k qo'shilsa, mediana ham k ga oshadi.",
      gen() {
        const k = ri(3, 15);
        const med = ri(10, 40);
        return {
          prompt: `To'plam medianasi ${med}. Barcha qiymatlarga ${k} qo'shildi. Yangi mediana nechaga teng?`,
          answer: `${med + k}`,
          distractors: [`${med}`, `${med * k}`, `${med - k}`],
          hint: "Siljish barcha ko'rsatkichlarga teng ta'sir qiladi.",
          steps: [`Yangi mediana = ${med} + ${k} = ${med + k}`],
        };
      },
    },
    {
      id: "statistics.cumulativeFreq",
      title: "Yig'ilgan chastota",
      tagline: "Ketma-ket qo'shish",
      theory: "Yig'ilgan chastota — shu qiymatgacha bo'lgan barcha chastotalar yig'indisi.",
      gen() {
        const c = [ri(2, 6), ri(2, 6), ri(2, 6), ri(2, 6)];
        const idx = ri(1, 3);
        const cum = c.slice(0, idx + 1).reduce((a, b) => a + b, 0);
        return {
          prompt: `Chastotalar: ${c.join(", ")}. ${idx + 1}-qiymatgacha yig'ilgan chastota nechaga teng?`,
          answer: `${cum}`,
          distractors: [`${c[idx]}`, `${cum + c[idx]}`, `${c.reduce((a, b) => a + b, 0)}`],
          hint: "Shu qiymatgacha bo'lganlarni qo'shing.",
          steps: [`${c.slice(0, idx + 1).join(" + ")} = ${cum}`],
        };
      },
    },
    {
      id: "statistics.lowerFence",
      title: "Pastki chegara",
      tagline: "Q₁ − 1,5·IQR",
      theory: "Pastki chegara = Q₁ − 1,5·IQR. Undan kichik qiymat — outlier.",
      gen() {
        const q1 = ri(20, 40);
        const iqr = ri(4, 10);
        const fence = q1 - 1.5 * iqr;
        return {
          prompt: `Q₁ = ${q1}, IQR = ${iqr}. Pastki chegarani toping.`,
          answer: `${fmt(fence)}`,
          distractors: [`${q1 + 1.5 * iqr}`, `${q1}`, `${fmt(fence + iqr)}`],
          hint: "Q₁ − 1,5·IQR.",
          steps: [`1,5·${iqr} = ${1.5 * iqr}`, `Chegara = ${q1} − ${1.5 * iqr} = ${fmt(fence)}`],
        };
      },
    },
    {
      id: "statistics.sampleSizeFromMoe",
      title: "Tanlanma hajmi",
      tagline: "n = (1/MOE)²",
      theory: "MOE ≈ 1/√n ⟹ n ≈ (1/MOE)².",
      gen() {
        const moe = pick([5, 4, 2.5, 2]);
        const n = Math.round((1 / (moe / 100)) ** 2);
        return {
          prompt: `Xatolik chegarasi ${fmt(moe)}% bo'lishi uchun tanlanma hajmi qancha bo'lishi kerak?`,
          answer: `${n}`,
          distractors: [`${n * 2}`, `${Math.round(n / 2)}`, `${Math.round(100 / moe)}`],
          hint: "n ≈ (1/MOE)², MOE kasrda.",
          steps: [
            `MOE = ${fmt(moe / 100)}`,
            `n = (1/${fmt(moe / 100)})² = ${n}`,
          ],
        };
      },
    },
  ],
};
