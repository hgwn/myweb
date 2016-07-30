jQuery&&function(t){t.fn.pagetable=function(e){return this.each(function(){function a(a,n){a.pageSize=e.pageSize,x();var r=t(".pagination",i);r.remove(),t(".pageNote",i).empty();var u=e.header;a&&a.pageIdx?e.params=a:e.params=t.extend({pageIdx:1},a),e.url&&(w(),t.ajax({type:"post",url:e.url,data:e.params,dataType:"json",success:function(r){if(N(),e.result=r.result,e.curPageData=r.result.data,e.rowCount=r.result.rowCount,e.first=!0,0==e.rowCount)return A(),void(n&&n());var h=p(u,e.curPageData);if(s.append(h),P(),""!=l&&t("input[name^='internalChx_']",s).each(function(){t(this).attr("id")==l&&t(this).parent().parent().trigger("click")}),o)if(""==c||void 0==c)t("input[name^='internalChx_']",s).each(function(){t(this).attr("disabled","disabled"),t(this).unbind(),t(this).parent().parent().unbind()});else if("number"==typeof c){var f=t("input[name='internalChx_"+c+"']",s);f.attr("disabled","disabled"),f.unbind(),f.parent().parent().unbind()}if(!e.displayAll){var g=t('<div class="pagewrapDIV"><div class="paginationDIV"><ul class="pagination"></ul></div></div>');i.append(g);var b=t(".pagination",i);d(b,e.rowCount,function(r){if(e.first)return e.first=!1,!1;x();var d=r+1;return t("tbody",i).remove(),e.params=t.extend({pageIdx:d,pageSize:e.pageSize},a),w(),t.ajax({type:"post",url:e.url,data:e.params,dataType:"json",success:function(a){N(),e.curPageData=a.result.data;var r=p(u,e.curPageData);if(s.append(r),P(),""!=l&&t("input[name^='internalChx_']",s).each(function(){t(this).attr("id")==l&&t(this).parent().parent().trigger("click")}),o)if(""==c||void 0==c)t("input[name^='internalChx_']",s).each(function(){t(this).attr("disabled","disabled"),t(this).unbind(),t(this).parent().parent().unbind()});else if("number"==typeof c){var i=t("input[name='internalChx_"+c+"']",s);i.attr("disabled","disabled"),i.unbind(),i.parent().parent().unbind()}n&&n()}}),!1})}n&&n()}}))}e=t.extend({pageSize:10,displayEntries:5,edgeEntries:1,displayAll:!1,params:{}},e||{});var n=function(t){for(var a='<thead><tr class="bgcolor">',n=0;n<t.length;n++){var r=t[n],s=r.width?"width="+r.width:"";a+=r.checkbox?"single"==e.clickOption?"<th nowrap "+s+">选择</th>":"<th nowrap "+s+'>&nbsp;&nbsp;<input id="selectAllChx" type="checkbox">&nbsp;全选</th>':"<th nowrap "+s+' title="'+r.text+'">'+r.text+'<input id="'+r.name+'_th" class="th_descsort th_transparent" type="button"></th>'}return a+="</tr></thead>"},r=t(n(e.header)),s=t('<table width="100%" border="0" cellpadding="0" cellspacing="0" class="pagetable"></table>').append(r),i=t(this).append(s),l="",o=!1,c="",d=function(t,a,n){var r={callback:n};r.items_per_page=e.pageSize,r.num_display_entries=e.displayEntries,r.num_edge_entries=e.edgeEntries,r.num_total=e.rowCount,r.prev_text="<div class='prev_arrow'></div>",r.next_text="<div class='next_arrow'></div>",r.first_text="<div class='first_arrow'></div>",r.last_text="<div class='last_arrow'></div>",t.pagination(a,r)},u=function(t,e){if(-1!=e.indexOf(".")){var a=e.split("."),n=t[a[0]];if(!n||void 0==n)return"";for(var r=1;r<a.length;r++){var s=a[r];if(!n[s]||void 0==n[s])return"";n=n[s]}return n}if(-1!=e.indexOf(",")){for(var a=e.split(","),i={},r=0;r<a.length;r++){var s=a[r];i[s]=t[s]}return i}return t[e]},h=function(t,e){if(-1!=e.indexOf(",")){for(var a=e.split(","),n="",r=0;r<a.length;r++){var s=a[r];n+=t[s],r<a.length-1&&(n+=",")}return n}return t[e]},p=function(t,a){if(null==a||0==a.length)return'<tbody><tr onmouseout="this.className=\'pagetable_tr_d\'" onmouseover="this.className=\'pagetable_tr_o\'" class="pagetable_tr_d"><td nowrap colspan="'+t.length+'" align="center">暂无数据</td></tr></tbody>';for(var n="<tbody>",r=0;r<a.length;r++){var s,i=a[r];s=r%2==0?'<tr name="internalTr_'+r+'" class="pagetable_tr_d" onmouseover="this.className=\'pagetable_tr_o\'" onmouseout="this.className=\'pagetable_tr_d\'">':'<tr name="internalTr_'+r+'" class="pagetable_tr_s" onmouseover="this.className=\'pagetable_tr_o\'" onmouseout="this.className=\'pagetable_tr_s\'">';for(var l=0;l<t.length;l++){var o,c=t[l],d=c.align?"text-align:"+c.align:"text-align:center",p=u(i,c.name);c.checkbox?(p=h(i,c.name),o='<input name="internalChx_'+r+'" type="checkbox" id="'+p+'">',s+='<td style="text-align:center;">'+o+"</td>"):c.render?(o=c.render(p),s+='<td style="'+d+'" class="render_class">&nbsp;'+o+"</td>"):"money"!=c.type?"shortTime"!=c.type?"status"!=c.type?"state"!=c.type?c.name&&((null==p||void 0==p)&&(p=""),o=p,s+=c.name==e.editEntryColumn&&""!=o?'<td style="'+d+'" id='+i.id+' class="underline" onclick="edit_line(\''+o+"',this);\">&nbsp;"+o+"</td>":c.name==e.detailEntryColumn&&""!=o?'<td style="'+d+'" id='+i.id+' class="underline" onclick="detail_line(\''+o+"',this);\">&nbsp;"+o+"</td>":c.align&&"left"==c.align?'<td style="'+d+'">&nbsp;'+o+"</td>":'<td style="'+d+'">'+o+"</td>"):(o=1==p.state?'<fonts style="color:blue;fonts-weight: bolder;">'+p._stateName+"</fonts>":2==p.state?'<fonts style="color:orange;fonts-weight: bolder;">'+p._stateName+"</fonts>":3==p.state?'<fonts style="color:green;fonts-weight: bolder;">'+p._stateName+"</fonts>":4==p.state?'<fonts style="color:red;fonts-weight: bolder;">'+p._stateName+"</fonts>":5==p.state?'<fonts style="color:grey;fonts-weight: bolder;">'+p._stateName+"</fonts>":"<fonts></fonts>",s+='<td style="'+d+'" class="render_class">&nbsp;'+o+"</td>"):(o=1==p.status?'<fonts style="color:blue;fonts-weight: bolder;">'+p._statusName+"</fonts>":2==p.status?'<fonts style="color:orange;fonts-weight: bolder;">'+p._statusName+"</fonts>":3==p.status?'<fonts style="color:green;fonts-weight: bolder;">'+p._statusName+"</fonts>":4==p.status?'<fonts style="color:red;fonts-weight: bolder;">'+p._statusName+"</fonts>":5==p.status?'<fonts style="color:grey;fonts-weight: bolder;">'+p._statusName+"</fonts>":"<fonts></fonts>",s+='<td style="'+d+'" class="render_class">&nbsp;'+o+"</td>"):(o=p?"<fonts>"+p.substring(0,10)+"</fonts>":"<fonts></fonts>",s+='<td style="'+d+'" class="render_class">&nbsp;'+o+"</td>"):(o=p?"<fonts>"+Number(p).toFixed(2)+"</fonts>":"<fonts>0.00</fonts>",s+='<td style="'+d+'" class="render_class">&nbsp;'+o+"</td>")}s+="</tr>",n+=s}return n+="</tbody>"},f=function(t){t.removeAttr("class"),t.addClass("pagetable_tr_o"),t.removeAttr("onmouseout")},g=function(e){var a=e.attr("name").split("_")[1];t(":checkbox[name^='internalChx_']",e).removeAttr("checked"),e.removeAttr("class"),a%2==0?(e.addClass("pagetable_tr_d"),e.attr("onmouseout","this.className='pagetable_tr_d'")):(e.addClass("pagetable_tr_s"),e.attr("onmouseout","this.className='pagetable_tr_s'"))},b=null,m=null,_=function(e){t("tr[name^='internalTr_']",e).dblclick(function(){clearTimeout(b);var e="internalChx_"+t(this).attr("name").split("_")[1],a=t("input[name='"+e+"']",t(this));if(a.size()>0){var n=a.attr("checked");"checked"==n?(a.removeAttr("checked"),g(t(this))):(a.attr("checked","checked"),f(t(this)))}else{var r=t(this).attr("sltattr");r?(g(t(this)),t(this).removeAttr("sltattr")):(f(t(this)),t(this).attr("sltattr","sltattr"))}})},v=function(){t("tr[name^='internalTr_']",s).click(function(){m=t(this),curIndex=parseInt(m.attr("name").split("_")[1]),clearTimeout(b),b=setTimeout(function(){var a="internalChx_"+m.attr("name").split("_")[1],n=t("input[name='"+a+"']",m);if(n.size()>0){var r=n.attr("checked");"checked"==r?(n.removeAttr("checked"),g(m)):(t("input[type='checkbox']",s).removeAttr("checked"),n.attr("checked","checked"),m.siblings().each(function(e,a){g(t(a))}),f(m))}else{var i=m.attr("sltattr");i?(g(m),m.removeAttr("sltattr")):(f(m),m.attr("sltattr","sltattr"))}e.rowSelected&&e.rowSelected(e.curPageData[curIndex])},300)})},y=function(a){t("input[name^='internalChx_']",a).parent().click(function(t){t.stopPropagation?t.stopPropagation():t.cancelBubble=!0}),t("input[name^='internalChx_']",a).click(function(a){var n=t(this).attr("checked"),r=t(this).parent().parent(),s=parseInt(r.attr("name").split("_")[1]);"single"==e.clickOption?"checked"==n?(f(r),r.siblings().each(function(e,a){g(t(a))})):g(r):"checked"==n?f(r):g(r),e.rowSelected&&e.rowSelected(e.curPageData[s]),a.stopPropagation?a.stopPropagation():a.cancelBubble=!0})},k=function(){t("th :input[type!='checkbox']",s).each(function(){var a=this.id.split("_")[0],n=e.header,r=!1;for(var s in n)1==n[s].sort&&a==n[s].name&&(r=!0,t(this).click(function(){void 0==this.flag?(this.flag=!0,t(this).toggleClass("th_ascsort")):(this.flag=!this.flag,t(this).toggleClass("th_ascsort")),D(a,this.flag)}));r||t(this).removeClass("th_descsort")})},x=function(){t("#selectAllChx",i).removeAttr("checked")};try{s.colResizable({liveDrag:!0,gripInnerHtml:"<div class='grip'></div>",draggingClass:"dragging",minWidth:30})}catch(C){}var w=function(){t("tbody",i).remove();var a='<tbody id="loading_"><tr onmouseout="this.className=\'pagetable_tr_d\'" onmouseover="this.className=\'pagetable_tr_o\'" class="pagetable_tr_d"><td nowrap colspan="'+e.header.length+'" align="center">数据加载中...</td></tr></tbody>';s.append(a)},N=function(){t("#loading_",s).remove()},A=function(){t("tbody",i).remove();var a='<tbody id="loading_"><tr onmouseout="this.className=\'pagetable_tr_d\'" onmouseover="this.className=\'pagetable_tr_o\'" class="pagetable_tr_d"><td nowrap colspan="'+e.header.length+'" align="center">无数据</td></tr></tbody>';s.append(a)};this.query=function(t,n){a(t,function(){n&&n(e)})};var D=function(a,n){for(var r,l=e.curPageData,o=0;o<l.length;o++)for(var c=o;c<l.length;c++)n&&l[o][a]<l[c][a]?(r=l[o],l[o]=l[c],l[c]=r):!n&&l[o][a]>l[c][a]&&(r=l[o],l[o]=l[c],l[c]=r);x();var d=p(head,l);t("tbody",i).remove(),s.append(d),P()},P=function(){y(s),"single"==e.clickOption?v(s):"double"==e.clickOption?_(s):(v(s),_(s))};this.refresh=function(){a(e.params)},this.getCheckedVals=function(){var e=new Array,a=t("input[type='checkbox']:checked",t("tbody",i));return a.each(function(){e.push(t(this).attr("id"))}),0==e.length?null:1==e.length?e[0]:e},this.getCheckedArrayVals=function(){var e=new Array,a=t("input[type='checkbox']:checked",t("tbody",i));return a.each(function(){e.push(t(this).attr("id"))}),0==e.length?null:e},this.getCheckedObjVals=function(){for(var a=[],n=t("input[type='checkbox']:checked",t("tbody",i)),r=0;r<n.length;r++)a.push(e.curPageData[parseInt(t(n[r]).attr("name").split("_")[1])]);return a},this.getCurPageData=function(){return e.curPageData},this.query(e.params),t("#selectAllChx",i).click(function(){var e=t(this).attr("checked"),a=t("input[name^='internalChx_'][name!='selectAllChx']",i);"checked"==e?(a.attr("checked","checked"),a.each(function(){f(t(this).parent().parent())})):(a.removeAttr("checked"),a.each(function(){g(t(this).parent().parent())}))}),this.initChecked=function(t){l=t},this.disableRow=function(t){o=!0,c=t},this.asyncInitChecked=function(e){t("input[name^='internalChx_']",s).each(function(){t(this).attr("id")==e&&t(this).parent().parent().trigger("click")}),l=e},this.asyncDisableRow=function(e){if(""==c||void 0==c)t("input[name^='internalChx_']",s).each(function(){t(this).attr("disabled","disabled"),t(this).unbind(),t(this).parent().parent().unbind()});else if("number"==typeof c){var a=t("input[name='internalChx_"+c+"']",s);a.attr("disabled","disabled"),a.unbind(),a.parent().parent().unbind()}o=!0,c=e},this.hasData=function(){return null==e.curPageData||0==e.curPageData.length?!1:!0},k(),e.loadedcallback&&e.loadedcallback()})[0]}}(jQuery);