// AnormalMath — application shell, router, views, test mode
import { sections } from "./content/index.js";
import { makeQuestion, fmt, shuffle } from "./engine.js";

const TOPIC_INDEX = new Map();
for (const s of sections) {
  for (const t of s.topics) {
    t.sectionId = s.id;
    t.section = s;
    TOPIC_INDEX.set(t.id, t);
  }
}
const SECTION_INDEX = new Map(sections.map((s) => [s.id, s]));
const ALL_TOPICS = [...TOPIC_INDEX.values()];

const STORE_KEY = "anormalmath.v1";
const store = loadStore();

function loadStore() {
  const base = { theme: "auto", topics: {}, answered: 0, correct: 0, bookmarks: [], tests: [] };
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
    return Object.assign(base, saved, {
      bookmarks: Array.isArray(saved.bookmarks) ? saved.bookmarks : [],
      tests: Array.isArray(saved.tests) ? saved.tests : [],
    });
  } catch {
    return base;
  }
}
function saveStore() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
  } catch { /* private mode: progress simply does not persist */ }
}
function topicStat(id) {
  return store.topics[id] || { solved: 0, correct: 0 };
}
function bump(id, ok) {
  const t = store.topics[id] || (store.topics[id] = { solved: 0, correct: 0 });
  t.solved += 1;
  if (ok) t.correct += 1;
  store.answered += 1;
  if (ok) store.correct += 1;
  saveStore();
}
function isBookmarked(id) {
  return store.bookmarks.includes(id);
}
function toggleBookmark(id) {
  const i = store.bookmarks.indexOf(id);
  if (i >= 0) store.bookmarks.splice(i, 1);
  else store.bookmarks.push(id);
  saveStore();
  toast(i >= 0 ? "Xatcho'pdan olindi" : "Xatcho'pga qo'shildi");
}
const fmtTime = (sec) => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
};
const fmtDate = (ts) => {
  const d = new Date(ts);
  return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getFullYear()).slice(2)}`;
};

/* ---------------------------------- theme --------------------------------- */
function applyTheme() {
  const sysDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const dark = store.theme === "dark" || (store.theme === "auto" && sysDark);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  document.querySelector('meta[name="theme-color"]').setAttribute("content", dark ? "#070810" : "#eef1f7");
  document.getElementById("themeIcon").innerHTML = dark
    ? '<path d="M20 14.2A8 8 0 1 1 9.8 4 6.4 6.4 0 0 0 20 14.2z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>'
    : '<circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 2.6v2.3M12 19.1v2.3M2.6 12h2.3M19.1 12h2.3M5.4 5.4l1.6 1.6M17 17l1.6 1.6M18.6 5.4 17 7M7 17l-1.6 1.6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>';
}
document.getElementById("themeBtn").addEventListener("click", () => {
  store.theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  saveStore();
  applyTheme();
});
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  if (store.theme === "auto") applyTheme();
});

/* ---------------------------------- router -------------------------------- */
const view = document.getElementById("view");
const backBtn = document.getElementById("backBtn");
const topTitle = document.getElementById("topTitle");
const tabbar = document.getElementById("tabbar");

function go(hash) {
  if (location.hash === hash) paint();
  else location.hash = hash;
}
backBtn.addEventListener("click", () => history.back());
document.getElementById("searchBtn").addEventListener("click", () => go("#/search"));

function parseRoute() {
  const h = location.hash.replace(/^#\/?/, "");
  const parts = h.split("/").filter(Boolean);
  if (!parts.length) return { name: "home" };
  if (parts[0] === "s") return { name: "section", id: parts[1] };
  if (parts[0] === "t") return { name: "topic", sectionId: parts[1], topicId: parts[2] };
  if (parts[0] === "test") return { name: "test", sectionId: parts[1] };
  if (parts[0] === "result") return { name: "result", testId: parts[1] };
  if (parts[0] === "history") return { name: "history" };
  if (parts[0] === "bookmarks") return { name: "bookmarks" };
  if (parts[0] === "search") return { name: "search" };
  if (parts[0] === "stats") return { name: "stats" };
  if (parts[0] === "settings") return { name: "settings" };
  return { name: "home" };
}

function setTab(name) {
  tabbar.querySelectorAll(".tab").forEach((b) => b.classList.toggle("is-active", b.dataset.tab === name));
  movePill();
}

function movePill() {
  const pill = document.getElementById("tabPill");
  const active = tabbar.querySelector(".tab.is-active");
  if (!pill || !active) return;
  const x = active.offsetLeft;
  const w = active.offsetWidth;
  if (w) {
    pill.style.width = `${w}px`;
    pill.style.transform = `translateX(${x}px)`;
  }
}
window.addEventListener("resize", movePill);

tabbar.addEventListener("click", (e) => {
  const b = e.target.closest(".tab");
  if (!b) return;
  const map = { home: "#/", stats: "#/stats", settings: "#/settings" };
  go(map[b.dataset.tab]);
});

/* -------------------------------- lifecycle -------------------------------- */
let practice = null;
let testSession = null;

function render() {
  paint();
}

function paint() {
  const r = parseRoute();

  // leaving a running test cancels it
  if (r.name !== "test" && testSession && testSession.timerId) {
    clearInterval(testSession.timerId);
    testSession = null;
  }

  const chromeless = r.name === "home" || r.name === "stats" || r.name === "settings" || r.name === "search";
  backBtn.hidden = chromeless;
  setTab(r.name === "stats" || r.name === "history" || r.name === "result" ? "stats" : r.name === "settings" ? "settings" : "home");

  if (r.name === "home") {
    topTitle.textContent = "AnormalMath";
    view.innerHTML = homeView();
    bindHome();
  } else if (r.name === "section") {
    const s = SECTION_INDEX.get(r.id);
    if (!s) return go("#/");
    topTitle.textContent = s.title;
    view.innerHTML = sectionView(s);
    bindSection(s);
  } else if (r.name === "topic") {
    const t = TOPIC_INDEX.get(r.topicId) || TOPIC_INDEX.get(`${r.sectionId}.${r.topicId}`);
    if (!t) return go("#/");
    topTitle.textContent = t.title;
    mountTopic(t);
  } else if (r.name === "test") {
    topTitle.textContent = "Test";
    mountTest();
  } else if (r.name === "result") {
    const res = store.tests.find((x) => x.id === r.testId);
    topTitle.textContent = "Natija";
    view.innerHTML = resultView(res);
    bindResult(res);
  } else if (r.name === "history") {
    topTitle.textContent = "Tarix";
    view.innerHTML = historyView();
    bindHistory();
  } else if (r.name === "bookmarks") {
    topTitle.textContent = "Xatcho'plar";
    view.innerHTML = bookmarksView();
    bindList();
  } else if (r.name === "search") {
    topTitle.textContent = "Qidiruv";
    view.innerHTML = searchView("");
    bindSearch();
  } else if (r.name === "stats") {
    topTitle.textContent = "Hisobot";
    view.innerHTML = statsView();
    bindList();
  } else {
    topTitle.textContent = "Sozlamalar";
    view.innerHTML = settingsView();
    bindSettings();
  }
  window.scrollTo({ top: 0, behavior: "auto" });

  // one-layer entrance: the old DOM is already gone, so nothing overlaps
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!calm) {
    view.classList.remove("swap");
    void view.offsetWidth;
    view.classList.add("swap");
  }
  requestAnimationFrame(movePill);
}

/* ---------------------------------- views --------------------------------- */
function homeView() {
  const acc = store.answered ? Math.round((store.correct / store.answered) * 100) : 0;
  const cards = sections
    .map((s) => {
      const solved = s.topics.reduce((n, t) => n + topicStat(t.id).solved, 0);
      return `
      <button class="card glass" data-section="${s.id}"
              style="--glow:${s.accent}55;--chip-bg:${s.accent}22;--chip-fg:${s.accent}">
        <span class="count">${s.topics.length} mavzu</span>
        <div class="glyph">${s.glyph}</div>
        <h3>${s.title}</h3>
        <p>${s.blurb}</p>
        ${solved ? `<div class="progressline"><i style="width:${Math.min(100, solved * 6)}%"></i></div>` : ""}
      </button>`;
    })
    .join("");

  return `
    <section class="hero">
      <h1>Matematikani o'rgan,<br>adashmasdan.</h1>
      <p>${sections.length} bo'lim · ${ALL_TOPICS.length} mavzu · cheksiz mashq. Har savolda maslahat va qadam-baqadam yechim.</p>
    </section>
    <div class="actions" style="margin-bottom:14px">
      <button class="btn primary wide" id="mixBtn">Aralash test · 10 savol · taymer</button>
    </div>
    <div class="grid">${cards}</div>
    <section class="panel glass" style="margin-top:16px">
      <h5>Bugungi holat</h5>
      <p style="margin:0;display:flex;gap:18px;font-size:13.5px;color:var(--ink-2)">
        <span>Yechilgan: <b style="color:var(--ink)">${store.answered}</b></span>
        <span>Aniqlik: <b style="color:var(--ink)">${acc}%</b></span>
        <span>Testlar: <b style="color:var(--ink)">${store.tests.length}</b></span>
      </p>
    </section>`;
}

function bindHome() {
  view.querySelectorAll(".card[data-section]").forEach((el) =>
    el.addEventListener("click", () => go(`#/s/${el.dataset.section}`)),
  );
  const mix = document.getElementById("mixBtn");
  if (mix) mix.addEventListener("click", () => startTest("mixed"));
}

