(window.webpackJsonp = window.webpackJsonp || []).push([[116], {
  '6f450ee307b6b0d39990': function (e, t, n) {
    n.r(t); let o; const r = n('8af190b70a6bc55c6f1b'); const i = n.n(r); const a = n('8a2d1b95e05b6a321e74'); const c = n.n(a); const f = n('0d7f0986bcd2f33d8a2a'); const u = n.n(f); const s = n('ab039aecd4a1d4fedc0e'); const l = n('0b3cb19af78752326f59'); const p = n('e4dd33cd8c3dbbd378c3'); const d = n('79020d965b3bf6e5937c'); const b = n('06c544058ac212c34b44'); const y = n('c192223dbe6bcf2cf3a4'); const h = Object(s.defineMessages)({ metaDescription: { id: 'app.containers.Unauthorised.metaDescription', defaultMessage: 'Unauthorised page' }, pageTitle: { id: 'app.containers.Unauthorised.pageTitle', defaultMessage: 'Unauthorised' }, info: { id: 'app.containers.Unauthorised.info', defaultMessage: 'We are sorry but you do not have sufficient rights to access this page.' } }); function m(e) { return (m = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function (e) { return typeof e; } : function (e) { return e && typeof Symbol === 'function' && e.constructor === Symbol && e !== Symbol.prototype ? 'symbol' : typeof e; })(e); } function v(e, t, n, r) {
      o || (o = typeof Symbol === 'function' && Symbol.for && Symbol.for('react.element') || 60103); const i = e && e.defaultProps; const a = arguments.length - 3; if (t || a === 0 || (t = { children: void 0 }), a === 1)t.children = r; else if (a > 1) { for (var c = new Array(a), f = 0; f < a; f++)c[f] = arguments[f + 3]; t.children = c; } if (t && i) for (const u in i) void 0 === t[u] && (t[u] = i[u]); else t || (t = i || {}); return {
        $$typeof: o, type: e, key: void 0 === n ? null : `${n}`, ref: null, props: t, _owner: null,
      };
    } function g(e, t) { for (let n = 0; n < t.length; n++) { const o = t[n]; o.enumerable = o.enumerable || !1, o.configurable = !0, 'value' in o && (o.writable = !0), Object.defineProperty(e, o.key, o); } } function w(e, t) { return (w = Object.setPrototypeOf || function (e, t) { return e.__proto__ = t, e; })(e, t); } function O(e) { const t = (function () { if (typeof Reflect === 'undefined' || !Reflect.construct) return !1; if (Reflect.construct.sham) return !1; if (typeof Proxy === 'function') return !0; try { return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], () => {})), !0; } catch (e) { return !1; } }()); return function () { let n; const o = j(e); if (t) { const r = j(this).constructor; n = Reflect.construct(o, arguments, r); } else n = o.apply(this, arguments); return (function (e, t) { if (t && (m(t) === 'object' || typeof t === 'function')) return t; if (void 0 !== t) throw new TypeError('Derived constructors may only return object or undefined'); return (function (e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }(e)); }(this, n)); }; } function j(e) { return (j = Object.setPrototypeOf ? Object.getPrototypeOf : function (e) { return e.__proto__ || Object.getPrototypeOf(e); })(e); }n.d(t, 'Unauthorised', () => M); const _ = Object(l.default)(d.a).withConfig({ displayName: 'Unauthorised__ViewContainer', componentId: 'sc-1huuaag-0' })(['min-height:100vH;']); const S = v(y.a, {}); var M = (function (e) { !(function (e, t) { if (typeof t !== 'function' && t !== null) throw new TypeError('Super expression must either be null or a function'); e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), t && w(e, t); }(a, i.a.PureComponent)); let t; let n; let o; const r = O(a); function a() { return (function (e, t) { if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function'); }(this, a)), r.apply(this, arguments); } return t = a, (n = [{ key: 'render', value() { const e = this.context.intl; return v('div', {}, void 0, v(u.a, { title: e.formatMessage(h.pageTitle), meta: [{ name: 'description', content: e.formatMessage(h.metaDescription) }] }), v(b.a, { isStatic: !0, hasFooter: !0 }, void 0, v(_, {}, void 0, v(p.a, { title: e.formatMessage(h.pageTitle) }), v('p', {}, void 0, i.a.createElement(s.FormattedMessage, h.info))), S)); } }]) && g(t.prototype, n), o && g(t, o), a; }()); M.contextTypes = { intl: c.a.object.isRequired }; t.default = M;
  },
}]);