(window.webpackJsonp=window.webpackJsonp||[]).push([[89],{"882a64edfe4fc742a29e":function(t,e,n){"use strict";n.r(e);var r,i=n("8af190b70a6bc55c6f1b"),a=n.n(i),o=n("8a2d1b95e05b6a321e74"),c=n.n(o),s=n("d7dd51e1bf6bfc2c9c3d"),u=n("0d7f0986bcd2f33d8a2a"),d=n.n(u),f=n("ab039aecd4a1d4fedc0e"),l=n("1dfca9f44be16af281fa"),b=n("54f683fcda7806277002"),p=n("47e94b5ec55a17ebe237"),y=n("57b36dff0c422d2b9c67"),g=n("86b83146d2366c27fd7c"),m=n("a0eea3e3c7c0b7b70771"),h=n("02787f146ca448ef9310"),O=n("fcb99a06256635f70435"),j=n("2157bd598f2b425595ea"),v=n("52147c536625ee918894"),E=n("a72b40110d9c31c9b5c5"),S=n("6542cd13fd5dd1bcffd4"),I=n("fb88414ab887e57c7b57"),M=n("17a826745d7905c7f263"),_=n("4bbbd76528501909b843"),x=n("e4dd33cd8c3dbbd378c3"),C=n("2da65066c2da9f64c68a"),R=n("0d5a1aa701766449187d"),w=n("a28fc3c963a1d4d1a2e5"),T=n("968c3c585cf17da94a14"),F=Object(w.a)(function(t){return t.get("categoryEdit")},function(t){return t}),A=Object(w.a)(S.Z,function(t){return Object(S.eb)(t,j.n.USERS)},S.oc,function(t,e,n){return Object(R.C)(t,e,n)}),D=Object(w.a)(S.Z,S.Y,S.oc,function(t,e,n){if(t&&n&&e){var r=n.find(function(e){return Object(T.b)(t.getIn(["attributes","taxonomy_id"]),e.get("id"))}),i=r&&r.getIn(["attributes","parent_id"]);return i?e.filter(function(t){var e=n.find(function(e){return Object(T.b)(t.getIn(["attributes","taxonomy_id"]),e.get("id"))});return e?Object(T.b)(i,e.get("id")):null}):null}return null}),P=Object(w.a)(S.Z,S.oc,function(t,e){if(t&&e){var n=e.find(function(e){return Object(T.b)(t.getIn(["attributes","taxonomy_id"]),e.get("id"))});return e.find(function(t){return Object(T.b)(n.getIn(["attributes","parent_id"]),t.get("id"))})}return null}),N=Object(w.a)(S.Z,S.oc,function(t,e){if(t&&e){var n=e.find(function(e){return Object(T.b)(t.getIn(["attributes","taxonomy_id"]),e.get("id"))});return e.some(function(t){return Object(T.b)(t.getIn(["attributes","parent_id"]),n.get("id"))})}return!1}),k=(Object(w.a)(function(t){return Object(S.eb)(t,j.n.USERS)},function(t){return Object(S.eb)(t,j.n.USER_ROLES)},function(t,e){return Object(R.O)(t,e,j.M.MANAGER.value)}),Object(w.a)(function(t,e){return e},S.p,N,function(t,e,n){return n?null:Object(R.h)(e,t)}),Object(w.a)(function(t,e){return e},S.Z,function(t){return Object(S.eb)(t,j.n.ACTORTYPE_TAXONOMIES)},S.M,N,function(t,e,n,r,i){if(i||!e||!n||!r)return null;var a=n.reduce(function(t,n){return Object(T.b)(n.getIn(["attributes","taxonomy_id"]),e.getIn(["attributes","taxonomy_id"]))?t.push(n.getIn(["attributes","actortype_id"])):t},Object(b.List)()),o=r.filter(function(t){return a.find(function(e){return Object(T.b)(e,t.getIn(["attributes","actortype_id"]))})});return Object(R.h)(o,t).groupBy(function(t){return t.getIn(["attributes","actortype_id"]).toString()})}),Object(w.a)(function(t){return Object(S.R)(t)},S.Y,function(t,e){return Object(R.G)(t,e,["tags_actions","tags_actors"])}),Object(f.defineMessages)({pageTitle:{id:"app.containers.CategoryEdit.pageTitle",defaultMessage:"Edit Category"},pageTitleTaxonomy:{id:"app.containers.CategoryEdit.pageTitleTaxonomy",defaultMessage:"Edit {taxonomy}"},metaDescription:{id:"app.containers.CategoryEdit.metaDescription",defaultMessage:"Edit Category page description"},header:{id:"app.containers.CategoryEdit.header",defaultMessage:"Edit Category"},notFound:{id:"app.containers.CategoryEdit.notFound",defaultMessage:"Sorry no category found"}})),B=n("9935d4f99ef9d6677bac");function U(t){return(U="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"===typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function Y(t,e,n,i){r||(r="function"===typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103);var a=t&&t.defaultProps,o=arguments.length-3;if(e||0===o||(e={children:void 0}),1===o)e.children=i;else if(o>1){for(var c=new Array(o),s=0;s<o;s++)c[s]=arguments[s+3];e.children=c}if(e&&a)for(var u in a)void 0===e[u]&&(e[u]=a[u]);else e||(e=a||{});return{$$typeof:r,type:t,key:void 0===n?null:""+n,ref:null,props:e,_owner:null}}function G(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function J(t,e){return(J=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function Z(t){var e=function(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch(t){return!1}}();return function(){var n,r=L(t);if(e){var i=L(this).constructor;n=Reflect.construct(r,arguments,i)}else n=r.apply(this,arguments);return function(t,e){if(e&&("object"===U(e)||"function"===typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return H(t)}(this,n)}}function H(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function L(t){return(L=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function W(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}n.d(e,"CategoryEdit",function(){return $});var z=Y(M.a,{}),X=Y(M.a,{}),$=function(t){!function(t,e){if("function"!==typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&J(t,e)}(o,a.a.PureComponent);var e,n,r,i=Z(o);function o(t){var e;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,o),W(H(e=i.call(this,t)),"getInitialFormData",function(t){var n=t||e.props,r=n.viewEntity,i=n.users,a=n.actions,o=n.actorsByActortype,c=n.parentOptions;return r?Object(b.Map)({id:r.get("id"),attributes:r.get("attributes").mergeWith(function(t,e){return null===t?e:t},B.b.get("attributes")),associatedActions:a&&Object(p.a)(a,!0),associatedActorsByActortype:o?o.map(function(t){return Object(p.a)(t,!0)}):Object(b.Map)(),associatedUser:Object(p.O)(i,r.getIn(["attributes","manager_id"])),associatedCategory:Object(p.C)(c,r.getIn(["attributes","parent_id"]))}):Object(b.Map)()}),W(H(e),"getHeaderMainFields",function(){var t=e.context.intl,n=[];return n.push({fields:[Object(p.z)(t.formatMessage),Object(p.w)(t.formatMessage)]}),n}),W(H(e),"getHeaderAsideFields",function(t,n,r){var i=e.context.intl,a=[];return a.push({fields:[Object(p.x)(i.formatMessage),Object(y.m)(t)]}),t.getIn(["taxonomy","attributes","tags_users"])&&a.push({fields:[Object(p.d)(i.formatMessage,"user_only")]}),n&&r&&a.push({label:i.formatMessage(v.a.entities.taxonomies.parent),icon:"categories",fields:[Object(p.J)(n,Object(R.y)(r),t.getIn(["attributes","parent_id"]))]}),a}),W(H(e),"getBodyMainFields",function(){var t=e.context.intl,n=[];return n.push({fields:[Object(p.m)(t.formatMessage)]}),n}),W(H(e),"getBodyAsideFields",function(){var t=e.context.intl,n=[];return n.push({fields:[Object(p.j)({formatMessage:t.formatMessage,controlType:"url",attribute:"url"})]}),n}),W(H(e),"getTaxTitle",function(t){return e.context.intl.formatMessage(v.a.entities.taxonomies[t].single)}),e.scrollContainer=a.a.createRef(),e}return e=o,(n=[{key:"UNSAFE_componentWillMount",value:function(){this.props.loadEntitiesIfNeeded(),this.props.dataReady&&this.props.viewEntity&&this.props.initialiseForm("categoryEdit.form.data",this.getInitialFormData())}},{key:"UNSAFE_componentWillReceiveProps",value:function(t){t.dataReady||this.props.loadEntitiesIfNeeded(),t.dataReady&&!this.props.dataReady&&t.viewEntity&&this.props.initialiseForm("categoryEdit.form.data",this.getInitialFormData(t)),t.authReady&&!this.props.authReady&&this.props.redirectIfNotPermitted(),Object(m.a)(t,this.props)&&this.scrollContainer&&Object(g.d)(this.scrollContainer.current)}},{key:"render",value:function(){var t=this,e=this.context.intl,n=this.props,r=n.viewEntity,i=n.dataReady,o=n.isAdmin,c=n.viewDomain,s=n.parentOptions,u=n.parentTaxonomy,l=this.props.params.id,b=c.get("page").toJS(),p=b.saveSending,y=b.saveError,g=b.deleteSending,m=b.deleteError,h=b.submitValid,j=e.formatMessage(k.pageTitle);return r&&r.get("taxonomy")&&(j=e.formatMessage(k.pageTitleTaxonomy,{taxonomy:this.getTaxTitle(r.getIn(["taxonomy","id"]))})),Y("div",{},void 0,Y(d.a,{title:"".concat(e.formatMessage(k.pageTitle),": ").concat(l),meta:[{name:"description",content:e.formatMessage(k.metaDescription)}]}),a.a.createElement(_.a,{ref:this.scrollContainer},Y(x.a,{title:j,type:O.l,icon:"categories",buttons:r&&i?[{type:"cancel",onClick:function(){return t.props.handleCancel(l)}},{type:"save",disabled:p,onClick:function(){return t.props.handleSubmitRemote("categoryEdit.form.data")}}]:null}),!h&&Y(I.a,{type:"error",messageKey:"submitInvalid",onDismiss:this.props.onErrorDismiss}),y&&Y(I.a,{type:"error",messages:y.messages,onDismiss:this.props.onServerErrorDismiss}),m&&Y(I.a,{type:"error",messages:[m]}),(p||g||!i)&&z,!r&&i&&!y&&!g&&Y("div",{},void 0,a.a.createElement(f.FormattedMessage,k.notFound)),r&&i&&!g&&Y(C.a,{model:"categoryEdit.form.data",formData:c.getIn(["form","data"]),saving:p,handleSubmit:function(e){return t.props.handleSubmit(e,r.get("taxonomy"))},handleSubmitFail:this.props.handleSubmitFail,handleCancel:function(){return t.props.handleCancel(l)},handleUpdate:this.props.handleUpdate,handleDelete:function(){return o?t.props.handleDelete(r.getIn(["attributes","taxonomy_id"])):null},fields:{header:{main:this.getHeaderMainFields(),aside:this.getHeaderAsideFields(r,s,u)},body:{main:this.getBodyMainFields(),aside:this.getBodyAsideFields()}},scrollContainer:this.scrollContainer.current}),(p||g)&&X))}}])&&G(e.prototype,n),r&&G(e,r),o}();$.contextTypes={intl:c.a.object.isRequired};e.default=Object(s.connect)(function(t,e){return{isAdmin:Object(S.vb)(t),viewDomain:F(t),dataReady:Object(S.Pb)(t,{path:B.a}),authReady:Object(S.Qb)(t),viewEntity:A(t,e.params.id),parentOptions:D(t,e.params.id),parentTaxonomy:P(t,e.params.id)}},function(t,e){return{loadEntitiesIfNeeded:function(){B.a.forEach(function(e){return t(Object(E.s)(e))})},redirectIfNotPermitted:function(){t(Object(E.A)(j.M.MANAGER.value))},initialiseForm:function(e,n){t(l.actions.reset(e)),t(l.actions.change(e,n,{silent:!0}))},onErrorDismiss:function(){t(Object(E.Y)(!0))},onServerErrorDismiss:function(){t(Object(E.F)())},handleSubmitFail:function(){t(Object(E.Y)(!1))},handleSubmitRemote:function(e){t(l.actions.submit(e))},handleSubmit:function(e){var n,r,i=e,a=Object(h.c)(e.get("associatedCategory"));i=b.List.isList(a)&&a.size?i.setIn(["attributes","parent_id"],a.first()):i.setIn(["attributes","parent_id"],null),t((n=i.toJS(),{type:B.c,data:n,id:r}))},handleCancel:function(e){t(Object(E.cb)("".concat(j.I.CATEGORY,"/").concat(e),{replace:!0}))},handleUpdate:function(e){t(Object(E.bb)(e))},handleDelete:function(n){t(Object(E.h)({path:j.n.CATEGORIES,id:e.params.id,redirect:"".concat(j.I.TAXONOMIES,"/").concat(n)}))},onCreateOption:function(e){t(Object(E.y)(e))}}})($)}}]);