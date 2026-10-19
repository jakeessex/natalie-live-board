/* Nat Comms. Read-only for Jake.
   Notes: https://dweet.cc/get/latest/dweet/for/jem-natalie-live-nbj-2026
   Replies: nat-comms-replies.json, key venueId|entry.at
   A note with no reply shows as Not actioned yet. */
(function () {
  var DWEET = "https://dweet.cc/get/latest/dweet/for/jem-natalie-live-nbj-2026";
  var REPLIES = "nat-comms-replies.json";
  var CLOSED = { sent: 1, done: 1, "no action needed": 1, "no action": 1 };
  var state = { filter: "all", opened: false, notes: null, replies: null, loading: false, waiters: [], error: "" };

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&" + "amp;")
      .replace(/</g, "&" + "lt;")
      .replace(/>/g, "&" + "gt;")
      .replace(/"/g, "&" + "quot;");
  }

  function ukWhen(iso) {
    var d = new Date(iso);
    if (!iso || isNaN(d.getTime())) return "";
    try {
      return new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/London",
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23"
      }).format(d).replace(",", "");
    } catch (e) {
      return iso;
    }
  }

  function townOf(v) {
    if (!v) return "";
    var town = String(v.town || "").trim();
    if (town) return town;
    var name = String(v.name || "");
    var m = name.match(/^(.*)\s+(Conservative Club|Social Club|RBL Club|Cons|WMC|RBL)$/i);
    if (!m) m = name.match(/^(.*)\s+Club$/i);
    if (!m || !m[1]) return "";
    var place = m[1].trim();
    if (/^the\b/i.test(place) || /social|conservative|working|services/i.test(place)) return "";
    if (place.split(/\s+/).length > 2) return "";
    return place;
  }

  function venueTitle(v, id) {
    var name = (v && v.name) || id || "Unknown venue";
    var town = townOf(v);
    if (!town) return name;
    var end = town.toLowerCase();
    var n = name.toLowerCase();
    if (n === end || n.endsWith(", " + end) || n.endsWith(" " + end)) return name;
    return name + ", " + town;
  }

  function isJunk(venueId, text) {
    if (venueId === "probe") return true;
    var t = String(text || "").trim().toLowerCase();
    return !t || t === "test" || t === "hey there" || t === "sync-ok";
  }

  function isStock(entry) {
    var t = String(entry.text || "").trim().toLowerCase();
    if (!entry.outcome) return false;
    if (t === "they'll confirm" || t === "they’ll confirm" || t === "voicemail") return true;
    if (t.indexOf("dead") === 0 && t.length < 40) return true;
    if (t.indexOf("booked") === 0 && t.length < 80) return true;
    return false;
  }

  function outcomeLabel(outcome) {
    if (!outcome) return "";
    if (outcome === "confirm") return "They'll confirm";
    if (outcome === "voicemail") return "Voicemail";
    if (outcome === "booked") return "Booked";
    if (outcome === "dead") return "Dead, don't chase";
    return String(outcome);
  }

  function statusMeta(status) {
    var s = String(status || "").toLowerCase();
    if (s === "waiting on jake") return { cls: "wait", label: "Waiting on Jake", open: true };
    if (s === "drafted") return { cls: "draft", label: "Drafted", open: true };
    if (s === "sent") return { cls: "ok", label: "Sent", open: false };
    if (s === "done") return { cls: "ok", label: "Done", open: false };
    if (s === "no action needed" || s === "no action") return { cls: "none", label: "No action", open: false };
    return { cls: "wait", label: status || "Open", open: true };
  }

  function replyFor(card, replies) {
    var bag = replies || {};
    var keys = [card.venueId + "|" + card.at];
    if (card.alsoAt) keys.push(card.venueId + "|" + card.alsoAt);
    var i;
    for (i = 0; i < keys.length; i++) if (bag[keys[i]]) return bag[keys[i]];
    return null;
  }

  function cardsFrom(notes, replies) {
    var byVenue = {};
    var order = [];
    Object.keys(notes || {}).forEach(function (venueId) {
      var rec = notes[venueId];
      if (!rec || typeof rec !== "object") return;
      var entries = Array.isArray(rec.entries) ? rec.entries.slice() : [];
      if (!entries.length && rec.note) {
        entries.push({ at: rec.updatedAt || rec.calledAt || "", text: rec.note, outcome: rec.outcome });
      }
      entries.forEach(function (entry) {
        if (!entry || isJunk(venueId, entry.text)) return;
        if (!byVenue[venueId]) { byVenue[venueId] = []; order.push(venueId); }
        byVenue[venueId].push(entry);
      });
    });
    var cards = [];
    order.forEach(function (venueId) {
      var list = byVenue[venueId].slice().sort(function (a, b) {
        return String(a.at || "").localeCompare(String(b.at || ""));
      });
      var pending = null;
      list.forEach(function (entry) {
        if (pending && isStock(entry)) {
          var gap = new Date(entry.at) - new Date(pending.at);
          if (gap >= 0 && gap < 10 * 60 * 1000) {
            pending.outcome = entry.outcome || pending.outcome;
            pending.alsoAt = entry.at;
            return;
          }
        }
        if (pending) cards.push(pending);
        pending = {
          venueId: venueId,
          at: entry.at || "",
          text: entry.text || "",
          outcome: entry.outcome || ""
        };
      });
      if (pending) cards.push(pending);
    });
    cards.forEach(function (card) {
      var reply = replyFor(card, replies);
      card.reply = reply;
      var meta = reply ? statusMeta(reply.status) : { cls: "wait", label: "Not actioned yet", open: true };
      card.open = !reply || meta.open || !CLOSED[String(reply.status || "").toLowerCase()];
      if (reply && CLOSED[String(reply.status || "").toLowerCase()]) card.open = false;
    });
    cards.sort(function (a, b) {
      if (a.open !== b.open) return a.open ? -1 : 1;
      return String(b.at).localeCompare(String(a.at));
    });
    return cards;
  }

  function chip(meta) {
    return '<span class="nc-chip ' + meta.cls + '">' + esc(meta.label) + "</span>";
  }

  function cardHtml(card, venues) {
    var v = null;
    var i;
    for (i = 0; i < venues.length; i++) if (venues[i] && venues[i].id === card.venueId) v = venues[i];
    var reply = card.reply;
    var right;
    if (!reply) {
      right = '<p class="nc-gap">Not actioned yet</p>';
    } else {
      var meta = statusMeta(reply.status);
      right = '<p class="nc-action">' + esc(reply.action || "") + "</p>" +
        (reply.owner ? '<p class="nc-owner">' + esc(reply.owner) + "</p>" : "") +
        chip(meta) +
        (reply.link ? '<a class="nc-link" href="' + esc(reply.link) + '" target="_blank" rel="noopener">Open thread</a>' : "");
    }
    var outcome = outcomeLabel(card.outcome);
    return '<article class="nc-card' + (card.open ? " open" : " closed") + '" data-key="' + esc(card.venueId + "|" + card.at) + '">' +
      '<div class="nc-note"><p class="nc-venue">' + esc(venueTitle(v, card.venueId)) + '</p>' +
      '<p class="nc-when">' + esc(ukWhen(card.at)) + "</p>" +
      '<p class="nc-text">' + esc(card.text) + "</p>" +
      (outcome ? '<p class="nc-outcome">Outcome: ' + esc(outcome) + "</p>" : "") +
      "</div><div class=\"nc-reply\">" + right + "</div></article>";
  }

  function bar(count) {
    var n = count == null ? "" : '<em>' + count + " open</em>";
    return '<button type="button" class="nc-bar" onclick="NatComms.toggle()" aria-expanded="' + (state.opened ? "true" : "false") + '">' +
      "<b>NATALIES NOTES</b>" + n + "<i>" + (state.opened ? "−" : "+") + "</i></button>";
  }

  function paint(el, venues) {
    if (!el) return;
    venues = venues || [];
    if (state.error && !state.notes) {
      el.innerHTML = '<section class="nat-comms">' + bar(null) +
        (state.opened ? '<div class="nc-body"><p class="nc-gap">' + esc(state.error) + "</p></div>" : "") + "</section>";
      return;
    }
    if (!state.notes) {
      el.innerHTML = '<section class="nat-comms">' + bar(null) + "</section>";
      ensure(function () { paint(el, venues); });
      return;
    }
    var all = cardsFrom(state.notes, state.replies || {});
    var openN = all.filter(function (c) { return c.open; }).length;
    var body = "";
    if (state.opened) {
      var shown = all.filter(function (c) {
        if (state.filter === "open") return c.open;
        if (state.filter === "wait") return c.reply && String(c.reply.status || "").toLowerCase() === "waiting on jake";
        return true;
      });
      var html = "";
      var split = false;
      shown.forEach(function (card) {
        if (!card.open && !split && state.filter === "all") {
          split = true;
          html += '<p class="nc-split">Closed</p>';
        }
        html += cardHtml(card, venues);
      });
      if (!shown.length) html = '<p class="nc-when">Nothing in this filter.</p>';
      function tab(id, label) {
        return '<button type="button" class="' + (state.filter === id ? "on" : "") + '" onclick="NatComms.filter(\'' + id + "')\">" + label + "</button>";
      }
      body = '<div class="nc-body"><div class="nc-tools"><div class="nc-filters">' +
        tab("all", "All") + tab("open", "Open") + tab("wait", "Waiting on Jake") +
        '</div><button type="button" class="nc-refresh" onclick="NatComms.refresh()">Refresh</button></div>' +
        html + "</div>";
    }
    el.innerHTML = '<section class="nat-comms' + (state.opened ? " open" : "") + '">' + bar(openN) + body + "</section>";
  }

  function takeNotes(payload) {
    var content = payload && payload.with && payload.with[0] && payload.with[0].content;
    var notes = content && content.notes;
    if (typeof notes === "string") {
      try { notes = JSON.parse(notes); } catch (e) { notes = null; }
    }
    if (!notes || typeof notes !== "object") throw new Error("Notes feed was empty");
    return notes;
  }

  function ensure(cb) {
    if (state.notes) { cb(); return; }
    state.waiters.push(cb);
    if (state.loading) return;
    state.loading = true;
    var stamp = Date.now();
    Promise.all([
      fetch(DWEET + "?t=" + stamp, { cache: "no-store" }).then(function (r) {
        if (!r.ok) throw new Error("Notes feed failed");
        return r.json();
      }),
      fetch(REPLIES + "?t=" + stamp, { cache: "no-store" }).then(function (r) {
        if (!r.ok) return { replies: {} };
        return r.json();
      }).catch(function () { return { replies: {} }; })
    ]).then(function (pair) {
      state.notes = takeNotes(pair[0]);
      state.replies = (pair[1] && pair[1].replies) || {};
      state.error = "";
    }).catch(function (err) {
      state.error = "Notes didn’t load. Tap refresh.";
      state.notes = null;
    }).then(function () {
      state.loading = false;
      var waiters = state.waiters.splice(0);
      waiters.forEach(function (fn) { try { fn(); } catch (e) {} });
    });
  }

  window.NatComms = {
    paint: function (el, venues) {
      state.host = el;
      state.venues = venues || [];
      ensure(function () { paint(state.host, state.venues); });
    },
    toggle: function () {
      state.opened = !state.opened;
      paint(state.host, state.venues || []);
    },
    filter: function (id) {
      state.filter = id || "all";
      paint(state.host, state.venues || []);
    },
    refresh: function () {
      state.notes = null;
      state.replies = null;
      state.error = "";
      if (state.host) paint(state.host, state.venues || []);
    },
    cardsFrom: cardsFrom
  };
})();
