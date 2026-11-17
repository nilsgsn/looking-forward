(() => {
  "use strict";
  const SUPA_URL = "https://fpugcvhnaibadyecchfn.supabase.co";
  const SUPA_KEY = "sb_publishable_rLSLcAgPdRLFE5LpWN4K9Q_6w0n1xSe";
  const ERR = {
    INVALID_CODE: "Diesen Code gibt es nicht.",
    NOT_TEACHER: "Das ist kein Lehrkraft-Code.",
    BAD_NICK: "Spitzname: 3–16 Buchstaben, Ziffern oder _.",
    NICK_TAKEN: "Dieser Spitzname ist schon vergeben.",
    BAD_OPPONENT: "Spieler:in nicht gefunden.",
    BAD_RESULT: "Ungültige Eingabe."
  };
  const MODE_SHORT = { vocab1: "T1", vocab2: "T2", vocab3: "T3", interview: "Int", grammar: "Gr" };
  const MODE_LONG = { vocab1: "Test 1 (25.11.)", vocab2: "Test 2 (02.12.)", vocab3: "Test 3 (09.12.)", interview: "Job interview", grammar: "Grammatik: Fragen" };

  async function rpc(fn, args) {
    let res;
    try {
      res = await fetch(`${SUPA_URL}/rest/v1/rpc/${fn}`, { method: "POST", headers: { apikey: SUPA_KEY, "Content-Type": "application/json" }, body: JSON.stringify(args || {}) });
    } catch (e) { throw new Error("Keine Verbindung zum Server."); }
    const text = await res.text(); const data = text ? JSON.parse(text) : null;
    if (!res.ok) { const k = data && data.message; throw new Error(ERR[k] || k || "Serverfehler"); }
    return data;
  }
  const store = {
    get(k) { try { return localStorage.getItem("lf_t_" + k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem("lf_t_" + k, v); } catch (e) {} },
    del(k) { try { localStorage.removeItem("lf_t_" + k); } catch (e) {} }
  };
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const $main = document.getElementById("main");
  const S = { code: store.get("code"), data: null, tab: "overview", course: "all", sort: "nickname", dir: 1, timer: null, updated: null };

  function ago(ts) {
    if (!ts) return "–";
    const m = Math.round((Date.now() - new Date(ts).getTime()) / 60000);
    if (m < 1) return "gerade eben"; if (m < 60) return `vor ${m} Min.`;
    const h = Math.round(m / 60); if (h < 24) return `vor ${h} Std.`;
    const d = Math.round(h / 24); return `vor ${d} Tag${d === 1 ? "" : "en"}`;
  }
  const isToday = (ts) => ts && new Date(ts).toDateString() === new Date().toDateString();
  const pctCell = (m) => m ? `<span class="pct ${m.pct >= 80 ? "p-hi" : m.pct >= 50 ? "p-mid" : "p-lo"}" title="${m.rounds} Runden">${m.pct}%</span>` : '<span class="muted">–</span>';

  function signIn(msg) {
    $main.innerHTML = `<div class="card" style="max-width:480px;margin:30px auto">
      <h1>Anmeldung Lehrkraft</h1><p class="muted">Mit dem Lehrkraft-Code. Lernende-Codes funktionieren hier nicht.</p>
      <input type="text" id="code" placeholder="OWL-XXXX" autocapitalize="characters" autocomplete="off" autocorrect="off" spellcheck="false">
      <div class="row" style="margin-top:12px"><button class="btn" id="go">Anmelden</button></div><div class="err" id="err">${esc(msg || "")}</div></div>`;
    const inp = document.getElementById("code"); inp.focus();
    const go = async () => { const c = inp.value.trim().toUpperCase(); if (!c) return; S.code = c; await load(true); };
    document.getElementById("go").onclick = go; inp.onkeydown = (e) => { if (e.key === "Enter") go(); };
  }

  async function load(fromSignIn) {
    try {
      S.data = await rpc("t_overview", { p_code: S.code });
      S.updated = new Date();
      store.set("code", S.code);
      if (!S.timer) S.timer = setInterval(() => { if (!document.hidden) load(); }, 60000);
      render();
    } catch (e) {
      if (fromSignIn || /Code/.test(e.message)) { store.del("code"); S.code = null; clearInterval(S.timer); S.timer = null; signIn(e.message); }
      else { const el = document.getElementById("status"); if (el) el.textContent = e.message; }
    }
  }

  function render() {
    const d = S.data;
    document.getElementById("me").innerHTML = `Stand ${S.updated.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })} · <a href="#" id="refresh" style="color:#fff">aktualisieren</a> · <a href="#" id="out" style="color:#fff">abmelden</a>`;
    document.getElementById("refresh").onclick = (e) => { e.preventDefault(); load(); };
    document.getElementById("out").onclick = (e) => { e.preventDefault(); store.del("code"); S.code = null; clearInterval(S.timer); S.timer = null; document.getElementById("me").innerHTML = ""; signIn(); };
    const tabs = [["overview", "Übersicht"], ["players", `Lernende (${d.players.length})`], ["duels", `Duelle (${d.duels.filter((x) => x.status === "open").length} offen)`], ["admin", "Verwaltung"]];
    $main.innerHTML = `<div class="ttabs">${tabs.map(([k, l]) => `<button data-t="${k}" class="${S.tab === k ? "on" : ""}">${esc(l)}</button>`).join("")}</div><div id="status" class="err"></div><div id="view"></div>`;
    $main.querySelectorAll("[data-t]").forEach((b) => (b.onclick = () => { S.tab = b.dataset.t; render(); }));
    ({ overview, players, duels, admin })[S.tab](document.getElementById("view"));
  }

  function overview(v) {
    const d = S.data, P = d.players;
    const today = P.filter((p) => isToday(p.last_active)).length;
    const week = P.filter((p) => p.rounds_week > 0).length;
    const roundsWeek = P.reduce((s, p) => s + p.rounds_week, 0);
    const per = (c) => P.filter((p) => p.course === c).length;
    const max = Math.max(1, ...d.board.courses.map((c) => c.per_player));
    const days = [];
    for (let i = 13; i >= 0; i--) {
      const dt = new Date(Date.now() - i * 864e5); const key = dt.toLocaleDateString("sv-SE");
      const row = d.days.find((x) => x.day === key) || { rounds: 0, players: 0 };
      days.push({ label: dt.toLocaleDateString("de-DE", { weekday: "short", day: "numeric" }), ...row });
    }
    const dmax = Math.max(1, ...days.map((x) => x.rounds));
    const recent = P.filter((p) => p.last_active).sort((a, b) => new Date(b.last_active) - new Date(a.last_active)).slice(0, 8);
    v.innerHTML = `
      <div class="kpis">
        <div class="card"><div class="muted">Angemeldet</div><div class="stat">${P.length}</div><div class="muted">9abc: ${per("9abc")} · 9de: ${per("9de")}</div></div>
        <div class="card"><div class="muted">Heute aktiv</div><div class="stat">${today}</div></div>
        <div class="card"><div class="muted">Diese Woche aktiv</div><div class="stat">${week}</div></div>
        <div class="card"><div class="muted">Runden diese Woche</div><div class="stat">${roundsWeek}</div></div>
      </div>
      <div class="grid">
        <div class="card"><h2 style="margin-top:0">Kursduell (Woche)</h2><p class="muted">Punkte pro Spieler:in</p>
          ${d.board.courses.map((c) => `<div><b>${esc(c.course)}</b> <span class="muted">· ${c.pts} Punkte · ${c.players} Spieler:innen</span><div class="bar"><div style="width:${Math.max(8, (c.per_player / max) * 100)}%;background:${c.course === "9abc" ? "var(--cyan)" : "var(--petrol)"}">${c.per_player}</div></div></div>`).join("")}</div>
        <div class="card"><h2 style="margin-top:0">Zuletzt aktiv</h2>${recent.length ? `<ul class="list">${recent.map((p) => `<li><span><b>${esc(p.nickname)}</b> <span class="badge c${esc(p.course)}">${esc(p.course)}</span></span><span class="muted">${ago(p.last_active)}</span></li>`).join("")}</ul>` : '<p class="muted">Noch niemand.</p>'}</div>
      </div>
      <div class="card"><h2 style="margin-top:0">Runden pro Tag (14 Tage)</h2>
        <div class="days">${days.map((x) => `<div title="${x.rounds} Runden, ${x.players} Spieler:innen"><span style="height:${Math.round((x.rounds / dmax) * 110)}px"></span>${x.rounds}<br>${esc(x.label)}</div>`).join("")}</div></div>`;
  }

  function players(v) {
    const d = S.data;
    let rows = d.players.filter((p) => S.course === "all" || p.course === S.course);
    const key = S.sort, dir = S.dir;
    const val = (p) => key.startsWith("m:") ? ((p.modes || {})[key.slice(2)] || { pct: -1 }).pct : key === "last_active" ? (p.last_active ? new Date(p.last_active).getTime() : 0) : p[key];
    rows.sort((a, b) => { const x = val(a), y = val(b); return (typeof x === "string" ? x.localeCompare(y, "de", { sensitivity: "base" }) : (x || 0) - (y || 0)) * dir; });
    const th = (k, l, num) => `<th data-s="${k}" class="${num ? "num" : ""}">${esc(l)}${S.sort === k ? (S.dir > 0 ? " ▲" : " ▼") : ""}</th>`;
    v.innerHTML = `<div class="card">
      <div class="row" style="justify-content:space-between"><div class="row"><b>Kurs:</b>
        <select id="course"><option value="all">alle</option><option value="9abc">9abc</option><option value="9de">9de</option></select></div>
        <span class="muted">Trefferquote je Bereich: T1–T3 = Vokabeltests, Int = Interview, Gr = Grammatik</span></div>
      <div class="scroll" style="margin-top:10px"><table class="t"><thead><tr>
        ${th("nickname", "Spitzname")}${th("course", "Kurs")}${th("code", "Code")}${th("xp", "XP", 1)}${th("week", "Woche", 1)}${th("rounds_week", "Runden Woche", 1)}${th("rounds", "Runden ges.", 1)}${th("last_active", "zuletzt aktiv")}
        ${Object.keys(MODE_SHORT).map((m) => th("m:" + m, MODE_SHORT[m], 1)).join("")}<th></th></tr></thead>
      <tbody>${rows.map((p) => `<tr class="${p.blocked ? "blocked" : ""}"><td><b>${esc(p.nickname)}</b>${p.blocked ? " 🚫" : ""}</td><td><span class="badge c${esc(p.course)}">${esc(p.course)}</span></td>
        <td class="muted">${esc(p.code)}</td><td class="num">${p.xp}</td><td class="num">${p.week}</td><td class="num">${p.rounds_week}</td><td class="num">${p.rounds}</td><td>${ago(p.last_active)}</td>
        ${Object.keys(MODE_SHORT).map((m) => `<td class="num">${pctCell((p.modes || {})[m])}</td>`).join("")}
        <td><button class="btn small alt" data-act="${esc(p.nickname)}">…</button></td></tr>`).join("") || '<tr><td colspan="14" class="muted">Noch keine Lernenden mit Spitznamen.</td></tr>'}</tbody></table></div></div>
      <div id="act"></div>`;
    const sel = document.getElementById("course"); sel.value = S.course; sel.onchange = () => { S.course = sel.value; render(); };
    v.querySelectorAll("[data-s]").forEach((h) => (h.onclick = () => { if (S.sort === h.dataset.s) S.dir *= -1; else { S.sort = h.dataset.s; S.dir = h.dataset.s === "nickname" || h.dataset.s === "course" ? 1 : -1; } render(); }));
    v.querySelectorAll("[data-act]").forEach((b) => (b.onclick = () => actions(d.players.find((p) => p.nickname === b.dataset.act))));
  }

  function actions(p) {
    const box = document.getElementById("act");
    const modes = Object.keys(MODE_LONG).map((m) => { const x = (p.modes || {})[m]; return `<li><span>${esc(MODE_LONG[m])}</span><span>${x ? `${x.rounds} Runden · ${pctCell(x)}` : '<span class="muted">nicht gespielt</span>'}</span></li>`; }).join("");
    box.innerHTML = `<div class="card"><h2 style="margin-top:0">${esc(p.nickname)} <span class="badge c${esc(p.course)}">${esc(p.course)}</span> <span class="muted">Code ${esc(p.code)}</span></h2>
      <ul class="list">${modes}</ul>
      <div class="row" style="margin-top:12px">
        <input type="text" id="newnick" placeholder="neuer Spitzname" style="max-width:260px;font-size:17px;padding:8px 12px" autocomplete="off" autocorrect="off" spellcheck="false">
        <button class="btn small" id="ren">Umbenennen</button>
        <button class="btn small alt" id="reset">Spitzname zurücksetzen</button>
        <button class="btn small alt" id="blk">${p.blocked ? "Entsperren" : "Sperren"}</button></div>
      <p class="muted">„Zurücksetzen“: Beim nächsten Öffnen muss ein neuer Spitzname gewählt werden. „Sperren“: Der Code funktioniert nicht mehr, der Name verschwindet aus Rangliste und Duellen, offene Duelle werden gelöscht.</p>
      <div class="err" id="aerr"></div></div>`;
    box.scrollIntoView({ behavior: "smooth" });
    const run = async (fn, args, ask) => { if (ask && !window.confirm(ask)) return; try { await rpc(fn, { p_code: S.code, ...args }); await load(); } catch (e) { document.getElementById("aerr").textContent = e.message; } };
    document.getElementById("ren").onclick = () => run("t_rename", { p_old: p.nickname, p_new: document.getElementById("newnick").value.trim() });
    document.getElementById("reset").onclick = () => run("t_rename", { p_old: p.nickname, p_new: null }, `Spitznamen „${p.nickname}“ zurücksetzen?`);
    document.getElementById("blk").onclick = () => run("t_block", { p_nick: p.nickname, p_blocked: !p.blocked }, p.blocked ? null : `„${p.nickname}“ sperren?`);
  }

  function duels(v) {
    const D = S.data.duels;
    const open = D.filter((x) => x.status === "open"), done = D.filter((x) => x.status === "done");
    const who = (n, c) => `<b>${esc(n)}</b> <span class="badge c${esc(c)}">${esc(c)}</span>`;
    v.innerHTML = `<div class="card"><h2 style="margin-top:0">Offen (${open.length})</h2>
        ${open.length ? `<div class="scroll"><table class="t"><thead><tr><th>Herausforderer:in</th><th>wartet auf</th><th>Bereich</th><th class="num">Ergebnis</th><th>seit</th></tr></thead><tbody>
        ${open.map((x) => `<tr><td>${who(x.challenger, x.challenger_course)}</td><td>${who(x.opponent, x.opponent_course)}</td><td>${esc(MODE_LONG[x.mode])}</td><td class="num">${x.challenger_score}/10 · ${x.challenger_time}s</td><td>${ago(x.created_at)}</td></tr>`).join("")}</tbody></table></div>` : '<p class="muted">Keine offenen Duelle.</p>'}</div>
      <div class="card"><h2 style="margin-top:0">Beendet, letzte 14 Tage (${done.length})</h2>
        ${done.length ? `<div class="scroll"><table class="t"><thead><tr><th>Duell</th><th>Bereich</th><th class="num">Ergebnis</th><th>Sieger:in</th><th>beendet</th></tr></thead><tbody>
        ${done.map((x) => { const cw = x.challenger_score > x.opponent_score || (x.challenger_score === x.opponent_score && x.challenger_time < x.opponent_time); const draw = x.challenger_score === x.opponent_score && x.challenger_time === x.opponent_time;
          return `<tr><td>${who(x.challenger, x.challenger_course)} vs. ${who(x.opponent, x.opponent_course)}</td><td>${esc(MODE_LONG[x.mode])}</td><td class="num">${x.challenger_score}:${x.opponent_score} <span class="muted">(${x.challenger_time}s/${x.opponent_time}s)</span></td><td>${draw ? "unentschieden" : esc(cw ? x.challenger : x.opponent)}</td><td>${ago(x.finished_at)}</td></tr>`; }).join("")}</tbody></table></div>` : '<p class="muted">Noch keine.</p>'}</div>`;
  }

  function admin(v) {
    const U = S.data.unused;
    v.innerHTML = `<div class="card"><h2 style="margin-top:0">Neue Codes erzeugen</h2>
        <div class="row"><select id="nc"><option>9abc</option><option>9de</option></select>
        <input type="text" id="nn" value="5" style="max-width:90px;font-size:17px;padding:8px 12px" inputmode="numeric">
        <button class="btn small" id="gen">Erzeugen</button></div><div id="newcodes" class="codes" style="margin-top:10px"></div><div class="err" id="gerr"></div></div>
      <div class="card"><h2 style="margin-top:0">Noch nicht benutzte Codes</h2>
        ${U.length ? U.map((u) => `<p><b>${esc(u.course)}</b> <span class="muted">(${u.n})</span></p><div class="codes">${esc(u.codes)}</div>`).join("") : '<p class="muted">Alle Codes sind vergeben.</p>'}</div>
      <div class="card"><h2 style="margin-top:0">Hinweise</h2><ul>
        <li>Die Zuordnung Code → Name nur auf Papier festhalten, nicht digital.</li>
        <li>Neue Codes erscheinen nach „aktualisieren“ auch in der Liste oben.</li>
        <li>Die Seite aktualisiert sich jede Minute von selbst.</li></ul></div>`;
    document.getElementById("gen").onclick = async () => {
      try { const codes = await rpc("t_new_codes", { p_code: S.code, p_course: document.getElementById("nc").value, p_n: parseInt(document.getElementById("nn").value, 10) || 0 });
        document.getElementById("newcodes").innerHTML = `<b>Neu:</b> ${codes.map(esc).join(" ")}`; }
      catch (e) { document.getElementById("gerr").textContent = e.message; }
    };
  }

  if (S.code) load(true); else signIn();
})();