function sectionView(s) {
  const rows = s.topics
    .map((t, i) => {
      const st = topicStat(t.id);
      const pct = st.solved ? Math.round((st.correct / st.solved) * 100) : 0;
      return `
      <button class="row glass" data-topic="${t.id}"
              style="--chip-bg:${s.accent}22;--chip-fg:${s.accent}">
        <span class="num">${i + 1}</span>
        <span class="meta">
          <h4>${t.title} ${isBookmarked(t.id) ? "★" : ""}</h4>
          <small>${st.solved ? `${st.solved} yechilgan · ${pct}% aniqlik` : t.tagline || "Mashqni boshlash"}</small>
        </span>
        ${st.solved ? '<span class="done">✓</span>' : ""}
      </button>`;
    })
    .join("");
  return `
    <section class="hero">
      <h1 style="font-size:23px;color:${s.accent}">${s.title}</h1>
      <p>${s.blurb}</p>
    </section>
    <div class="actions" style="margin-bottom:14px">
      <button class="btn primary wide" data-test="${s.id}">Testni boshlash · ${Math.min(10, s.topics.length)} savol</button>
    </div>
    <div class="list">${rows}</div>`;
}

function bindSection(s) {
  view.querySelectorAll(".row[data-topic]").forEach((el) =>
    el.addEventListener("click", () => go(`#/t/${s.id}/${el.dataset.topic}`)),
  );
  const btn = view.querySelector("[data-test]");
  if (btn) btn.addEventListener("click", () => startTest(btn.dataset.test));
}

