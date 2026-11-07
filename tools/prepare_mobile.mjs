// language: Node ESM, file: tools/prepare_mobile.mjs
// Assembles mobile/www: the same UI, but with one classic script and no modules,
// so it runs from file:// inside a WebView.
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "mobile", "www");

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const src = path.join(from, entry.name);
    const dst = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(src, dst);
    else fs.copyFileSync(src, dst);
  }
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const html = fs
  .readFileSync(path.join(ROOT, "index.html"), "utf8")
  .replace('<script type="module" src="js/app.js"></script>', '<script src="bundle.js"></script>');

if (html.includes('type="module"')) throw new Error("module script tag was not replaced");

fs.writeFileSync(path.join(OUT, "index.html"), html, "utf8");
copyDir(path.join(ROOT, "css"), path.join(OUT, "css"));
copyDir(path.join(ROOT, "assets"), path.join(OUT, "assets"));
copyDir(path.join(ROOT, "icons"), path.join(OUT, "icons"));
fs.copyFileSync(path.join(ROOT, "manifest.json"), path.join(OUT, "manifest.json"));

console.log("mobile/www prepared");
for (const f of fs.readdirSync(OUT)) {
  const p = path.join(OUT, f);
  const st = fs.statSync(p);
  console.log(" ", f.padEnd(14), st.isDirectory() ? "<dir>" : `${st.size} bytes`);
}
