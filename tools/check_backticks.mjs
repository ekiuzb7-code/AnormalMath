// language: Node ESM, file: tools/check_backticks.mjs
// Finds unterminated template literals by tracking odd backtick counts per line.
import fs from "node:fs";

const file = process.argv[2] || "js/content/algebra.js";
const src = fs.readFileSync(file, "utf8");
const lines = src.split("\n");
const BT = String.fromCharCode(96);

let open = false;
let openedAt = 0;
lines.forEach((line, i) => {
  const n = (line.split(BT).length - 1) % 2;
  if (n === 1) {
    if (!open) {
      open = true;
      openedAt = i + 1;
    } else {
      open = false;
    }
  }
  if (i + 1 === 1461) console.log(`line 1461 → open=${open} openedAt=${openedAt}`);
});

console.log(`file: ${file}`);
console.log(`unterminated: ${open}${open ? ` (opened at line ${openedAt})` : ""}`);
