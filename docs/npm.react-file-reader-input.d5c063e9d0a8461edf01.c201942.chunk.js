(window.webpackJsonp=window.webpackJsonp||[]).push([[50],{"7443924afe5081acef92":function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r,o=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},a="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"===typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(n("8af190b70a6bc55c6f1b")),c=n("63f14ac74ce296f77f4d"),u=(r=c)&&r.__esModule?r:{default:r};var f=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!==typeof t&&"function"!==typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));n.handleChange=function(e){var t=Array.prototype.slice.call(e.target.files),r=(n.props.as||"url").toLowerCase();Promise.all(t.map(function(e){return new Promise(function(t,n){var o=new FileReader;switch(o.onload=function(n){t([n,e])},r){case"binary":o.readAsBinaryString(e);break;case"buffer":o.readAsArrayBuffer(e);break;case"text":o.readAsText(e);break;case"url":o.readAsDataURL(e)}})})).then(function(t){n.props.onChange(e,t)})},n.triggerInput=function(){var e=u.default.findDOMNode(n._reactFileReaderInput);e&&e.click()};var r="object"===("undefined"===typeof window?"undefined":a(window))?window:{};return r.File&&r.FileReader&&r.FileList&&r.Blob||console.warn("[react-file-reader-input] Some file APIs detected as not supported. File reader functionality may not fully work."),n}return function(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,l.Component),i(t,[{key:"render",value:function(){var e=this,t=this.props,n=(t.as,t.children),r=t.style,a=function(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}(t,["as","children","style"]),i=n?{position:"absolute",top:"-9999px"}:{};return l.createElement("div",{className:"_react-file-reader-input",onClick:this.triggerInput,style:r},l.createElement("input",o({},a,{type:"file",ref:function(t){e._reactFileReaderInput=t},onChange:this.handleChange,onClick:function(){e._reactFileReaderInput.value=null},style:i})),n)}}]),t}();t.default=f}}]);