!function(t){t.fn.fixedHeaderTable=function(e){var i={width:"100%",height:"100%",themeClass:"fht-default",borderCollapse:!0,fixedColumns:0,fixedColumn:!1,sortable:!1,autoShow:!0,footer:!1,cloneHeadToFoot:!1,autoResize:!1,create:null},s={},d={init:function(e){return s=t.extend({},i,e),this.each(function(){var e=t(this);a._isTable(e)?(d.setup.apply(this,Array.prototype.slice.call(arguments,1)),t.isFunction(s.create)&&s.create.call(this)):t.error("Invalid table mark-up")})},setup:function(){var e,i,o,n,l,h=t(this),f=this,r=h.find("thead"),c=h.find("tfoot"),b=0;s.originalTable=t(this).clone(),s.includePadding=a._isPaddingIncludedWithWidth(),s.scrollbarOffset=a._getScrollbarWidth(),s.themeClassName=s.themeClass,l=s.width.search("%")>-1?h.parent().width()-s.scrollbarOffset:s.width-s.scrollbarOffset,h.css({width:l}),h.closest(".fht-table-wrapper").length||(h.addClass("fht-table"),h.wrap('<div class="fht-table-wrapper"></div>')),e=h.closest(".fht-table-wrapper"),1==s.fixedColumn&&s.fixedColumns<=0&&(s.fixedColumns=1),s.fixedColumns>0&&0==e.find(".fht-fixed-column").length&&(h.wrap('<div class="fht-fixed-body"></div>'),t('<div class="fht-fixed-column"></div>').prependTo(e),n=e.find(".fht-fixed-body")),e.css({width:s.width,height:s.height}).addClass(s.themeClassName),h.hasClass("fht-table-init")||h.wrap('<div class="fht-tbody"></div>'),o=h.closest(".fht-tbody");var p=a._getTableProps(h);a._setupClone(o,p.tbody),h.hasClass("fht-table-init")?i=e.find("div.fht-thead"):(i=s.fixedColumns>0?t('<div class="fht-thead"><table class="fht-table"></table></div>').prependTo(n):t('<div class="fht-thead"><table class="fht-table"></table></div>').prependTo(e),i.find("table.fht-table").addClass(s.originalTable.attr("class")).attr("style",s.originalTable.attr("style")),r.clone().appendTo(i.find("table"))),a._setupClone(i,p.thead),h.css({"margin-top":-i.outerHeight(!0)}),1==s.footer&&(a._setupTableFooter(h,f,p),c.length||(c=e.find("div.fht-tfoot table")),b=c.outerHeight(!0));var u=e.height()-r.outerHeight(!0)-b-p.border;return o.css({height:u}),h.addClass("fht-table-init"),"undefined"!=typeof s.altClass&&d.altRows.apply(f),s.fixedColumns>0&&a._setupFixedColumn(h,f,p),s.autoShow||e.hide(),a._bindScroll(o,p),f},resize:function(){var t=this;return t},altRows:function(e){var i=t(this),d="undefined"!=typeof e?e:s.altClass;i.closest(".fht-table-wrapper").find("tbody tr:odd:not(:hidden)").addClass(d)},show:function(e,i,s){var d=t(this),a=this,o=d.closest(".fht-table-wrapper");return"undefined"!=typeof e&&"number"==typeof e?(o.show(e,function(){t.isFunction(i)&&i.call(this)}),a):"undefined"!=typeof e&&"string"==typeof e&&"undefined"!=typeof i&&"number"==typeof i?(o.show(e,i,function(){t.isFunction(s)&&s.call(this)}),a):(d.closest(".fht-table-wrapper").show(),t.isFunction(e)&&e.call(this),a)},hide:function(e,i,s){var d=t(this),a=this,o=d.closest(".fht-table-wrapper");return"undefined"!=typeof e&&"number"==typeof e?(o.hide(e,function(){t.isFunction(s)&&s.call(this)}),a):"undefined"!=typeof e&&"string"==typeof e&&"undefined"!=typeof i&&"number"==typeof i?(o.hide(e,i,function(){t.isFunction(s)&&s.call(this)}),a):(d.closest(".fht-table-wrapper").hide(),t.isFunction(s)&&s.call(this),a)},destroy:function(){var e=t(this),i=this,s=e.closest(".fht-table-wrapper");return e.insertBefore(s).removeAttr("style").append(s.find("tfoot")).removeClass("fht-table fht-table-init").find(".fht-cell").remove(),s.remove(),i}},a={_isTable:function(t){var e=t,i=e.is("table"),s=e.find("thead").length>0,d=e.find("tbody").length>0;return i&&s&&d?!0:!1},_bindScroll:function(t){var e=t,i=e.closest(".fht-table-wrapper"),d=e.siblings(".fht-thead"),a=e.siblings(".fht-tfoot");e.bind("scroll",function(){if(s.fixedColumns>0){var t=i.find(".fht-fixed-column");t.find(".fht-tbody table").css({"margin-top":-e.scrollTop()})}d.find("table").css({"margin-left":-this.scrollLeft}),(s.footer||s.cloneHeadToFoot)&&a.find("table").css({"margin-left":-this.scrollLeft})})},_fixHeightWithCss:function(t,e){s.includePadding?t.css({height:t.height()+e.border}):t.css({height:t.parent().height()+e.border})},_fixWidthWithCss:function(e,i,d){s.includePadding?e.each(function(){t(this).css({width:void 0==d?t(this).width()+i.border:d+i.border})}):e.each(function(){t(this).css({width:void 0==d?t(this).parent().width()+i.border:d+i.border})})},_setupFixedColumn:function(e,i,d){var o,n,l,h,f,r=e,c=r.closest(".fht-table-wrapper"),b=c.find(".fht-fixed-body"),p=c.find(".fht-fixed-column"),u=t('<div class="fht-thead"><table class="fht-table"><thead><tr></tr></thead></table></div>'),g=t('<div class="fht-tbody"><table class="fht-table"><tbody></tbody></table></div>'),v=t('<div class="fht-tfoot"><table class="fht-table"><tfoot><tr></tr></tfoot></table></div>'),y=c.width(),m=b.find(".fht-tbody").height()-s.scrollbarOffset;u.find("table.fht-table").addClass(s.originalTable.attr("class")),g.find("table.fht-table").addClass(s.originalTable.attr("class")),v.find("table.fht-table").addClass(s.originalTable.attr("class")),o=b.find(".fht-thead thead tr > *:lt("+s.fixedColumns+")"),l=s.fixedColumns*d.border,o.each(function(){l+=t(this).outerWidth(!0)}),a._fixHeightWithCss(o,d),a._fixWidthWithCss(o,d);var w=[];o.each(function(){w.push(t(this).width())}),f="tbody tr > *:not(:nth-child(n+"+(s.fixedColumns+1)+"))",n=b.find(f).each(function(e){a._fixHeightWithCss(t(this),d),a._fixWidthWithCss(t(this),d,w[e%s.fixedColumns])}),u.appendTo(p).find("tr").append(o.clone()),g.appendTo(p).css({"margin-top":-1,height:m+d.border}),n.each(function(e){e%s.fixedColumns==0&&(h=t("<tr></tr>").appendTo(g.find("tbody")),s.altClass&&t(this).parent().hasClass(s.altClass)&&h.addClass(s.altClass)),t(this).clone().appendTo(h)}),p.css({height:0,width:l});var C=p.find(".fht-tbody .fht-table").height()-p.find(".fht-tbody").height();if(p.find(".fht-tbody .fht-table").bind("mousewheel",function(e,i,s,d){if(0!=d){var a=parseInt(t(this).css("marginTop"),10)+(d>0?120:-120);return a>0&&(a=0),-C>a&&(a=-C),t(this).css("marginTop",a),b.find(".fht-tbody").scrollTop(-a).scroll(),!1}}),b.css({width:y}),1==s.footer||1==s.cloneHeadToFoot){var x,T=b.find(".fht-tfoot tr > *:lt("+s.fixedColumns+")");a._fixHeightWithCss(T,d),v.appendTo(p).find("tr").append(T.clone()),x=v.find("table").innerWidth(),v.css({top:s.scrollbarOffset,width:x})}},_setupTableFooter:function(e,i,d){var o=e,n=o.closest(".fht-table-wrapper"),l=o.find("tfoot"),h=n.find("div.fht-tfoot");switch(h.length||(h=s.fixedColumns>0?t('<div class="fht-tfoot"><table class="fht-table"></table></div>').appendTo(n.find(".fht-fixed-body")):t('<div class="fht-tfoot"><table class="fht-table"></table></div>').appendTo(n)),h.find("table.fht-table").addClass(s.originalTable.attr("class")),!0){case!l.length&&1==s.cloneHeadToFoot&&1==s.footer:var f=n.find("div.fht-thead");h.empty(),f.find("table").clone().appendTo(h);break;case l.length&&0==s.cloneHeadToFoot&&1==s.footer:h.find("table").append(l).css({"margin-top":-d.border}),a._setupClone(h,d.tfoot)}},_getTableProps:function(e){var i={thead:{},tbody:{},tfoot:{},border:0},d=1;return 1==s.borderCollapse&&(d=2),i.border=(e.find("th:first-child").outerWidth()-e.find("th:first-child").innerWidth())/d,e.find("thead tr:first-child > *").each(function(e){i.thead[e]=t(this).width()+i.border}),e.find("tfoot tr:first-child > *").each(function(e){i.tfoot[e]=t(this).width()+i.border}),e.find("tbody tr:first-child > *").each(function(e){i.tbody[e]=t(this).width()+i.border}),i},_setupClone:function(e,i){var d,a=e,o=a.find("thead").length?"thead tr:first-child > *":a.find("tfoot").length?"tfoot tr:first-child > *":"tbody tr:first-child > *";a.find(o).each(function(e){if(d=t(this).find("div.fht-cell").length?t(this).find("div.fht-cell"):t('<div class="fht-cell"></div>').appendTo(t(this)),d.css({width:parseInt(i[e],10)}),!t(this).closest(".fht-tbody").length&&t(this).is(":last-child")&&!t(this).closest(".fht-fixed-column").length){var a=Math.max((t(this).innerWidth()-t(this).width())/2,s.scrollbarOffset);t(this).css({"padding-right":parseInt(t(this).css("padding-right"))+a+"px"})}})},_isPaddingIncludedWithWidth:function(){var e,i,d=t('<table class="fht-table"><tr><td style="padding: 10px; fonts-size: 10px;">test</td></tr></table>');return d.addClass(s.originalTable.attr("class")),d.appendTo("body"),e=d.find("td").height(),d.find("td").css("height",d.find("tr").height()),i=d.find("td").height(),d.remove(),e!=i?!0:!1},_getScrollbarWidth:function(){var e=0;if(!e)if(/msie/.test(navigator.userAgent.toLowerCase())){var i=t('<textarea cols="10" rows="2"></textarea>').css({position:"absolute",top:-1e3,left:-1e3}).appendTo("body"),s=t('<textarea cols="10" rows="2" style="overflow: hidden;"></textarea>').css({position:"absolute",top:-1e3,left:-1e3}).appendTo("body");e=i.width()-s.width()+2,i.add(s).remove()}else{var d=t("<div />").css({width:100,height:100,overflow:"auto",position:"absolute",top:-1e3,left:-1e3}).prependTo("body").append("<div />").find("div").css({width:"100%",height:200});e=100-d.width(),d.parent().remove()}return e}};return d[e]?d[e].apply(this,Array.prototype.slice.call(arguments,1)):"object"!=typeof e&&e?void t.error('Method "'+e+'" does not exist in fixedHeaderTable jquery.plugin!'):d.init.apply(this,arguments)}}(jQuery);