function statsView() {
  const acc = store.answered ? Math.round((store.correct / store.answered) * 100) : 0;
  const bars = sections
    .map((s) => {
      const solved = s.topics.reduce((n, t) => n + topicStat(t.id).solved, 0);
      const correct = s.topics.reduce((n, t) => n + topicStat(t.id).correct, 0);
      const p = solved ? Math.round((correct / solved) * 100) : 0;
      return `
        <div class="row glass" style="cursor:default">
          <span class="num" style="--chip-bg:${s.accent}22;--chip-fg:${s.accent}">${s.glyph}</span>
          <span class="meta">
            <h4>${s.title}</h4>
            <small>${solved} ta yechilgan</small>
            <div class="bar"><i style="width:${p}%"></i></div>
          </span>
          <span class="done" style="color:var(--ink-2)">${p}%</span>
        </div>`;
    })
    .join("");
  return `
    <section class="hero"><h1>Hisobot</h1><p>Barcha mashqlar bo'yicha yig'ilgan natija.</p></section>
    <div class="statgrid">
      <div class="stat glass"><b>${store.answered}</b><span>Javob</span></div>
      <div class="stat glass"><b>${acc}%</b><span>Aniqlik</span></div>
      <div class="stat glass"><b>${store.tests.length}</b><span>Test</span></div>
    </div>
    <button class="linkrow" data-goto="#/history"><span>Testlar tarixi</span><span>${store.tests.length} →</span></button>
    <button class="linkrow" data-goto="#/bookmarks" style="margin-bottom:16px"><span>Xatcho'plar</span><span>${store.bookmarks.length} →</span></button>
    <div class="list">${bars}</div>`;
}

