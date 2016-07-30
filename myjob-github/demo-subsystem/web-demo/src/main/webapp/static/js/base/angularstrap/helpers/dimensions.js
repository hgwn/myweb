"use strict";angular.module("mgcrea.ngStrap.helpers.dimensions",[]).factory("dimensions",["$document","$window",function(t,e){var o=(angular.element,{}),n=o.nodeName=function(t,e){return t.nodeName&&t.nodeName.toLowerCase()===e.toLowerCase()};o.css=function(t,e,o){var n;return n=t.currentStyle?t.currentStyle[e]:window.getComputedStyle?window.getComputedStyle(t)[e]:t.style[e],o===!0?parseFloat(n)||0:n},o.offset=function(t){var e=t.getBoundingClientRect(),o=t.ownerDocument;return{width:e.width||t.offsetWidth,height:e.height||t.offsetHeight,top:e.top+(window.pageYOffset||o.documentElement.scrollTop)-(o.documentElement.clientTop||0),left:e.left+(window.pageXOffset||o.documentElement.scrollLeft)-(o.documentElement.clientLeft||0)}},o.setOffset=function(t,e,n){var s,i,r,f,c,l,d,a=o.css(t,"position"),u=angular.element(t),p={};"static"===a&&(t.style.position="relative"),c=o.offset(t),r=o.css(t,"top"),l=o.css(t,"left"),d=("absolute"===a||"fixed"===a)&&(r+l).indexOf("auto")>-1,d?(s=o.position(t),f=s.top,i=s.left):(f=parseFloat(r)||0,i=parseFloat(l)||0),angular.isFunction(e)&&(e=e.call(t,n,c)),null!==e.top&&(p.top=e.top-c.top+f),null!==e.left&&(p.left=e.left-c.left+i),"using"in e?e.using.call(u,p):u.css({top:p.top+"px",left:p.left+"px"})},o.position=function(t){var e,i,r={top:0,left:0};return"fixed"===o.css(t,"position")?i=t.getBoundingClientRect():(e=s(t),i=o.offset(t),n(e,"html")||(r=o.offset(e)),r.top+=o.css(e,"borderTopWidth",!0),r.left+=o.css(e,"borderLeftWidth",!0)),{width:t.offsetWidth,height:t.offsetHeight,top:i.top-r.top-o.css(t,"marginTop",!0),left:i.left-r.left-o.css(t,"marginLeft",!0)}};var s=function(t){var e=t.ownerDocument,s=t.offsetParent||e;if(n(s,"#document"))return e.documentElement;for(;s&&!n(s,"html")&&"static"===o.css(s,"position");)s=s.offsetParent;return s||e.documentElement};return o.height=function(t,e){var n=t.offsetHeight;return e?n+=o.css(t,"marginTop",!0)+o.css(t,"marginBottom",!0):n-=o.css(t,"paddingTop",!0)+o.css(t,"paddingBottom",!0)+o.css(t,"borderTopWidth",!0)+o.css(t,"borderBottomWidth",!0),n},o.width=function(t,e){var n=t.offsetWidth;return e?n+=o.css(t,"marginLeft",!0)+o.css(t,"marginRight",!0):n-=o.css(t,"paddingLeft",!0)+o.css(t,"paddingRight",!0)+o.css(t,"borderLeftWidth",!0)+o.css(t,"borderRightWidth",!0),n},o}]);