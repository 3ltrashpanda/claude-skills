// Builds a local preview of huddle/board.html: the real page plus an in-memory mock of the artifact db, seeded with demo data.
// Usage: node docs/make-preview.js huddle/board.html preview.html   then serve the folder (e.g. python -m http.server) and open preview.html.
const fs = require("fs"), path = require("path");
const board = fs.readFileSync(process.argv[2], "utf8").replace(/\{\{PROJECT\}\}/g, "Trail Notes");
const mock = `<script>
(() => {
  const now = Date.now(), m = n => now - n * 60000, h = n => now - n * 3600000, d = n => now - n * 86400000;
  const S = new Map(), subs = [];
  const put = (p, v) => S.set(p, v);
  const merge = (a, b) => { const o = { ...a }; for (const [k, v] of Object.entries(b)) o[k] = (v && typeof v === "object" && !Array.isArray(v) && o[k] && typeof o[k] === "object" && !Array.isArray(o[k])) ? merge(o[k], v) : v; return o; };
  const colDocs = c => [...S.entries()].filter(([p]) => p.startsWith(c + "/") && p.split("/").length === 2).map(([p, v]) => ({ id: p.split("/")[1], exists: true, data: () => v }));
  const fire = () => subs.forEach(s => s());
  const doc = p => ({
    id: p.split("/").pop(), path: p,
    get: async () => ({ exists: S.has(p), data: () => S.get(p) }),
    update: async x => { if (!S.has(p)) throw { message: "missing doc" }; S.set(p, merge(S.get(p), x)); fire(); },
    set: async x => { S.set(p, x); fire(); },
    onSnapshot(next) { const f = () => next({ id: p.split("/").pop(), exists: S.has(p), data: () => S.get(p) }); subs.push(f); setTimeout(f, 0); return () => {}; }
  });
  const col = c => ({ onSnapshot(next) { const f = () => { const docs = colDocs(c); next({ docs, size: docs.length, empty: !docs.length }); }; subs.push(f); setTimeout(f, 0); return () => {}; } });
  window.claude = { use: async n => n === "db" ? { doc, collection: col } : n === "user" ? { can: async () => true, id: async () => "u1" } : null };
  window.__fireDb = fire; window.__store = S;

  put("meta/project", { name: "Trail Notes", lede: "A hiking journal app: offline notes, maps and photo sync.", updated: m(12), updatedBy: "Claude", lastSyncAt: m(30), lastGroom: { at: d(9), merged: 2, archived: 6 } });
  const c = (id, o) => put("cards/" + id, { owner: "", updated: h(3), created: d(2), ...o });
  const note = (by, at, text, kind) => ({ by, at, text, kind });
  c("c1", { title: "Offline sync on iPad Safari", lane: "testing", owner: "frontend", detail: "Merged. Needs a real-device check with Wi-Fi off.", needsYou: "Turn Wi-Fi off, add a note, turn it back on: does it appear on the second device?", needsYouKind: "check", needsYouAt: h(6), updated: h(6) });
  c("c2", { title: "GPX export format", lane: "triaged", owner: "backend", detail: "Users asked for track export.", needsYou: "GPX only, or GPX plus KML? KML doubles the test work.", needsYouKind: "decision", needsYouAt: h(30), updated: h(30) });
  c("c3", { title: "Empty-state wording for new journal", lane: "triaged", owner: "design", needsYou: "Which copy do you want: 'Start your first hike' or 'Nothing here yet'?", needsYouKind: "question", needsYouAt: h(2), updated: h(2) });
  c("c4", { title: "Dark map style", lane: "next", owner: "frontend", detail: "Matches system dark mode.", updated: h(20), notes: { a: note("Claude", h(20), "Scoped: about half a day, no new dependencies.", "comment"), b: note("you", m(10), "Do this before the export work please.", "comment") } });
  c("c5", { title: "Cache map tiles for offline use", lane: "triaged", owner: "backend", detail: "Needs a storage budget decision first.", updated: h(9) });
  c("c6", { title: "Fix login redirect loop", lane: "doing", owner: "backend", detail: "Loop after password reset on mobile.", claim: { by: "Claude", startedAt: h(7), heartbeatAt: h(5) }, updated: h(5) });
  c("c8", { title: "Sync engine retry logic", lane: "doing", owner: "backend", detail: "Exponential backoff with a cap.", claim: { by: "Claude", startedAt: m(50), heartbeatAt: m(4) }, updated: m(4) });
  c("c9", { title: "Photo upload resize", lane: "doing", owner: "frontend", claim: { by: "Claude", startedAt: h(3), heartbeatAt: m(95) }, updated: m(95) });
  c("c10", { title: "Search index for notes", lane: "doing", owner: "backend", updated: h(1) });
  c("c11", { title: "Rate limit the public API", lane: "approved", owner: "backend", detail: "Cleared to build.", updated: h(8) });
  c("c12", { title: "Crash when rotating the map", lane: "reported", detail: "iPad, landscape to portrait while a track is open.", from: "you", updated: m(40), notes: { a: note("you", h(5), "Happens every time on the 12.9 inch iPad.", "comment") } });
  c("c13", { title: "Share a hike as a link", lane: "testing", owner: "frontend", detail: "Automated tests pass; Claude is checking the share sheet.", updated: h(2) });
  const doneTitles = ["Account deletion", "Onboarding screens", "Pin photos to a map point", "Track recording", "Basic note editor", "Sign in with email", "Unit tests for sync", "Crash reporting", "Settings page", "Export notes as text"];
  doneTitles.forEach((t, i) => c("d" + i, { title: t, lane: "done", owner: i % 2 ? "frontend" : "backend", updated: d(1 + i) }));
  c("x1", { title: "Old duplicate: GPX export", lane: "done", archived: true, archivedAt: d(3), archiveReason: "Merged into 'GPX export format'", updated: d(3) });

  const idea = (id, o) => put("ideas/" + id, { from: "you", reviews: {}, status: "reviewing", updated: h(10), created: d(1), ...o });
  idea("i1", { title: "Weather overlay on the map", pitch: "Show rain and wind along a planned route.", reviews: { product: { verdict: "yes", size: "M", note: "Hikers check weather first; strong fit." }, backend: { verdict: "maybe", size: "L", note: "Needs a paid weather API and caching." }, security: { verdict: "yes", size: "S", note: "No personal data leaves the device." } } });
  idea("i2", { title: "Group hikes with shared notes", pitch: "Invite friends to a shared journal.", status: "question", askBy: "team", ask: "Reviewers split on accounts vs invite links. Recommendation: invite links first. Okay?", reviews: { product: { verdict: "yes", size: "L", note: "Big value, big surface." }, security: { verdict: "maybe", size: "L", note: "Sharing needs an access model." } }, updated: h(4) });
  idea("i3", { title: "Voice notes", pitch: "Record a short voice note on the trail.", from: "Claude" });
  idea("i4", { title: "Trail difficulty scoring", pitch: "Rate routes from elevation and distance.", status: "parked", decision: "Good, but wait until we have route data.", reviews: { product: { verdict: "yes", size: "M", note: "Nice later." } }, updated: d(4) });
  idea("i5", { title: "Offline-first search", pitch: "Search notes with no connection.", status: "approved", decision: "Yes. Claude will turn it into a card.", reviews: { backend: { verdict: "yes", size: "M", note: "Fits the existing index." } }, updated: d(2) });

  put("meta/groomPlan", { status: "proposed", createdAt: m(25), items: {
    p1: { kind: "merge", title: "Merge 'Crash when rotating the map' into 'Rotation crash on iPad'", why: "Same symptom, same device; the second card has the repro steps." },
    p2: { kind: "archive", title: "Archive 6 cards finished more than 14 days ago", why: "Done for two weeks or more, no open notes. Restorable from the Archived list." },
    p3: { kind: "move", title: "Move 'Share a hike as a link' back to In progress", why: "Tests failed on the last run, so it is not ready for testing." }
  } });
})();
<\/script>`;
const out = "<!doctype html><meta charset=utf8><meta name=viewport content=\"width=device-width,initial-scale=1\">" + board.replace('<div class="wrap">', mock + '\n<div class="wrap">');
fs.writeFileSync(process.argv[3], out);
console.log("wrote", process.argv[3], out.length);