function settingsView() {
  const opt = (v, label) =>
    `<button class="btn ${store.theme === v ? "primary" : ""}" data-theme-opt="${v}">${label}</button>`;
  return `
    <section class="hero"><h1>Sozlamalar</h1><p>Ko'rinish va ma'lumot.</p></section>
    <div class="panel glass">
      <h5>Ko'rinish</h5>
      <div class="actions">
        ${opt("light", "Yorug'")}${opt("dark", "Tungi")}${opt("auto", "Tizim")}
      </div>
    </div>
    <div class="panel glass">
      <h5>Ma'lumot</h5>
      <p>Progress, testlar tarixi va xatcho'plar brauzer xotirasida saqlanadi — hisob shart emas.</p>
      <div class="actions"><button class="btn wide" id="resetBtn" style="color:var(--bad)">Hammasini tozalash</button></div>
    </div>
    <div class="panel glass">
      <h5>Ilova haqida</h5>
      <p>AnormalMath · 1.1.0<br>${sections.length} bo'lim · ${ALL_TOPICS.length} mavzu</p>
    </div>`;
}

function bindSettings() {
  view.querySelectorAll("[data-theme-opt]").forEach((b) =>
    b.addEventListener("click", () => {
      store.theme = b.dataset.themeOpt;
      saveStore();
      applyTheme();
      paint();
    }),
  );
  const r = document.getElementById("resetBtn");
  if (r)
    r.addEventListener("click", () => {
      store.topics = {};
      store.answered = 0;
      store.correct = 0;
      store.bookmarks = [];
      store.tests = [];
      saveStore();
      paint();
      toast("Hammasi tozalandi");
    });
}

function bindList() {
  view.querySelectorAll("[data-goto]").forEach((el) =>
    el.addEventListener("click", () => go(el.dataset.goto)),
  );
  view.querySelectorAll("[data-open-topic]").forEach((el) => {
    const t = TOPIC_INDEX.get(el.dataset.openTopic);
    if (t) el.addEventListener("click", () => go(`#/t/${t.sectionId}/${t.id}`));
  });
}

/* ------------------------------- practice --------------------------------- */
function mountTopic(topic) {
  practice = { topic, q: makeQuestion(topic), picked: null, hint: false };
  paintTopic();
}

function paintTopic() {
  const { topic, q } = practice;
  const s = topic.section;
  const st = topicStat(topic.id);
  const acc = st.solved ? Math.round((st.correct / st.solved) * 100) : 0;
  const bm = isBookmarked(topic.id);

  const choices = q.choices
    .map(
      (c, i) => `
      <button class="choice" data-i="${i}">
        <span class="k">${"ABCD"[i]}</span><span>${c}</span>
      </button>`,
    )
    .join("");

  view.innerHTML = `
    <div class="qcard glass">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
        <div class="tag" style="margin:0;color:${s.accent}">${s.title} · ${topic.title}</div>
        <button class="bookmark ${bm ? "on" : ""}" id="bmBtn" aria-label="Xatcho'p">
          <svg viewBox="0 0 24 24" width="17" height="17"><path d="M12 3.6l2.6 5.3 5.8.85-4.2 4.1 1 5.75L12 16.9l-5.2 2.7 1-5.75-4.2-4.1 5.8-.85z" fill="${bm ? "currentColor" : "none"}" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
        </button>
      </div>
      <div class="qtext">${q.prompt}</div>
      ${st.solved ? `<div class="progressline"><i style="width:${acc}%"></i></div>` : ""}
    </div>
    <div class="choices" id="choices">${choices}</div>
    <div class="actions">
      <button class="btn" id="hintBtn">Maslahat</button>
      <button class="btn" id="solBtn" ${practice.picked === null ? "disabled" : ""}>Yechim</button>
      <button class="btn primary wide" id="nextBtn" hidden>Keyingi savol →</button>
    </div>
    <div id="hintBox" class="panel glass hidden"></div>
    <div id="solBox" class="panel glass hidden"></div>`;

  view.querySelectorAll(".choice").forEach((el) => el.addEventListener("click", () => answerPractice(Number(el.dataset.i))));
  document.getElementById("bmBtn").addEventListener("click", () => {
    toggleBookmark(topic.id);
    paintTopic();
  });
  document.getElementById("hintBtn").addEventListener("click", () => {
    practice.hint = !practice.hint;
    const box = document.getElementById("hintBox");
    box.classList.toggle("hidden", !practice.hint);
    box.innerHTML = `<h5>Maslahat</h5><p>${q.hint}</p>`;
  });
  document.getElementById("solBtn").addEventListener("click", revealSolution);
  document.getElementById("nextBtn").addEventListener("click", () => mountTopic(topic));
}

