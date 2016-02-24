<%@page import="com.rongbang.utils.PlatformConstants"%>
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>
<script type="text/javascript">
//<!--
var org_CurrentAccessScope = <%=request.getAttribute("CurrentAccessScope")%>;
var org_lCurrentOrgCode = <%=request.getAttribute("lCurrentOrgCode")%>;
var treeUrl = "terminalno_list";
var setting = {
	view: {
		selectedMulti: false
	},
	data: {
		simpleData: {
			enable:true,
			idKey: "code",
			pIdKey: "pId",
			rootPId: ""
		}
	},
	async: {
		enable: true,
		url:"${contextPath }/management/security/organization/getAsyncTreeData",
		autoParam: ["code"],
		otherParam:{"CurrentAccessScope":org_CurrentAccessScope,"lCurrentOrgCode":org_lCurrentOrgCode,showAll:false,"treeUrl":treeUrl}
	},
	callback: {
		onClick: function(event, treeId, treeNode) {
			
			if(treeNode.orgLevel==<%=PlatformConstants.ORG_LEVEL_SITE%>
				||treeNode.orgLevel==<%=PlatformConstants.ORG_LEVEL_SUBSTATION%>){
				
				var $rel = $("#jbsxBox2TerminalnoList");
				$rel.loadUrl(treeNode.url, {}, function(){
					$rel.find("[layoutH]").layoutH();
				});				
			}
			event.preventDefault();
		}
	}
};

     	
$(document).ready(function(){
	var t = $("#orgTree");
	t = $.fn.zTree.init(t, setting);
});
//-->
</script>
<style>
<!--
#orgTree li span {
	text-align:left;
	display: inline;
} 
-->
</style>
<ul id="orgTree" class="ztree" style="display: block;"></ul>