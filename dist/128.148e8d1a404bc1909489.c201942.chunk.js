(window.webpackJsonp = window.webpackJsonp || []).push([[128], {
  '364891063248c8c4e5ed': function (e, r, s) {
    s.r(r); const t = s('3ad3c1378076e862aab0'); const c = s('54f683fcda7806277002'); const a = s('f363639bc5c3c97af546'); const i = s('4e2e9348dad8fe460c1d'); const n = s('1dfca9f44be16af281fa'); const d = s('f7cede8c0a88354b9040'); const o = Object(c.fromJS)({ registerSending: !1, registerSuccess: !1, registerError: !1 }); const f = Object(c.fromJS)({
      attributes: {
        name: '', email: '', password: '', passwordConfirmation: '',
      },
    }); r.default = Object(i.combineReducers)({ page() { const e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : o; const r = arguments.length > 1 ? arguments[1] : void 0; switch (r.type) { case t.LOCATION_CHANGE: return o; case d.c: return e.set('registerSending', !0).set('registerSuccess', !1).set('registerError', !1); case d.d: return e.set('registerSending', !1).set('registerSuccess', !0); case d.b: return e.set('registerSending', !1).set('registerSuccess', !1).set('registerError', Object(a.a)(r.error)); default: return e; } }, form: Object(n.combineForms)({ data: f }, 'userRegister.form') });
  },
}]);
