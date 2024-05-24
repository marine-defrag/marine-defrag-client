(window.webpackJsonp = window.webpackJsonp || []).push([[11], {
  f4eed3003a020c447519(a, e, t) {
    t.d(e, 'a', () => u); const r = t('54f683fcda7806277002'); const s = t('3ad3c1378076e862aab0'); const c = t('fcb99a06256635f70435'); const n = t('f363639bc5c3c97af546'); const d = Object(r.fromJS)({ sending: {}, success: {}, errors: {} }); var u = function () { const a = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : d; const e = arguments.length > 1 ? arguments[1] : void 0; switch (e.type) { case c.C: return d; case c.M: case s.LOCATION_CHANGE: return d; case c.S: return e.data ? a.setIn(['sending', e.data.timestamp], e.data) : a; case c.T: return e.data ? a.setIn(['success', e.data.timestamp], e.data) : a; case c.P: return e.data ? a.setIn(['errors', e.data.timestamp], { data: e.data, error: Object(n.a)(e.error) }) : a; default: return a; } };
  },
}]);
