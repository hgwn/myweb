(function(){var n;n=angular.module("selectAddress",[]),n.directive("selectAddress",function(n,e,t){var r,i,c;return i=e.defer(),c="/masgetweb/com/static/common/address-selector/template/box.html",r="/masgetweb/com/static/common/address-selector/js/data/city.min.js",n.get(r).success(function(n){return i.resolve(n)}),{restrict:"A",scope:{ngModel:"="},link:function(e,r,u){var s;return s={element:null,backdrop:null,show:function(){return primaryP=e.p,primaryC=e.c,primaryA=e.a,primaryD=e.d,this.element.addClass("active")},hide:function(){return this.element.removeClass("active"),this.resize(),!1},resize:function(){return this.element?(this.element.css({top:-this.element.height()-30,"margin-left":-this.element.width()/2}),!1):void 0},cancle:function(){return e.p=primaryP,e.c=primaryC,e.a=primaryA,e.d=primaryD,this.hide(),!1},focus:function(){return $('[ng-model="d"]').focus(),!1},init:function(){return r.on("click keydown",function(){return s.show(),!1}),$(window).on("click",function(n){return function(){}}(this)),this.element.on("click",function(){}),setTimeout(function(n){return function(){return n.element.show(),n.resize()}}(this),500)}},i.promise.then(function(r){return n.get(c).success(function(n){var i;return i=t(n)(e),$("body").append(i),s.element=$(i[2]),e.provinces=r,s.init()}),e.aSet={p:function(n){return e.p=n,e.c=null,e.a=null,e.d=null},c:function(n){return e.c=n,e.a=null,e.d=null},a:function(n){return e.a=n,e.d=null,s.focus()}},e.clear=function(){return e.ngModel="",e.p=null,e.c=null,e.a=null,e.d=null,s.hide()},e.cancle=function(){return s.cancle()},e.submit=function(){return e.ngModel="",e.p&&(e.ngModel+=e.p),e.c&&(e.ngModel+=""+e.c),e.a&&(e.ngModel+=""+e.a),e.d&&(e.ngModel+=""+e.d),s.resize(),s.hide()},e.$watch("p",function(n){var t,i,c,u;if(n){for(u=[],i=0,c=r.length;c>i;i++)t=r[i],t.p===n&&u.push(e.cities=t.c);return u}return e.cities=null}),e.$watch("c",function(n){var t,r,i,c,u;if(n){for(c=e.cities,u=[],r=0,i=c.length;i>r;r++)t=c[r],t.n===n&&u.push(e.dists=t.a);return u}return e.dists=[]}),e.$watch(function(){return s.resize()})})}}})}).call(this);