function answerPractice(i) {
  if (practice.picked !== null) return;
  practice.picked = i;
  const ok = i === practice.q.answerIndex;
  bump(practice.topic.id, ok);

  view.querySelectorAll(".choice").forEach((el, k) => {
    el.disabled = true;
    if (k === practice.q.answerIndex) el.classList.add("is-right");
    else if (k === i) el.classList.add("is-wrong");
  });

  document.getElementById("solBtn").disabled = false;
  document.getElementById("nextBtn").hidden = false;
  toast(ok ? "To'g'ri ✓" : "Adashdingiz — yechimni ko'ring");
  revealSolution();
}

function revealSolution() {
  const { q, picked } = practice;
  const box = document.getElementById("solBox");
  const ok = picked === q.answerIndex;
  const verdict = picked === null ? "" : `<p class="verdict ${ok ? "ok" : "bad"}">${ok ? "To'g'ri javob" : "Noto'g'ri"}</p>`;
  box.classList.remove("hidden");
  box.innerHTML = `
    ${verdict}
    <h5>Yechim</h5>
    <ol>${q.steps.map((x) => `<li>${x}</li>`).join("")}</ol>
    ${q.theory ? `<h5 style="margin-top:14px">Nazariya</h5><p>${q.theory}</p>` : ""}`;
  box.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

/* -------------------------------- test mode -------------------------------- */
function startTest(sectionId) {
  const s = SECTION_INDEX.get(sectionId) || null;
  const pool = s ? s.topics : ALL_TOPICS;
  const picked = shuffle(pool).slice(0, Math.min(10, pool.length));
  testSession = {
    id: `t${Date.now().toString(36)}`,
    sectionId: s ? s.id : "mixed",
    title: s ? s.title : "Aralash test",
    questions: picked.map((t) => ({
      topicId: t.id,
      title: t.title,
      section: t.section.title,
      accent: t.section.accent,
      q: makeQuestion(t),
    })),
    answers: new Array(picked.length).fill(null),
    index: 0,
    startedAt: Date.now(),
    duration: picked.length * 60,
    timerId: null,
    deadline: 0,
  };
  go(`#/test/${testSession.sectionId}`);
}

function mountTest() {
  const ts = testSession;
  if (!ts) return go("#/");
  if (!ts.timerId) {
    ts.deadline = Date.now() + ts.duration * 1000;
    ts.timerId = setInterval(tickTest, 250);
  }
  paintTestQuestion();
}

function tickTest() {
  const ts = testSession;
  if (!ts) return;
  const left = Math.max(0, Math.ceil((ts.deadline - Date.now()) / 1000));
  const el = document.getElementById("testTimer");
  if (el) {
    el.textContent = fmtTime(left);
    el.classList.toggle("low", left <= 30);
  }
  if (left <= 0) finishTest();
}

function paintTestQuestion() {
  const ts = testSession;
  if (!ts) return;
  const item = ts.questions[ts.index];
  const left = Math.max(0, Math.ceil(((ts.deadline || Date.now() + ts.duration * 1000) - Date.now()) / 1000));
  const choices = item.q.choices
    .map((c, i) => `<button class="choice" data-i="${i}"><span class="k">${"ABCD"[i]}</span><span>${c}</span></button>`)
    .join("");

  view.innerHTML = `
    <div class="testbar glass">
      <span class="step">${ts.index + 1}/${ts.questions.length}</span>
      <span class="prog"><i style="width:${((ts.index) / ts.questions.length) * 100}%"></i></span>
      <span class="clock ${left <= 30 ? "low" : ""}" id="testTimer">${fmtTime(left)}</span>
    </div>
    <div class="qcard glass">
      <div class="tag" style="color:${item.accent}">${item.section} · ${item.title}</div>
      <div class="qtext">${item.q.prompt}</div>
    </div>
    <div class="choices">${choices}</div>`;

  view.querySelectorAll(".choice").forEach((el) => el.addEventListener("click", () => answerTest(Number(el.dataset.i))));
}

function answerTest(i) {
  const ts = testSession;
  if (!ts || ts.answers[ts.index] !== null) return;
  ts.answers[ts.index] = i;
  const item = ts.questions[ts.index];
  view.querySelectorAll(".choice").forEach((el, k) => {
    el.disabled = true;
    if (k === item.q.answerIndex) el.classList.add("is-right");
    else if (k === i) el.classList.add("is-wrong");
  });
  setTimeout(() => {
    if (!testSession) return;
    if (ts.index + 1 >= ts.questions.length) finishTest();
    else {
      ts.index += 1;
      paintTestQuestion();
    }
  }, 460);
}

function finishTest() {
  const ts = testSession;
  if (!ts) return;
  clearInterval(ts.timerId);
  const per = new Map();
  let correct = 0;
  const details = ts.questions.map((item, i) => {
    const ok = ts.answers[i] === item.q.answerIndex;
    if (ok) correct += 1;
    const rec = per.get(item.topicId) || { topicId: item.topicId, title: item.title, section: item.section, correct: 0, total: 0 };
    rec.total += 1;
    if (ok) rec.correct += 1;
    per.set(item.topicId, rec);
    if (ts.answers[i] !== null) bump(item.topicId, ok);
    return { title: item.title, ok, picked: ts.answers[i] };
  });

  const res = {
    id: ts.id,
    date: Date.now(),
    sectionId: ts.sectionId,
    title: ts.title,
    total: ts.questions.length,
    answered: ts.answers.filter((a) => a !== null).length,
    correct,
    percent: Math.round((correct / ts.questions.length) * 100),
    usedSec: Math.round((Date.now() - ts.startedAt) / 1000),
    topics: [...per.values()],
    details,
  };
  store.tests.unshift(res);
  store.tests = store.tests.slice(0, 40);
  saveStore();
  testSession = null;
  go(`#/result/${res.id}`);
}

/* -------------------------------- result ---------------------------------- */
function resultView(res) {
  if (!res) return `<section class="hero"><h1>Natija topilmadi</h1><p>Tarixdan qayta oching.</p></section>`;
  const weak = res.topics
    .filter((t) => t.correct < t.total)
    .sort((a, b) => a.correct / a.total - b.correct / b.total);
  const strong = res.topics.filter((t) => t.correct === t.total);
  const good = res.percent >= 70;

  return `
    <div class="result-hero glass">
      <div class="pct" style="color:${good ? "var(--ok)" : "var(--bad)"}">${res.percent}%</div>
      <div class="lbl">${res.correct} / ${res.total} to'g'ri</div>
      <div class="sub">${res.title} · ${fmtDate(res.date)} · ${fmtTime(res.usedSec)} sarflandi</div>
    </div>
    ${
      weak.length
        ? `<div class="panel glass"><h5>Zaif joylar</h5>${weak
            .map(
              (t) => `<div class="weakrow"><span class="nm">${t.title}</span><span class="sc">${t.correct}/${t.total}</span></div>`,
            )
            .join("")}</div>`
        : `<div class="panel glass"><h5>Zaif joylar</h5><p>Hammasi to'g'ri — zaif mavzu yo'q.</p></div>`
    }
    ${
      strong.length
        ? `<div class="panel glass"><h5>Mustahkam</h5>${strong
            .map((t) => `<div class="weakrow"><span class="nm">${t.title}</span><span class="sc ok">${t.correct}/${t.total}</span></div>`)
            .join("")}</div>`
        : ""
    }
    <div class="actions" style="margin-top:14px">
      <button class="btn" id="againBtn">Yana urinish</button>
      <button class="btn primary" id="histBtn">Tarix</button>
    </div>`;
}

function bindResult(res) {
  const again = document.getElementById("againBtn");
  if (again) again.addEventListener("click", () => startTest(res ? res.sectionId : "mixed"));
  const h = document.getElementById("histBtn");
  if (h) h.addEventListener("click", () => go("#/history"));
}

/* -------------------------------- history --------------------------------- */
function historyView() {
  if (!store.tests.length) {
    return `<section class="hero"><h1>Tarix</h1><p>Hali test yechilmagan. Bosh sahifadan aralash testni boshlang.</p></section>`;
  }
  const rows = store.tests
    .map((r) => {
      const good = r.percent >= 70;
      return `
      <button class="hrow glass" data-result="${r.id}">
        <span class="badge" style="background:${good ? "rgba(16,185,129,0.16)" : "rgba(239,68,68,0.14)"};color:${good ? "var(--ok)" : "var(--bad)"}">${r.percent}%</span>
        <span class="meta">
          <h4>${r.title}</h4>
          <small>${r.correct}/${r.total} · ${fmtDate(r.date)} · ${fmtTime(r.usedSec)}</small>
        </span>
      </button>`;
    })
    .join("");
  return `<section class="hero"><h1>Tarix</h1><p>Oxirgi ${store.tests.length} test.</p></section><div class="list">${rows}</div>`;
}

function bindHistory() {
  view.querySelectorAll("[data-result]").forEach((el) =>
    el.addEventListener("click", () => go(`#/result/${el.dataset.result}`)),
  );
}

