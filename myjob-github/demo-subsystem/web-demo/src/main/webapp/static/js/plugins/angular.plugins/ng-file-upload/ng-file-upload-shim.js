!function(){function e(e,t){window.XMLHttpRequest.prototype[e]=t(window.XMLHttpRequest.prototype[e])}function t(e,t,i){try{Object.defineProperty(e,t,{get:i})}catch(s){}}function i(e){return"input"===e[0].tagName.toLowerCase()&&e.attr("type")&&"file"===e.attr("type").toLowerCase()}var s=function(){try{var e=new ActiveXObject("ShockwaveFlash.ShockwaveFlash");if(e)return!0}catch(t){if(void 0!=navigator.mimeTypes["application/x-shockwave-flash"])return!0}return!1};if(window.XMLHttpRequest&&!window.FormData||window.FileAPI&&FileAPI.forceLoad){var n=function(e){if(!e.__listeners){e.upload||(e.upload={}),e.__listeners=[];var t=e.upload.addEventListener;e.upload.addEventListener=function(i,s,n){e.__listeners[i]=s,t&&t.apply(this,arguments)}}};e("open",function(e){return function(t,i,s){n(this),this.__url=i;try{e.apply(this,[t,i,s])}catch(a){a.message.indexOf("Access is denied")>-1&&(this.__origError=a,e.apply(this,[t,"_fix_for_ie_crossdomain__",s]))}}}),e("getResponseHeader",function(e){return function(t){return this.__fileApiXHR&&this.__fileApiXHR.getResponseHeader?this.__fileApiXHR.getResponseHeader(t):null==e?null:e.apply(this,[t])}}),e("getAllResponseHeaders",function(e){return function(){return this.__fileApiXHR&&this.__fileApiXHR.getAllResponseHeaders?this.__fileApiXHR.getAllResponseHeaders():null==e?null:e.apply(this)}}),e("abort",function(e){return function(){return this.__fileApiXHR&&this.__fileApiXHR.abort?this.__fileApiXHR.abort():null==e?null:e.apply(this)}}),e("setRequestHeader",function(e){return function(t,i){if("__setXHR_"===t){n(this);var s=i(this);s instanceof Function&&s(this)}else this.__requestHeaders=this.__requestHeaders||{},this.__requestHeaders[t]=i,e.apply(this,arguments)}}),e("send",function(e){return function(){var i=this;if(arguments[0]&&arguments[0].__isFileAPIShim){var n=arguments[0],a={url:i.__url,jsonp:!1,cache:!0,complete:function(e,s){i.__completed=!0,!e&&i.__listeners.load&&i.__listeners.load({type:"load",loaded:i.__loaded,total:i.__total,target:i,lengthComputable:!0}),!e&&i.__listeners.loadend&&i.__listeners.loadend({type:"loadend",loaded:i.__loaded,total:i.__total,target:i,lengthComputable:!0}),"abort"===e&&i.__listeners.abort&&i.__listeners.abort({type:"abort",loaded:i.__loaded,total:i.__total,target:i,lengthComputable:!0}),void 0!==s.status&&t(i,"status",function(){return 0==s.status&&e&&"abort"!==e?500:s.status}),void 0!==s.statusText&&t(i,"statusText",function(){return s.statusText}),t(i,"readyState",function(){return 4}),void 0!==s.response&&t(i,"response",function(){return s.response});var n=s.responseText||(e&&0==s.status&&"abort"!==e?e:void 0);t(i,"responseText",function(){return n}),t(i,"response",function(){return n}),e&&t(i,"err",function(){return e}),i.__fileApiXHR=s,i.onreadystatechange&&i.onreadystatechange(),i.onload&&i.onload()},progress:function(e){if(e.target=i,i.__listeners.progress&&i.__listeners.progress(e),i.__total=e.total,i.__loaded=e.loaded,e.total===e.loaded){var t=this;setTimeout(function(){i.__completed||(i.getAllResponseHeaders=function(){},t.complete(null,{status:204,statusText:"No Content"}))},FileAPI.noContentTimeout||1e4)}},headers:i.__requestHeaders};a.data={},a.files={};for(var r=0;r<n.data.length;r++){var o=n.data[r];null!=o.val&&null!=o.val.name&&null!=o.val.size&&null!=o.val.type?a.files[o.key]=o.val:a.data[o.key]=o.val}setTimeout(function(){if(!s())throw'Adode Flash Player need to be installed. To check ahead use "FileAPI.hasFlash"';i.__fileApiXHR=FileAPI.upload(a)},1)}else{if(this.__origError)throw this.__origError;e.apply(i,arguments)}}}),window.XMLHttpRequest.__isFileAPIShim=!0,window.FormData=FormData=function(){return{append:function(e,t,i){t.__isFileAPIBlobShim&&(t=t.data[0]),this.data.push({key:e,val:t,name:i})},data:[],__isFileAPIShim:!0}},window.Blob=Blob=function(e){return{data:e,__isFileAPIBlobShim:!0}},function(){if(window.FileAPI||(window.FileAPI={}),FileAPI.forceLoad&&(FileAPI.html5=!1),!FileAPI.upload){var e,t,i,n,a,r=document.createElement("script"),o=document.getElementsByTagName("script");if(window.FileAPI.jsUrl)e=window.FileAPI.jsUrl;else if(window.FileAPI.jsPath)t=window.FileAPI.jsPath;else for(i=0;i<o.length;i++)if(a=o[i].src,n=a.search(/\/ng\-file\-upload[\-a-zA-z0-9\.]*\.js/),n>-1){t=a.substring(0,n+1);break}null==FileAPI.staticPath&&(FileAPI.staticPath=t),r.setAttribute("src",e||t+"FileAPI.min.js"),document.getElementsByTagName("head")[0].appendChild(r),FileAPI.hasFlash=s()}}(),FileAPI.ngfFixIE=function(e,t,n,a,r){if(!s())throw'Adode Flash Player need to be installed. To check ahead use "FileAPI.hasFlash"';var o=function(s){function r(e){var t,i;if(t=i=0,e.offsetParent)do t+=e.offsetLeft,i+=e.offsetTop;while(e=e.offsetParent);return{left:t,top:i}}if(e.attr("disabled"))e.__ngf_elem__.removeClass("js-fileapi-wrapper");else{var d=e.__ngf_elem__;d?n(e.__ngf_elem__):(d=e.__ngf_elem__=t(),d.addClass("js-fileapi-wrapper"),!i(e),setTimeout(function(){d.bind("mouseenter",o)},10),d.bind("change",function(e){l.apply(this,[e]),a.apply(this,[e])})),i(e)||d.css("position","absolute").css("top",r(e[0]).top+"px").css("left",r(e[0]).left+"px").css("width",e[0].offsetWidth+"px").css("height",e[0].offsetHeight+"px").css("filter","alpha(opacity=0)").css("display",e.css("display")).css("overflow","hidden").css("z-index","900000").css("visibility","visible")}};e.bind("mouseenter",o);var l=function(e){for(var t=FileAPI.getFiles(e),i=0;i<t.length;i++)void 0===t[i].size&&(t[i].size=0),void 0===t[i].name&&(t[i].name="file"),void 0===t[i].type&&(t[i].type="undefined");e.target||(e.target={}),e.target.files=t,e.target.files!=t&&(e.__files_=t),(e.__files_||e.target.files).item=function(t){return(e.__files_||e.target.files)[t]||null}}},FileAPI.disableFileInput=function(e,t){t?e.removeClass("js-fileapi-wrapper"):e.addClass("js-fileapi-wrapper")}}window.FileReader||(window.FileReader=function(){var e=this,t=!1;this.listeners={},this.addEventListener=function(t,i){e.listeners[t]=e.listeners[t]||[],e.listeners[t].push(i)},this.removeEventListener=function(t,i){e.listeners[t]&&e.listeners[t].splice(e.listeners[t].indexOf(i),1)},this.dispatchEvent=function(t){var i=e.listeners[t.type];if(i)for(var s=0;s<i.length;s++)i[s].call(e,t)},this.onabort=this.onerror=this.onload=this.onloadstart=this.onloadend=this.onprogress=null;var i=function(t,i){var s={type:t,target:e,loaded:i.loaded,total:i.total,error:i.error};return null!=i.result&&(s.target.result=i.result),s},s=function(s){if(t||(t=!0,e.onloadstart&&e.onloadstart(i("loadstart",s))),"load"===s.type){e.onloadend&&e.onloadend(i("loadend",s));var n=i("load",s);e.onload&&e.onload(n),e.dispatchEvent(n)}else if("progress"===s.type){var n=i("progress",s);e.onprogress&&e.onprogress(n),e.dispatchEvent(n)}else{var n=i("error",s);e.onerror&&e.onerror(n),e.dispatchEvent(n)}};this.readAsArrayBuffer=function(e){FileAPI.readAsBinaryString(e,s)},this.readAsBinaryString=function(e){FileAPI.readAsBinaryString(e,s)},this.readAsDataURL=function(e){FileAPI.readAsDataURL(e,s)},this.readAsText=function(e){FileAPI.readAsText(e,s)}})}();