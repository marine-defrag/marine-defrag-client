(window.webpackJsonp = window.webpackJsonp || []).push([[122], {
  '98b76881d8b2f17af4f9': function (e, t, n) {
    n.r(t), n.d(t, 'login', () => s), n.d(t, 'defaultSaga', () => i); const r = n('d782b72bc5b680c7122c'); const a = n('3ad3c1378076e862aab0'); const c = n('a72b40110d9c31c9b5c5'); const u = n('d8136f37fb53859ae7bb'); const o = regeneratorRuntime.mark(s); const b = regeneratorRuntime.mark(i); function s(e) { let t; return regeneratorRuntime.wrap((n) => { for (;;) switch (n.prev = n.next) { case 0: return t = e.data, n.next = 3, Object(r.put)(Object(c.b)(t)); case 3: case 'end': return n.stop(); } }, o); } function i() { let e; return regeneratorRuntime.wrap((t) => { for (;;) switch (t.prev = t.next) { case 0: return t.next = 2, Object(r.takeLatest)(u.a, s); case 2: return e = t.sent, t.next = 5, Object(r.take)(a.LOCATION_CHANGE); case 5: return t.next = 7, Object(r.cancel)(e); case 7: case 'end': return t.stop(); } }, b); }t.default = [i];
  },
}]);