/* ------------------------------- bookmarks -------------------------------- */
function bookmarksView() {
  const items = store.bookmarks.map((id) => TOPIC_INDEX.get(id)).filter(Boolean);
  if (!items.length) {
    return `<section class="hero"><h1>Xatcho'plar</h1><p>Hozircha bo'sh. Savol ekranidagi ★ tugmasi bilan saqlang.</p></section>`;
  }
  const rows = items
    .map(
      (t) => `
      <button class="row glass" data-open-topic="${t.id}" style="--chip-bg:${t.section.accent}22;--chip-fg:${t.section.accent}">
        <span class="num">★</span>
        <span class="meta"><h4>${t.title}</h4><small>${t.section.title}</small></span>
      </button>`,
    )
    .join("");
  return `<section class="hero"><h1>Xatcho'plar</h1><p>${items.length} mavzu saqlangan.</p></section><div class="list">${rows}</div>`;
}

/* --------------------------------- search --------------------------------- */
function resultsHtml(q) {
  if (!q) return `<p style="color:var(--ink-3);font-size:13px">${ALL_TOPICS.length} mavzu ichidan qidiring.</p>`;
  const hits = ALL_TOPICS.filter((t) =>
    `${t.title} ${t.tagline || ""} ${t.section.title}`.toLowerCase().includes(q),
  ).slice(0, 40);
  if (!hits.length) return `<p style="color:var(--ink-3);font-size:13px">Hech narsa topilmadi.</p>`;
  return `<div class="list">${hits
    .map(
      (t) => `
      <button class="row glass" data-open-topic="${t.id}" style="--chip-bg:${t.section.accent}22;--chip-fg:${t.section.accent}">
        <span class="num">${t.section.glyph}</span>
        <span class="meta"><h4>${t.title}</h4><small>${t.section.title}</small></span>
      </button>`,
    )
    .join("")}</div>`;
}

