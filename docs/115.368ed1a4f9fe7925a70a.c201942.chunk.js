(window.webpackJsonp = window.webpackJsonp || []).push([[115], {
  '076cf8597902e2d1c995': function (e, t, r) {
    r.r(t), r.d(t, 'updateQuery', () => b), r.d(t, 'resetSearchQuery', () => f), r.d(t, 'updateSortBy', () => g), r.d(t, 'updateSortOrder', () => v), r.d(t, 'defaultSaga', () => l); const n = r('d782b72bc5b680c7122c'); const a = r('3ad3c1378076e862aab0'); const c = r('a72b40110d9c31c9b5c5'); const u = r('ce1150625851d45f3cbe'); const o = regeneratorRuntime.mark(b); const s = regeneratorRuntime.mark(f); const p = regeneratorRuntime.mark(g); const i = regeneratorRuntime.mark(v); const d = regeneratorRuntime.mark(l); function b(e) {
      let t; let r; return regeneratorRuntime.wrap((a) => {
        for (;;) {
          switch (a.prev = a.next) {
            case 0: return t = e.value, r = t.map((e) => ({
              arg: e.get('query'), value: e.get('value'), replace: e.get('replace'), add: e.get('checked'), remove: !e.get('checked'),
            })).toJS(), a.next = 4, r.push({
              arg: 'page', value: '', replace: !0, remove: !0,
            }); case 4: return a.next = 6, Object(n.put)(Object(c.db)(r)); case 6: case 'end': return a.stop();
          }
        }
      }, o);
    } function f(e) {
      let t; let r; return regeneratorRuntime.wrap((a) => {
        for (;;) {
          switch (a.prev = a.next) {
            case 0: return t = e.values, r = t.map((e) => ({
              arg: e, value: '', replace: !0, remove: !0,
            })), a.next = 4, Object(n.put)(Object(c.db)(r)); case 4: case 'end': return a.stop();
          }
        }
      }, s);
    } function g(e) { let t; return regeneratorRuntime.wrap((r) => { for (;;) switch (r.prev = r.next) { case 0: return t = e.sort, r.next = 3, Object(n.put)(Object(c.db)({ arg: 'sort', value: t, replace: !0 })); case 3: case 'end': return r.stop(); } }, p); } function v(e) { let t; return regeneratorRuntime.wrap((r) => { for (;;) switch (r.prev = r.next) { case 0: return t = e.order, r.next = 3, Object(n.put)(Object(c.db)({ arg: 'order', value: t, replace: !0 })); case 3: case 'end': return r.stop(); } }, i); } function l() { let e; let t; let r; let c; return regeneratorRuntime.wrap((o) => { for (;;) switch (o.prev = o.next) { case 0: return o.next = 2, Object(n.takeLatest)(u.f, b); case 2: return e = o.sent, o.next = 5, Object(n.takeLatest)(u.c, f); case 5: return t = o.sent, o.next = 8, Object(n.takeLatest)(u.d, g); case 8: return r = o.sent, o.next = 11, Object(n.takeLatest)(u.e, v); case 11: return c = o.sent, o.next = 14, Object(n.take)(a.LOCATION_CHANGE); case 14: return o.next = 16, Object(n.cancel)(e); case 16: return o.next = 18, Object(n.cancel)(t); case 18: return o.next = 20, Object(n.cancel)(r); case 20: return o.next = 22, Object(n.cancel)(c); case 22: case 'end': return o.stop(); } }, d); }t.default = [l];
  },
}]);
