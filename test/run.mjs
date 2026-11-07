// language: Node ESM, file: test/run.mjs
// Exercises every generator many times and fails on broken questions.
import { sections } from "../js/content/index.js";
import { makeQuestion } from "../js/engine.js";

let topics = 0;
let questions = 0;
const problems = [];

for (const s of sections) {
  for (const t of s.topics) {
    topics++;
    for (let i = 0; i < 60; i++) {
      let q;
      try {
        q = makeQuestion(t);
      } catch (e) {
        problems.push(`${t.id}: threw ${e.message}`);
        break;
      }
      questions++;
      if (q.choices.length !== 4) problems.push(`${t.id}: ${q.choices.length} choices`);
      const uniq = new Set(q.choices);
      if (uniq.size !== 4) problems.push(`${t.id}: duplicate choices ${q.choices.join(" | ")}`);
      if (q.answerIndex < 0) problems.push(`${t.id}: answer not among choices`);
      if (!q.steps.length) problems.push(`${t.id}: no solution steps`);
      if (!q.hint) problems.push(`${t.id}: no hint`);
      if (/undefined|NaN|null|\[object|\$\{/.test(q.prompt + q.choices.join("") + q.steps.join("") + q.hint)) {
        problems.push(`${t.id}: leaked placeholder -> ${q.prompt}`);
      }
    }
  }
}

console.log(`sections: ${sections.length}  topics: ${topics}  questions generated: ${questions}`);
const uniqProblems = [...new Set(problems)];
if (uniqProblems.length) {
  console.log(`\nPROBLEMS (${uniqProblems.length}):`);
  for (const p of uniqProblems.slice(0, 40)) console.log("  -", p);
  process.exitCode = 1;
} else {
  console.log("all generators clean: 4 unique choices, answer present, hint + steps present");
}
