(window.webpackJsonp=window.webpackJsonp||[]).push([[97],{"3d239754910012ad9a6a":function(t,e,n){"use strict";n.r(e);var r,a=n("8af190b70a6bc55c6f1b"),c=n.n(a),o=(n("8a2d1b95e05b6a321e74"),n("d7dd51e1bf6bfc2c9c3d")),i=n("0d7f0986bcd2f33d8a2a"),u=n.n(i),s=n("ab039aecd4a1d4fedc0e"),d=n("57b36dff0c422d2b9c67"),f=n("0d5a1aa701766449187d"),b=n("cdfaa1887f639931317a"),l=n("a72b40110d9c31c9b5c5"),p=n("2157bd598f2b425595ea"),y=n("fcb99a06256635f70435"),O=n("17a826745d7905c7f263"),g=n("4bbbd76528501909b843"),j=n("0765c307dd1d0b7a1748"),m=n("6542cd13fd5dd1bcffd4"),I=n("52147c536625ee918894"),h=Object(s.defineMessages)({pageTitle:{id:"app.containers.CategoryView.pageTitle",defaultMessage:"Category"},metaDescription:{id:"app.containers.CategoryView.metaDescription",defaultMessage:"Category page description"},notFound:{id:"app.containers.CategoryView.notFound",defaultMessage:"Sorry no category found"}}),E=n("a28fc3c963a1d4d1a2e5"),A=n("54f683fcda7806277002"),C=n("968c3c585cf17da94a14"),S=n("905cf391b8f5511eada1"),v=[p.n.USERS,p.n.USER_ROLES,p.n.CATEGORIES,p.n.TAXONOMIES,p.n.ACTIONS,p.n.ACTORS,p.n.RESOURCES,p.n.ACTORTYPES,p.n.ACTIONTYPES,p.n.ACTORTYPE_TAXONOMIES,p.n.ACTIONTYPE_TAXONOMIES,p.n.ACTOR_CATEGORIES,p.n.ACTION_CATEGORIES,p.n.ACTION_ACTORS,p.n.ACTION_RESOURCES,p.n.ACTOR_ACTIONS,p.n.PAGES],T=Object(E.a)(m.Z,function(t){return Object(m.eb)(t,p.n.USERS)},m.oc,m.Y,function(t,e,n,r){return t&&Object(f.k)(t,[{related:e,key:"user",relatedKey:"updated_by_id"},{related:e,key:"manager",relatedKey:"manager_id"},{related:n,key:"taxonomy",relatedKey:"taxonomy_id"},{related:r,key:"category",relatedKey:"parent_id"}])}),_=Object(E.a)(m.Z,m.nc,function(t,e){return t&&e&&e.get(t.getIn(["attributes","taxonomy_id"]).toString())}),k=Object(E.a)(_,m.nc,function(t,e){return t&&e&&t.getIn(["attributes","parent_id"])&&e.get(t.getIn(["attributes","parent_id"]).toString())}),x=Object(E.a)(m.Z,_,m.oc,m.Y,function(t,e,n,r){return e&&n?n.filter(function(t){return Object(C.b)(t.getIn(["attributes","parent_id"]),e.get("id"))}).map(function(e){return e.set("categories",Object(S.c)(r.filter(function(n){return Object(C.b)(n.getIn(["attributes","parent_id"]),t.get("id"))&&Object(C.b)(n.getIn(["attributes","taxonomy_id"]),e.get("id"))}),e.get("id")))}):null}),M=Object(E.a)(function(t,e){return e},m.Y,function(t,e){return e.filter(function(e){return Object(C.b)(e.getIn(["attributes","parent_id"]),t)})}),w=Object(E.a)(function(t,e){return e},m.H,function(t,e){return e.get(parseInt(t,10))}),R=Object(E.a)(function(t,e){return e},m.i,function(t,e){return e.get(parseInt(t,10))}),B=Object(E.a)(M,m.H,function(t,e){return t&&e&&t.keySeq().reduce(function(t,n){var r=e.get(parseInt(n,10));return r?t.merge(r):t},Object(A.Map)())}),N=Object(E.a)(M,m.i,function(t,e){return t&&e&&t.keySeq().reduce(function(t,n){var r=e.get(parseInt(n,10));return r?t.merge(r):t},Object(A.Map)())}),P=Object(E.a)(m.L,B,function(t,e){return t&&e&&e.reduce(function(e,n){var r=t.get(n.toString());return r?e.set(n,r):e},Object(A.Map)())}),Y=Object(E.a)(m.L,N,function(t,e){return t&&e&&e.reduce(function(e,n){var r=t.get(n.toString());return r?e.set(n,r):e},Object(A.Map)())}),G=Object(E.a)(m.L,w,function(t,e){return t&&e&&e.reduce(function(e,n){var r=t.get(n.toString());return r?e.set(n,r):e},Object(A.Map)())}),L=Object(E.a)(R,m.o,function(t,e){return t&&t.map(function(t){return e.get(t.toString())})}),z=Object(E.a)(function(t){return Object(m.Pb)(t,{path:v})},L,m.j,m.B,m.d,m.l,m.h,m.Y,function(t,e,n,r,a,c,o,i){return t?e&&e.map(function(t){return Object(f.I)({action:t,actionConnections:n,actorActions:r,actionActors:a,actionResources:c,categories:i,actionCategories:o})}).groupBy(function(t){return t.getIn(["attributes","measuretype_id"])}).sortBy(function(t,e){return e}):Object(A.Map)()}),D=Object(E.a)(function(t){return Object(m.Pb)(t,{path:v})},G,m.I,m.D,m.f,m.G,m.Y,function(t,e,n,r,a,c,o){return t?e&&e.map(function(t){return Object(f.J)({actor:t,actorConnections:n,actorActions:r,actionActors:a,categories:o,actorCategories:c})}).groupBy(function(t){return t.getIn(["attributes","actortype_id"])}).sortBy(function(t,e){return e}):Object(A.Map)()}),U=Object(E.a)(function(t){return Object(m.Pb)(t,{path:v})},P,m.D,m.G,m.Y,function(t,e,n,r,a){return e&&e.map(function(t){return t&&t.set("categories",Object(f.v)(t.get("id"),r,a)).set("actions",n.get(parseInt(t.get("id"),10)))}).groupBy(function(t){return t.getIn(["attributes","actortype_id"])})}),V=Object(E.a)(function(t){return Object(m.Pb)(t,{path:v})},Y,m.B,m.h,m.Y,function(t,e,n,r,a){return e&&e.map(function(t){return t&&t.set("categories",Object(f.v)(t.get("id"),r,a)).set("actors",n.get(parseInt(t.get("id"),10)))}).groupBy(function(t){return t.getIn(["attributes","actiontype_id"])})});function X(t,e,n,a){r||(r="function"===typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103);var c=t&&t.defaultProps,o=arguments.length-3;if(e||0===o||(e={children:void 0}),1===o)e.children=a;else if(o>1){for(var i=new Array(o),u=0;u<o;u++)i[u]=arguments[u+3];e.children=i}if(e&&c)for(var s in c)void 0===e[s]&&(e[s]=c[s]);else e||(e=c||{});return{$$typeof:r,type:t,key:void 0===n?null:""+n,ref:null,props:e,_owner:null}}function F(t){return function(t){if(Array.isArray(t))return K(t)}(t)||function(t){if("undefined"!==typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(t)||function(t,e){if(!t)return;if("string"===typeof t)return K(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return K(t,e)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function K(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}var J=function(t,e){var n=[];return n.push({fields:[Object(d.u)(t,e),Object(d.d)(t,e)]}),n},Z=function(t,e,n,r){var a=e?[{fields:[e&&Object(d.r)(t),Object(d.m)(t)]}]:[];return t.getIn(["taxonomy","attributes","tags_users"])&&t.getIn(["attributes","user_only"])&&a.push({type:"dark",fields:[{type:"text",value:r.formatMessage(I.a.textValues.user_only),label:I.a.attributes.user_only}]}),t.get("category")&&n&&a.push({label:I.a.entities.taxonomies.parent,icon:"categories",fields:[Object(d.g)(t.get("category"),p.I.CATEGORY,"",Object(f.y)(n))]}),a.length>0?a:null},$=function(t,e,n,r,a,c,o,i,u){var s=[];if(s.push({fields:[Object(d.l)(t,"description",!0)]}),!t.getIn(["attributes","user_only"])){var f=[];a&&a.size>0?a.forEach(function(t,n){f.push(Object(d.c)({actors:t,taxonomies:e,onEntityClick:u,connections:o,typeid:n}))}):n&&n.forEach(function(t,n){f.push(Object(d.c)({actors:t,taxonomies:e,onEntityClick:u,connections:o,typeid:n}))}),s.push({label:I.a.nav.actors,fields:f});var b=[];c&&c.size>0?c.forEach(function(t,n){b.push(Object(d.b)({actions:t,taxonomies:e,onEntityClick:u,connections:i,typeid:n}))}):r&&r.forEach(function(t,n){b.push(Object(d.b)({actions:t,taxonomies:e,onEntityClick:u,connections:i,typeid:n}))}),s.push({label:I.a.nav.actions,fields:b})}return s},q=function(t,e,n){var r=[];n&&Object(d.v)(n)&&r.push({label:I.a.entities.taxonomies.children,icon:"categories",fields:Object(d.s)(n,!0)});var a=t.getIn(["attributes","url"])&&t.getIn(["attributes","url"]).trim().length>0,c=t.getIn(["taxonomy","attributes","has_date"]);return(a||c)&&r.push({type:"dark",fields:[c&&Object(d.e)(t,"date",{showEmpty:!0}),a&&Object(d.j)(t)]}),e&&t.getIn(["taxonomy","attributes","has_manager"])&&r.push({type:"dark",fields:[Object(d.k)(t,I.a.attributes.manager_id.categories,I.a.attributes.manager_id.categoriesEmpty)]}),r.length>0?r:null},H=function(t,e){return e.formatMessage(I.a.entities.taxonomies[t].single)},Q=X(O.a,{});e.default=Object(o.connect)(function(t,e){return{isManager:Object(m.xb)(t),dataReady:Object(m.Pb)(t,{path:v}),viewEntity:T(t,e.params.id),taxonomies:Object(m.pc)(t),parentTaxonomy:k(t,e.params.id),childTaxonomies:x(t,e.params.id),actorConnections:Object(m.I)(t),actionConnections:Object(m.j)(t),actorsByActortype:D(t,e.params.id),actionsByActiontype:z(t,e.params.id),childActorsByActortype:U(t,e.params.id),childActionsByActiontype:V(t,e.params.id)}},function(t,e){var n=e.params;return{onLoadEntitiesIfNeeded:function(){v.forEach(function(e){return t(Object(l.s)(e))})},onEntityClick:function(e,n){t(Object(l.cb)("".concat(n,"/").concat(e)))},handleEdit:function(){t(Object(l.cb)("".concat(p.I.CATEGORY).concat(p.I.EDIT,"/").concat(n.id),{replace:!0}))},handleClose:function(e){t(Object(l.f)("".concat(p.I.TAXONOMIES,"/").concat(e)))},handleTypeClick:function(e){t(Object(l.cb)("".concat(p.I.TAXONOMIES,"/").concat(e)))},onSetPrintView:function(e){t(Object(l.z)(e))}}})(Object(s.injectIntl)(function(t){var e=t.viewEntity,n=t.dataReady,r=t.isManager,o=t.parentTaxonomy,i=t.childTaxonomies,d=t.actionsByActiontype,l=t.childActionsByActiontype,p=t.taxonomies,O=t.onEntityClick,m=t.actionConnections,I=t.actorsByActortype,E=t.childActorsByActortype,A=t.actorConnections,C=t.handleEdit,S=t.handleTypeClick,v=t.onLoadEntitiesIfNeeded,T=t.onSetPrintView,_=t.intl,k=t.handleClose;Object(a.useEffect)(function(){v()},[]);var x=function(){return T({printType:y.I.SINGLE,printOrientation:"portrait",printSize:"A4"})},M=function(t){Object(b.a)(t,x)};Object(a.useEffect)(function(){return document.addEventListener("keydown",M),function(){document.removeEventListener("keydown",M)}},[]);var w=[];n&&(window.print&&(w=[].concat(F(w),[{type:"icon",onClick:x,title:"Print",icon:"print"}])),r&&(w=[].concat(F(w),[{type:"edit",onClick:C}])));var R=_.formatMessage(h.pageTitle),B=R;if(e&&e.get("taxonomy")){R=H(e.getIn(["taxonomy","id"]),_);var N=Object(f.x)(e,!1);B=N?"".concat(R," ").concat(N,": ").concat(Object(f.z)(e)):"".concat(R,": ").concat(Object(f.z)(e))}return X("div",{},void 0,X(u.a,{title:B,meta:[{name:"description",content:_.formatMessage(h.metaDescription)}]}),X(g.a,{isSingle:!0},void 0,!n&&Q,!e&&n&&X("div",{},void 0,c.a.createElement(s.FormattedMessage,h.notFound)),e&&n&&X(j.a,{header:{title:R,onClose:k,buttons:w,onTypeClick:e&&r?function(){return S(e.getIn(["taxonomy","id"]))}:null},fields:{header:{main:J(e,r),aside:Z(e,r,o,_)},body:{main:$(e,p,I,d,E,l,A,m,O),aside:q(e,r,i)}}})))}))}}]);