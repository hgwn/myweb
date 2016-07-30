!function($,window,document,undefined){"use strict";var pluginName="treeview",defaults={injectStyle:!0,levels:2,expandIcon:"glyphicon glyphicon-plus",collapseIcon:"glyphicon glyphicon-minus",emptyIcon:"glyphicon",userIcon:"glyphicon glyphicon-user",groupIcon:"icon icon-group",color:undefined,backColor:undefined,borderColor:undefined,onhoverColor:"#F5F5F5",selectedColor:"#FFFFFF",selectedBackColor:"#428bca",searchResultColor:"#D9534F",searchResultBackColor:undefined,$defer:null,isStepByStep:!0,collapseGroup:!1,width:"259px",forSearchList:"",showRightButtons:!0,enableLinks:!1,highlightSelected:!0,highlightSearchResults:!0,showBorder:!0,showTags:!1,multiSelect:!0,showCheckbox:!0,fieldShowNameId:"addressgroupid",fieldShowName:"addressgroupname",leafFieldName:"contactname",leafFieldNameId:"addresslistid",onNodeCollapsed:function(e,t){console.log(t)},onNodeExpanded:function(e,t){console.log(t)},onNodeSelected:function(e){console.log(e)},onNodeUnselected:function(e,t){console.log(t)},onSearchComplete:function(e,t){console.log(t)},onSearchCleared:function(e,t){console.log(t)},onMenuClicked:function(e,t){console.log(t)},onMenuInitialized:function(e,t){console.log(e,t)}},Tree=function(e,t){return this.$element=$(e),this.elementId=e.id,this.styleId=this.elementId+"-style",this.activeGroupId="",this.init(t),{reloadStationNode:$.proxy(this.reloadStationNode,this),reloadCompanyNode:$.proxy(this.reloadCompanyNode,this),reloadStaffNode:$.proxy(this.reloadStaffNode,this),options:this.options,init:$.proxy(this.init,this),remove:$.proxy(this.remove,this),refresh:$.proxy(this.refresh,this),getNodes:$.proxy(this.getNodes,this),getNode:$.proxy(this.getNode,this),getParent:$.proxy(this.getParent,this),getSiblings:$.proxy(this.getSiblings,this),getCurentCollapseNode:$.proxy(this.getCurentCollapseNode,this),pushNode:$.proxy(this.pushNode,this),selectNode:$.proxy(this.selectNode,this),unselectNode:$.proxy(this.unselectNode,this),toggleNodeSelected:$.proxy(this.toggleNodeSelected,this),collapseAll:$.proxy(this.collapseAll,this),collapseNode:$.proxy(this.collapseNode,this),expandAll:$.proxy(this.expandAll,this),expandNode:$.proxy(this.expandNode,this),toggleNodeExpanded:$.proxy(this.toggleNodeExpanded,this),search:$.proxy(this.search,this),clearSearch:$.proxy(this.clearSearch,this)}};Tree.prototype.init=function(e){this.tree=[],this.nodes=[],e.data&&("string"==typeof e.data&&(e.data=$.parseJSON(e.data)),this.tree=e.data),this.options=$.extend({},defaults,e),this.destroy(),this.subscribeEvents(),this.setInitialStates({nodes:this.tree},0),this.render()},Tree.prototype.refresh=function(){this.destroy(),this.subscribeEvents(),this.nodes.length>0&&(this.nodes=[]),this.setInitialStates({nodes:this.tree},0),this.render()},Tree.prototype.reloadStationNode=function(nodeId,callback){var node=this.nodes[nodeId],_this=this;node.isCompany?$.get("/masgetweb/contacts.do?type=getorganization&objecttypeid="+node.objecttypeid+"&companyid="+node.companyid).success(function(resp){try{resp=eval("("+resp+")")}catch(e){return}0==resp.ret&&($.each(resp.data.stations,function(e,t){t.addressgroupname=t.stationname,t.isLastGroup=!0,t.isStation=!0,t.isGroup=!0,t.state={expanded:!1,selected:!1}}),node.nodes=resp.data.stations,_this.refresh(),callback&&callback())}):$.get("/masgetweb/contacts.do?type=getorganization&objecttypeid=0").success(function(resp){try{resp=eval("("+resp+")")}catch(e){return}0==resp.ret&&($.each(resp.data.stations,function(e,t){t.addressgroupname=t.stationname,t.isLastGroup=!0,t.isStation=!0,t.isGroup=!0,t.state={expanded:!1,selected:!1}}),node.nodes=resp.data.stations,_this.refresh(),callback&&callback())})},Tree.prototype.reloadCompanyNode=function(nodeId,callback){var node=this.nodes[nodeId],_this=this;$.get("/masgetweb/contacts.do?type=getorganization&objecttypeid=0").success(function(resp){try{resp=eval("("+resp+")")}catch(e){return}0==resp.ret&&($.each(resp.data.companys,function(e,t){t.addressgroupname=t.companyname,t.isGroup=!0,t.isLastGroup=!1,t.isCompany=!0,t.state={expanded:!1,selected:!1}}),node.nodes=resp.data.companys,_this.refresh(),callback&&callback())})},Tree.prototype.reloadStaffNode=function(nodeId,callback){var node=this.nodes[nodeId],_this=this;$.get("/masgetweb/contacts.do?type=getorganization&objecttypeid="+node.objecttypeid+"&companyid="+node.parent.companyid+"&stationid="+node.stationid).success(function(resp){try{resp=eval("("+resp+")")}catch(e){return}0==resp.ret&&($.each(resp.data.staffs,function(e,t){t.contactname=t.staffname,t.state={selected:!1},t.isLeaf=!0,t.isStaff=!0}),node.nodes=resp.data.staffs,_this.refresh(),callback&&callback())})},Tree.prototype.remove=function(){this.destroy(),$.removeData(this,pluginName),$("#"+this.styleId).remove()},Tree.prototype.destroy=function(){this.initialized&&(this.$wrapper.remove(),this.$wrapper=null,this.unsubscribeEvents(),this.initialized=!1)},Tree.prototype.unsubscribeEvents=function(){this.$element.off("click"),"function"==typeof this.options.onNodeCollapsed&&this.$element.off("nodeCollapsed"),"function"==typeof this.options.onNodeExpanded&&this.$element.off("nodeExpanded"),"function"==typeof this.options.onNodeSelected&&this.$element.off("nodeSelected"),"function"==typeof this.options.onNodeUnselected&&this.$element.off("nodeUnselected"),"function"==typeof this.options.onSearchComplete&&this.$element.off("searchComplete"),"function"==typeof this.options.onSearchCleared&&this.$element.off("searchCleared")},Tree.prototype.subscribeEvents=function(){this.unsubscribeEvents(),this.$element.on("click",$.proxy(this.clickHandler,this)),"function"==typeof this.options.onNodeCollapsed&&this.$element.on("nodeCollapsed",this.options.onNodeCollapsed),"function"==typeof this.options.onNodeExpanded&&this.$element.on("nodeExpanded",this.options.onNodeExpanded),"function"==typeof this.options.onNodeSelected&&this.$element.on("nodeSelected",this.options.onNodeSelected),"function"==typeof this.options.onNodeUnselected&&this.$element.on("nodeUnselected",this.options.onNodeUnselected),"function"==typeof this.options.onSearchComplete&&this.$element.on("searchComplete",this.options.onSearchComplete),"function"==typeof this.options.onSearchCleared&&this.$element.on("searchCleared",this.options.onSearchCleared)},Tree.prototype.setInitialStates=function(e,t){if(e.nodes){t+=1;var o=e,s=this;$.each(e.nodes,function(e,n){n.nodeId=s.nodes.length,n.parentId=o.nodeId,n.parent=o,n.level=t,n.hasOwnProperty(s.options.fieldShowName)&&!n.nodes&&(n.nodes=[]),!s.options.isStepByStep||n.nodes&&0!=n.nodes.length||n.isLeaf?!n.hasOwnProperty(s.options.leafFieldName)&&n.nodes.length>0&&n.nodes[0].hasOwnProperty(s.options.leafFieldNameId)&&(n.isLastGroup=!0):(n.nodes=[],n.isLastGroup=!0),n.hasOwnProperty("selectable")||(n.selectable=!0),n.state=n.state||{},n.state.hasOwnProperty("expanded")||(n.nodes&&0==n.nodes.length?n.state.expanded=!1:t<s.options.levels?n.state.expanded=!0:n.state.expanded=!1),n.state.hasOwnProperty("selected")||(n.state.selected=!1),n.hasOwnProperty(s.options.leafFieldNameId)&&-1!=s.options.forSearchList.indexOf(n[s.options.leafFieldNameId].toString())&&(n.state.selected=!0),n.isOld&&(n.isOld=!1),n.nodes&&!n.isLeaf&&(n.isGroup=!0,n.nodes.length>0&&(n.isLoaded=!0),s.nodes.push(n),s.setInitialStates(n,t))})}},Tree.prototype.clickHandler=function(e){this.options.enableLinks||e.preventDefault();var t=$(e.target),o=t.attr("class")?t.attr("class").split(" "):[],s=this.findNode(t);-1!=o.indexOf("click-expand")||-1!=o.indexOf("click-collapse")?this.toggleExpandedState(s,this.activeGroupId==s.addressgroupid?!0:!1):-1!=o.indexOf("glyphicon-menu-hamburger")?("function"==typeof this.options.onMenuClicked&&this.setSelectedState(s,!0,!0),this.renderSelectStates(),this.options.onMenuClicked(t,s)):-1!=o.indexOf("glyphicon-refresh")?this.options.onMenuClicked(t,s):s&&(s.selectable?this.toggleSelectedState(s,!1,t):this.toggleExpandedState(s,!1))},Tree.prototype.findNode=function(e){var t=e.closest("li.list-group-item").attr("data-nodeid"),o=this.nodes[t];return o||console.log("Error: node does not exist"),o},Tree.prototype.toggleExpandedState=function(e,t){if(e){if(this.setExpandedState(e,!e.state.expanded,t),this.options.collapseGroup&&1==e.level&&e.state.expanded&&this.activeGroupId!=e.addressgroupid&&(this.activeGroupId=e.addressgroupid,this.collapseAllSiblings(e)),this.options.isStepByStep&&e.isLastGroup&&e.state.expanded&&!e.isLoaded){var o=this;return e.isLoaded=!0,e.$defer=this.options.$defer.defer(),void e.$defer.promise.then(function(){o.render()})}this.render()}},Tree.prototype.getCurentCollapseNode=function(){for(var e=0;e<this.tree.length;e++)if(1==this.tree[e].state.expanded)return this.tree[e];return{}},Tree.prototype.collapseAllSiblings=function(e){for(var t=this.getSiblings(e),o=0;o<t.length;o++)this.setSelectedStateRecursive(t[o],!1,!0),this.collapseNode(t[o],{silent:!1})},Tree.prototype.setExpandedState=function(e,t,o){t?(e.state.expanded=!0,o||this.$element.trigger("nodeExpanded",e)):(e.state.expanded=!1,o||this.$element.trigger("nodeCollapsed",e))},Tree.prototype.toggleSelectedState=function(e,t,o){e&&(this.setSelectedState(e,!e.state.selected,t),this.render())},Tree.prototype.setSelectedState=function(e,t,o){t?(this.options.multiSelect||$.each(this.findNodes("true","g","state.selected"),$.proxy(function(e,t){this.setSelectedState(t,!1,o)},this)),e.state.selected=!0,o||this.$element.trigger("nodeSelected",e)):(e.state.selected=!1,o||this.$element.trigger("nodeUnselected",e))},Tree.prototype.setSelectedStateRecursive=function(e,t,o){var s=this;t?(this.options.multiSelect||$.each(this.findNodes("true","g","state.selected"),$.proxy(function(e,t){this.setSelectedState(t,!1,o)},this)),e.state.selected=!0,o||this.$element.trigger("nodeSelected",$.extend(!0,{},e))):(e.state.selected=!1,o||this.$element.trigger("nodeUnselected",$.extend(!0,{},e))),e.nodes&&e.nodes.length>0&&$.each(e.nodes,function(e,n){s.setSelectedStateRecursive(n,t,o)})},Tree.prototype.renderSelectStates=function(){var e=this;$("ul li",e.$element).each(function(){var t=e.nodes[$(this).attr("data-nodeid")];t.state.selected?$(this).addClass(t.state.selected?"node-selected":"").attr("style",e.options.showCheckbox?"":e.buildStyleOverride(t)):$(this).removeClass("node-selected").removeAttr("style")})},Tree.prototype.render=function(){this.initialized||(this.$element.addClass(pluginName),this.$wrapper=$('<ul class="list-group" style="margin-bottom: 0px;width: '+this.options.width+';"></ul>'),this.injectStyle(),this.initialized=!0),this.$element.empty().append(this.$wrapper.empty()),this.buildTree(this.tree,0)},Tree.prototype.buildTree=function(e,t){if(e){t+=1;var o=this;$.each(e,function(e,s){for(var n=$(o.template.item).addClass("node-"+o.elementId).addClass(s.state.selected?"node-selected":"").addClass(s.searchResult?"search-result":"").attr("data-nodeid",s.nodeId).attr("style",o.buildStyleOverride(s)),i=0;t-1>i;i++)n.append(o.template.indent);if(s.nodes||s.isGroup?s.state.expanded?n.append($(o.template.expandCollapseIcon).addClass("click-collapse").addClass(o.options.collapseIcon)):n.append($(o.template.expandCollapseIcon).addClass("click-expand").addClass(o.options.expandIcon)):n.append($(o.template.expandCollapseIcon).addClass(o.options.emptyIcon)),s.isGroup?n.append($(o.template.icon).addClass(s.icon?s.icon:o.options.groupIcon)):n.append($(o.template.icon).addClass(s.icon?s.icon:o.options.userIcon)),o.options.enableLinks?n.append($(o.template.link).attr("href",s.href).append('<div style="position:absolute;width:140px;overflow:hidden;display:inline;white-space: nowrap;text-overflow: ellipsis;">'+s[o.options.fieldShowName]+"</div>")):n.append('<div style="position:absolute;width:140px;overflow:hidden;display:inline;white-space: nowrap;text-overflow: ellipsis;">'+s[o.options.fieldShowName]+"</div>"),o.options.showCheckbox&&!s.nodes&&n.append($(o.template.checkbox).addClass(s.state.selected?"glyphicon-checked":"")),o.options.showRightButtons&&s.nodes){var d;d=$(1==s.scenetypeid?o.template.refreshBtn:o.template.rightButtons),n.append(d),o.options.onMenuInitialized(d,s)}return o.$wrapper.append(n),s.nodes&&s.state.expanded?s.isLastGroup?o.buildLeaf(s.nodes,t,s):o.buildTree(s.nodes,t):void 0})}},Tree.prototype.buildLeaf=function(e,t,o){if(e){var s=this;$.each(e,function(e,n){n.isOld||(n.isOld=!0,n.nodeId=s.nodes.length,n.parentId=o.nodeId,n.parent=o,n.isLeaf=!0,n.hasOwnProperty("selectable")||(n.selectable=!0),n.state=n.state||{},n.state.hasOwnProperty("selected")||(n.state.selected=!1),s.nodes.push(n));for(var i=$(s.template.item).addClass("node-"+s.elementId).addClass(n.state.selected?"node-selected":"").addClass(n.searchResult?"search-result":"").attr("data-nodeid",n.nodeId).attr("style",s.buildStyleOverride(n)),d=0;t>d;d++)i.append(s.template.indent);i.append($(s.template.expandCollapseIcon).addClass(s.options.emptyIcon)),n.isGroup?i.append($(s.template.icon).addClass(n.icon?n.icon:s.options.groupIcon)):i.append($(s.template.icon).addClass(n.icon?n.icon:s.options.userIcon)),s.options.enableLinks?i.append($(s.template.link).attr("href",n.href).append(n[s.options.fieldShowName])):i.append(n[s.options.leafFieldName]),s.options.showTags&&n.tags&&$.each(n.tags,function(e,t){i.append($(s.template.badge).append(t))}),s.options.showCheckbox&&n.hasOwnProperty(s.options.leafFieldNameId)&&i.append($(s.template.checkbox).addClass(n.state.selected?"glyphicon-check":"")),s.options.showRightButtons&&n.showRigthButton&&i.append($(s.template.rightButtons)),s.$wrapper.append(i)})}},Tree.prototype.buildStyleOverride=function(e){var t=e.color,o=e.backColor;return this.options.highlightSelected&&e.state.selected&&(this.options.selectedColor&&(t=this.options.selectedColor),this.options.selectedBackColor&&(o=this.options.selectedBackColor)),this.options.highlightSearchResults&&e.searchResult&&(this.options.searchResultColor&&(t=this.options.searchResultColor),this.options.searchResultBackColor&&(o=this.options.searchResultBackColor)),"color:"+t+";background-color:"+o+";"},Tree.prototype.injectStyle=function(){this.options.injectStyle&&!document.getElementById(this.styleId)&&$('<style type="text/css" id="'+this.styleId+'"> '+this.buildStyle()+" </style>").appendTo("head")},Tree.prototype.buildStyle=function(){var e=".node-"+this.elementId+"{";return this.options.color&&(e+="color:"+this.options.color+";"),this.options.backColor&&(e+="background-color:"+this.options.backColor+";"),this.options.showBorder?this.options.borderColor&&(e+="border:1px solid "+this.options.borderColor+";"):e+="border:none;",e+="}",this.options.onhoverColor&&(e+=".node-"+this.elementId+":hover{background-color:"+this.options.onhoverColor+";}"),this.css+e},Tree.prototype.template={list:'<ul class="list-group" style="margin-bottom: 0px;width: 258px;"></ul>',item:'<li class="list-group-item"></li>',indent:'<span class="indent"></span>',expandCollapseIcon:'<span class="expand-collapse"></span>',icon:'<span class="icon"></span>',link:'<a href="#" style="color:inherit;"></a>',badge:'<span style="color: red;float:right;right: 5px;"></span>',checkbox:'<span class="glyphicon glyphicon-unchecked masget-treeCheck"></span>',rightButtons:'<button class="btn glyphicon glyphicon-menu-hamburger" style="position:absolute;float:right;background: inherit;right: 0px;"></button>',refreshBtn:'<button class="btn glyphicon glyphicon-refresh" data-loading-text="..." style="position:absolute;float:right;background: inherit;right: 0px;"></button>'},Tree.prototype.css=".treeview .list-group-item{cursor:pointer}.treeview span.indent{margin-left:10px;margin-right:10px}.treeview span.expand-collapse{width:1rem;height:1rem}.treeview span.icon{margin-left:10px;margin-right:5px}",Tree.prototype.getNode=function(e){return this.nodes[e]},Tree.prototype.getNodes=function(){return this.nodes},Tree.prototype.getParent=function(e){var t=this.identifyNode(e);return this.nodes[t.parentId]},Tree.prototype.getSiblings=function(e){var t=this.identifyNode(e),o=this.getParent(t),s=o?o.nodes:this.tree;return s.filter(function(e){return e.nodeId!==t.nodeId})},Tree.prototype.selectNode=function(e,t){var o=this.isSilent(t);this.setSelectedState(this.identifyNode(e),!0,o),this.render()},Tree.prototype.unselectNode=function(e,t){var o=this.isSilent(t);this.setSelectedState(this.identifyNode(e),!1,o),this.render()},Tree.prototype.toggleNodeSelected=function(e,t){this.toggleSelectedState(this.identifyNode(e),this.isSilent(t))},Tree.prototype.collapseAll=function(e){var t=this.isSilent(e);$.each(this.nodes,$.proxy(function(e,o){this.setExpandedState(o,!1,t)},this)),this.render()},Tree.prototype.collapseNode=function(e,t){var o=this.isSilent(t);this.setExpandedState(this.identifyNode(e),!1,o),this.render()},Tree.prototype.expandAll=function(e){var t=this.isSilent(e);e&&e.levels?this.expandLevels(this.tree,e.levels,t):$.each(this.nodes,$.proxy(function(e,o){this.setExpandedState(o,!0,t)},this)),this.render()},Tree.prototype.expandNode=function(e,t){var o=this.isSilent(t),s=this.identifyNode(e);this.setExpandedState(s,!0,o),s.nodes&&t&&t.levels&&this.expandLevels(s.nodes,t.levels-1,o),this.render()},Tree.prototype.expandLevels=function(e,t,o){$.each(e,$.proxy(function(e,s){this.setExpandedState(s,t>0?!0:!1),s.nodes&&this.expandLevels(s.nodes,t-1,o)},this))},Tree.prototype.toggleNodeExpanded=function(e,t){this.toggleExpandedState(this.identifyNode(e),this.isSilent(t))},Tree.prototype.identifyNode=function(e){return"number"==typeof e?this.nodes[e]:e},Tree.prototype.isSilent=function(e){return e&&e.hasOwnProperty("silent")?e.silent:!1},Tree.prototype.search=function(e,t){this.clearSearch();var o=this,s=[];if(e&&e.length>0){t.exactMatch&&(e="^"+e+"$");var n="g";t.ignoreCase&&(n+="i"),s=this.findNodes(e,n),$.each(s,function(e,t){t.searchResult=!0,o.setNodeChain(t)}),o.setExpandedStateWithNodeChain(s),this.render()}return this.$element.trigger("searchComplete",s),s},Tree.prototype.setNodeChain=function(e){return"undefined"==typeof e.parent.nodeId?void(e.nodeChain=""):(this.setNodeChain(e.parent),void("undefined"==typeof e.nodeChain&&(e.nodeChain=e.parent.nodeChain+"&"+e.parent.nodeId)))},Tree.prototype.setExpandedStateWithNodeChain=function(e){var t=[],o=this;$.each(e,function(e,s){for(var n=s.nodeChain.substring(1,s.nodeChain.length).split("&"),i=0;i<n.length;i++)o.contains(t,n[i])||t.push(n[i])});for(var s=0;s<t.length;s++)this.nodes[t[s]].state.expanded=!0},Tree.prototype.contains=function(e,t){for(var o=0;o<e.length;o++)if(e[o]==t)return!0;return!1},Tree.prototype.clearSearch=function(){var e=$.each(this.findNodes("true","g","searchResult"),function(e,t){t.searchResult=!1});this.render(),this.$element.trigger("searchCleared",e)},Tree.prototype.findNodes=function(e,t,o){t=t||"g",o=o||this.options.leafFieldName;var s=this;return $.grep(this.nodes,function(n){var i=s.getNodeValue(n,o);return"string"==typeof i?i.match(new RegExp(e,t)):void 0})},Tree.prototype.pushNode=function(e){this.nodes.push($.extend(e,{nodeId:this.nodes.length+1}))},Tree.prototype.getNodeValue=function(e,t){var o=t.indexOf(".");if(o>0){var s=e[t.substring(0,o)],n=t.substring(o+1,t.length);return this.getNodeValue(s,n)}return e.hasOwnProperty(t)?e[t].toString():undefined};var logError=function(e){window.console&&window.console.error(e)};$.fn[pluginName]=function(e,t){var o;return this.each(function(){var s=$.data(this,pluginName);"string"==typeof e?s?$.isFunction(s[e])&&"_"!==e.charAt(0)?(t instanceof Array||(t=[t]),o=s[e].apply(s,t)):logError("No such method : "+e):logError("Not initialized, can not call method : "+e):"boolean"==typeof e?o=s:$.data(this,pluginName,new Tree(this,$.extend(!0,{},e)))}),o||this}}(jQuery,window,document);