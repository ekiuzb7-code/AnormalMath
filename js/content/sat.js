// AnormalMath — SAT bo'limi (savollar ingliz tilida, SAT formatida)
// To'qqiz mavzu: chiziqli model, so'rov statistikasi, kvadratik kontekst,
// eksponensial model, jadval, qo'shma figura, xatolik chegarasi,
// doira sektori va foiz o'zgarishi.
import { ri, pick } from "../engine.js";

/** English decimal formatting: SAT answers use a dot, not the Uzbek comma. */
const en = (n) => (typeof n === "number" && isFinite(n) ? String(Math.round(n * 1000) / 1000) : String(n));

export const sat = {
  id: "sat",
  title: "SAT",
  glyph: "★",
  accent: "#eab308",
  blurb: "SAT Math — word problems, models and data analysis. Har bir savol ingliz tilida.",
  topics: [
    {
      id: "sat.linearModel",
      title: "Linear model",
      tagline: "C = a + b·x",
      theory:
        "A linear model has the form C = a + b·x, where a is the one-time base amount and b is the rate per unit.",
      gen() {
        const a = ri(10, 40);
        const b = ri(3, 9);
        const x = ri(4, 12);
        const C = a + b * x;
        return {
          prompt: `A repair service charges a flat fee of <b>$${a}</b> plus <b>$${b}</b> per hour. What is the total cost for <b>${x} hours</b>?`,
          answer: `$${C}`,
          distractors: [`$${a + x}`, `$${b * x}`, `$${C + b}`],
          hint: "The flat fee is paid once; only the hourly part is multiplied.",
          steps: [
            `Total = flat fee + hourly rate × hours`,
            `C = ${a} + ${b}(${x})`,
            `C = ${a} + ${b * x} = $${C}`,
          ],
        };
      },
    },
    {
      id: "sat.surveyStats",
      title: "Survey statistics",
      tagline: "Scaling a sample to a population",
      theory:
        "To estimate a population count from a sample percentage, multiply: expected count = p/100 · N.",
      gen() {
        const p = pick([12, 15, 20, 24, 35]);
        const N = pick([1200, 1500, 2000, 2500, 3000]);
        const k = (p * N) / 100;
        return {
          prompt: `In a survey, <b>${p}%</b> of respondents said they use public transport daily. If the town has <b>${N}</b> residents, how many are expected to do the same?`,
          answer: `${k}`,
          distractors: [`${k + 20}`, `${p * 10}`, `${Math.round(N / p)}`],
          hint: "Multiply the percentage by the population.",
          steps: [
            `Expected = ${p}/100 × ${N}`,
            `= ${p * N}/100`,
            `= ${k}`,
          ],
        };
      },
    },
    {
      id: "sat.quadraticContext",
      title: "Quadratic context",
      tagline: "Height and time",
      theory:
        "h(t) = −16t² + v·t + h₀. The maximum height occurs at t = v/32 when height is measured in feet.",
      gen() {
        const v = pick([32, 48, 64, 80, 96]);
        const t = v / 32;
        return {
          prompt: `A ball's height in feet after t seconds is h(t) = −16t² + ${v}t. After how many seconds does the ball reach its <b>maximum height</b>?`,
          answer: `${en(t)} s`,
          distractors: [`${en(t * 2)} s`, `${en(v)} s`, `${en(t + 1)} s`],
          hint: "The vertex of a downward parabola is at t = v/32.",
          steps: [
            `h′(t) = −32t + ${v}`,
            `Set h′(t) = 0: 32t = ${v}`,
            `t = ${v}/32 = ${en(t)} s`,
          ],
        };
      },
    },
    {
      id: "sat.exponentialModel",
      title: "Exponential model",
      tagline: "Growth and decay",
      theory: "A(t) = A₀(1 + r)ᵗ models growth, A(t) = A₀(1 − r)ᵗ models decay.",
      gen() {
        const A0 = pick([200, 400, 500, 800, 1000]);
        const r = pick([10, 20, 25, 50]);
        const t = pick([2, 3]);
        const val = A0 * Math.pow(1 + r / 100, t);
        return {
          prompt: `A colony starts with <b>${A0}</b> bacteria and grows by <b>${r}%</b> each year. What is the population after <b>${t} years</b>?`,
          answer: `${en(Math.round(val * 10) / 10)}`,
          distractors: [
            `${en(A0 + (A0 * r * t) / 100)}`,
            `${en(Math.round(A0 * (1 + r / 100) * 10) / 10)}`,
            `${en(Math.round(val * 2 * 10) / 10)}`,
          ],
          hint: "Each year multiplies by (1 + r/100), not by a fixed amount.",
          steps: [
            `A = A₀(1 + r)ᵗ`,
            `A = ${A0}(1 + ${r}/100)^${t}`,
            `A = ${en(Math.round(val * 10) / 10)}`,
          ],
        };
      },
    },
    {
      id: "sat.dataTable",
      title: "Data table",
      tagline: "Reading two-way tables",
      theory:
        "Sum the cells you need before comparing; a table question usually asks for a difference or a share.",
      gen() {
        const a = ri(5, 20);
        const b = ri(5, 20);
        const c = ri(5, 20);
        const d = ri(5, 20);
        return {
          prompt: `The table lists students by group and outcome: Group 1 has ${a} and ${b}; Group 2 has ${c} and ${d}. How many <b>more</b> students are in Group 1 than in Group 2?`,
          answer: `${a + b - (c + d)}`,
          distractors: [`${a + b + c + d}`, `${a - c}`, `${Math.round((a + b + c + d) / 2)}`],
          hint: "Add each row first, then subtract.",
          steps: [
            `Group 1 total = ${a} + ${b} = ${a + b}`,
            `Group 2 total = ${c} + ${d} = ${c + d}`,
            `Difference = ${a + b} − ${c + d} = ${a + b - (c + d)}`,
          ],
        };
      },
    },
    {
      id: "sat.geometryComposite",
      title: "Composite figure",
      tagline: "Rectangle + semicircle",
      theory:
        "The area of a composite figure is the sum of its parts. A semicircle with radius r has area ½πr².",
      gen() {
        const w = ri(6, 14);
        const h = ri(4, 10);
        const r = h / 2;
        const area = w * h + 0.5 * 3.14 * r * r;
        return {
          prompt: `A rectangle measuring ${w} by ${h} is topped by a semicircle whose diameter is ${h}. What is the total area? (π ≈ 3.14)`,
          answer: `${en(Math.round(area * 10) / 10)}`,
          distractors: [
            `${en(w * h)}`,
            `${en(Math.round((w * h + 3.14 * r * r) * 10) / 10)}`,
            `${en(Math.round((w * h + 0.5 * 3.14 * r) * 10) / 10)}`,
          ],
          hint: "Split the figure into a rectangle and a semicircle.",
          steps: [
            `Rectangle = ${w} × ${h} = ${w * h}`,
            `Semicircle = ½ · 3.14 · ${en(r)}² = ${en(Math.round(0.5 * 3.14 * r * r * 10) / 10)}`,
            `Total = ${en(Math.round(area * 10) / 10)}`,
          ],
        };
      },
    },
    {
      id: "sat.marginOfError",
      title: "Margin of error",
      tagline: "1/√n",
      theory:
        "For a proportion near 50%, the margin of error is approximately 1/√n. Doubling the sample halves the margin.",
      gen() {
        const n = pick([100, 400, 900, 1600, 2500]);
        const moe = Math.round((1 / Math.sqrt(n)) * 1000) / 10;
        return {
          prompt: `A random sample of <b>${n}</b> people is used to estimate a proportion. What is the approximate margin of error?`,
          answer: `${en(moe)}%`,
          distractors: [`${en(Math.round(moe * 2 * 10) / 10)}%`, `${en(Math.round((100 / n) * 10) / 10)}%`, `${en(Math.round(n / 100))}%`],
          hint: "Margin of error ≈ 1/√n, expressed as a percent.",
          steps: [
            `√${n} = ${Math.sqrt(n)}`,
            `1 / ${Math.sqrt(n)} = ${en(Math.round((1 / Math.sqrt(n)) * 1000) / 1000)}`,
            `As a percent: ${en(moe)}%`,
          ],
        };
      },
    },
    {
      id: "sat.circleSprinkler",
      title: "Circle area",
      tagline: "Sprinkler coverage",
      theory: "A sprinkler with radius r covers an area of S = πr².",
      gen() {
        const r = pick([5, 6, 8, 10, 12]);
        const area = Math.round(3.14 * r * r * 10) / 10;
        return {
          prompt: `A sprinkler sprays water in a circle of radius <b>${r} meters</b>. What area does it cover? (π ≈ 3.14)`,
          answer: `${en(area)} m²`,
          distractors: [
            `${en(Math.round(2 * 3.14 * r * 10) / 10)} m²`,
            `${en(Math.round(3.14 * r * 10) / 10)} m²`,
            `${en(Math.round(area * 2 * 10) / 10)} m²`,
          ],
          hint: "The covered area is a full circle, not the circumference.",
          steps: [
            `S = πr²`,
            `S = 3.14 × ${r}²`,
            `S = ${en(area)} m²`,
          ],
        };
      },
    },
    {
      id: "sat.percentChange",
      title: "Percent change",
      tagline: "Successive increases and decreases",
      theory:
        "An increase of p% multiplies by (1 + p/100); a decrease of q% multiplies by (1 − q/100). Apply them in order.",
      gen() {
        const price = pick([100, 200, 400, 500, 800]);
        const up = pick([10, 20, 25, 50]);
        const down = pick([10, 20, 25]);
        const afterUp = price * (1 + up / 100);
        const after = afterUp * (1 - down / 100);
        return {
          prompt: `A jacket costs $${price}. Its price is increased by <b>${up}%</b>, then the new price is decreased by <b>${down}%</b>. What is the final price?`,
          answer: `$${en(Math.round(after * 100) / 100)}`,
          distractors: [
            `$${en(price)}`,
            `$${en(Math.round(afterUp * 100) / 100)}`,
            `$${en(Math.round(price * (1 + (up - down) / 100) * 100) / 100)}`,
          ],
          hint: "The second percent applies to the new price, not the original one.",
          steps: [
            `After the increase: ${price}(1 + ${up}/100) = $${en(Math.round(afterUp * 100) / 100)}`,
            `After the decrease: ${en(Math.round(afterUp * 100) / 100)}(1 − ${down}/100)`,
            `Final price: $${en(Math.round(after * 100) / 100)}`,
          ],
        };
      },
    },
    {
      id: "sat.slopeIntercept",
      title: "Slope and intercept",
      tagline: "y = mx + b",
      theory: "Slope m = (y₂ − y₁)/(x₂ − x₁); the y-intercept b is where the line crosses the y-axis.",
      gen() {
        const m = ri(2, 5);
        const b = ri(-6, 8);
        const x1 = ri(0, 4);
        const y1 = m * x1 + b;
        return {
          prompt: `A line passes through the points (${x1}, ${y1}) and (${x1 + 2}, ${y1 + 2 * m}). What is its slope?`,
          answer: `${m}`,
          distractors: [`${-m}`, `${b}`, `${y1}`],
          hint: "Slope = change in y ÷ change in x.",
          steps: [
            `Change in y = ${y1 + 2 * m} − ${y1} = ${2 * m}`,
            `Change in x = ${x1 + 2} − ${x1} = 2`,
            `m = ${2 * m}/2 = ${m}`,
          ],
        };
      },
    },
    {
      id: "sat.systems",
      title: "Systems of equations",
      tagline: "Two variables",
      theory: "Add or subtract the equations to eliminate one variable, then substitute back.",
      gen() {
        const x = ri(2, 9);
        const y = ri(1, 8);
        return {
          prompt: `Solve the system: x + y = ${x + y}; x − y = ${x - y}. What is <b>x</b>?`,
          answer: `${x}`,
          distractors: [`${y}`, `${x + y}`, `${x + 1}`],
          hint: "Add the two equations to remove y.",
          steps: [
            `Adding: 2x = ${x + y} + ${x - y} = ${2 * x}`,
            `x = ${x}`,
            `y = ${x + y} − ${x} = ${y}`,
          ],
        };
      },
    },
    {
      id: "sat.inequalities",
      title: "Linear inequalities",
      tagline: "Solving for x",
      theory: "Solve like an equation; flip the inequality sign only when multiplying or dividing by a negative.",
      gen() {
        const a = ri(2, 6);
        const bound = ri(2, 9);
        const b = ri(1, 9);
        const c = a * bound + b;
        return {
          prompt: `If ${a}x + ${b} ≤ ${c}, what is the greatest integer value of x?`,
          answer: `${bound}`,
          distractors: [`${bound + 1}`, `${bound - 1}`, `${c}`],
          hint: "Isolate x, then take the greatest integer inside the range.",
          steps: [
            `${a}x ≤ ${c - b}`,
            `x ≤ ${bound}`,
            `Greatest integer: ${bound}`,
          ],
        };
      },
    },
    {
      id: "sat.functions",
      title: "Function notation",
      tagline: "f(x) evaluation",
      theory: "Substitute the given input wherever x appears in the function's rule.",
      gen() {
        const a = ri(2, 4);
        const b = ri(-5, 7);
        const x0 = ri(-2, 4);
        const val = a * x0 * x0 + b;
        return {
          prompt: `If f(x) = ${a}x² ${b < 0 ? "−" : "+"} ${Math.abs(b)}, what is <b>f(${x0})</b>?`,
          answer: `${val}`,
          distractors: [`${a * x0 + b}`, `${val + a}`, `${-val}`],
          hint: `Square ${x0} first, then multiply and add.`,
          steps: [
            `f(${x0}) = ${a}(${x0})² ${b < 0 ? "−" : "+"} ${Math.abs(b)}`,
            `= ${a * x0 * x0} ${b < 0 ? "−" : "+"} ${Math.abs(b)}`,
            `= ${val}`,
          ],
        };
      },
    },
    {
      id: "sat.quadraticRoots",
      title: "Quadratic roots",
      tagline: "Factoring",
      theory: "x² + bx + c = (x + p)(x + q) when p + q = b and pq = c; the roots are −p and −q.",
      gen() {
        const p = ri(1, 6);
        const q = ri(1, 6);
        return {
          prompt: `The equation x² − ${p + q}x + ${p * q} = 0 has two positive roots. What is the <b>larger</b> root?`,
          answer: `${Math.max(p, q)}`,
          distractors: [`${Math.min(p, q)}`, `${p + q}`, `${p * q}`],
          hint: "Find two numbers that add to the middle coefficient and multiply to the constant.",
          steps: [
            `${p} + ${q} = ${p + q}, ${p} × ${q} = ${p * q}`,
            `x² − ${p + q}x + ${p * q} = (x − ${p})(x − ${q})`,
            `Roots: ${p} and ${q}; larger is ${Math.max(p, q)}`,
          ],
        };
      },
    },
    {
      id: "sat.exponentRules",
      title: "Exponent rules",
      tagline: "Multiplying powers",
      theory: "aᵐ · aⁿ = aᵐ⁺ⁿ, (aᵐ)ⁿ = aᵐⁿ, aᵐ/aⁿ = aᵐ⁻ⁿ.",
      gen() {
        const a = pick([2, 3, 5]);
        const m = ri(3, 6);
        const n = ri(2, 4);
        return {
          prompt: `Which expression equals <b>${a}<sup>${m}</sup> · ${a}<sup>${n}</sup></b>?`,
          answer: `${a}^${m + n}`,
          distractors: [`${a}^${m * n}`, `${a}^${m - n}`, `${a * a}^${m + n}`],
          hint: "Multiplying powers with the same base adds the exponents.",
          steps: [`${a}^${m} · ${a}^${n} = ${a}^(${m} + ${n})`, `= ${a}^${m + n}`],
        };
      },
    },
    {
      id: "sat.radicals",
      title: "Radicals",
      tagline: "Simplifying square roots",
      theory: "√(a²b) = a√b — pull perfect squares out of the radical.",
      gen() {
        const a = ri(2, 6);
        const b = pick([2, 3, 5, 7]);
        return {
          prompt: `Which expression is equivalent to <b>√${a * a * b}</b>?`,
          answer: `${a}√${b}`,
          distractors: [`${b}√${a}`, `${a * b}`, `${a}√${a}`],
          hint: `Write ${a * a * b} as a perfect square times what is left.`,
          steps: [`${a * a * b} = ${a * a} · ${b}`, `√${a * a * b} = ${a}√${b}`],
        };
      },
    },
    {
      id: "sat.proportions",
      title: "Proportions",
      tagline: "Scaling up",
      theory: "Set up a/b = c/x and cross-multiply.",
      gen() {
        const k = ri(2, 6);
        const a = ri(3, 9);
        const b = ri(2, 8);
        return {
          prompt: `If ${a} notebooks cost $${b * k}, how much do ${a * k} notebooks cost?`,
          answer: `$${b * k * k}`,
          distractors: [`$${b * k}`, `$${a * k}`, `$${b * k * 2}`],
          hint: `The number of notebooks multiplies by ${k}, so the cost does too.`,
          steps: [
            `${a} → $${b * k}`,
            `${a} × ${k} = ${a * k} notebooks`,
            `Cost = $${b * k} × ${k} = $${b * k * k}`,
          ],
        };
      },
    },
    {
      id: "sat.unitRate",
      title: "Unit rate",
      tagline: "Per one unit",
      theory: "A unit rate divides the quantity by the number of units.",
      gen() {
        const rate = pick([45, 50, 60, 75]);
        const t = ri(2, 6);
        return {
          prompt: `A car travels ${rate * t} miles in ${t} hours at a constant speed. How many miles does it travel per hour?`,
          answer: `${rate}`,
          distractors: [`${rate * t}`, `${t}`, `${rate + 10}`],
          hint: "Divide the distance by the time.",
          steps: [`Unit rate = ${rate * t}/${t}`, `= ${rate} mph`],
        };
      },
    },
    {
      id: "sat.averages",
      title: "Averages",
      tagline: "Mean of a list",
      theory: "Mean = sum ÷ count. If the mean and count are known, the sum is their product.",
      gen() {
        const mean = ri(60, 90);
        const n = ri(4, 8);
        const sum = mean * n;
        return {
          prompt: `${n} test scores have a mean of ${mean}. What is their <b>sum</b>?`,
          answer: `${sum}`,
          distractors: [`${mean}`, `${sum + n}`, `${Math.round(mean / n)}`],
          hint: "Sum = mean × count.",
          steps: [`Sum = ${mean} × ${n}`, `= ${sum}`],
        };
      },
    },
    {
      id: "sat.medianMode",
      title: "Median and mode",
      tagline: "Order statistics",
      theory: "Order the values first; the median is the middle, the mode is the most frequent.",
      gen() {
        const arr = [ri(2, 8), ri(9, 15), ri(16, 22), ri(23, 29), ri(30, 36)];
        const mode = arr[2];
        const list = [arr[0], arr[1], mode, mode, arr[3]];
        return {
          prompt: `The data set is {${list.join(", ")}}. What is the <b>mode</b>?`,
          answer: `${mode}`,
          distractors: [`${arr[1]}`, `${arr[3]}`, `${arr[0]}`],
          hint: "Which value appears most often?",
          steps: [`${mode} appears twice, every other value once`, `Mode = ${mode}`],
        };
      },
    },
    {
      id: "sat.probability",
      title: "Probability",
      tagline: "Favorable over total",
      theory: "P = favorable outcomes ÷ total equally likely outcomes.",
      gen() {
        const r = ri(3, 7);
        const b = ri(3, 7);
        const total = r + b;
        return {
          prompt: `A bag contains ${r} red and ${b} blue marbles. One marble is drawn at random. What is the probability that it is <b>red</b>?`,
          answer: `${r}/${total}`,
          distractors: [`${b}/${total}`, `${r}/${b}`, `1/${total}`],
          hint: "Favorable = red marbles; total = all marbles.",
          steps: [`P = ${r}/${total}`, `P = ${r}/${total}`],
        };
      },
    },
    {
      id: "sat.combinations",
      title: "Counting",
      tagline: "Choosing without order",
      theory: "Choosing k objects from n without regard to order: C(n, k) = n!/(k!(n − k)!).",
      gen() {
        const n = ri(5, 8);
        const k = 2;
        const comb = (n * (n - 1)) / 2;
        return {
          prompt: `A committee of ${k} must be chosen from ${n} students. How many different committees are possible?`,
          answer: `${comb}`,
          distractors: [`${n * (n - 1)}`, `${n}`, `${comb + n}`],
          hint: "Order does not matter — use C(n, k).",
          steps: [`C(${n}, ${k}) = ${n}·${n - 1}/2`, `= ${comb}`],
        };
      },
    },
    {
      id: "sat.angles",
      title: "Angles",
      tagline: "Parallel lines",
      theory: "When two parallel lines are cut by a transversal, corresponding angles are equal and same-side interior angles add to 180°.",
      gen() {
        const a = ri(40, 140);
        return {
          prompt: `Two parallel lines are cut by a transversal, forming an angle of ${a}°. What is the measure of the angle <b>same-side</b> (co-interior) to it?`,
          answer: `${180 - a}°`,
          distractors: [`${a}°`, `${90 - (a - 90)}°`, `${360 - a}°`],
          hint: "Same-side interior angles are supplementary.",
          steps: [`α + β = 180°`, `β = 180° − ${a}° = ${180 - a}°`],
        };
      },
    },
    {
      id: "sat.similarTriangles",
      title: "Similar triangles",
      tagline: "Proportional sides",
      theory: "Corresponding sides of similar triangles are proportional: a₁/a₂ = b₁/b₂.",
      gen() {
        const k = pick([2, 3]);
        const a = ri(3, 8);
        const b = ri(4, 9);
        return {
          prompt: `Two triangles are similar. The first has sides ${a} and ${b}; the side corresponding to ${a} in the second triangle is ${a * k}. What is the side corresponding to ${b}?`,
          answer: `${b * k}`,
          distractors: [`${b + k}`, `${a * k}`, `${b * k + 2}`],
          hint: "Scale factor k = new/old.",
          steps: [`k = ${a * k}/${a} = ${k}`, `corresponding side = ${b} × ${k} = ${b * k}`],
        };
      },
    },
    {
      id: "sat.circleGeometry",
      title: "Circles",
      tagline: "Central angles",
      theory: "A central angle equals its intercepted arc; an inscribed angle is half its arc.",
      gen() {
        const arc = ri(4, 34) * 10;
        return {
          prompt: `In a circle, an inscribed angle intercepts an arc of ${arc}°. What is the measure of the <b>inscribed</b> angle?`,
          answer: `${arc / 2}°`,
          distractors: [`${arc}°`, `${arc * 2}°`, `${180 - arc}°`],
          hint: "Inscribed angle = half the arc.",
          steps: [`Angle = ${arc}°/2`, `= ${arc / 2}°`],
        };
      },
    },
    {
      id: "sat.volume",
      title: "Volume",
      tagline: "Cylinders and prisms",
      theory: "V = base area × height. For a cylinder, V = πr²h.",
      gen() {
        const a = ri(3, 8);
        const b = ri(3, 8);
        const h = ri(3, 9);
        return {
          prompt: `A rectangular box has a ${a} by ${b} base and a height of ${h}. What is its volume?`,
          answer: `${a * b * h}`,
          distractors: [`${a * b}`, `${2 * (a + b) * h}`, `${a + b + h}`],
          hint: "V = length × width × height.",
          steps: [`Base area = ${a} × ${b} = ${a * b}`, `V = ${a * b} × ${h} = ${a * b * h}`],
        };
      },
    },
    {
      id: "sat.trigValues",
      title: "Trigonometric values",
      tagline: "Special angles",
      theory: "sin 30° = 1/2, sin 45° = √2/2, sin 60° = √3/2; cos is the reverse order.",
      gen() {
        const rows = [
          { d: 30, s: "1/2", c: "√3/2" },
          { d: 45, s: "√2/2", c: "√2/2" },
          { d: 60, s: "√3/2", c: "1/2" },
        ];
        const r = pick(rows);
        const fn = pick(["sin", "cos"]);
        const v = fn === "sin" ? r.s : r.c;
        return {
          prompt: `What is the value of <b>${fn} ${r.d}°</b>?`,
          answer: v,
          distractors: rows.map((x) => (fn === "sin" ? x.s : x.c)).filter((x) => x !== v).slice(0, 3),
          hint: "Recall the special angle table.",
          steps: [`${fn} ${r.d}° = ${v}`],
        };
      },
    },
    {
      id: "sat.absoluteValue",
      title: "Absolute value",
      tagline: "|x − a| = b",
      theory: "|x − a| = b means x − a = b or x − a = −b, so x = a ± b.",
      gen() {
        const a = ri(-5, 8);
        const b = ri(2, 7);
        return {
          prompt: `If |x − ${a}| = ${b}, what is the <b>sum</b> of all possible values of x?`,
          answer: `${2 * a}`,
          distractors: [`${a}`, `${b}`, `${2 * b}`],
          hint: "The two solutions are a − b and a + b.",
          steps: [
            `x = ${a} − ${b} = ${a - b}`,
            `x = ${a} + ${b} = ${a + b}`,
            `Sum = ${a - b} + ${a + b} = ${2 * a}`,
          ],
        };
      },
    },
    {
      id: "sat.rateWork",
      title: "Rates",
      tagline: "Working together",
      theory: "Combined rate = sum of individual rates: 1/T = 1/a + 1/b.",
      gen() {
        const a = pick([6, 8, 12]);
        const b = pick([12, 16, 24]);
        const t = (a * b) / (a + b);
        return {
          prompt: `Machine A finishes a job in ${a} hours, machine B in ${b} hours. Working together, how many hours do they need?`,
          answer: `${en(Math.round(t * 100) / 100)}`,
          distractors: [`${a + b}`, `${en((a + b) / 2)}`, `${en(Math.round(t * 2 * 100) / 100)}`],
          hint: "Add the rates, then take the reciprocal.",
          steps: [
            `1/${a} + 1/${b} = ${a + b}/${a * b}`,
            `T = ${a * b}/${a + b} = ${en(Math.round(t * 100) / 100)} hours`,
          ],
        };
      },
    },
    {
      id: "sat.lineOfBestFit",
      title: "Lines of best fit",
      tagline: "Interpreting slope",
      theory: "In a line of best fit, the slope describes how the predicted y changes per unit of x.",
      gen() {
        const m = ri(2, 9);
        const b = ri(10, 60);
        return {
          prompt: `A line of best fit is y = ${m}x + ${b}, where x is hours studied and y is the predicted score. What does the <b>slope</b> mean?`,
          answer: `each extra hour raises the predicted score by ${m}`,
          distractors: [
            `the predicted score with no studying is ${m}`,
            `the score cannot exceed ${m}`,
            `each extra point raises study time by ${m} hours`,
          ],
          hint: "Slope is the change in y per one unit of x.",
          steps: [`y = mx + b with m = ${m}`, `One more hour of study adds ${m} to the predicted score`],
        };
      },
    },
  ],
};
