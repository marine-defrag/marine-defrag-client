(window.webpackJsonp = window.webpackJsonp || []).push([[110], {
  ed5708424716474addb3(e, t, n) {
    n.r(t); let r; const i = n('8af190b70a6bc55c6f1b'); const o = n.n(i); const a = n('8a2d1b95e05b6a321e74'); const c = n.n(a); const s = n('d7dd51e1bf6bfc2c9c3d'); const u = n('0d7f0986bcd2f33d8a2a'); const f = n.n(u); const d = n('1dfca9f44be16af281fa'); const l = n('54f683fcda7806277002'); const p = n('47e94b5ec55a17ebe237'); const b = n('57b36dff0c422d2b9c67'); const m = n('86b83146d2366c27fd7c'); const y = n('a0eea3e3c7c0b7b70771'); const h = n('0d5a1aa701766449187d'); const g = n('fcb99a06256635f70435'); const O = n('2157bd598f2b425595ea'); const j = n('52147c536625ee918894'); const v = n('a72b40110d9c31c9b5c5'); const w = n('6542cd13fd5dd1bcffd4'); const S = n('fb88414ab887e57c7b57'); const R = n('17a826745d7905c7f263'); const M = n('4bbbd76528501909b843'); const _ = n('e4dd33cd8c3dbbd378c3'); const E = n('2da65066c2da9f64c68a'); const C = n('a28fc3c963a1d4d1a2e5'); const N = n('968c3c585cf17da94a14'); const A = Object(C.a)((e) => e.get('resourceNew'), (e) => e); const F = Object(C.a)(w.n, w.Y, (e, t) => Object(h.D)(e, t, !1)); const D = Object(C.a)((e, t) => t, w.p, w.v, (e, t, n) => { if (!n || !t) return null; const r = Object.keys(O.f).filter((t) => { const n = O.f[t]; return n && n.indexOf(e) > -1; }); return r && r.length !== 0 ? n.filter((e) => r && r.indexOf(e.get('id')) > -1).map((e) => t.filter((t) => Object(N.b)(e.get('id'), t.getIn(['attributes', 'measuretype_id'])))) : null; }); const x = n('ab039aecd4a1d4fedc0e'); const I = Object(x.defineMessages)({ pageTitle: { id: 'app.containers.ResourceNew.pageTitle', defaultMessage: 'New {type}' }, metaDescription: { id: 'app.containers.ResourceNew.metaDescription', defaultMessage: 'New Resource page description' }, header: { id: 'app.containers.ResourceNew.header', defaultMessage: 'New {type}' } }); const P = n('bdaacb84cf8e1bc70267'); function B(e) { return (B = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function (e) { return typeof e; } : function (e) { return e && typeof Symbol === 'function' && e.constructor === Symbol && e !== Symbol.prototype ? 'symbol' : typeof e; })(e); } function k(e, t, n, i) {
      r || (r = typeof Symbol === 'function' && Symbol.for && Symbol.for('react.element') || 60103); const o = e && e.defaultProps; const a = arguments.length - 3; if (t || a === 0 || (t = { children: void 0 }), a === 1)t.children = i; else if (a > 1) { for (var c = new Array(a), s = 0; s < a; s++)c[s] = arguments[s + 3]; t.children = c; } if (t && o) for (const u in o) void 0 === t[u] && (t[u] = o[u]); else t || (t = o || {}); return {
        $$typeof: r, type: e, key: void 0 === n ? null : `${n}`, ref: null, props: t, _owner: null,
      };
    } function T(e, t) { for (let n = 0; n < t.length; n++) { const r = t[n]; r.enumerable = r.enumerable || !1, r.configurable = !0, 'value' in r && (r.writable = !0), Object.defineProperty(e, r.key, r); } } function U(e, t) { return (U = Object.setPrototypeOf || function (e, t) { return e.__proto__ = t, e; })(e, t); } function J(e) { const t = (function () { if (typeof Reflect === 'undefined' || !Reflect.construct) return !1; if (Reflect.construct.sham) return !1; if (typeof Proxy === 'function') return !0; try { return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], () => {})), !0; } catch (e) { return !1; } }()); return function () { let n; const r = K(e); if (t) { const i = K(this).constructor; n = Reflect.construct(r, arguments, i); } else n = r.apply(this, arguments); return (function (e, t) { if (t && (B(t) === 'object' || typeof t === 'function')) return t; if (void 0 !== t) throw new TypeError('Derived constructors may only return object or undefined'); return H(e); }(this, n)); }; } function H(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; } function K(e) { return (K = Object.setPrototypeOf ? Object.getPrototypeOf : function (e) { return e.__proto__ || Object.getPrototypeOf(e); })(e); } function Y(e, t, n) {
      return t in e ? Object.defineProperty(e, t, {
        value: n, enumerable: !0, configurable: !0, writable: !0,
      }) : e[t] = n, e;
    }n.d(t, 'ResourceNew', () => q); const W = k(R.a, {}); const $ = k(R.a, {}); var q = (function (e) {
      !(function (e, t) { if (typeof t !== 'function' && t !== null) throw new TypeError('Super expression must either be null or a function'); e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), t && U(e, t); }(a, o.a.PureComponent)); let t; let n; let r; const i = J(a); function a(e) {
        let t; return (function (e, t) { if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function'); }(this, a)), Y(H(t = i.call(this, e)), 'getInitialFormData', (e) => { const n = (e || t.props).params; return Object(l.Map)(P.b.setIn(['attributes', 'resourcetype_id'], n.id)); }), Y(H(t), 'getHeaderMainFields', (e) => { const n = t.context.intl; const r = e.get('id'); return [{ fields: [Object(b.i)('resourcetype_id', n.formatMessage(j.a.resourcetypes[r]), !0), Object(h.e)(r, 'title') && Object(p.z)(n.formatMessage, 'title', 'title', Object(h.f)(r, 'title'))] }]; }), Y(H(t), 'getHeaderAsideFields', () => { const e = t.context.intl; return [{ fields: [Object(p.x)(e.formatMessage)] }]; }), Y(H(t), 'getBodyMainFields', (e, n, r, i) => {
          const o = t.context.intl; const a = e.get('id'); const c = []; if (c.push({ fields: [Object(h.e)(a, 'url') && Object(p.l)(o.formatMessage, Object(h.f)(a, 'url'), 'url')] }), c.push({ fields: [Object(h.e)(a, 'description') && Object(p.m)(o.formatMessage, Object(h.f)(a, 'description'), 'description'), Object(h.e)(a, 'status') && Object(p.m)(o.formatMessage, Object(h.f)(a, 'status'), 'status')] }), r) {
            const s = Object(p.E)({
              entitiesByActiontype: r, taxonomies: n, onCreateOption: i, contextIntl: o,
            }); s && c.push({ label: o.formatMessage(j.a.nav.actions), fields: s });
          } return c;
        }), Y(H(t), 'getBodyAsideFields', (e) => { const n = t.context.intl; const r = e.get('id'); return [{ fields: [Object(h.e)(r, 'publication_date') && Object(p.g)(n.formatMessage, 'publication_date', Object(h.f)(r, 'publication_date')), Object(h.e)(r, 'access_date') && Object(p.g)(n.formatMessage, 'access_date', Object(h.f)(r, 'access_date'))] }]; }), t.scrollContainer = o.a.createRef(), t;
      } return t = a, (n = [{ key: 'UNSAFE_componentWillMount', value() { this.props.loadEntitiesIfNeeded(), this.props.initialiseForm('resourceNew.form.data', this.getInitialFormData()); } }, { key: 'UNSAFE_componentWillReceiveProps', value(e) { e.dataReady || this.props.loadEntitiesIfNeeded(), e.authReady && !this.props.authReady && this.props.redirectIfNotPermitted(), Object(y.a)(e, this.props) && this.scrollContainer && Object(m.d)(this.scrollContainer.current); } }, {
        key: 'render',
        value() {
          const e = this; const t = this.context.intl; const n = this.props; const r = n.dataReady; const i = n.viewDomain; const a = n.connectedTaxonomies; const c = n.actionsByActiontype; const s = n.onCreateOption; const u = n.resourcetype; const d = n.params.id; const l = i.get('page').toJS(); const p = l.saveSending; const b = l.saveError; const m = l.submitValid; const y = t.formatMessage(j.a.entities['resources_'.concat(d)].single); return k('div', {}, void 0, k(f.a, { title: ''.concat(t.formatMessage(I.pageTitle, { type: y })), meta: [{ name: 'description', content: t.formatMessage(I.metaDescription) }] }), o.a.createElement(M.a, { ref: this.scrollContainer }, k(_.a, { title: t.formatMessage(I.pageTitle, { type: y }), type: g.l, buttons: r ? [{ type: 'cancel', onClick() { return e.props.handleCancel(d); } }, { type: 'save', disabled: p, onClick() { return e.props.handleSubmitRemote('resourceNew.form.data'); } }] : null }), !m && k(S.a, { type: 'error', messageKey: 'submitInvalid', onDismiss: this.props.onErrorDismiss }), b && k(S.a, { type: 'error', messages: b.messages, onDismiss: this.props.onServerErrorDismiss }), (p || !r) && W, r && k(E.a, {
            model: 'resourceNew.form.data', formData: i.getIn(['form', 'data']), saving: p, handleSubmit(t) { return e.props.handleSubmit(t, u, c); }, handleSubmitFail: this.props.handleSubmitFail, handleCancel() { return e.props.handleCancel(d); }, handleUpdate: this.props.handleUpdate, fields: { header: { main: this.getHeaderMainFields(u), aside: this.getHeaderAsideFields() }, body: { main: this.getBodyMainFields(u, a, c, s), aside: this.getBodyAsideFields(u) } }, scrollContainer: this.scrollContainer.current,
          }), p && $));
        },
      }]) && T(t.prototype, n), r && T(t, r), a;
    }()); q.contextTypes = { intl: c.a.object.isRequired }; t.default = Object(s.connect)((e, t) => {
      const n = t.params; return {
        viewDomain: A(e), dataReady: Object(w.Pb)(e, { path: P.a }), authReady: Object(w.Qb)(e), connectedTaxonomies: F(e), resourcetype: Object(w.Xb)(e, n.id), actionsByActiontype: D(e, n.id),
      };
    }, (e) => ({
      initialiseForm(t, n) { e(d.actions.reset(t)), e(d.actions.change(t, n, { silent: !0 })); },
      loadEntitiesIfNeeded() { P.a.forEach((t) => e(Object(v.s)(t))); },
      redirectIfNotPermitted() { e(Object(v.A)(O.M.MANAGER.value)); },
      onErrorDismiss() { e(Object(v.Y)(!0)); },
      onServerErrorDismiss() { e(Object(v.F)()); },
      handleSubmitFail() { e(Object(v.Y)(!1)); },
      handleSubmitRemote(t) { e(d.actions.submit(t)); },
      handleSubmit(t, n, r) {
        let i; let o = t.setIn(['attributes', 'resourcetype_id'], n.get('id')); r && t.get('associatedActionsByActiontype') && (o = o.set('actionResources', r.map((e, n) => Object(p.f)({
          formData: t, connections: e, connectionAttribute: ['associatedActionsByActiontype', n.toString()], createConnectionKey: 'measure_id', createKey: 'resource_id',
        })).reduce((e, t) => { const n = e.get('create').concat(t.get('create')); return e.set('create', n); }, Object(l.fromJS)({ create: [] })))), e((i = o.toJS(), n.get('id'), { type: P.c, data: i }));
      },
      handleCancel(t) { e(Object(v.cb)(''.concat(O.I.RESOURCES, '/').concat(t)), { replace: !0 }); },
      handleUpdate(t) { e(Object(v.bb)(t)); },
      onCreateOption(t) { e(Object(v.y)(t)); },
    }))(q);
  },
}]);