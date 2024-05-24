(window.webpackJsonp = window.webpackJsonp || []).push([[15], {
  '56b1ecaabeb9ccb8cfe5': function (e, t, r) {
    r.d(t, 'c', () => i), r.d(t, 'a', () => s), r.d(t, 'b', () => u); const n = r('54f683fcda7806277002'); const c = r('2157bd598f2b425595ea'); function o(e, t) { const r = Object.keys(e); if (Object.getOwnPropertySymbols) { let n = Object.getOwnPropertySymbols(e); t && (n = n.filter((t) => Object.getOwnPropertyDescriptor(e, t).enumerable)), r.push.apply(r, n); } return r; } function O(e) { for (let t = 1; t < arguments.length; t++) { var r = arguments[t] != null ? arguments[t] : {}; t % 2 ? o(Object(r), !0).forEach((t) => { a(e, t, r[t]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : o(Object(r)).forEach((t) => { Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t)); }); } return e; } function a(e, t, r) {
      return t in e ? Object.defineProperty(e, t, {
        value: r, enumerable: !0, configurable: !0, writable: !0,
      }) : e[t] = r, e;
    } var i = 'impactoss/ActionNew/SAVE'; var s = [c.n.USER_ROLES, c.n.CATEGORIES, c.n.TAXONOMIES, c.n.ACTIONS, c.n.ACTORS, c.n.ACTORTYPES, c.n.RESOURCES, c.n.RESOURCETYPES, c.n.ACTIONTYPES, c.n.ACTORTYPE_TAXONOMIES, c.n.ACTIONTYPE_TAXONOMIES, c.n.ACTOR_CATEGORIES, c.n.ACTION_CATEGORIES]; var u = Object(n.fromJS)({
      id: '', attributes: Object.keys(c.h.ATTRIBUTES).reduce((e, t) => O(O({}, e), {}, a({}, t, c.h.ATTRIBUTES[t].defaultValue || '')), {}), associatedTaxonomies: {}, associatedActorsByActortype: {}, associatedTargetsByActortype: {}, associatedResourcesByResource: {}, associatedParent: [],
    });
  },
}]);
