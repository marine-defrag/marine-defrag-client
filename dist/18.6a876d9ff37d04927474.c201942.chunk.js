(window.webpackJsonp = window.webpackJsonp || []).push([[18], {
  d9f130e687fda36a966d(e, t, n) {
    n.d(t, 'c', () => s), n.d(t, 'a', () => O), n.d(t, 'b', () => u); const r = n('54f683fcda7806277002'); const c = n('2157bd598f2b425595ea'); function o(e, t) { const n = Object.keys(e); if (Object.getOwnPropertySymbols) { let r = Object.getOwnPropertySymbols(e); t && (r = r.filter((t) => Object.getOwnPropertyDescriptor(e, t).enumerable)), n.push.apply(n, r); } return n; } function i(e) { for (let t = 1; t < arguments.length; t++) { var n = arguments[t] != null ? arguments[t] : {}; t % 2 ? o(Object(n), !0).forEach((t) => { a(e, t, n[t]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : o(Object(n)).forEach((t) => { Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t)); }); } return e; } function a(e, t, n) {
      return t in e ? Object.defineProperty(e, t, {
        value: n, enumerable: !0, configurable: !0, writable: !0,
      }) : e[t] = n, e;
    } var s = 'impactoss/ActorNew/SAVE'; var O = [c.n.USER_ROLES, c.n.CATEGORIES, c.n.TAXONOMIES, c.n.ACTORS, c.n.ACTIONS, c.n.ACTORTYPES, c.n.ACTIONTYPES, c.n.ACTOR_CATEGORIES, c.n.ACTION_CATEGORIES, c.n.ACTORTYPE_TAXONOMIES, c.n.ACTIONTYPE_TAXONOMIES, c.n.PAGES]; var u = Object(r.fromJS)({
      id: '', attributes: Object.keys(c.m.ATTRIBUTES).reduce((e, t) => i(i({}, e), {}, a({}, t, c.m.ATTRIBUTES[t].defaultValue || '')), {}), associatedTaxonomies: {}, associatedActionsByActiontype: [], associatedActionsAsTargetByActiontype: [], associatedMembersByActortype: [], associatedAssociationsByActortype: [],
    });
  },
}]);
