(window.webpackJsonp = window.webpackJsonp || []).push([[109], {
  e541725db3eba020cece(e, t, n) {
    n.r(t), n.d(t, 'save', () => i), n.d(t, 'defaultSaga', () => b); const r = n('d782b72bc5b680c7122c'); const a = n('3ad3c1378076e862aab0'); const c = n('2157bd598f2b425595ea'); const u = n('a72b40110d9c31c9b5c5'); const s = n('dd482097622c786e5f0d'); const o = regeneratorRuntime.mark(i); const d = regeneratorRuntime.mark(b); function i(e) {
      let t; return regeneratorRuntime.wrap((n) => {
        for (;;) {
          switch (n.prev = n.next) {
            case 0: return t = e.data, n.next = 3, Object(r.put)(Object(u.v)({
              path: c.n.RESOURCES, entity: t, redirect: !1, saveRef: t.saveRef,
            })); case 3: case 'end': return n.stop();
          }
        }
      }, o);
    } function b() { let e; return regeneratorRuntime.wrap((t) => { for (;;) switch (t.prev = t.next) { case 0: return t.next = 2, Object(r.takeEvery)(s.c, i); case 2: return e = t.sent, t.next = 5, Object(r.take)(a.LOCATION_CHANGE); case 5: return t.next = 7, Object(r.cancel)(e); case 7: case 'end': return t.stop(); } }, d); }t.default = [b];
  },
}]);