function searchView(query) {
  return `
    <div class="searchbox glass">
      <svg viewBox="0 0 24 24" width="19" height="19" style="color:var(--ink-3)"><circle cx="11" cy="11" r="6.4" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M16 16l4.2 4.2" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>
      <input id="q" type="search" placeholder="Mavzu yoki bo'lim nomi…" value="${query.replace(/"/g, "&quot;")}" autocomplete="off">
    </div>
    <div id="results">${resultsHtml(query.trim().toLowerCase())}</div>`;
}

function bindSearch() {
  const input = document.getElementById("q");
  if (!input) return;
  const refresh = () => {
    const box = document.getElementById("results");
    if (box) box.innerHTML = resultsHtml(input.value.trim().toLowerCase());
    bindList();
  };
  input.addEventListener("input", refresh);
  bindList();
}

/* ---------------------------------- toast --------------------------------- */
let toastTimer = null;
function toast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 1700);
}

/* --------------------------------- splash --------------------------------- */
function initSplash() {
  const el = document.getElementById("splash");
  if (!el) return;
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let seen = false;
  try {
    seen = sessionStorage.getItem("anormalmath.splash") === "1";
  } catch { /* private mode: the intro simply plays again */ }

  if (seen || calm) {
    el.remove();
    return;
  }

  const video = document.getElementById("splashVideo");
  let closed = false;
  const close = () => {
    if (closed) return;
    closed = true;
    try {
      sessionStorage.setItem("anormalmath.splash", "1");
    } catch { /* ignore */ }
    el.classList.add("out");
    setTimeout(() => el.remove(), 640);
  };

  if (video) {
    video.addEventListener("ended", close);
    const started = video.play();
    if (started && started.catch) started.catch(() => {});
  }
  el.addEventListener("click", close);
  const skip = document.getElementById("splashSkip");
  if (skip) {
    skip.addEventListener("click", (e) => {
      e.stopPropagation();
      close();
    });
  }
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
  setTimeout(close, 23000); // hard cap in case playback stalls
}

/* ---------------------------------- boot ---------------------------------- */
window.addEventListener("hashchange", render);
if (!location.hash) location.replace("#/");
applyTheme();
initSplash();
render();
