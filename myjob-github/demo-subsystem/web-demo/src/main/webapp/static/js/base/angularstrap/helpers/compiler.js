"use strict";function bsCompilerService(e,t,n,l,r,a){function o(e,t){return angular.element((t||document).querySelectorAll(e))}function i(e){return c[e]?c[e]:c[e]=t.get(e,{cache:a}).then(function(e){return e.data})}this.compile=function(t){t.template&&/\.html$/.test(t.template)&&(console.warn("Deprecated use of `template` option to pass a file. Please use the `templateUrl` option instead."),t.templateUrl=t.template,t.template="");var a=t.templateUrl,c=t.template||"",m=t.controller,p=t.controllerAs,u=angular.copy(t.resolve||{}),s=angular.copy(t.locals||{}),g=t.transformTemplate||angular.identity,d=t.bindToController;if(angular.forEach(u,function(e,t){angular.isString(e)?u[t]=n.get(e):u[t]=n.invoke(e)}),angular.extend(u,s),c)u.$template=e.when(c);else{if(!a)throw new Error("Missing `template` / `templateUrl` option.");u.$template=i(a)}return t.contentTemplate&&(u.$template=e.all([u.$template,i(t.contentTemplate)]).then(function(e){var n=angular.element(e[0]),l=o('[ng-bind="content"]',n[0]).removeAttr("ng-bind").html(e[1]);return t.templateUrl||l.next().remove(),n[0].outerHTML})),e.all(u).then(function(e){var n=g(e.$template);t.html&&(n=n.replace(/ng-bind="/gi,'ng-bind-html="'));var a=angular.element("<div>").html(n.trim()).contents(),o=l(a);return{locals:e,element:a,link:function(t){if(e.$scope=t,m){var n=r(m,e,!0);d&&angular.extend(n.instance,e);var l=angular.isObject(n)?n:n();a.data("$ngControllerController",l),a.children().data("$ngControllerController",l),p&&(t[p]=l)}return o.apply(null,arguments)}}})};var c={}}angular.module("mgcrea.ngStrap.core",[]).service("$bsCompiler",bsCompilerService),bsCompilerService.$inject=["$q","$http","$injector","$compile","$controller","$templateCache"];