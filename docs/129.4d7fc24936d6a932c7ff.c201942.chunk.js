(window.webpackJsonp = window.webpackJsonp || []).push([[129], {
  '14a6b31bc26602e138d5': function (e, t, r) {
    r.r(t), r.d(t, 'register', () => p), r.d(t, 'registerSaga', () => d); const a = r('d782b72bc5b680c7122c'); const n = r('3ad3c1378076e862aab0'); const c = r('a72b40110d9c31c9b5c5'); const s = r('06205e26d6c7c8553b42'); const u = r('5a80a6ba48d3a103d341'); const b = r('f7cede8c0a88354b9040'); const o = regeneratorRuntime.mark(p); const i = regeneratorRuntime.mark(d); function p(e) {
      let t; let r; return regeneratorRuntime.wrap((n) => {
        for (;;) {
          switch (n.prev = n.next) {
            case 0: return t = e.data, n.prev = 1, n.next = 4, Object(a.put)(Object(u.c)()); case 4: return n.next = 6, Object(a.call)(s.c, {
              email: t.attributes.email, password: t.attributes.password, password_confirmation: t.attributes.passwordConfirmation, name: t.attributes.name,
            }); case 6: return r = n.sent, n.next = 9, Object(a.put)(Object(u.d)()); case 9: return n.next = 11, Object(a.put)(Object(c.b)({ email: r.data.email, password: t.attributes.password })); case 11: n.next = 20; break; case 13: return n.prev = 13, n.t0 = n.catch(1), n.next = 17, n.t0.response.json(); case 17: return n.t0.response.json = n.sent, n.next = 20, Object(a.put)(Object(u.b)(n.t0)); case 20: case 'end': return n.stop();
          }
        }
      }, o, null, [[1, 13]]);
    } function d() { let e; return regeneratorRuntime.wrap((t) => { for (;;) switch (t.prev = t.next) { case 0: return t.next = 2, Object(a.takeLatest)(b.a, p); case 2: return e = t.sent, t.next = 5, Object(a.take)(n.LOCATION_CHANGE); case 5: return t.next = 7, Object(a.cancel)(e); case 7: case 'end': return t.stop(); } }, i); }t.default = [d];
  },
}]);
