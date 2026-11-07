// AnormalMath — generator engine
// Every topic supplies a generator; the engine turns it into four shuffled choices,
// a hint and a step-by-step solution tail.

export const ri = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
export const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/** Display formatter: drops trailing zeros, uses the Uzbek decimal comma. */
export function fmt(n) {
  if (typeof n !== "number" || !isFinite(n)) return String(n);
  const r = Math.round(n * 1000) / 1000;
  const s = Number.isInteger(r) ? String(r) : String(r).replace(".", ",");
  return s;
}

/**
 * Near-miss variants of an answer string. The first number inside the string is
 * rewritten, so "16,5 km/soat" yields "33 km/soat", "8,25 km/soat", and so on —
 * plausible wrong answers that keep the unit suffix.
 */
function variantsOf(answer) {
  const s = String(answer);
  const m = s.match(/-?\d+(?:[.,]\d+)?/);
  if (!m) return [];
  const numStr = m[0];
  const num = parseFloat(numStr.replace(",", "."));
  if (!isFinite(num)) return [];

  const mk = (v) => {
    const rounded = Math.round(v * 1000) / 1000;
    let digits = Number.isInteger(rounded) ? String(rounded) : String(rounded);
    if (numStr.includes(",")) digits = digits.replace(".", ",");
    return s.slice(0, m.index) + digits + s.slice(m.index + numStr.length);
  };

  const out = [];
  if (num !== 0) out.push(mk(num * 2), mk(num / 2), mk(-num));
  out.push(mk(num + 1), mk(num - 1), mk(num + 2), mk(num + 5), mk(num + 10), mk(num - 2));
  return out;
}

/** Builds four unique choices and remembers where the right one landed. */
export function buildChoices(answer, distractors) {
  const key = String(answer);
  const seen = new Set([key]);
  const out = [];
  const add = (v) => {
    const k = String(v);
    if (seen.has(k) || out.length >= 3) return;
    seen.add(k);
    out.push(k);
  };

  for (const d of distractors) add(d);
  for (const v of variantsOf(answer)) add(v);
  // last resort: bare integers, so a text answer with no digits still gets four options
  for (let i = 1; out.length < 3 && i < 60; i++) add(String(i * 7 + 3));

  const choices = shuffle([key, ...out]);
  return { choices, answerIndex: choices.indexOf(key) };
}

/** Normalises a generator result into the shape the question screen renders. */
export function makeQuestion(topic) {
  const raw = topic.gen();
  const { choices, answerIndex } = buildChoices(raw.answer, raw.distractors || []);
  return {
    topicId: topic.id,
    prompt: raw.prompt,
    choices,
    answerIndex,
    hint: raw.hint || "",
    steps: raw.steps || [],
    theory: raw.theory || topic.theory || "",
  };
}
