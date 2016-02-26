"use strict";angular.module("mgcrea.ngStrap.tab",[]).provider("$tab",function(){var e=this.defaults={animation:"am-fade",template:"tab/tab.tpl.html",navClass:"nav-tabs",activeClass:"active"},n=this.controller=function(n,a,t){var s=this;s.$options=angular.copy(e),angular.forEach(["animation","navClass","activeClass"],function(e){angular.isDefined(t[e])&&(s.$options[e]=t[e])}),n.$navClass=s.$options.navClass,n.$activeClass=s.$options.activeClass,s.$panes=n.$panes=[],s.$activePaneChangeListeners=s.$viewChangeListeners=[],s.$push=function(e){angular.isUndefined(s.$panes.$active)&&n.$setActive(e.name||0),s.$panes.push(e)},s.$remove=function(e){var n,a=s.$panes.indexOf(e),t=s.$panes.$active;n=angular.isString(t)?s.$panes.map(function(e){return e.name}).indexOf(t):s.$panes.$active,s.$panes.splice(a,1),n>a?n--:a===n&&n===s.$panes.length&&n--,n>=0&&n<s.$panes.length?s.$setActive(s.$panes[n].name||n):s.$setActive()},s.$setActive=n.$setActive=function(e){s.$panes.$active=e,s.$activePaneChangeListeners.forEach(function(e){e()})},s.$isActive=n.$isActive=function(e,n){return s.$panes.$active===e.name||s.$panes.$active===n}};this.$get=function(){var a={};return a.defaults=e,a.controller=n,a}}).directive("bsTabs",["$window","$animate","$tab","$parse",function(e,n,a,t){var s=a.defaults;return{require:["?ngModel","bsTabs"],transclude:!0,scope:!0,controller:["$scope","$element","$attrs",a.controller],templateUrl:function(e,n){return n.template||s.template},link:function(e,n,a,s){var i=s[0],$=s[1];if(i&&($.$activePaneChangeListeners.push(function(){i.$setViewValue($.$panes.$active)}),i.$formatters.push(function(e){return $.$setActive(e),e})),a.bsActivePane){var c=t(a.bsActivePane);$.$activePaneChangeListeners.push(function(){c.assign(e,$.$panes.$active)}),e.$watch(a.bsActivePane,function(e,n){$.$setActive(e)},!0)}}}}]).directive("bsPane",["$window","$animate","$sce",function(e,n,a){return{require:["^?ngModel","^bsTabs"],scope:!0,link:function(e,t,s,i){function $(){var a=c.$panes.indexOf(e);n[c.$isActive(e,a)?"addClass":"removeClass"](t,c.$options.activeClass)}var c=(i[0],i[1]);t.addClass("tab-pane"),s.$observe("title",function(n,t){e.title=a.trustAsHtml(n)}),e.name=s.name,c.$options.animation&&t.addClass(c.$options.animation),s.$observe("disabled",function(n,a){e.disabled=e.$eval(n)}),c.$push(e),e.$on("$destroy",function(){c.$remove(e)}),c.$activePaneChangeListeners.push(function(){$()}),$()}}}]);