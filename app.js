(() => {
  "use strict";

  // ---- Backend (Supabase, EU Frankfurt). The publishable key is meant to be public;
  // the database only allows the functions below, never direct table access.
  const SUPA_URL = "https://fpugcvhnaibadyecchfn.supabase.co";
  const SUPA_KEY = "sb_publishable_rLSLcAgPdRLFE5LpWN4K9Q_6w0n1xSe";

  const ERR = {
    INVALID_CODE: "This code does not exist. Check it again.",
    BAD_NICK: "Nickname: 3–16 letters, numbers or _ (no spaces).",
    NICK_TAKEN: "This nickname is already taken.",
    NO_NICK: "Choose a nickname first.",
    TOO_FAST: "Slow down 😉 Wait a few seconds and try again.",
    BAD_OPPONENT: "This player does not exist.",
    TOO_MANY_OPEN: "You already have 5 open duels. Wait for answers first.",
    BAD_DUEL: "This duel is not available any more.",
    BAD_RESULT: "Something went wrong with your result."
  };

  async function rpc(fn, args) {
    let res;
    try {
      res = await fetch(`${SUPA_URL}/rest/v1/rpc/${fn}`, {
        method: "POST",
        headers: { apikey: SUPA_KEY, "Content-Type": "application/json" },
        body: JSON.stringify(args || {})
      });
    } catch (e) {
      throw new Error("No connection to the server.");
    }
    const text = await res.text();
    const data = text ? JSON.parse(text) : null;
    if (!res.ok) {
      const key = data && data.message;
      throw new Error(ERR[key] || key || "Server error");
    }
    return data;
  }

  // ---- Local storage (safe wrappers)
  const store = {
    get(k, d) { try { const v = localStorage.getItem("lf_" + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("lf_" + k, JSON.stringify(v)); } catch (e) {} },
    del(k) { try { localStorage.removeItem("lf_" + k); } catch (e) {} }
  };

  const state = { code: store.get("code", null), me: null, tab: "home" };
  const $main = document.getElementById("main");
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const MODES = { vocab1: "Vocabulary – " + LISTS.vocab1.title, vocab2: "Vocabulary – " + LISTS.vocab2.title, vocab3: "Vocabulary – " + LISTS.vocab3.title, interview: "Vocabulary – Job interview", grammar: "Grammar – Questions" };

  // ---- Seeded random (same seed = same questions, used for duels)
  function rng(seed) {
    let a = seed >>> 0;
    return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  function shuffle(arr, rand) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  const newSeed = () => Math.floor(Math.random() * 2147483647);

  // ---- Answer checking
  function norm(s) {
    return String(s).toLowerCase().replace(/[’`´]/g, "'").replace(/\bsomething\b/g, "sth").replace(/\bsth\.?/g, "sth")
      .replace(/[.!?,;:]+$/g, "").replace(/^to\s+/, "").replace(/\s+/g, " ").replace(/\s*-\s*/g, "-").trim();
  }
  function isCorrect(input, answers) { const n = norm(input); return n.length > 0 && answers.some((a) => norm(a) === n); }
  function lev(a, b) {
    const m = a.length, n = b.length; if (Math.abs(m - n) > 2) return 9;
    const d = Array.from({ length: m + 1 }, (_, i) => [i]);
    for (let j = 1; j <= n; j++) d[0][j] = j;
    for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[m][n];
  }
  const almost = (input, answers) => answers.some((a) => lev(norm(input), norm(a)) === 1);

  // ---- Levels
  function level(xp) {
    let cur = LEVELS[0], next = null;
    for (let i = 0; i < LEVELS.length; i++) { if (xp >= LEVELS[i][0]) { cur = LEVELS[i]; next = LEVELS[i + 1] || null; } }
    const pct = next ? Math.round(((xp - cur[0]) / (next[0] - cur[0])) * 100) : 100;
    return { name: cur[1], next: next ? next[1] : null, toNext: next ? next[0] - xp : 0, pct };
  }

  // ---- Streak (local, per device)
  function touchStreak() {
    const today = new Date().toISOString().slice(0, 10);
    const s = store.get("streak", { last: null, days: 0 });
    if (s.last === today) return s.days;
    const y = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
    s.days = s.last === y ? s.days + 1 : 1; s.last = today; store.set("streak", s); return s.days;
  }

  // ---- Header
  function renderMe() {
    const el = document.getElementById("me");
    if (state.me && state.me.nickname) {
      const lv = level(state.me.xp);
      el.innerHTML = `<b>${esc(state.me.nickname)}</b> · ${esc(lv.name)}<br>${state.me.xp} XP`;
    } else el.innerHTML = state.code ? "" : "not signed in";
  }

  // ---- Router
  function go(tab, arg) {
    state.tab = tab;
    document.querySelectorAll(".tabs button").forEach((b) => b.classList.toggle("on", b.dataset.go === tab));
    window.scrollTo(0, 0);
    ({ home: viewHome, learn: viewLearn, practice: viewPractice, duels: viewDuels, ranking: viewRanking })[tab](arg);
  }
  document.addEventListener("click", (e) => { const b = e.target.closest("[data-go]"); if (b) go(b.dataset.go); });

  // ---- Home / sign in
  function viewHome() {
    if (!state.code) return viewSignIn();
    if (state.me && !state.me.nickname) return viewNickname();
    const me = state.me || { xp: 0, week: 0 };
    const lv = level(me.xp);
    const streak = store.get("streak", { days: 0 }).days;
    $main.innerHTML = `
      <div class="card hero">
        <h1>Hi ${esc(me.nickname || "")}! 👋</h1>
        <div class="row" style="justify-content:space-between">
          <div><div class="muted">Your level</div><div class="stat" style="color:#fff">${esc(lv.name)}</div></div>
          <div><div class="muted">XP</div><div class="stat" style="color:#fff">${me.xp}</div></div>
          <div><div class="muted">This week</div><div class="stat" style="color:#fff">${me.week}</div></div>
          <div><div class="muted">Streak</div><div class="stat" style="color:#fff">🔥 ${streak}</div></div>
        </div>
        <div class="levelbar" style="margin-top:10px"><div style="width:${lv.pct}%"></div></div>
        <div class="muted" style="margin-top:6px">${lv.next ? `${lv.toNext} XP to <b>${esc(lv.next)}</b>` : "Top level reached – you're the CEO! 🎉"}</div>
      </div>
      <div class="grid">
        <div class="tile" data-go="learn"><b>📚 Learn</b><small>Flashcards and grammar rules – no pressure</small></div>
        <div class="tile" data-go="practice"><b>🎯 Practice</b><small>10 questions, collect XP</small></div>
        <div class="tile" data-go="duels"><b>⚔️ Duels</b><small>Challenge someone from 9abc or 9de</small></div>
        <div class="tile" data-go="ranking"><b>🏆 Ranking</b><small>9abc vs. 9de – who is ahead this week?</small></div>
      </div>
      <p class="muted center" style="margin-top:20px"><a href="#" id="logout">Sign out on this device</a></p>`;
    document.getElementById("logout").onclick = (e) => { e.preventDefault(); if (confirmBox()) { store.del("code"); state.code = null; state.me = null; renderMe(); go("home"); } };
  }
  function confirmBox() { return window.confirm("Sign out? Keep your code – you need it to sign in again."); }

  function viewSignIn() {
    $main.innerHTML = `
      <div class="card hero"><h1>Welcome! 💼</h1><p class="muted">Get ready for your oral exam: learn words, practise questions and challenge your classmates.</p></div>
      <div class="card">
        <h2>Sign in with your code</h2>
        <p class="muted">You get your code from your teacher (e.g. FOX-4K7P).</p>
        <input type="text" id="code" placeholder="FOX-4K7P" autocapitalize="characters" autocomplete="off" autocorrect="off" spellcheck="false">
        <div class="row" style="margin-top:12px"><button class="btn" id="go">Sign in</button></div>
        <div class="err" id="err"></div>
      </div>
      <div class="card"><h2>No code yet?</h2><p class="muted">You can still learn and practise. Your points are not saved.</p>
        <button class="btn alt" data-go="learn">Start learning</button></div>`;
    const inp = document.getElementById("code");
    const submit = async () => {
      const code = inp.value.trim().toUpperCase();
      if (!code) return;
      try { state.me = await rpc("login", { p_code: code }); state.code = code; store.set("code", code); renderMe(); go("home"); }
      catch (e) { document.getElementById("err").textContent = e.message; }
    };
    document.getElementById("go").onclick = submit;
    inp.onkeydown = (e) => { if (e.key === "Enter") submit(); };
  }

  function viewNickname() {
    $main.innerHTML = `
      <div class="card">
        <h1>Choose your nickname</h1>
        <p class="muted">Everybody sees it in the ranking. <b>Don't use your real name.</b> 3–16 letters or numbers.</p>
        <input type="text" id="nick" placeholder="e.g. SuperChef7" autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false" maxlength="16">
        <div class="row" style="margin-top:12px"><button class="btn" id="save">Save</button></div>
        <div class="err" id="err"></div>
      </div>`;
    const inp = document.getElementById("nick");
    const save = async () => {
      try { state.me = await rpc("set_nickname", { p_code: state.code, p_nick: inp.value.trim() }); renderMe(); go("home"); }
      catch (e) { document.getElementById("err").textContent = e.message; }
    };
    document.getElementById("save").onclick = save;
    inp.onkeydown = (e) => { if (e.key === "Enter") save(); };
  }

  // ---- Learn: flashcards (Leitner boxes, stored on the device) + grammar rules
  function viewLearn() {
    const tiles = Object.entries(LISTS).map(([k, l]) => {
      const boxes = store.get("box_" + k, {});
      const known = l.words.filter((w) => (boxes[w[0]] || 0) >= 3).length;
      return `<div class="tile" data-list="${k}"><b>${esc(l.title)}</b><small>${esc(l.sub)} · ${l.words.length} words</small>
        <div class="progress"><div style="width:${Math.round((known / l.words.length) * 100)}%"></div></div><small>${known} of ${l.words.length} learnt</small></div>`;
    }).join("");
    $main.innerHTML = `<h1>📚 Learn</h1>
      <h2>Vocabulary (flashcards)</h2><div class="grid">${tiles}</div>
      <h2>Grammar</h2><div class="grid"><div class="tile" id="rules"><b>❓ Asking questions</b><small>Rules + practice without points</small></div></div>`;
    $main.querySelectorAll("[data-list]").forEach((t) => (t.onclick = () => flashcards(t.dataset.list)));
    document.getElementById("rules").onclick = grammarRules;
  }

  function flashcards(key) {
    const list = LISTS[key];
    const boxes = store.get("box_" + key, {});
    let dir = store.get("dir", "de");
    const rand = rng(newSeed());
    let queue = shuffle(list.words, rand).sort((a, b) => (boxes[a[0]] || 0) - (boxes[b[0]] || 0)).slice(0, 12);
    let i = 0, flipped = false, done = 0;
    const draw = () => {
      if (i >= queue.length) {
        touchStreak();
        $main.innerHTML = `<div class="card center"><div class="big">🎉</div><h1>Round finished!</h1><p class="muted">${done} cards learnt in this round.</p>
          <div class="row" style="justify-content:center"><button class="btn" id="again">Next round</button><button class="btn alt" data-go="learn">Back</button></div></div>`;
        document.getElementById("again").onclick = () => flashcards(key);
        return;
      }
      const w = queue[i];
      const front = dir === "de" ? w[0] : w[1];
      const back = dir === "de" ? w[1] : w[0];
      const box = boxes[w[0]] || 0;
      $main.innerHTML = `
        <div class="row" style="justify-content:space-between"><h1>${esc(list.title)}</h1>
          <div class="toggle"><button data-dir="de" class="${dir === "de" ? "on" : ""}">DE → EN</button><button data-dir="en" class="${dir === "en" ? "on" : ""}">EN → DE</button></div></div>
        <div class="progress"><div style="width:${(i / queue.length) * 100}%"></div></div>
        <div class="flash ${flipped ? "back" : ""}" id="card">${esc(flipped ? back : front)}</div>
        <p class="muted center">${flipped ? "Did you know it?" : "Think of the answer, then tap the card."} · Box ${box + 1}/5</p>
        <div class="row" style="justify-content:center">${flipped
          ? `<button class="btn lime" id="yes">✔ I knew it</button><button class="btn alt" id="no">✘ Not yet</button>`
          : `<button class="btn" id="flip">Show answer</button>`}</div>`;
      $main.querySelectorAll("[data-dir]").forEach((b) => (b.onclick = () => { dir = b.dataset.dir; store.set("dir", dir); flipped = false; draw(); }));
      const flip = () => { flipped = true; draw(); };
      document.getElementById("card").onclick = flipped ? null : flip;
      if (!flipped) document.getElementById("flip").onclick = flip;
      else {
        document.getElementById("yes").onclick = () => { boxes[w[0]] = Math.min(box + 1, 4); store.set("box_" + key, boxes); done++; i++; flipped = false; draw(); };
        document.getElementById("no").onclick = () => { boxes[w[0]] = 0; store.set("box_" + key, boxes); queue.push(w); i++; flipped = false; draw(); };
      }
    };
    draw();
  }

  function grammarRules() {
    $main.innerHTML = `<h1>❓ Asking questions</h1>${GRAMMAR_RULES.map((r) => `<div class="card"><b>${esc(r.h)}</b><p>${r.b}</p></div>`).join("")}
      <div class="row"><button class="btn" id="try">Try 10 questions (no points)</button><button class="btn alt" data-go="learn">Back</button></div>`;
    document.getElementById("try").onclick = () => playRound({ mode: "grammar", seed: newSeed(), scored: false });
  }

  // ---- Practice
  function viewPractice() {
    const tiles = Object.keys(MODES).map((k) => `<div class="tile" data-mode="${k}"><b>${k === "grammar" ? "❓" : "🔤"} ${esc(MODES[k])}</b><small>${k === "grammar" ? "Question words, do/does/did, word order" : esc(LISTS[k].sub) + " – type the English word"}</small></div>`).join("");
    $main.innerHTML = `<h1>🎯 Practice</h1><p class="muted">10 questions. Every correct answer = 1 XP${state.code ? "" : " (sign in to save your XP)"}.</p><div class="grid">${tiles}</div>`;
    $main.querySelectorAll("[data-mode]").forEach((t) => (t.onclick = () => playRound({ mode: t.dataset.mode, seed: newSeed(), scored: !!state.code })));
  }

  function buildRound(mode, seed) {
    const rand = rng(seed);
    if (mode === "grammar") return shuffle(GRAMMAR, rand).slice(0, 10).map((g) => ({ ...g, o: g.o ? shuffle(g.o, rand) : null, w: g.w ? shuffle(g.w, rand) : null }));
    return shuffle(LISTS[mode].words, rand).slice(0, 10).map((w) => ({ t: "type", q: w[0], answers: w.slice(1) }));
  }

  // opts: {mode, seed, scored, duel: {kind:'create', opponent} | {kind:'answer', id}}
  function playRound(opts) {
    const qs = buildRound(opts.mode, opts.seed);
    let i = 0, score = 0;
    const started = Date.now();
    const next = () => { i++; i < qs.length ? draw() : finish(); };

    function header() {
      return `<div class="row" style="justify-content:space-between"><b>${esc(MODES[opts.mode])}</b><span class="muted">${i + 1} / ${qs.length} · ✔ ${score}</span></div>
        <div class="progress"><div style="width:${(i / qs.length) * 100}%"></div></div>`;
    }
    function feedback(ok, text) {
      return `<div class="feedback ${ok ? "ok" : "bad"}">${ok ? "✔ Correct!" : "✘ " + text}</div><div class="row" style="margin-top:12px"><button class="btn" id="next">Next ➜</button></div>`;
    }
    function bindNext() { const b = document.getElementById("next"); b.onclick = next; b.focus(); }

    function draw() {
      const q = qs[i];
      if (q.t === "type") {
        $main.innerHTML = `${header()}<div class="card"><div class="muted">Translate into English:</div><div class="prompt">${esc(q.q)}</div>
          <input type="text" id="ans" autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false">
          <div class="row" style="margin-top:12px"><button class="btn" id="check">Check</button></div><div id="fb"></div></div>`;
        const inp = document.getElementById("ans"); inp.focus();
        let checked = false;
        const check = () => {
          if (checked) return; checked = true; inp.disabled = true; document.getElementById("check").remove();
          const ok = isCorrect(inp.value, q.answers);
          if (ok) score++;
          const hint = !ok && almost(inp.value, q.answers) ? "Almost! Check your spelling: " : "Correct answer: ";
          document.getElementById("fb").innerHTML = feedback(ok, hint + "<b>" + esc(q.answers[0]) + "</b>");
          bindNext();
        };
        document.getElementById("check").onclick = check;
        inp.onkeydown = (e) => { if (e.key === "Enter") check(); };
      } else if (q.t === "qw" || q.t === "aux") {
        $main.innerHTML = `${header()}<div class="card"><div class="muted">${q.t === "qw" ? "Choose the right question word:" : "Choose the right helping verb:"}</div>
          <div class="prompt">${esc(q.q)}</div><div class="choices">${q.o.map((o) => `<button data-o="${esc(o)}">${esc(o)}</button>`).join("")}</div><div id="fb"></div></div>`;
        const btns = $main.querySelectorAll("[data-o]");
        btns.forEach((b) => (b.onclick = () => {
          btns.forEach((x) => { x.disabled = true; if (x.dataset.o === q.a) x.classList.add("ok"); });
          const ok = b.dataset.o === q.a; if (ok) score++; else b.classList.add("bad");
          document.getElementById("fb").innerHTML = feedback(ok, "Correct answer: <b>" + esc(q.a) + "</b>");
          bindNext();
        }));
      } else if (q.t === "order") {
        let picked = [];
        const drawOrder = () => {
          const left = q.w.filter((_, k) => !picked.includes(k));
          $main.innerHTML = `${header()}<div class="card"><div class="muted">Tap the words in the right order:</div>
            <div class="answerline chips" id="line">${picked.map((k, n) => `<button class="chip" data-back="${n}">${esc(q.w[k])}</button>`).join("") || '<span class="muted">…</span>'}<span style="font-size:20px;align-self:center">?</span></div>
            <div class="chips">${q.w.map((w, k) => picked.includes(k) ? "" : `<button class="chip" data-k="${k}">${esc(w)}</button>`).join("")}</div>
            <div class="row" style="margin-top:12px"><button class="btn" id="check" ${left.length ? "disabled" : ""}>Check</button></div><div id="fb"></div></div>`;
          $main.querySelectorAll("[data-k]").forEach((b) => (b.onclick = () => { picked.push(+b.dataset.k); drawOrder(); }));
          $main.querySelectorAll("[data-back]").forEach((b) => (b.onclick = () => { picked.splice(+b.dataset.back, 1); drawOrder(); }));
          document.getElementById("check").onclick = () => {
            const built = picked.map((k) => q.w[k]).join(" ") + "?";
            const ok = norm(built) === norm(q.a); if (ok) score++;
            $main.querySelectorAll(".chip").forEach((c) => (c.disabled = true));
            document.getElementById("check").remove();
            document.getElementById("fb").innerHTML = feedback(ok, "Correct question: <b>" + esc(q.a) + "</b>");
            bindNext();
          };
        };
        drawOrder();
      }
    }

    async function finish() {
      const secs = Math.round((Date.now() - started) / 1000);
      touchStreak();
      $main.innerHTML = `<div class="card center"><div class="big">${score >= 9 ? "🏆" : score >= 6 ? "👍" : "💪"}</div>
        <h1>${score} / ${qs.length}</h1><p class="muted">Time: ${secs} s</p><div id="srv" class="muted">${opts.scored ? "Saving …" : opts.duel ? "Sending …" : "Practice only – no points saved."}</div>
        <div class="row" style="justify-content:center;margin-top:14px"><button class="btn" id="again">Play again</button><button class="btn alt" data-go="${opts.duel ? "duels" : "practice"}">Back</button></div></div>`;
      document.getElementById("again").onclick = () => opts.duel ? go("duels") : playRound({ ...opts, seed: newSeed() });
      const srv = document.getElementById("srv");
      try {
        if (opts.duel && opts.duel.kind === "create") {
          await rpc("create_duel", { p_code: state.code, p_opponent: opts.duel.opponent, p_mode: opts.mode, p_seed: opts.seed, p_score: score, p_time: secs });
          srv.innerHTML = `Duel sent to <b>${esc(opts.duel.opponent)}</b>. +${score} XP. Now it's their turn! ⚔️`;
        } else if (opts.duel && opts.duel.kind === "answer") {
          const r = await rpc("play_duel", { p_code: state.code, p_duel: opts.duel.id, p_score: score, p_time: secs });
          const msg = { win: "You won! 🎉 +5 bonus XP", loss: "You lost this time. 💪", draw: "Draw! +2 bonus XP" }[r.result];
          srv.innerHTML = `<b>${msg}</b><br>${esc(opts.duel.other)}: ${r.other_score} / 10 in ${r.other_time} s`;
        } else if (opts.scored) {
          state.me = await rpc("submit_result", { p_code: state.code, p_mode: opts.mode, p_score: score, p_total: qs.length });
          srv.innerHTML = `+${score} XP saved ✔`;
        }
        if (state.code) { state.me = await rpc("login", { p_code: state.code }); renderMe(); }
      } catch (e) { srv.innerHTML = `<span class="err">${esc(e.message)}</span>`; }
    }
    draw();
  }

  // ---- Duels
  async function viewDuels() {
    if (!state.code) { $main.innerHTML = `<h1>⚔️ Duels</h1><div class="card"><p>Sign in with your code to challenge others.</p><button class="btn" data-go="home">Sign in</button></div>`; return; }
    $main.innerHTML = `<h1>⚔️ Duels</h1><p class="muted">Loading …</p>`;
    let duels = [], players = [];
    try { [duels, players] = await Promise.all([rpc("my_duels", { p_code: state.code }), rpc("list_players", { p_code: state.code })]); }
    catch (e) { $main.innerHTML = `<h1>⚔️ Duels</h1><p class="err">${esc(e.message)}</p>`; return; }
    const todo = duels.filter((d) => d.status === "open" && !d.i_challenged);
    const waiting = duels.filter((d) => d.status === "open" && d.i_challenged);
    const done = duels.filter((d) => d.status === "done");
    const res = (d) => d.my_score > d.other_score || (d.my_score === d.other_score && d.my_time < d.other_time) ? "🏆 won" : d.my_score === d.other_score && d.my_time === d.other_time ? "🤝 draw" : "lost";
    $main.innerHTML = `<h1>⚔️ Duels</h1>
      <div class="card"><h2 style="margin-top:0">New duel</h2>
        <p class="muted">You play 10 questions first. Then your opponent gets the same questions. More points win – if it's a draw, the faster player wins. Winner: +5 XP.</p>
        <input type="text" id="opp" list="players" placeholder="Nickname of your opponent" autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false">
        <datalist id="players">${players.map((p) => `<option value="${esc(p.nickname)}">${esc(p.course)}</option>`).join("")}</datalist>
        <div class="row" style="margin-top:10px">${Object.keys(MODES).map((k) => `<button class="btn small alt" data-dm="${k}">${esc(MODES[k].replace("Vocabulary – ", ""))}</button>`).join("")}</div>
        <div class="err" id="err"></div></div>
      <div class="card"><h2 style="margin-top:0">Your turn (${todo.length})</h2>${todo.length ? `<ul class="list">${todo.map((d) => `<li><span><b>${esc(d.other)}</b> challenged you · ${esc(MODES[d.mode])}</span><button class="btn small" data-play="${d.id}">Play</button></li>`).join("")}</ul>` : '<p class="muted">No open challenges.</p>'}</div>
      <div class="card"><h2 style="margin-top:0">Waiting for … (${waiting.length})</h2>${waiting.length ? `<ul class="list">${waiting.map((d) => `<li><span><b>${esc(d.other)}</b> · ${esc(MODES[d.mode])}</span><span class="muted">you: ${d.my_score}/10</span></li>`).join("")}</ul>` : '<p class="muted">Nothing open.</p>'}</div>
      <div class="card"><h2 style="margin-top:0">Results</h2>${done.length ? `<ul class="list">${done.map((d) => `<li><span>vs. <b>${esc(d.other)}</b> · ${d.my_score}:${d.other_score}</span><span>${res(d)}</span></li>`).join("")}</ul>` : '<p class="muted">No results yet.</p>'}</div>`;
    $main.querySelectorAll("[data-dm]").forEach((b) => (b.onclick = () => {
      const opp = document.getElementById("opp").value.trim();
      const known = players.find((p) => p.nickname.toLowerCase() === opp.toLowerCase());
      if (!known) { document.getElementById("err").textContent = "Choose a nickname from the list."; return; }
      playRound({ mode: b.dataset.dm, seed: newSeed(), scored: false, duel: { kind: "create", opponent: known.nickname } });
    }));
    $main.querySelectorAll("[data-play]").forEach((b) => (b.onclick = () => {
      const d = todo.find((x) => String(x.id) === b.dataset.play);
      playRound({ mode: d.mode, seed: d.seed, scored: false, duel: { kind: "answer", id: d.id, other: d.other } });
    }));
  }

  // ---- Ranking
  async function viewRanking() {
    $main.innerHTML = `<h1>🏆 Ranking</h1><p class="muted">Loading …</p>`;
    let lb;
    try { lb = await rpc("leaderboard"); } catch (e) { $main.innerHTML = `<h1>🏆 Ranking</h1><p class="err">${esc(e.message)}</p>`; return; }
    const max = Math.max(1, ...lb.courses.map((c) => c.per_player));
    const colors = { "9abc": "var(--cyan)", "9de": "var(--petrol)" };
    const table = (rows, mine) => rows.length ? `<table class="rank">${rows.map((r, n) => `<tr${mine && r.nickname === mine ? ' style="background:#fbfce9"' : ""}><td>${n + 1}.</td><td>${esc(r.nickname)} <span class="badge c${esc(r.course)}">${esc(r.course)}</span></td><td>${r.pts}</td></tr>`).join("")}</table>` : '<p class="muted">No points yet – be the first!</p>';
    const mine = state.me && state.me.nickname;
    $main.innerHTML = `<h1>🏆 Ranking</h1>
      <div class="card"><h2 style="margin-top:0">Course battle (this week)</h2>
        <p class="muted">Points per player – so the size of the course doesn't matter.</p>
        ${lb.courses.map((c) => `<div><b>${esc(c.course)}</b> <span class="muted">· ${c.pts} points · ${c.players} players</span>
          <div class="bar"><div style="width:${Math.max(8, (c.per_player / max) * 100)}%;background:${colors[c.course] || "var(--cyan)"}">${c.per_player}</div></div></div>`).join("")}</div>
      <div class="card"><h2 style="margin-top:0">Top 10 this week</h2>${table(lb.week_top, mine)}<p class="muted">New week, new chance: the weekly ranking starts again every Monday.</p></div>
      <div class="card"><h2 style="margin-top:0">Hall of Fame (all XP)</h2>${table(lb.all_top, mine)}</div>`;
  }

  // ---- Start
  (async () => {
    if (state.code) {
      try { state.me = await rpc("login", { p_code: state.code }); }
      catch (e) { if (e.message === ERR.INVALID_CODE) { store.del("code"); state.code = null; } }
    }
    renderMe();
    go("home");
  })();
})();
