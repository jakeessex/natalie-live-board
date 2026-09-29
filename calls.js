/* Nat call deck (Calls tab). Board v43. Data = calls.json only. Self-contained: no libs, no fonts. */
(function () {
  "use strict";
  var KEY = "nat-calls-v1:";
  var CSS = [
    ".nd{position:fixed;inset:0;z-index:60;display:flex;flex-direction:column;background:#e8ecf2;color:#17202b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:18px;line-height:1.45;-webkit-text-size-adjust:100%}",
    ".nd *{box-sizing:border-box}",
    ".nd-top{display:flex;align-items:center;gap:8px;padding:calc(8px + env(safe-area-inset-top)) 10px 8px;background:#17202b;color:#fff}",
    ".nd-top button{font:inherit;font-size:16px;font-weight:700;border:0;border-radius:12px;padding:10px 14px;background:#2d3a4b;color:#fff;cursor:pointer}",
    ".nd-count{flex:1;text-align:center;font-size:20px;font-weight:800;letter-spacing:.02em}",
    ".nd-count small{display:block;font-size:12px;font-weight:600;opacity:.75;letter-spacing:0}",
    ".nd-track{flex:1;display:flex;overflow-x:auto;overflow-y:hidden;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;overscroll-behavior-x:contain;scrollbar-width:none}",
    ".nd-track::-webkit-scrollbar{display:none}",
    ".nd-slide{flex:0 0 100%;width:100%;height:100%;scroll-snap-align:start;scroll-snap-stop:always;padding:10px}",
    ".nd-card{height:100%;overflow-y:auto;background:#fff;border-radius:22px;padding:18px 16px 28px;box-shadow:0 2px 10px rgba(20,30,45,.12);overscroll-behavior-y:contain}",
    ".nd-card.called{box-shadow:0 0 0 3px #1f9d55 inset,0 2px 10px rgba(20,30,45,.12)}",
    ".nd-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap}",
    ".nd-rank{display:inline-block;margin:0;font-size:15px;font-weight:800;background:#17202b;color:#fff;border-radius:999px;padding:4px 12px}",
    ".nd-badge{display:none;font-size:15px;font-weight:800;background:#1f9d55;color:#fff;border-radius:999px;padding:4px 12px}",
    ".nd-card.called .nd-badge{display:inline-block}",
    ".nd-pills{display:flex;flex-wrap:wrap;gap:6px;margin:10px 0 2px}",
    ".nd-pill{font-size:14px;font-weight:800;border-radius:999px;padding:5px 11px;letter-spacing:.01em}",
    ".nd-pill.hold{background:#d62d2d;color:#fff}",
    ".nd-pill.wait{background:#f5a623;color:#2a1a00}",
    ".nd-pill.emailed{background:#2f6fd6;color:#fff}",
    ".nd-pill.far{background:#8a939e;color:#fff}",
    ".nd h2{font-size:28px;line-height:1.15;margin:10px 0 2px;font-weight:800}",
    ".nd-town{font-size:19px;color:#4a5665;margin:0 0 6px}",
    ".nd-contact{font-size:19px;margin:6px 0 12px}",
    ".nd-contact b{font-weight:700}",
    ".nd-call{display:block;text-decoration:none;background:#1f9d55;color:#fff;border-radius:18px;padding:14px 16px;margin:0 0 10px;text-align:center;box-shadow:0 3px 0 #157a41}",
    ".nd-call:active{transform:translateY(2px);box-shadow:0 1px 0 #157a41}",
    ".nd-call .n{display:block;font-size:27px;font-weight:800;letter-spacing:.02em}",
    ".nd-call .l{display:block;font-size:14px;opacity:.9}",
    ".nd-card.hold .nd-call{background:#9aa3ad;box-shadow:0 3px 0 #7b848e}",
    ".nd-nophone{background:#f1f3f6;border-radius:16px;padding:14px;font-weight:700;color:#4a5665;margin:0 0 10px;text-align:center}",
    ".nd-note{background:#fff4d6;border-left:6px solid #f5a623;border-radius:12px;padding:10px 12px;margin:6px 0 12px;font-size:17px}",
    ".nd-card.hold .nd-note.holdnote{background:#fde3e3;border-color:#d62d2d}",
    ".nd-sec{margin:14px 0 0}",
    ".nd-sec h3{font-size:13px;text-transform:uppercase;letter-spacing:.08em;color:#6a7685;margin:0 0 3px;font-weight:800}",
    ".nd-sec p{margin:0}",
    ".nd-days{font-size:22px;font-weight:800}",
    ".nd-sub{font-size:16px;color:#4a5665;margin-top:3px!important}",
    ".nd-why{background:#eef5ff;border-radius:14px;padding:10px 12px}",
    ".nd-mark{display:block;width:100%;font:inherit;font-size:20px;font-weight:800;border:3px solid #1f9d55;background:#fff;color:#1f9d55;border-radius:16px;padding:13px;margin:18px 0 10px;cursor:pointer}",
    ".nd-card.called .nd-mark{background:#1f9d55;color:#fff}",
    ".nd-notes{display:block;width:100%;min-height:96px;font:inherit;font-size:17px;border:2px solid #cfd6df;border-radius:14px;padding:10px;resize:vertical;background:#fbfcfd;color:#17202b}",
    ".nd-lbl{display:block;font-size:13px;text-transform:uppercase;letter-spacing:.08em;color:#6a7685;font-weight:800;margin:4px 0 4px}",
    ".nd-bot{display:flex;gap:10px;padding:8px 10px calc(10px + env(safe-area-inset-bottom));background:#e8ecf2}",
    ".nd-bot button{flex:1;font:inherit;font-size:20px;font-weight:800;border:0;border-radius:16px;padding:14px;background:#17202b;color:#fff;cursor:pointer}",
    ".nd-bot button:disabled{opacity:.35}",
    ".nd-intro h1{font-size:30px;line-height:1.1;margin:4px 0 6px;font-weight:800}",
    ".nd-intro ul{margin:6px 0 0;padding-left:22px}",
    ".nd-intro li{margin:4px 0}",
    ".nd-intro .big{font-size:19px}",
    ".nd-legend .nd-pill{display:inline-block;margin:3px 4px 3px 0}",
    ".nd-hint{margin-top:16px;text-align:center;font-weight:800;color:#2f6fd6}",
    ".nd-jump{position:absolute;inset:0;z-index:5;background:rgba(15,22,32,.55);display:none}",
    ".nd-jump.on{display:block}",
    ".nd-jump-box{position:absolute;left:10px;right:10px;top:calc(10px + env(safe-area-inset-top));bottom:10px;background:#fff;border-radius:22px;display:flex;flex-direction:column;overflow:hidden}",
    ".nd-jump-head{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-bottom:1px solid #e3e7ec;font-size:20px;font-weight:800}",
    ".nd-jump-head button{font:inherit;font-size:16px;font-weight:700;border:0;border-radius:12px;padding:9px 14px;background:#17202b;color:#fff}",
    ".nd-jump-list{overflow-y:auto;padding:6px 8px 14px}",
    ".nd-jump-list button{display:flex;width:100%;align-items:center;gap:8px;text-align:left;font:inherit;font-size:17px;border:0;background:none;border-bottom:1px solid #eef1f4;padding:11px 6px;color:#17202b;cursor:pointer}",
    ".nd-jump-list button.cur{background:#eef5ff;border-radius:10px}",
    ".nd-jump-list .r{min-width:30px;font-weight:800}",
    ".nd-jump-list .t{flex:1}",
    ".nd-dot{width:11px;height:11px;border-radius:50%;display:inline-block}",
    ".nd-dot.hold{background:#d62d2d}.nd-dot.wait{background:#f5a623}.nd-dot.emailed{background:#2f6fd6}.nd-dot.far{background:#8a939e}",
    ".nd-tick{color:#1f9d55;font-weight:800}",
    ".nd-mail{display:flex;gap:8px;margin:2px 0 12px}",
    ".nd-mail a,.nd-mail button{flex:1;display:block;text-align:center;text-decoration:none;font:inherit;font-size:17px;font-weight:800;border-radius:14px;padding:12px 8px;cursor:pointer;border:2px solid #2f6fd6}",
    ".nd-mail .emails{background:#2f6fd6;color:#fff}",
    ".nd-mail .gmail{background:#fff;color:#2f6fd6}",
    "#calls{display:none}#calls.show{display:block}#calls.suspended,#calls.suspended *{visibility:hidden!important;pointer-events:none!important}"
  ].join("\n");

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function store(k, v) {
    try { if (v == null || v === "") localStorage.removeItem(KEY + k); else localStorage.setItem(KEY + k, v); } catch (e) {}
  }
  function load(k) {
    try { return localStorage.getItem(KEY + k) || ""; } catch (e) { return ""; }
  }
  function injectCss() {
    if (document.getElementById("nd-css")) return;
    var s = el("style");
    s.id = "nd-css";
    s.textContent = CSS;
    document.head.appendChild(s);
  }
  function sec(title, body, cls) {
    var d = el("div", "nd-sec");
    d.appendChild(el("h3", null, title));
    var p = el("p", cls || null, body);
    d.appendChild(p);
    return d;
  }

  function introCard(data) {
    var c = el("div", "nd-card nd-intro");
    c.appendChild(el("p", "nd-rank", String(data.venues.length) + " venues, ranked"));
    c.appendChild(el("h1", null, data.title));
    var s1 = el("div", "nd-sec");
    s1.appendChild(el("h3", null, "Free 2026 weekend nights"));
    var ul = el("ul", "big");
    data.freeNights.forEach(function (f) { ul.appendChild(el("li", null, f.nights)); });
    s1.appendChild(ul);
    c.appendChild(s1);
    var s2 = el("div", "nd-sec");
    s2.appendChild(el("h3", null, "Rules"));
    var ul2 = el("ul", "big");
    data.rules.forEach(function (r) { ul2.appendChild(el("li", null, r)); });
    s2.appendChild(ul2);
    c.appendChild(s2);
    var s3 = el("div", "nd-sec nd-legend");
    s3.appendChild(el("h3", null, "Flags"));
    [["hold", "HOLD: ask Jake first"], ["wait", "WAIT: see reason"], ["emailed", "EMAILED (date on card)"], ["far", "FAR"]].forEach(function (x) {
      s3.appendChild(el("span", "nd-pill " + x[0], x[1]));
    });
    c.appendChild(s3);
    var prog = el("p", "nd-sub nd-prog");
    c.appendChild(prog);
    c.appendChild(el("p", "nd-hint", "Swipe left to start \u203A"));
    return c;
  }

  function venueCard(v, opts) {
    opts = opts || {};
    var c = el("div", "nd-card");
    var isHold = v.flags.some(function (f) { return f.type === "hold"; });
    if (isHold) c.classList.add("hold");
    var row = el("div", "nd-row");
    row.appendChild(el("span", "nd-rank", "#" + v.rank));
    row.appendChild(el("span", "nd-badge", "\u2713 Called"));
    c.appendChild(row);
    if (v.flags.length) {
      var pills = el("div", "nd-pills");
      v.flags.forEach(function (f) { pills.appendChild(el("span", "nd-pill " + f.type, f.text)); });
      c.appendChild(pills);
    }
    c.appendChild(el("h2", null, v.venue));
    if (v.town) c.appendChild(el("p", "nd-town", v.town));
    var ct = el("p", "nd-contact");
    ct.appendChild(el("b", null, v.contact));
    c.appendChild(ct);
    if (isHold) c.appendChild(el("p", "nd-note holdnote", "Jake HOLD. Get Jake's OK before calling."));
    if (v.phones.length) {
      v.phones.forEach(function (p) {
        var a = el("a", "nd-call");
        a.href = "tel:" + p.tel;
        a.appendChild(el("span", "n", "\u260E " + p.number));
        if (p.label) a.appendChild(el("span", "l", p.label));
        c.appendChild(a);
      });
    } else {
      c.appendChild(el("p", "nd-nophone", v.noPhone || "No phone found."));
    }
    if ((opts.openEmails && v.venueId) || v.gmailThreadId) {
      var mail = el("div", "nd-mail");
      if (opts.openEmails && v.venueId) {
        var ob = el("button", "emails", "\u2709 Open emails");
        ob.type = "button";
        ob.setAttribute("data-venue", v.venueId);
        ob.onclick = function () { opts.openEmails(v); };
        mail.appendChild(ob);
      }
      if (v.gmailThreadId) {
        var ga = el("a", "gmail", "Open in Gmail \u2197");
        ga.href = "https://mail.google.com/mail/u/0/#all/" + encodeURIComponent(v.gmailThreadId);
        ga.target = "_blank";
        ga.rel = "noopener";
        mail.appendChild(ga);
      }
      c.appendChild(mail);
    }
    if (v.note) c.appendChild(el("p", "nd-note", v.note));
    c.appendChild(sec("Quote we sent", v.quote));
    var lastTitle = (v.lastWho === "Us" ? "Last message (Us)" : "Their last message") + (v.lastDate ? ", " + v.lastDate : " (date not in list)");
    c.appendChild(sec(lastTitle, v.lastMsg));
    var dd = v.days;
    var base = data.listDate ? new Date(data.listDate + "T00:00:00") : null;
    var now0 = new Date(); now0.setHours(0, 0, 0, 0);
    var off = base ? Math.round((now0 - base) / 86400000) : 0;
    if (off > 0 && typeof dd === "string") dd = dd.replace(/\d+/g, function (n) { return String(Number(n) + off); });
    var d = sec("Days since contact", dd, "nd-days");
    if (v.daysNote) d.appendChild(el("p", "nd-sub", v.daysNote));
    c.appendChild(d);
    c.appendChild(sec("Why a call closes it", v.why, "nd-why"));
    var mark = el("button", "nd-mark");
    mark.type = "button";
    c.appendChild(mark);
    var lbl = el("label", "nd-lbl", "Notes");
    var ta = el("textarea", "nd-notes");
    ta.placeholder = "Who you spoke to, what they said, next step";
    ta.id = "nd-notes-" + v.id;
    lbl.htmlFor = ta.id;
    ta.value = load("notes:" + v.id);
    ta.addEventListener("input", function () { store("notes:" + v.id, ta.value); });
    c.appendChild(lbl);
    c.appendChild(ta);
    function paint() {
      var on = load("called:" + v.id) === "1";
      c.classList.toggle("called", on);
      mark.textContent = on ? "\u2713 Called (tap to undo)" : "Mark called";
      mark.setAttribute("aria-pressed", on ? "true" : "false");
    }
    mark.addEventListener("click", function () {
      store("called:" + v.id, load("called:" + v.id) === "1" ? "" : "1");
      paint();
      if (c._onChange) c._onChange();
    });
    paint();
    return c;
  }

  /* Build a deck inside root. opts.onClose adds a Close button. Returns {go, index, destroy}. */
  function build(root, data, opts) {
    opts = opts || {};
    injectCss();
    root.innerHTML = "";
    var deck = el("div", "nd");
    deck.setAttribute("role", "region");
    deck.setAttribute("aria-label", "Nat call deck");
    var top = el("div", "nd-top");
    if (opts.onClose) {
      var close = el("button", "nd-close", "\u2039 Board");
      close.type = "button";
      close.onclick = opts.onClose;
      top.appendChild(close);
    }
    var count = el("div", "nd-count");
    count.setAttribute("aria-live", "polite");
    top.appendChild(count);
    var jumpBtn = el("button", "nd-jumpbtn", "Jump");
    jumpBtn.type = "button";
    top.appendChild(jumpBtn);
    deck.appendChild(top);

    var track = el("div", "nd-track");
    var cards = [];
    var intro = introCard(data);
    cards.push(intro);
    data.venues.forEach(function (v) { cards.push(venueCard(v, opts)); });
    cards.forEach(function (c, i) {
      var s = el("div", "nd-slide");
      s.setAttribute("data-i", String(i));
      s.appendChild(c);
      track.appendChild(s);
      c._onChange = function () { paintMeta(); };
    });
    deck.appendChild(track);

    var bot = el("div", "nd-bot");
    var prev = el("button", "nd-prev", "\u2039 Prev");
    var next = el("button", "nd-next", "Next \u203A");
    prev.type = next.type = "button";
    bot.appendChild(prev);
    bot.appendChild(next);
    deck.appendChild(bot);

    var jump = el("div", "nd-jump");
    var jbox = el("div", "nd-jump-box");
    var jhead = el("div", "nd-jump-head");
    jhead.appendChild(el("span", null, "Jump to card"));
    var jclose = el("button", null, "Close");
    jclose.type = "button";
    jhead.appendChild(jclose);
    jbox.appendChild(jhead);
    var jlist = el("div", "nd-jump-list");
    jbox.appendChild(jlist);
    jump.appendChild(jbox);
    deck.appendChild(jump);
    root.appendChild(deck);

    var total = data.venues.length;
    var idx = 0;
    function calledCount() {
      return data.venues.filter(function (v) { return load("called:" + v.id) === "1"; }).length;
    }
    function paintMeta() {
      var cc = calledCount();
      count.innerHTML = "";
      count.appendChild(document.createTextNode(idx === 0 ? "Intro" : idx + " / " + total));
      count.appendChild(el("small", null, cc + " of " + total + " called"));
      var p = intro.querySelector(".nd-prog");
      if (p) p.textContent = "Called so far: " + cc + " of " + total + ". Tap Jump to go to any venue.";
      prev.disabled = idx <= 0;
      next.disabled = idx >= total;
    }
    function fillJump() {
      jlist.innerHTML = "";
      var b0 = el("button", idx === 0 ? "cur" : "");
      b0.type = "button";
      b0.appendChild(el("span", "r", ""));
      b0.appendChild(el("span", "t", "Intro: free nights and rules"));
      b0.onclick = function () { closeJump(); go(0, false); };
      jlist.appendChild(b0);
      data.venues.forEach(function (v, k) {
        var b = el("button", idx === k + 1 ? "cur" : "");
        b.type = "button";
        b.appendChild(el("span", "r", v.rank + "."));
        b.appendChild(el("span", "t", v.venue + (v.town ? ", " + v.town : "")));
        v.flags.forEach(function (f) { var d = el("span", "nd-dot " + f.type); d.title = f.text; b.appendChild(d); });
        if (load("called:" + v.id) === "1") b.appendChild(el("span", "nd-tick", "\u2713"));
        b.onclick = function () { closeJump(); go(k + 1, false); };
        jlist.appendChild(b);
      });
    }
    function openJump() {
      fillJump();
      jump.classList.add("on");
      var cur = jlist.querySelector(".cur");
      if (cur && cur.scrollIntoView) cur.scrollIntoView({ block: "center" });
    }
    function closeJump() { jump.classList.remove("on"); }
    jumpBtn.onclick = openJump;
    jclose.onclick = closeJump;
    jump.addEventListener("click", function (e) { if (e.target === jump) closeJump(); });

    function go(i, smooth) {
      i = Math.max(0, Math.min(total, i));
      idx = i;
      track.scrollTo({ left: i * track.clientWidth, behavior: smooth === false ? "auto" : "smooth" });
      paintMeta();
      store("last", String(i));
    }
    prev.onclick = function () { go(idx - 1); };
    next.onclick = function () { go(idx + 1); };
    var t = 0;
    track.addEventListener("scroll", function () {
      var w = track.clientWidth || 1;
      var i = Math.round(track.scrollLeft / w);
      if (i !== idx) { idx = Math.max(0, Math.min(total, i)); paintMeta(); store("last", String(idx)); }
    }, { passive: true });
    function onKey(e) {
      if (!deck.isConnected || root.classList.contains("suspended")) return;
      var tg = e.target && e.target.tagName;
      if (tg === "TEXTAREA" || tg === "INPUT" || tg === "SELECT") return;
      if (e.key === "ArrowRight") { e.preventDefault(); go(idx + 1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); go(idx - 1); }
      else if (e.key === "Escape") { if (jump.classList.contains("on")) closeJump(); else if (opts.onClose) opts.onClose(); }
    }
    document.addEventListener("keydown", onKey);
    function onResize() { track.scrollTo({ left: idx * track.clientWidth, behavior: "auto" }); }
    window.addEventListener("resize", onResize);

    var start = parseInt(load("last"), 10);
    if (opts.start != null) start = opts.start;
    idx = isNaN(start) ? 0 : Math.max(0, Math.min(total, start));
    paintMeta();
    requestAnimationFrame(function () { go(idx, false); });

    return {
      go: go,
      index: function () { return idx; },
      refresh: function () { if (jump.classList.contains("on")) fillJump(); paintMeta(); },
      destroy: function () {
        document.removeEventListener("keydown", onKey);
        window.removeEventListener("resize", onResize);
        root.innerHTML = "";
      }
    };
  }

  window.NatCallDeck = { build: build };

  /* Board integration: Calls tab behind the existing gate. */
  var deckApi = null;
  var cache = null;
  function host() {
    var h = document.getElementById("calls");
    if (!h) { h = el("div"); h.id = "calls"; document.body.appendChild(h); }
    return h;
  }
  var suspendedAt = -1;
  function openEmails(v) {
    var h = document.getElementById("calls");
    if (!h || !deckApi || typeof window.natOpen !== "function") return;
    var det = document.getElementById("detail");
    if (det) det.innerHTML = "";
    suspendedAt = deckApi.index();
    h.classList.add("suspended");
    document.documentElement.style.overflow = "";
    window.natOpen(v.venueId);
    if (!det || !det.querySelector(".back")) {
      /* venue not on the board: undo and stay on the card */
      suspendedAt = -1;
      h.classList.remove("suspended");
      document.documentElement.style.overflow = "hidden";
      if (window.natBack && window.natBack.__orig) window.natBack.__orig();
      alert("That venue is not on the board right now.");
      return;
    }
    if (typeof window.natEmails === "function" && det.querySelector(".openbtn")) window.natEmails();
    window.scrollTo(0, 0);
    var panels = det.querySelectorAll(".panel .kicker");
    for (var i = 0; i < panels.length; i++) {
      if (/^Emails/.test(panels[i].textContent)) {
        var head = det.querySelector("header");
        var y = panels[i].getBoundingClientRect().top + window.pageYOffset - (head ? head.offsetHeight : 0) - 8;
        window.scrollTo(0, Math.max(0, y));
        break;
      }
    }
  }
  function resumeCalls() {
    var h = document.getElementById("calls");
    if (suspendedAt < 0 || !h || !deckApi) return;
    var i = suspendedAt;
    suspendedAt = -1;
    h.classList.remove("suspended");
    document.documentElement.style.overflow = "hidden";
    window.scrollTo(0, 0);
    deckApi.go(i, false);
  }
  (function wrapBack() {
    var orig = window.natBack;
    if (typeof orig !== "function" || orig.__calls) return;
    var wrapped = function () {
      var r = orig.apply(this, arguments);
      resumeCalls();
      return r;
    };
    wrapped.__calls = true;
    wrapped.__orig = orig;
    window.natBack = wrapped;
  })();

  window.natCallsClose = function () {
    var h = document.getElementById("calls");
    suspendedAt = -1;
    if (h) h.classList.remove("suspended");
    if (deckApi) { deckApi.destroy(); deckApi = null; }
    if (h) h.classList.remove("show");
    document.documentElement.style.overflow = "";
  };
  window.natCalls = function () {
    var app = document.getElementById("app");
    if (!app || !app.classList.contains("show")) return; /* gate still locked */
    var h = host();
    function open(data) {
      injectCss();
      h.classList.add("show");
      document.documentElement.style.overflow = "hidden";
      deckApi = build(h, data, { onClose: window.natCallsClose, openEmails: openEmails });
      window.NatCallDeck.current = deckApi;
    }
    if (cache) { open(cache); return; }
    fetch("calls.json?t=" + Date.now(), { cache: "no-store" })
      .then(function (r) { if (!r.ok) throw new Error("calls.json " + r.status); return r.json(); })
      .then(function (data) {
        if (!data || !Array.isArray(data.venues)) throw new Error("calls.json has no venues");
        cache = data;
        open(data);
      })
      .catch(function (e) {
        injectCss();
        h.classList.add("show");
        h.innerHTML = "";
        var box = el("div", "nd");
        var card = el("div", "nd-card");
        card.style.margin = "20px";
        card.style.height = "auto";
        card.appendChild(el("h2", null, "Call list did not load"));
        card.appendChild(el("p", null, String(e && e.message || e)));
        var b = el("button", "nd-mark", "Back to board");
        b.type = "button";
        b.onclick = window.natCallsClose;
        card.appendChild(b);
        box.appendChild(card);
        h.appendChild(box);
      });
  };
})();
