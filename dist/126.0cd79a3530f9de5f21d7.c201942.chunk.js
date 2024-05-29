(window.webpackJsonp = window.webpackJsonp || []).push([[126], {
  f78722e6068760d0c04b(e, t, r) {
    r.r(t), r.d(t, 'save', () => f), r.d(t, 'defaultSaga', () => w); const n = r('d782b72bc5b680c7122c'); const a = r('3ad3c1378076e862aab0'); const c = r('06205e26d6c7c8553b42'); const s = r('2157bd598f2b425595ea'); const u = r('a72b40110d9c31c9b5c5'); const b = r('1dfca9f44be16af281fa'); const o = r('ba3b727456a6bd810465'); const d = r('174bc3ebd1bfff6074fe'); const i = regeneratorRuntime.mark(f); const p = regeneratorRuntime.mark(w); function f(e) {
      let t; return regeneratorRuntime.wrap((r) => {
        for (;;) {
          switch (r.prev = r.next) {
            case 0: return t = e.data, r.prev = 1, r.next = 4, Object(n.put)(Object(o.b)()); case 4: return r.next = 6, Object(n.call)(c.f, {
              id: t.id, current_password: t.attributes.password, password: t.attributes.passwordNew, password_confirmation: t.attributes.passwordConfirmation,
            }); case 6: return r.next = 8, Object(n.put)(Object(o.c)()); case 8: return r.next = 10, Object(n.put)(Object(u.cb)(''.concat(s.I.USERS, '/').concat(t.id))); case 10: return r.next = 12, Object(n.put)(b.actions.reset('userPassword.form.data')); case 12: r.next = 21; break; case 14: return r.prev = 14, r.t0 = r.catch(1), r.next = 18, r.t0.response.json(); case 18: return r.t0.response.json = r.sent, r.next = 21, Object(n.put)(Object(o.a)(r.t0)); case 21: case 'end': return r.stop();
          }
        }
      }, i, null, [[1, 14]]);
    } function w() { let e; return regeneratorRuntime.wrap((t) => { for (;;) switch (t.prev = t.next) { case 0: return t.next = 2, Object(n.takeLatest)(d.d, f); case 2: return e = t.sent, t.next = 5, Object(n.take)(a.LOCATION_CHANGE); case 5: return t.next = 7, Object(n.cancel)(e); case 7: case 'end': return t.stop(); } }, p); }t.default = [w];
  },
}]);
