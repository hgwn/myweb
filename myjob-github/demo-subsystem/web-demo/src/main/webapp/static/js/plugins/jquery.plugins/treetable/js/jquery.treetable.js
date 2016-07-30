!function(t){var e,n,r;e=function(){function e(e,n,r){var i;this.row=e,this.tree=n,this.settings=r,this.id=this.row.data(this.settings.nodeIdAttr),i=this.row.data(this.settings.parentIdAttr),null!=i&&""!==i&&(this.parentId=i),this.treeCell=t(this.row.children(this.settings.columnElType)[this.settings.column]),this.expander=t(this.settings.expanderTemplate),this.indenter=t(this.settings.indenterTemplate),this.children=[],this.initialized=!1,this.treeCell.prepend(this.indenter)}return e.prototype.addChild=function(t){return this.children.push(t)},e.prototype.ancestors=function(){var t,e;for(e=this,t=[];e=e.parentNode();)t.push(e);return t},e.prototype.collapse=function(){return this.collapsed()?this:(this.row.removeClass("expanded").addClass("collapsed"),this._hideChildren(),this.expander.attr("title",this.settings.stringExpand),this.initialized&&null!=this.settings.onNodeCollapse&&this.settings.onNodeCollapse.apply(this),this)},e.prototype.collapsed=function(){return this.row.hasClass("collapsed")},e.prototype.expand=function(){return this.expanded()?this:(this.row.removeClass("collapsed").addClass("expanded"),this.initialized&&null!=this.settings.onNodeExpand&&this.settings.onNodeExpand.apply(this),t(this.row).is(":visible")&&this._showChildren(),this.expander.attr("title",this.settings.stringCollapse),this)},e.prototype.expanded=function(){return this.row.hasClass("expanded")},e.prototype.hide=function(){return this._hideChildren(),this.row.hide(),this},e.prototype.isBranchNode=function(){return this.children.length>0||this.row.data(this.settings.branchAttr)===!0?!0:!1},e.prototype.updateBranchLeafClass=function(){this.row.removeClass("branch"),this.row.removeClass("leaf"),this.row.addClass(this.isBranchNode()?"branch":"leaf")},e.prototype.level=function(){return this.ancestors().length},e.prototype.parentNode=function(){return null!=this.parentId?this.tree[this.parentId]:null},e.prototype.removeChild=function(e){var n=t.inArray(e,this.children);return this.children.splice(n,1)},e.prototype.render=function(){var e,n,r=this.settings;return r.expandable===!0&&this.isBranchNode()&&(e=function(e){return t(this).parents("table").treetable("node",t(this).parents("tr").data(r.nodeIdAttr)).toggle(),e.preventDefault()},this.indenter.html(this.expander),n=r.clickableNodeNames===!0?this.treeCell:this.expander,n.off("click.treetable").on("click.treetable",e),n.off("keydown.treetable").on("keydown.treetable",function(t){13==t.keyCode&&e.apply(this,[t])})),this.indenter[0].style.paddingLeft=""+this.level()*r.indent+"px",this},e.prototype.reveal=function(){return null!=this.parentId&&this.parentNode().reveal(),this.expand()},e.prototype.setParent=function(t){return null!=this.parentId&&this.tree[this.parentId].removeChild(this),this.parentId=t.id,this.row.data(this.settings.parentIdAttr,t.id),t.addChild(this)},e.prototype.show=function(){return this.initialized||this._initialize(),this.row.show(),this.expanded()&&this._showChildren(),this},e.prototype.toggle=function(){return this.expanded()?this.collapse():this.expand(),this},e.prototype._hideChildren=function(){var t,e,n,r,i;for(r=this.children,i=[],e=0,n=r.length;n>e;e++)t=r[e],i.push(t.hide());return i},e.prototype._initialize=function(){var t=this.settings;return this.render(),t.expandable===!0&&"collapsed"===t.initialState?this.collapse():this.expand(),null!=t.onNodeInitialized&&t.onNodeInitialized.apply(this),this.initialized=!0},e.prototype._showChildren=function(){var t,e,n,r,i;for(r=this.children,i=[],e=0,n=r.length;n>e;e++)t=r[e],i.push(t.show());return i},e}(),n=function(){function n(t,e){this.table=t,this.settings=e,this.tree={},this.nodes=[],this.roots=[]}return n.prototype.collapseAll=function(){var t,e,n,r,i;for(r=this.nodes,i=[],e=0,n=r.length;n>e;e++)t=r[e],i.push(t.collapse());return i},n.prototype.expandAll=function(){var t,e,n,r,i;for(r=this.nodes,i=[],e=0,n=r.length;n>e;e++)t=r[e],i.push(t.expand());return i},n.prototype.findLastNode=function(t){return t.children.length>0?this.findLastNode(t.children[t.children.length-1]):t},n.prototype.loadRows=function(n){var r,i,s;if(null!=n)for(s=0;s<n.length;s++)i=t(n[s]),null!=i.data(this.settings.nodeIdAttr)&&(r=new e(i,this.tree,this.settings),this.nodes.push(r),this.tree[r.id]=r,null!=r.parentId&&this.tree[r.parentId]?this.tree[r.parentId].addChild(r):this.roots.push(r));for(s=0;s<this.nodes.length;s++)r=this.nodes[s].updateBranchLeafClass();return this},n.prototype.move=function(e,n){var r=e.parentNode();return e!==n&&n.id!==e.parentId&&-1===t.inArray(e,n.ancestors())&&(e.setParent(n),this._moveRows(e,n),1===e.parentNode().children.length&&e.parentNode().render()),r&&r.updateBranchLeafClass(),e.parentNode()&&e.parentNode().updateBranchLeafClass(),e.updateBranchLeafClass(),this},n.prototype.removeNode=function(e){return this.unloadBranch(e),e.row.remove(),null!=e.parentId&&e.parentNode().removeChild(e),delete this.tree[e.id],this.nodes.splice(t.inArray(e,this.nodes),1),this},n.prototype.render=function(){var t,e,n,r;for(r=this.roots,e=0,n=r.length;n>e;e++)t=r[e],t.show();return this},n.prototype.sortBranch=function(t,e){return t.children.sort(e),this._sortChildRows(t),this},n.prototype.unloadBranch=function(t){var e,n=t.children.slice(0);for(e=0;e<n.length;e++)this.removeNode(n[e]);return t.children=[],t.updateBranchLeafClass(),this},n.prototype._moveRows=function(t,e){var n,r=t.children;for(t.row.insertAfter(e.row),t.render(),n=r.length-1;n>=0;n--)this._moveRows(r[n],t)},n.prototype._sortChildRows=function(t){return this._moveRows(t,t)},n}(),r={init:function(e,r){var i;return i=t.extend({branchAttr:"ttBranch",clickableNodeNames:!1,column:0,columnElType:"td",expandable:!1,expanderTemplate:"<a href='#'>&nbsp;</a>",indent:19,indenterTemplate:"<span class='indenter'></span>",initialState:"collapsed",nodeIdAttr:"ttId",parentIdAttr:"ttParentId",stringExpand:"Expand",stringCollapse:"Collapse",onInitialized:null,onNodeCollapse:null,onNodeExpand:null,onNodeInitialized:null},e),this.each(function(){var e,s=t(this);return(r||void 0===s.data("treetable"))&&(e=new n(this,i),e.loadRows(this.rows).render(),s.addClass("treetable").data("treetable",e),null!=i.onInitialized&&i.onInitialized.apply(e)),s})},destroy:function(){return this.each(function(){return t(this).removeData("treetable").removeClass("treetable")})},collapseAll:function(){return this.data("treetable").collapseAll(),this},collapseNode:function(t){var e=this.data("treetable").tree[t];if(!e)throw new Error("Unknown node '"+t+"'");return e.collapse(),this},expandAll:function(){return this.data("treetable").expandAll(),this},expandNode:function(t){var e=this.data("treetable").tree[t];if(!e)throw new Error("Unknown node '"+t+"'");return e.initialized||e._initialize(),e.expand(),this},loadBranch:function(e,n){var r=this.data("treetable").settings,i=this.data("treetable").tree;if(n=t(n),null==e)this.append(n);else{var s=this.data("treetable").findLastNode(e);n.insertAfter(s.row)}return this.data("treetable").loadRows(n),n.filter("tr").each(function(){i[t(this).data(r.nodeIdAttr)].show()}),null!=e&&e.render().expand(),this},move:function(t,e){var n,r;return r=this.data("treetable").tree[t],n=this.data("treetable").tree[e],this.data("treetable").move(r,n),this},node:function(t){return this.data("treetable").tree[t]},removeNode:function(t){var e=this.data("treetable").tree[t];if(!e)throw new Error("Unknown node '"+t+"'");return this.data("treetable").removeNode(e),this},reveal:function(t){var e=this.data("treetable").tree[t];if(!e)throw new Error("Unknown node '"+t+"'");return e.reveal(),this},sortBranch:function(e,n){var r,i=this.data("treetable").settings;return n=n||i.column,r=n,t.isNumeric(n)&&(r=function(e,r){var i,s,a;return i=function(e){var r=e.row.find("td:eq("+n+")").text();return t.trim(r).toUpperCase()},s=i(e),a=i(r),a>s?-1:s>a?1:0}),this.data("treetable").sortBranch(e,r),this},unloadBranch:function(t){return this.data("treetable").unloadBranch(t),this}},t.fn.treetable=function(e){return r[e]?r[e].apply(this,Array.prototype.slice.call(arguments,1)):"object"!=typeof e&&e?t.error("Method "+e+" does not exist on jQuery.treetable"):r.init.apply(this,arguments)},this.TreeTable||(this.TreeTable={}),this.TreeTable.Node=e,this.TreeTable.Tree=n}(jQuery);